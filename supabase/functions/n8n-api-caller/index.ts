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

interface N8nApiRequest {
  workflow_name: string;
  execution_data: any;
  webhook_name?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workflow_name, execution_data, webhook_name }: N8nApiRequest = await req.json();
    
    console.log(`Processing workflow: ${workflow_name}`);

    // Enregistrer les métriques du workflow
    const { data: metrics, error: metricsError } = await supabase
      .from('workflow_metrics')
      .insert({
        workflow_name,
        status: 'running',
        input_data: execution_data,
        execution_id: crypto.randomUUID()
      })
      .select()
      .single();

    if (metricsError) {
      console.error('Error creating workflow metrics:', metricsError);
    }

    // Appeler l'API n8n selon le type de workflow
    const n8nResponse = await callN8nWorkflow(workflow_name, execution_data);
    
    // Mettre à jour les métriques
    if (metrics) {
      await supabase
        .from('workflow_metrics')
        .update({
          status: n8nResponse.success ? 'completed' : 'failed',
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - new Date(metrics.started_at).getTime(),
          output_data: n8nResponse.data,
          error_message: n8nResponse.error
        })
        .eq('id', metrics.id);
    }

    return new Response(
      JSON.stringify({
        success: n8nResponse.success,
        data: n8nResponse.data,
        metrics_id: metrics?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: n8nResponse.success ? 200 : 500
      }
    );

  } catch (error) {
    console.error('Error in n8n-api-caller:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function callN8nWorkflow(workflowName: string, data: any) {
  const n8nBaseUrl = 'https://n8n.samy360.com/api/v1';
  const n8nApiToken = Deno.env.get('N8N_API_TOKEN');

  try {
    // Mapper les workflows vers leurs endpoints n8n
    const workflowEndpoints: Record<string, string> = {
      'Conversation_Update': '/workflows/conversation-update/execute',
      'Escalation_Trigger': '/workflows/escalation-trigger/execute',
      'Settings_Sync': '/workflows/settings-sync/execute',
      'Document_Processing': '/workflows/document-processing/execute',
      'User_Management': '/workflows/user-management/execute',
      'Metrics_Collector': '/workflows/metrics-collector/execute',
      'Incident_Alerts': '/workflows/incident-alerts/execute',
      'Templates_Reponses': '/workflows/templates-responses/execute',
      'Knowledge_Base': '/workflows/knowledge-base/execute',
      'Analytics_Reporting': '/workflows/analytics-reporting/execute',
      'Backup_Sync': '/workflows/backup-sync/execute',
      'Maintenance_Scheduler': '/workflows/maintenance-scheduler/execute',
      'Quality_Monitor': '/workflows/quality-monitor/execute',
      'Resource_Optimizer': '/workflows/resource-optimizer/execute',
      'Integration_Health': '/workflows/integration-health/execute'
    };

    const endpoint = workflowEndpoints[workflowName];
    if (!endpoint) {
      throw new Error(`Unknown workflow: ${workflowName}`);
    }

    const response = await fetch(`${n8nBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${n8nApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, data: result };

  } catch (error) {
    console.error(`Error calling n8n workflow ${workflowName}:`, error);
    return { success: false, error: error.message, data: null };
  }
}