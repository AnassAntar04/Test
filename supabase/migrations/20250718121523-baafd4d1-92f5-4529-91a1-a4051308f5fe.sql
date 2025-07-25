
-- Créer les tables manquantes pour les workflows

-- Table pour le monitoring des workflows n8n
CREATE TABLE public.workflow_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_name text NOT NULL,
  execution_id text,
  status text NOT NULL DEFAULT 'pending',
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  duration_ms integer,
  input_data jsonb DEFAULT '{}',
  output_data jsonb DEFAULT '{}',
  error_message text,
  retry_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table pour la gestion des incidents système
CREATE TABLE public.system_incidents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open',
  source_component text,
  error_details jsonb DEFAULT '{}',
  assigned_to uuid,
  resolved_at timestamp with time zone,
  resolution_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table pour la queue de traitement des documents
CREATE TABLE public.document_processing_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attachment_id uuid REFERENCES public.chat_attachments(id),
  processing_status text NOT NULL DEFAULT 'queued',
  processing_type text NOT NULL,
  priority integer DEFAULT 5,
  attempts integer DEFAULT 0,
  max_attempts integer DEFAULT 3,
  scheduled_at timestamp with time zone DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  error_message text,
  result_data jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table pour les rapports programmés
CREATE TABLE public.scheduled_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_name text NOT NULL,
  report_type text NOT NULL,
  schedule_pattern text NOT NULL,
  recipients text[] DEFAULT '{}',
  parameters jsonb DEFAULT '{}',
  last_run_at timestamp with time zone,
  next_run_at timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.workflow_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour workflow_metrics
CREATE POLICY "Supervisors and above can view workflow metrics" 
ON public.workflow_metrics FOR SELECT 
USING (has_role(auth.uid(), 'superviseur'::app_role) OR has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "System can manage workflow metrics" 
ON public.workflow_metrics FOR ALL 
USING (true);

-- Politiques RLS pour system_incidents
CREATE POLICY "Admins can manage system incidents" 
ON public.system_incidents FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Supervisors can view system incidents" 
ON public.system_incidents FOR SELECT 
USING (has_role(auth.uid(), 'superviseur'::app_role) OR has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Politiques RLS pour document_processing_queue
CREATE POLICY "System can manage document processing queue" 
ON public.document_processing_queue FOR ALL 
USING (true);

CREATE POLICY "Agents can view document processing status" 
ON public.document_processing_queue FOR SELECT 
USING (has_role(auth.uid(), 'agent'::app_role) OR has_role(auth.uid(), 'superviseur'::app_role) OR has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Politiques RLS pour scheduled_reports
CREATE POLICY "Admins can manage scheduled reports" 
ON public.scheduled_reports FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Supervisors can view scheduled reports" 
ON public.scheduled_reports FOR SELECT 
USING (has_role(auth.uid(), 'superviseur'::app_role) OR has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Triggers pour updated_at
CREATE TRIGGER update_workflow_metrics_updated_at
  BEFORE UPDATE ON public.workflow_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_incidents_updated_at
  BEFORE UPDATE ON public.system_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_processing_queue_updated_at
  BEFORE UPDATE ON public.document_processing_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_reports_updated_at
  BEFORE UPDATE ON public.scheduled_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Ajouter des configurations webhook pour les nouveaux workflows
INSERT INTO public.webhook_configs (name, endpoint_url, secret_token) VALUES
('document-processing', 'https://n8n.samy360.com/webhook/document-processing', 'webhook_secret_doc_2024'),
('user-management', 'https://n8n.samy360.com/webhook/user-management', 'webhook_secret_user_2024'),
('metrics-collector', 'https://n8n.samy360.com/webhook/metrics-collector', 'webhook_secret_metrics_2024'),
('incident-alerts', 'https://n8n.samy360.com/webhook/incident-alerts', 'webhook_secret_incident_2024'),
('backup-sync', 'https://n8n.samy360.com/webhook/backup-sync', 'webhook_secret_backup_2024'),
('report-generator', 'https://n8n.samy360.com/webhook/report-generator', 'webhook_secret_report_2024');

-- Fonctions de notification pour les nouveaux workflows

-- Trigger pour le traitement de documents
CREATE OR REPLACE FUNCTION public.notify_document_upload()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_document_upload_webhook
  AFTER INSERT ON public.chat_attachments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_document_upload();

-- Trigger pour la gestion des utilisateurs
CREATE OR REPLACE FUNCTION public.notify_user_profile_change()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_profile_webhook
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_user_profile_change();

-- Trigger pour les incidents système
CREATE OR REPLACE FUNCTION public.notify_system_incident()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_system_incident_webhook
  AFTER INSERT ON public.system_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_system_incident();

-- Trigger pour les métriques de workflow
CREATE OR REPLACE FUNCTION public.notify_workflow_completion()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_workflow_completion_webhook
  AFTER UPDATE ON public.workflow_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_workflow_completion();

-- Insérer des données exemple pour les rapports programmés
INSERT INTO public.scheduled_reports (report_name, report_type, schedule_pattern, recipients, next_run_at) VALUES
('Rapport quotidien des conversations', 'daily_conversations', '0 8 * * *', ARRAY['admin@samy360.com'], now() + interval '1 day'),
('Métriques hebdomadaires', 'weekly_metrics', '0 9 * * 1', ARRAY['manager@samy360.com'], now() + interval '7 days'),
('Rapport mensuel de performance', 'monthly_performance', '0 10 1 * *', ARRAY['direction@samy360.com'], now() + interval '1 month');
