-- Phase 1: Nettoyage - Supprimer l'utilisateur problématique
-- Cela supprimera automatiquement les données dans profiles et user_roles grâce aux contraintes CASCADE
DELETE FROM auth.users WHERE email = 'contact@internationalits.com';

-- Créer un compte admin par défaut directement dans auth.users avec un mot de passe sécurisé
-- Cela déclenchera automatiquement le trigger handle_new_user pour créer le profil et les rôles
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@synergyai.com',
  crypt('AdminSynergy2025!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Admin","last_name":"System","profile_type":"administrateur"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Améliorer la fonction handle_new_user pour gérer tous les cas de rôles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles with comprehensive error handling
  INSERT INTO public.profiles (user_id, email, first_name, last_name, profile_type, phone, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'profile_type')::user_profile, 'agent'::user_profile),
    NEW.raw_user_meta_data ->> 'phone',
    true
  );
  
  -- Assign comprehensive role mapping based on profile type
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (
    NEW.id,
    CASE 
      WHEN (NEW.raw_user_meta_data ->> 'profile_type') = 'administrateur' THEN 'administrateur'::app_role
      WHEN (NEW.raw_user_meta_data ->> 'profile_type') = 'superviseur' THEN 'superviseur'::app_role
      WHEN (NEW.raw_user_meta_data ->> 'profile_type') = 'responsable_logistique' THEN 'responsable_logistique'::app_role
      WHEN (NEW.raw_user_meta_data ->> 'profile_type') = 'responsable_qualite' THEN 'responsable_qualite'::app_role
      WHEN (NEW.raw_user_meta_data ->> 'profile_type') = 'technicien' THEN 'technicien'::app_role
      WHEN (NEW.raw_user_meta_data ->> 'profile_type') = 'comptabilite' THEN 'comptabilite'::app_role
      WHEN (NEW.raw_user_meta_data ->> 'profile_type') = 'femme_de_menage' THEN 'femme_de_menage'::app_role
      ELSE 'agent'::app_role
    END,
    true
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user for user %, error: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;