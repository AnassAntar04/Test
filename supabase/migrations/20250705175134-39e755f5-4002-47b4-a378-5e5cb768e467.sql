-- Create request types table
CREATE TABLE public.request_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create routing matrix table
CREATE TABLE public.routing_matrix (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_type_id uuid NOT NULL REFERENCES public.request_types(id) ON DELETE CASCADE,
  role text NOT NULL,
  permission_type text NOT NULL CHECK (permission_type IN ('direct_treatment', 'entry_point', 'escalation', 'read_only', 'no_access')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(request_type_id, role)
);

-- Create escalation rules table  
CREATE TABLE public.escalation_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  from_role text NOT NULL,
  to_role text NOT NULL,
  condition text NOT NULL DEFAULT 'immediate',
  priority integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.request_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for request_types
CREATE POLICY "Authenticated users can view request types" 
ON public.request_types FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage request types" 
ON public.request_types FOR ALL 
USING (get_current_user_profile_type() = 'administrateur'::user_profile);

-- Create policies for routing_matrix
CREATE POLICY "Authenticated users can view routing matrix" 
ON public.routing_matrix FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage routing matrix" 
ON public.routing_matrix FOR ALL 
USING (get_current_user_profile_type() = 'administrateur'::user_profile);

-- Create policies for escalation_rules
CREATE POLICY "Authenticated users can view escalation rules" 
ON public.escalation_rules FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage escalation rules" 
ON public.escalation_rules FOR ALL 
USING (get_current_user_profile_type() = 'administrateur'::user_profile);

-- Create triggers for updated_at
CREATE TRIGGER update_request_types_updated_at
  BEFORE UPDATE ON public.request_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routing_matrix_updated_at
  BEFORE UPDATE ON public.routing_matrix
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_escalation_rules_updated_at
  BEFORE UPDATE ON public.escalation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.request_types (name, description, color, display_order) VALUES
('Réservation/Commercial', 'Demandes commerciales et réservations', '#10b981', 1),
('Problème technique', 'Pannes et problèmes techniques', '#f59e0b', 2),
('Ménage/Propreté', 'Questions de ménage et propreté', '#8b5cf6', 3),
('Facturation', 'Questions de facturation et paiement', '#ef4444', 4),
('Réclamation urgente', 'Réclamations nécessitant une intervention immédiate', '#dc2626', 5);

-- Insert default escalation rules
INSERT INTO public.escalation_rules (name, keywords, from_role, to_role, condition, priority) VALUES
('Problème technique', ARRAY['panne', 'climatisation', 'wifi', 'code'], 'agent', 'technicien', 'immediate', 1),
('Problème ménage', ARRAY['sale', 'ménage', 'serviette', 'draps'], 'agent', 'femme_de_menage', 'immediate', 2),
('Questions financières', ARRAY['facture', 'paiement', 'remboursement'], 'agent', 'comptabilite', 'immediate', 3),
('Escalade urgente', ARRAY['urgent', 'bloqué', 'problème grave'], 'agent', 'superviseur', 'immediate', 4);