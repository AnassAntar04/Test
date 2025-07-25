-- Créer un utilisateur administrateur par défaut
-- D'abord, insérer un profil administrateur de test
INSERT INTO public.profiles (
  user_id, 
  email, 
  first_name, 
  last_name, 
  profile_type, 
  geographical_zones, 
  is_active
) VALUES (
  'eb8b4f8b-8f3b-4a61-a74f-f9c746202bd2', -- ID d'un utilisateur existant d'après les logs
  'contact@internationalits.com',
  'Admin',
  'Système',
  'administrateur'::user_profile,
  ARRAY['paris_centre'::geographical_zone],
  true
) ON CONFLICT (user_id) DO UPDATE SET
  profile_type = 'administrateur'::user_profile,
  first_name = 'Admin',
  last_name = 'Système';

-- Assigner le rôle administrateur à cet utilisateur
INSERT INTO public.user_roles (
  user_id,
  role,
  assigned_by,
  is_active
) VALUES (
  'eb8b4f8b-8f3b-4a61-a74f-f9c746202bd2',
  'administrateur'::app_role,
  'eb8b4f8b-8f3b-4a61-a74f-f9c746202bd2',
  true
) ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true;