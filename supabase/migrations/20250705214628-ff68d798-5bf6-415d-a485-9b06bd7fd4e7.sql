-- Créer les profils manquants pour les utilisateurs qui ont des rôles mais pas de profils
INSERT INTO public.profiles (user_id, email, first_name, last_name, profile_type, is_active)
SELECT 
    au.id as user_id,
    au.email,
    COALESCE(au.raw_user_meta_data ->> 'first_name', '') as first_name,
    COALESCE(au.raw_user_meta_data ->> 'last_name', '') as last_name,
    COALESCE((au.raw_user_meta_data ->> 'profile_type')::user_profile, 'agent'::user_profile) as profile_type,
    true as is_active
FROM auth.users au
WHERE au.id IN (
    SELECT ur.user_id 
    FROM user_roles ur 
    WHERE ur.user_id NOT IN (SELECT user_id FROM profiles)
);