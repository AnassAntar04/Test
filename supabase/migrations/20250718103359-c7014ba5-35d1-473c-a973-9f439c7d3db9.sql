
-- Create webhook configuration table for n8n endpoints
CREATE TABLE public.webhook_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  endpoint_url text NOT NULL,
  secret_token text,
  is_active boolean NOT NULL DEFAULT true,
  retry_count integer NOT NULL DEFAULT 3,
  timeout_seconds integer NOT NULL DEFAULT 30,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create webhook logs table for monitoring
CREATE TABLE public.webhook_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_config_id uuid REFERENCES public.webhook_configs(id),
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  response_status integer,
  response_body text,
  error_message text,
  attempt_number integer NOT NULL DEFAULT 1,
  processing_time_ms integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only admins can manage webhook configs" 
ON public.webhook_configs FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Only admins can view webhook logs" 
ON public.webhook_logs FOR SELECT 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can create webhook logs" 
ON public.webhook_logs FOR INSERT 
WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_webhook_configs_updated_at
  BEFORE UPDATE ON public.webhook_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default webhook configurations
INSERT INTO public.webhook_configs (name, endpoint_url, secret_token) VALUES
('conversation-update', 'https://n8n.samy360.com/webhook/conversation-update', 'webhook_secret_conv_2024'),
('escalation-trigger', 'https://n8n.samy360.com/webhook/escalation-trigger', 'webhook_secret_esc_2024'),
('booking-notification', 'https://n8n.samy360.com/webhook/booking-notification', 'webhook_secret_book_2024'),
('settings-sync', 'https://n8n.samy360.com/webhook/settings-sync', 'webhook_secret_set_2024');

-- Create function to trigger webhook notifications
CREATE OR REPLACE FUNCTION public.trigger_webhook_notification(
  webhook_name text,
  event_type text,
  payload jsonb
) RETURNS void AS $$
BEGIN
  -- This will be handled by Edge Functions
  -- Just log the event for now
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic webhook notifications

-- Trigger for new conversation messages
CREATE OR REPLACE FUNCTION public.notify_conversation_update()
RETURNS trigger AS $$
BEGIN
  PERFORM public.trigger_webhook_notification(
    'conversation-update',
    'message_created',
    jsonb_build_object(
      'message_id', NEW.id,
      'conversation_id', NEW.conversation_id,
      'sender_type', NEW.sender_type,
      'message_content', NEW.message_content,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_conversation_message_webhook
  AFTER INSERT ON public.conversation_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_conversation_update();

-- Trigger for escalation events
CREATE OR REPLACE FUNCTION public.notify_escalation_event()
RETURNS trigger AS $$
BEGIN
  PERFORM public.trigger_webhook_notification(
    'escalation-trigger',
    'escalation_created',
    jsonb_build_object(
      'escalation_id', NEW.id,
      'conversation_id', NEW.conversation_id,
      'from_role', NEW.from_role,
      'to_role', NEW.to_role,
      'escalation_reason', NEW.escalation_reason,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_escalation_webhook
  AFTER INSERT ON public.escalation_history
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_escalation_event();

-- Trigger for conversation state changes
CREATE OR REPLACE FUNCTION public.notify_conversation_state_change()
RETURNS trigger AS $$
BEGIN
  IF OLD.state != NEW.state THEN
    PERFORM public.trigger_webhook_notification(
      'conversation-update',
      'state_changed',
      jsonb_build_object(
        'conversation_id', NEW.id,
        'old_state', OLD.state,
        'new_state', NEW.state,
        'assigned_agent_id', NEW.assigned_agent_id,
        'updated_at', NEW.updated_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_conversation_state_webhook
  AFTER UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_conversation_state_change();

-- Trigger for system settings changes
CREATE OR REPLACE FUNCTION public.notify_settings_change()
RETURNS trigger AS $$
BEGIN
  PERFORM public.trigger_webhook_notification(
    'settings-sync',
    'setting_changed',
    jsonb_build_object(
      'setting_key', NEW.setting_key,
      'category', NEW.category,
      'old_value', OLD.setting_value,
      'new_value', NEW.setting_value,
      'updated_at', NEW.updated_at
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_settings_webhook
  AFTER UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_settings_change();
