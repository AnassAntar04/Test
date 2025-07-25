-- Update the trigger function to call the webhook dispatcher Edge Function
CREATE OR REPLACE FUNCTION public.trigger_webhook_notification(
  webhook_name text,
  event_type text,
  payload jsonb
) RETURNS void AS $$
DECLARE
  webhook_url text;
BEGIN
  -- Call the webhook dispatcher Edge Function
  webhook_url := 'https://jwulacyvagxztjopbflh.supabase.co/functions/v1/webhook-dispatcher';
  
  PERFORM net.http_post(
    url := webhook_url,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'webhook_name', webhook_name,
      'event_type', event_type,
      'payload', payload
    )
  );
  
  -- Also log the event locally
  INSERT INTO public.webhook_logs (
    webhook_config_id,
    event_type,
    payload,
    attempt_number
  ) 
  SELECT 
    wc.id,
    event_type,
    payload,
    1
  FROM public.webhook_configs wc
  WHERE wc.name = webhook_name AND wc.is_active = true;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Failed to trigger webhook: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;