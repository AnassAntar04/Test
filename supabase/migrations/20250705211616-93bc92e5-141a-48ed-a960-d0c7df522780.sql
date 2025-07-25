-- Create an admin user directly in the profiles table if needed
INSERT INTO public.profiles (user_id, email, first_name, last_name, profile_type, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'admin@synergyai.com', 'Admin', 'System', 'administrateur', true)
ON CONFLICT (user_id) DO NOTHING;

-- Create admin role for this user
INSERT INTO public.user_roles (user_id, role, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'super_admin', true)
ON CONFLICT (user_id, role) DO NOTHING;

-- Update trigger to handle user creation properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, email, first_name, last_name, profile_type, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'profile_type')::user_profile, 'agent'::user_profile),
    NEW.raw_user_meta_data ->> 'phone'
  );
  
  -- Assign default role based on profile type
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
END;
$$;