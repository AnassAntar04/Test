-- Nettoyer les références dans user_roles pour l'utilisateur problématique
UPDATE public.user_roles 
SET assigned_by = NULL 
WHERE assigned_by = 'eb8b4f8b-8f3b-4a61-a74f-f9c746202bd2';

-- Supprimer les rôles de l'utilisateur
DELETE FROM public.user_roles 
WHERE user_id = 'eb8b4f8b-8f3b-4a61-a74f-f9c746202bd2';

-- Supprimer le profil
DELETE FROM public.profiles 
WHERE user_id = 'eb8b4f8b-8f3b-4a61-a74f-f9c746202bd2';

-- Maintenant supprimer l'utilisateur de auth.users
DELETE FROM auth.users 
WHERE email = 'contact@internationalits.com' OR id = 'eb8b4f8b-8f3b-4a61-a74f-f9c746202bd2';