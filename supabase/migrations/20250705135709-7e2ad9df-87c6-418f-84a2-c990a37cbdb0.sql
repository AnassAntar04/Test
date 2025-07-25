-- Créer une table pour gérer les privilèges par rôle
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Activer RLS sur la table role_permissions
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Seuls les administrateurs peuvent gérer les privilèges des rôles
CREATE POLICY "Only admins can manage role permissions" 
ON public.role_permissions 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Les utilisateurs authentifiés peuvent voir les privilèges des rôles
CREATE POLICY "Authenticated users can view role permissions" 
ON public.role_permissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Insérer quelques privilèges par défaut pour les rôles
INSERT INTO public.permissions (name, category, description) VALUES
  ('dashboard.view', 'dashboard', 'Accès au tableau de bord'),
  ('dashboard.stats', 'dashboard', 'Voir les statistiques avancées'),
  ('users.manage', 'administration', 'Gérer les utilisateurs'),
  ('users.view', 'administration', 'Voir les utilisateurs'),
  ('roles.manage', 'administration', 'Gérer les rôles et privilèges'),
  ('chat.view', 'communication', 'Accès au chat'),
  ('chat.manage', 'communication', 'Gérer les conversations'),
  ('analytics.view', 'analytique', 'Accès aux analyses'),
  ('analytics.advanced', 'analytique', 'Analyses avancées'),
  ('settings.view', 'configuration', 'Voir les paramètres'),
  ('settings.manage', 'configuration', 'Modifier les paramètres'),
  ('integrations.manage', 'intégrations', 'Gérer les intégrations'),
  ('notifications.manage', 'notifications', 'Gérer les notifications'),
  ('reports.view', 'rapports', 'Voir les rapports'),
  ('reports.generate', 'rapports', 'Générer des rapports'),
  ('quality.manage', 'qualité', 'Gestion qualité'),
  ('logistics.manage', 'logistique', 'Gestion logistique'),
  ('maintenance.manage', 'maintenance', 'Gestion maintenance'),
  ('cleaning.manage', 'nettoyage', 'Gestion nettoyage'),
  ('finance.view', 'finance', 'Accès finances'),
  ('finance.manage', 'finance', 'Gestion finances')
ON CONFLICT (name) DO NOTHING;

-- Assigner des privilèges par défaut aux rôles
INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'super_admin'::app_role, id FROM public.permissions;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'administrateur'::app_role, id FROM public.permissions
WHERE category IN ('dashboard', 'administration', 'configuration', 'analytique', 'rapports');

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'superviseur'::app_role, id FROM public.permissions
WHERE category IN ('dashboard', 'communication', 'analytique', 'rapports') 
OR name IN ('users.view');

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'responsable_logistique'::app_role, id FROM public.permissions
WHERE category IN ('dashboard', 'logistique', 'rapports') 
OR name IN ('chat.view');

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'responsable_qualite'::app_role, id FROM public.permissions
WHERE category IN ('dashboard', 'qualité', 'rapports') 
OR name IN ('chat.view');

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'technicien'::app_role, id FROM public.permissions
WHERE category IN ('dashboard', 'maintenance') 
OR name IN ('chat.view');

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'agent'::app_role, id FROM public.permissions
WHERE name IN ('dashboard.view', 'chat.view', 'chat.manage');

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'comptabilite'::app_role, id FROM public.permissions
WHERE category IN ('dashboard', 'finance', 'analytique');

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'femme_de_menage'::app_role, id FROM public.permissions
WHERE category IN ('nettoyage') 
OR name IN ('dashboard.view');