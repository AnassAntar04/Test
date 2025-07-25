-- Corriger les vulnérabilités de sécurité en définissant search_path pour toutes les fonctions

-- Fix cleanup_mcp_audit_trail function
CREATE OR REPLACE FUNCTION public.cleanup_mcp_audit_trail()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Supprimer les entrées plus anciennes que 30 jours
  DELETE FROM public.mcp_audit_trail 
  WHERE timestamp < now() - interval '30 days';
  
  -- Log du nettoyage
  RAISE NOTICE 'MCP Audit trail cleanup completed at %', now();
END;
$$;

-- Fix assign_user_role function
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id uuid, _role app_role, _assigned_by uuid, _expires_at timestamp with time zone DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Deactivate any existing active roles for this user
  UPDATE public.user_roles
  SET is_active = false
  WHERE user_id = _user_id AND is_active = true;
  
  -- Insert or reactivate the new role
  INSERT INTO public.user_roles (user_id, role, assigned_by, expires_at, is_active)
  VALUES (_user_id, _role, _assigned_by, _expires_at, true)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    is_active = true,
    assigned_by = _assigned_by,
    assigned_at = now(),
    expires_at = _expires_at;
END;
$$;

-- Fix notify_conversation_update function
CREATE OR REPLACE FUNCTION public.notify_conversation_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Fix notify_escalation_event function
CREATE OR REPLACE FUNCTION public.notify_escalation_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Fix notify_conversation_state_change function
CREATE OR REPLACE FUNCTION public.notify_conversation_state_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Fix notify_settings_change function
CREATE OR REPLACE FUNCTION public.notify_settings_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Fix trigger_webhook_notification function (already fixed in previous migration)
CREATE OR REPLACE FUNCTION public.trigger_webhook_notification(webhook_name text, event_type text, payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Fix notify_document_upload function
CREATE OR REPLACE FUNCTION public.notify_document_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Ajouter à la queue de traitement
  INSERT INTO public.document_processing_queue (
    attachment_id,
    processing_type,
    priority
  ) VALUES (
    NEW.id,
    CASE 
      WHEN NEW.file_type LIKE 'image/%' THEN 'image_analysis'
      WHEN NEW.file_type = 'application/pdf' THEN 'pdf_extraction'
      ELSE 'general_processing'
    END,
    CASE 
      WHEN NEW.file_type LIKE 'image/%' THEN 3
      ELSE 5
    END
  );

  -- Notifier n8n
  PERFORM public.trigger_webhook_notification(
    'document-processing',
    'document_uploaded',
    jsonb_build_object(
      'attachment_id', NEW.id,
      'file_name', NEW.file_name,
      'file_type', NEW.file_type,
      'file_size', NEW.file_size,
      'uploaded_by', NEW.uploaded_by,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
END;
$$;

-- Fix notify_user_profile_change function
CREATE OR REPLACE FUNCTION public.notify_user_profile_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.trigger_webhook_notification(
    'user-management',
    'profile_updated',
    jsonb_build_object(
      'user_id', NEW.user_id,
      'profile_id', NEW.id,
      'profile_type', NEW.profile_type,
      'is_active', NEW.is_active,
      'geographical_zones', NEW.geographical_zones,
      'updated_at', NEW.updated_at
    )
  );
  RETURN NEW;
END;
$$;