-- Tables pour les paramètres (Settings)

-- Table pour les configurations des chatbots
CREATE TABLE public.chatbot_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('principal', 'secondaire', 'attribution_auto', 'attribution_manuel', 'interne')),
  description TEXT,
  settings JSONB DEFAULT '{}',
  authorized_users TEXT[] DEFAULT '{}',
  message_retention TEXT DEFAULT 'unlimited',
  auto_hide_resolved BOOLEAN DEFAULT true,
  auto_close_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les templates de messages automatiques
CREATE TABLE public.auto_message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('booking_confirmed', 'day_before_checkin', 'day_before_checkout', 'post_checkout')),
  custom_trigger TEXT,
  schedule_time TEXT DEFAULT 'immediate',
  custom_time TIME,
  message_template TEXT NOT NULL,
  channels TEXT[] NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les paramètres système généraux
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'notifications', 'integrations', 'chatbots', 'escalation')),
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les configurations d'intégrations
CREATE TABLE public.integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_name TEXT NOT NULL CHECK (integration_name IN ('beds24', 'whatsapp', 'n8n', 'email', 'sms')),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
  config_data JSONB DEFAULT '{}',
  last_sync TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les notifications et paramètres d'alerte
CREATE TABLE public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('new_message', 'escalation', 'timeout', 'assignment', 'resolution')),
  is_enabled BOOLEAN DEFAULT true,
  threshold_value INTEGER,
  delivery_method TEXT[] DEFAULT ARRAY['email'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tables pour le système de conversations

-- Table pour les conversations principales
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL DEFAULT 'NOUVELLE' CHECK (state IN ('NOUVELLE', 'EN_COURS', 'EN_ATTENTE', 'TRANSFÉRÉE', 'RÉSOLUE', 'CLÔTURÉE', 'ARCHIVÉE')),
  journey_phase TEXT NOT NULL DEFAULT 'PRE_RESERVATION' CHECK (journey_phase IN ('PRE_RESERVATION', 'POST_RESERVATION', 'SEJOUR_COURS', 'PRE_CHECKOUT', 'POST_CHECKOUT')),
  channel_type TEXT NOT NULL CHECK (channel_type IN ('whatsapp', 'email', 'beds24', 'direct', 'sms')),
  booking_source TEXT CHECK (booking_source IN ('booking', 'airbnb', 'expedia', 'ctrip', 'direct')),
  guest_id UUID REFERENCES public.guest(guest_id) ON DELETE SET NULL,
  reservation_id UUID REFERENCES public.reservation(res_id) ON DELETE SET NULL,
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_chatbot_id UUID REFERENCES public.chatbot_configs(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  tags TEXT[] DEFAULT '{}',
  subject TEXT,
  last_message_content TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  has_children BOOLEAN DEFAULT false,
  is_recurrent BOOLEAN DEFAULT false,
  resolution_notes TEXT,
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les messages de conversation
CREATE TABLE public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('agent', 'guest', 'system', 'ai', 'chatbot')),
  sender_id UUID,
  sender_name TEXT,
  message_content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'video', 'audio', 'system')),
  attachment_ids UUID[],
  is_internal BOOLEAN DEFAULT false,
  is_automated BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour l'historique des escalades
CREATE TABLE public.escalation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  from_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  to_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  from_role TEXT NOT NULL,
  to_role TEXT NOT NULL,
  escalation_reason TEXT,
  escalation_type TEXT DEFAULT 'manual' CHECK (escalation_type IN ('manual', 'automatic', 'timeout')),
  triggered_by_rule_id UUID REFERENCES public.escalation_rules(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tables pour les statistiques et analytics

-- Table pour les métriques de performance
CREATE TABLE public.conversation_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  first_response_time INTEGER,
  resolution_time INTEGER,
  agent_messages_count INTEGER DEFAULT 0,
  guest_messages_count INTEGER DEFAULT 0,
  escalation_count INTEGER DEFAULT 0,
  ai_resolution_attempted BOOLEAN DEFAULT false,
  ai_resolution_successful BOOLEAN DEFAULT false,
  chatbot_handoff_count INTEGER DEFAULT 0,
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  tags_applied TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les logs d'activité
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('message_sent', 'conversation_assigned', 'conversation_escalated', 'settings_updated', 'user_login', 'file_uploaded')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('conversation', 'user', 'setting', 'message', 'escalation', 'chatbot')),
  entity_id UUID NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activation du RLS sur toutes les tables
ALTER TABLE public.chatbot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies RLS pour les tables de paramètres
CREATE POLICY "Authenticated users can view chatbot configs" ON public.chatbot_configs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only admins can manage chatbot configs" ON public.chatbot_configs FOR ALL USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Authenticated users can view auto message templates" ON public.auto_message_templates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only admins can manage auto message templates" ON public.auto_message_templates FOR ALL USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Authenticated users can view system settings" ON public.system_settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only admins can manage system settings" ON public.system_settings FOR ALL USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Authenticated users can view integration configs" ON public.integration_configs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only admins can manage integration configs" ON public.integration_configs FOR ALL USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can view their own notification settings" ON public.notification_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own notification settings" ON public.notification_settings FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all notification settings" ON public.notification_settings FOR SELECT USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Policies RLS pour les conversations
CREATE POLICY "Agents and above can view conversations" ON public.conversations FOR SELECT USING (
  has_role(auth.uid(), 'agent'::app_role) OR 
  has_role(auth.uid(), 'superviseur'::app_role) OR 
  has_role(auth.uid(), 'administrateur'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Agents can create conversations" ON public.conversations FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'agent'::app_role) OR 
  has_role(auth.uid(), 'superviseur'::app_role) OR 
  has_role(auth.uid(), 'administrateur'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Agents can update assigned conversations" ON public.conversations FOR UPDATE USING (
  assigned_agent_id = auth.uid() OR 
  has_role(auth.uid(), 'superviseur'::app_role) OR 
  has_role(auth.uid(), 'administrateur'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Policies pour les messages
CREATE POLICY "Agents can view conversation messages" ON public.conversation_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND (
      assigned_agent_id = auth.uid() OR 
      has_role(auth.uid(), 'superviseur'::app_role) OR 
      has_role(auth.uid(), 'administrateur'::app_role) OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

CREATE POLICY "Agents can create messages" ON public.conversation_messages FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'agent'::app_role) OR 
  has_role(auth.uid(), 'superviseur'::app_role) OR 
  has_role(auth.uid(), 'administrateur'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Policies pour l'historique des escalades
CREATE POLICY "Supervisors and above can view escalation history" ON public.escalation_history FOR SELECT USING (
  has_role(auth.uid(), 'superviseur'::app_role) OR 
  has_role(auth.uid(), 'administrateur'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Agents can create escalation history" ON public.escalation_history FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'agent'::app_role) OR 
  has_role(auth.uid(), 'superviseur'::app_role) OR 
  has_role(auth.uid(), 'administrateur'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Policies pour les métriques
CREATE POLICY "Supervisors and above can view metrics" ON public.conversation_metrics FOR SELECT USING (
  has_role(auth.uid(), 'superviseur'::app_role) OR 
  has_role(auth.uid(), 'administrateur'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "System can create metrics" ON public.conversation_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update metrics" ON public.conversation_metrics FOR UPDATE USING (true);

-- Policies pour les logs d'activité
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all activity logs" ON public.activity_logs FOR SELECT USING (
  has_role(auth.uid(), 'administrateur'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);
CREATE POLICY "System can create activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- Triggers pour mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chatbot_configs_updated_at
  BEFORE UPDATE ON public.chatbot_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_auto_message_templates_updated_at
  BEFORE UPDATE ON public.auto_message_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integration_configs_updated_at
  BEFORE UPDATE ON public.integration_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversation_metrics_updated_at
  BEFORE UPDATE ON public.conversation_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX idx_conversations_state ON public.conversations(state);
CREATE INDEX idx_conversations_assigned_agent ON public.conversations(assigned_agent_id);
CREATE INDEX idx_conversations_created_at ON public.conversations(created_at);
CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_created_at ON public.conversation_messages(created_at);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_escalation_history_conversation_id ON public.escalation_history(conversation_id);