-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Create a security definer function to get current user profile type
CREATE OR REPLACE FUNCTION public.get_current_user_profile_type()
RETURNS user_profile AS $$
  SELECT profile_type FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recreate the admin policy using the function to avoid recursion
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (public.get_current_user_profile_type() = 'administrateur'::user_profile);

-- Also fix the permissions policies that might have similar issues
DROP POLICY IF EXISTS "Only admins can manage permissions" ON public.permissions;
DROP POLICY IF EXISTS "Only admins can manage profile permissions" ON public.profile_permissions;

CREATE POLICY "Only admins can manage permissions" 
ON public.permissions 
FOR ALL 
USING (public.get_current_user_profile_type() = 'administrateur'::user_profile);

CREATE POLICY "Only admins can manage profile permissions" 
ON public.profile_permissions 
FOR ALL 
USING (public.get_current_user_profile_type() = 'administrateur'::user_profile);