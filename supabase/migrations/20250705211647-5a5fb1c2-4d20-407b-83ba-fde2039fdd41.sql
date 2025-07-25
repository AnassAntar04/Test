-- Improve the user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles with better error handling
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
  
  -- Assign appropriate role
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (
    NEW.id,
    CASE 
      WHEN (NEW.raw_user_meta_data ->> 'profile_type') = 'administrateur' THEN 'administrateur'::app_role
      ELSE 'agent'::app_role
    END,
    true
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;