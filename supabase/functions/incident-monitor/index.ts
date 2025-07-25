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
    console.log('Starting incident monitoring check...');

    // Vérifier les seuils critiques
    const checks = await Promise.all([
      checkConversationVolume(),
      checkWorkflowFailures(),
      checkSystemHealth(),
      checkResponseTimes()
    ]);

    const incidents = checks.filter(check => check.incident);
    
    // Créer des incidents pour les problèmes détectés
    for (const incident of incidents) {
      await createIncident(incident);
    }

    // Vérifier les incidents en cours qui peuvent être résolus
    await checkIncidentResolution();

    return new Response(
      JSON.stringify({
        success: true,
        checks_performed: checks.length,
        incidents_detected: incidents.length,
        incidents: incidents.map(i => ({
          type: i.incident_type,
          severity: i.severity,
          title: i.title
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in incident-monitor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function checkConversationVolume() {
  const last30min = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('id')
    .gte('created_at', last30min);

  if (error) throw error;

  const volume = conversations?.length || 0;
  const threshold = 100; // Seuil configurable

  if (volume > threshold) {
    return {
      incident: true,
      incident_type: 'high_conversation_volume',
      severity: 'high',
      title: 'Volume de conversations élevé',
      description: `${volume} conversations créées dans les 30 dernières minutes (seuil: ${threshold})`,
      source_component: 'conversation_system',
      error_details: { volume, threshold, timeframe: '30min' }
    };
  }

  return { incident: false, check: 'conversation_volume', status: 'normal' };
}

async function checkWorkflowFailures() {
  const last15min = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  
  const { data: failedWorkflows, error } = await supabase
    .from('workflow_metrics')
    .select('workflow_name, error_message')
    .eq('status', 'failed')
    .gte('created_at', last15min);

  if (error) throw error;

  const failureCount = failedWorkflows?.length || 0;
  const threshold = 5;

  if (failureCount > threshold) {
    const failuresByWorkflow = failedWorkflows?.reduce((acc: any, workflow) => {
      acc[workflow.workflow_name] = (acc[workflow.workflow_name] || 0) + 1;
      return acc;
    }, {});

    return {
      incident: true,
      incident_type: 'workflow_failures',
      severity: 'high',
      title: 'Échecs de workflows multiples',
      description: `${failureCount} workflows ont échoué dans les 15 dernières minutes`,
      source_component: 'workflow_engine',
      error_details: { total_failures: failureCount, failures_by_workflow: failuresByWorkflow }
    };
  }

  return { incident: false, check: 'workflow_failures', status: 'normal' };
}

async function checkSystemHealth() {
  // Vérifier la latence de la base de données
  const startTime = Date.now();
  
  const { error } = await supabase
    .from('conversations')
    .select('id')
    .limit(1);

  const dbLatency = Date.now() - startTime;
  const latencyThreshold = 5000; // 5 secondes

  if (error) {
    return {
      incident: true,
      incident_type: 'database_error',
      severity: 'critical',
      title: 'Erreur de base de données',
      description: `Erreur lors de l'accès à la base de données: ${error.message}`,
      source_component: 'database',
      error_details: { error: error.message, operation: 'select_test' }
    };
  }

  if (dbLatency > latencyThreshold) {
    return {
      incident: true,
      incident_type: 'high_latency',
      severity: 'medium',
      title: 'Latence élevée de la base de données',
      description: `Latence de ${dbLatency}ms détectée (seuil: ${latencyThreshold}ms)`,
      source_component: 'database',
      error_details: { latency_ms: dbLatency, threshold_ms: latencyThreshold }
    };
  }

  return { incident: false, check: 'system_health', status: 'normal' };
}

async function checkResponseTimes() {
  const last1hour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data: metrics, error } = await supabase
    .from('conversation_metrics')
    .select('first_response_time')
    .not('first_response_time', 'is', null)
    .gte('created_at', last1hour);

  if (error) throw error;

  if (metrics && metrics.length > 0) {
    const avgResponseTime = metrics.reduce((sum, m) => sum + (m.first_response_time || 0), 0) / metrics.length;
    const threshold = 300000; // 5 minutes en millisecondes

    if (avgResponseTime > threshold) {
      return {
        incident: true,
        incident_type: 'slow_response_times',
        severity: 'medium',
        title: 'Temps de réponse lents',
        description: `Temps de réponse moyen de ${Math.round(avgResponseTime / 1000)} secondes`,
        source_component: 'response_system',
        error_details: { 
          avg_response_time_ms: avgResponseTime, 
          threshold_ms: threshold,
          sample_size: metrics.length
        }
      };
    }
  }

  return { incident: false, check: 'response_times', status: 'normal' };
}

async function createIncident(incidentData: any) {
  // Vérifier si un incident similaire existe déjà
  const { data: existingIncident } = await supabase
    .from('system_incidents')
    .select('id')
    .eq('incident_type', incidentData.incident_type)
    .eq('status', 'open')
    .maybeSingle();

  if (existingIncident) {
    console.log(`Incident of type ${incidentData.incident_type} already exists`);
    return;
  }

  // Créer le nouvel incident
  const { error } = await supabase
    .from('system_incidents')
    .insert({
      incident_type: incidentData.incident_type,
      severity: incidentData.severity,
      title: incidentData.title,
      description: incidentData.description,
      source_component: incidentData.source_component,
      error_details: incidentData.error_details
    });

  if (error) {
    console.error('Error creating incident:', error);
  } else {
    console.log(`Created incident: ${incidentData.title}`);
  }
}

async function checkIncidentResolution() {
  // Récupérer les incidents ouverts
  const { data: openIncidents, error } = await supabase
    .from('system_incidents')
    .select('*')
    .eq('status', 'open');

  if (error) throw error;

  for (const incident of openIncidents || []) {
    // Logique pour vérifier si l'incident peut être résolu automatiquement
    const shouldResolve = await shouldAutoResolveIncident(incident);
    
    if (shouldResolve) {
      await supabase
        .from('system_incidents')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_notes: 'Auto-résolu par le système de monitoring'
        })
        .eq('id', incident.id);
      
      console.log(`Auto-resolved incident: ${incident.title}`);
    }
  }
}

async function shouldAutoResolveIncident(incident: any): Promise<boolean> {
  // Logique simple pour déterminer si un incident peut être auto-résolu
  const now = Date.now();
  const incidentAge = now - new Date(incident.created_at).getTime();
  const maxAge = 60 * 60 * 1000; // 1 heure

  // Auto-résoudre les incidents de latence anciens si la latence est redevenue normale
  if (incident.incident_type === 'high_latency' && incidentAge > maxAge) {
    const healthCheck = await checkSystemHealth();
    return !healthCheck.incident;
  }

  return false;
}