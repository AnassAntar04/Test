-- Create enum for user profiles
CREATE TYPE public.user_profile AS ENUM (
  'agent',
  'comptabilite', 
  'femme_de_menage',
  'technicien',
  'administrateur',
  'responsable_logistique',
  'responsable_qualite'
);

-- Create enum for geographical zones
CREATE TYPE public.geographical_zone AS ENUM (
  'paris_centre',
  'paris_ouest',
  'paris_est',
  'paris_nord',
  'paris_sud',
  'ile_de_france',
  'province',
  'international'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  profile_type user_profile NOT NULL DEFAULT 'agent',
  geographical_zones geographical_zone[] DEFAULT ARRAY['paris_centre']::geographical_zone[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create permissions table
CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create role permissions junction table  
CREATE TABLE public.profile_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_type user_profile NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  geographical_zones geographical_zone[] DEFAULT ARRAY[]::geographical_zone[],
  UNIQUE(profile_type, permission_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND profile_type = 'administrateur'
  )
);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (user_id = auth.uid());

-- Create policies for permissions
CREATE POLICY "Authenticated users can view permissions" 
ON public.permissions FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage permissions" 
ON public.permissions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND profile_type = 'administrateur'
  )
);

-- Create policies for profile_permissions
CREATE POLICY "Authenticated users can view profile permissions" 
ON public.profile_permissions FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage profile permissions" 
ON public.profile_permissions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND profile_type = 'administrateur'
  )
);

-- Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES
('dashboard.view', 'Voir le tableau de bord', 'dashboard'),
('dashboard.stats', 'Voir les statistiques détaillées', 'dashboard'),
('dashboard.export', 'Exporter les données', 'dashboard'),
('chat.view', 'Accéder au chat central', 'chat'),
('chat.manage', 'Gérer les conversations', 'chat'),
('chat.assign', 'Assigner des conversations', 'chat'),
('chat.escalate', 'Escalader les conversations', 'chat'),
('analytics.view', 'Voir les analyses', 'analytics'),
('analytics.reports', 'Générer des rapports', 'analytics'),
('analytics.advanced', 'Analyses avancées', 'analytics'),
('users.view', 'Voir les utilisateurs', 'users'),
('users.create', 'Créer des utilisateurs', 'users'),
('users.edit', 'Modifier les utilisateurs', 'users'),
('users.delete', 'Supprimer des utilisateurs', 'users'),
('users.roles', 'Gérer les rôles', 'users'),
('settings.view', 'Accéder aux paramètres', 'settings'),
('settings.chatbots', 'Configurer les chatbots', 'settings'),
('settings.integrations', 'Gérer les intégrations', 'settings'),
('settings.notifications', 'Configurer les notifications', 'settings'),
('settings.system', 'Paramètres système', 'settings');

-- Insert default profile permissions
INSERT INTO public.profile_permissions (profile_type, permission_id) 
SELECT 'agent', id FROM public.permissions 
WHERE name IN ('dashboard.view', 'chat.view', 'chat.manage');

INSERT INTO public.profile_permissions (profile_type, permission_id)
SELECT 'comptabilite', id FROM public.permissions
WHERE name IN ('dashboard.view', 'dashboard.stats', 'dashboard.export', 'analytics.view', 'analytics.reports');

INSERT INTO public.profile_permissions (profile_type, permission_id)
SELECT 'femme_de_menage', id FROM public.permissions  
WHERE name IN ('dashboard.view', 'chat.view');

INSERT INTO public.profile_permissions (profile_type, permission_id)
SELECT 'technicien', id FROM public.permissions
WHERE name IN ('dashboard.view', 'chat.view', 'chat.manage', 'settings.view');

INSERT INTO public.profile_permissions (profile_type, permission_id)
SELECT 'administrateur', id FROM public.permissions;

INSERT INTO public.profile_permissions (profile_type, permission_id)
SELECT 'responsable_logistique', id FROM public.permissions
WHERE name IN ('dashboard.view', 'dashboard.stats', 'chat.view', 'chat.assign', 'analytics.view', 'users.view');

INSERT INTO public.profile_permissions (profile_type, permission_id)
SELECT 'responsable_qualite', id FROM public.permissions
WHERE name IN ('dashboard.view', 'dashboard.stats', 'chat.view', 'analytics.view', 'analytics.reports', 'analytics.advanced', 'users.view');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration  
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();