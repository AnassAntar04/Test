import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting metrics aggregation...');

    // Agréger les métriques de conversation
    const conversationMetrics = await aggregateConversationMetrics();
    
    // Agréger les métriques de workflow
    const workflowMetrics = await aggregateWorkflowMetrics();
    
    // Agréger les métriques de performance système
    const systemMetrics = await aggregateSystemMetrics();
    
    // Agréger les métriques d'utilisation
    const usageMetrics = await aggregateUsageMetrics();

    const aggregatedData = {
      timestamp: new Date().toISOString(),
      conversations: conversationMetrics,
      workflows: workflowMetrics,
      system: systemMetrics,
      usage: usageMetrics
    };

    // Sauvegarder les métriques agrégées
    const { error: insertError } = await supabase
      .from('workflow_metrics')
      .insert({
        workflow_name: 'metrics_aggregation',
        status: 'completed',
        output_data: aggregatedData,
        execution_id: crypto.randomUUID()
      });

    if (insertError) {
      console.error('Error saving aggregated metrics:', insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: aggregatedData,
        aggregated_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in metrics-aggregator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function aggregateConversationMetrics() {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // Conversations aujourd'hui
  const { data: todayConversations, error: todayError } = await supabase
    .from('conversations')
    .select('id, state, created_at, assigned_agent_id')
    .gte('created_at', today.toISOString().split('T')[0]);

  if (todayError) throw todayError;

  // Métriques de résolution
  const { data: resolutionMetrics, error: resolutionError } = await supabase
    .from('conversation_metrics')
    .select('resolution_time, first_response_time, satisfaction_score')
    .not('resolution_time', 'is', null)
    .gte('created_at', yesterday.toISOString());

  if (resolutionError) throw resolutionError;

  return {
    total_today: todayConversations?.length || 0,
    by_state: groupBy(todayConversations || [], 'state'),
    average_resolution_time: calculateAverage(resolutionMetrics?.map(m => m.resolution_time) || []),
    average_first_response_time: calculateAverage(resolutionMetrics?.map(m => m.first_response_time) || []),
    average_satisfaction: calculateAverage(resolutionMetrics?.map(m => m.satisfaction_score).filter(s => s !== null) || [])
  };
}

async function aggregateWorkflowMetrics() {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: workflows, error } = await supabase
    .from('workflow_metrics')
    .select('workflow_name, status, duration_ms, error_message')
    .gte('created_at', last24h);

  if (error) throw error;

  const workflowStats = groupBy(workflows || [], 'workflow_name');
  const result: any = {};

  for (const [name, executions] of Object.entries(workflowStats)) {
    const successful = executions.filter((e: any) => e.status === 'completed');
    const failed = executions.filter((e: any) => e.status === 'failed');
    
    result[name] = {
      total_executions: executions.length,
      successful: successful.length,
      failed: failed.length,
      success_rate: executions.length > 0 ? (successful.length / executions.length) * 100 : 0,
      average_duration: calculateAverage(successful.map((e: any) => e.duration_ms).filter(d => d !== null))
    };
  }

  return result;
}

async function aggregateSystemMetrics() {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Incidents système
  const { data: incidents, error: incidentsError } = await supabase
    .from('system_incidents')
    .select('severity, status')
    .gte('created_at', last24h);

  if (incidentsError) throw incidentsError;

  // Documents traités
  const { data: documents, error: documentsError } = await supabase
    .from('document_processing_queue')
    .select('processing_status, processing_type')
    .gte('created_at', last24h);

  if (documentsError) throw documentsError;

  return {
    incidents: {
      total: incidents?.length || 0,
      by_severity: groupBy(incidents || [], 'severity'),
      by_status: groupBy(incidents || [], 'status')
    },
    documents: {
      total: documents?.length || 0,
      by_status: groupBy(documents || [], 'processing_status'),
      by_type: groupBy(documents || [], 'processing_type')
    }
  };
}

async function aggregateUsageMetrics() {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Utilisateurs actifs
  const { data: activeUsers, error: usersError } = await supabase
    .from('activity_logs')
    .select('user_id')
    .gte('created_at', last24h);

  if (usersError) throw usersError;

  const uniqueUsers = new Set(activeUsers?.map(log => log.user_id) || []).size;

  // Messages échangés
  const { data: messages, error: messagesError } = await supabase
    .from('conversation_messages')
    .select('id, sender_type')
    .gte('created_at', last24h);

  if (messagesError) throw messagesError;

  return {
    active_users_24h: uniqueUsers,
    messages_total: messages?.length || 0,
    messages_by_type: groupBy(messages || [], 'sender_type')
  };
}

function groupBy(array: any[], key: string) {
  return array.reduce((result, item) => {
    const group = item[key] || 'unknown';
    result[group] = (result[group] || 0) + 1;
    return result;
  }, {});
}

function calculateAverage(numbers: number[]) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}