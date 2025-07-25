import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookConfig {
  id: string;
  name: string;
  endpoint_url: string;
  secret_token: string | null;
  retry_count: number;
  timeout_seconds: number;
}

interface WebhookPayload {
  webhook_name: string;
  event_type: string;
  payload: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { webhook_name, event_type, payload } = await req.json() as WebhookPayload;

    console.log(`Processing webhook: ${webhook_name}, event: ${event_type}`);

    // Get webhook configuration
    const { data: webhookConfig, error: configError } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('name', webhook_name)
      .eq('is_active', true)
      .single();

    if (configError || !webhookConfig) {
      console.error('Webhook config not found:', configError);
      return new Response(
        JSON.stringify({ error: 'Webhook configuration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send webhook to n8n
    const success = await sendWebhookToN8N(supabase, webhookConfig, event_type, payload);

    return new Response(
      JSON.stringify({ success, webhook_name, event_type }),
      { status: success ? 200 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook dispatcher error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendWebhookToN8N(
  supabase: any,
  config: WebhookConfig,
  eventType: string,
  payload: any
): Promise<boolean> {
  const startTime = Date.now();
  let attempt = 1;
  let lastError: string | null = null;

  while (attempt <= config.retry_count) {
    try {
      console.log(`Sending webhook attempt ${attempt}/${config.retry_count} to ${config.endpoint_url}`);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (config.secret_token) {
        headers['Authorization'] = `Bearer ${config.secret_token}`;
      }

      const response = await fetch(config.endpoint_url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          event_type: eventType,
          timestamp: new Date().toISOString(),
          data: payload
        }),
        signal: AbortSignal.timeout(config.timeout_seconds * 1000)
      });

      const responseBody = await response.text();
      const processingTime = Date.now() - startTime;

      // Log the webhook call
      await supabase.from('webhook_logs').insert({
        webhook_config_id: config.id,
        event_type: eventType,
        payload: payload,
        response_status: response.status,
        response_body: responseBody,
        attempt_number: attempt,
        processing_time_ms: processingTime,
        error_message: response.ok ? null : `HTTP ${response.status}: ${responseBody}`
      });

      if (response.ok) {
        console.log(`Webhook sent successfully on attempt ${attempt}`);
        return true;
      } else {
        lastError = `HTTP ${response.status}: ${responseBody}`;
        console.error(`Webhook failed on attempt ${attempt}:`, lastError);
      }

    } catch (error) {
      lastError = error.message;
      console.error(`Webhook attempt ${attempt} failed:`, error);

      // Log the failed attempt
      await supabase.from('webhook_logs').insert({
        webhook_config_id: config.id,
        event_type: eventType,
        payload: payload,
        attempt_number: attempt,
        processing_time_ms: Date.now() - startTime,
        error_message: lastError
      });
    }

    attempt++;
    
    // Wait before retry (exponential backoff)
    if (attempt <= config.retry_count) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
    }
  }

  console.error(`All webhook attempts failed. Last error: ${lastError}`);
  return false;
}