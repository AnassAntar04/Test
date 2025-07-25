-- Corriger les dernières vulnérabilités de sécurité

-- Fix notify_system_incident function
CREATE OR REPLACE FUNCTION public.notify_system_incident()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.trigger_webhook_notification(
    'incident-alerts',
    'incident_created',
    jsonb_build_object(
      'incident_id', NEW.id,
      'incident_type', NEW.incident_type,
      'severity', NEW.severity,
      'title', NEW.title,
      'description', NEW.description,
      'source_component', NEW.source_component,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
END;
$$;

-- Fix notify_workflow_completion function  
CREATE OR REPLACE FUNCTION public.notify_workflow_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF OLD.status != NEW.status AND NEW.status IN ('completed', 'failed') THEN
    PERFORM public.trigger_webhook_notification(
      'metrics-collector',
      'workflow_completed',
      jsonb_build_object(
        'workflow_name', NEW.workflow_name,
        'execution_id', NEW.execution_id,
        'status', NEW.status,
        'duration_ms', NEW.duration_ms,
        'error_message', NEW.error_message,
        'completed_at', NEW.completed_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;