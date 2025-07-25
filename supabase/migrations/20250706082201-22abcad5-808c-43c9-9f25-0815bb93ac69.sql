-- Récupérer l'ID de l'admin et créer son profil et rôles
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Récupérer l'ID de l'utilisateur admin
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@synergyai.com';
    
    -- Créer le profil admin s'il n'existe pas
    INSERT INTO public.profiles (
        user_id, 
        email, 
        first_name, 
        last_name, 
        profile_type, 
        is_active
    ) VALUES (
        admin_user_id,
        'admin@synergyai.com',
        'Admin',
        'System',
        'administrateur',
        true
    ) ON CONFLICT (user_id) DO UPDATE SET
        profile_type = 'administrateur',
        is_active = true;
    
    -- Assigner le rôle administrateur
    INSERT INTO public.user_roles (
        user_id,
        role,
        is_active
    ) VALUES (
        admin_user_id,
        'administrateur',
        true
    ) ON CONFLICT (user_id, role) DO UPDATE SET
        is_active = true;
        
    -- Assigner aussi le rôle super_admin pour tous les privilèges
    INSERT INTO public.user_roles (
        user_id,
        role,
        is_active
    ) VALUES (
        admin_user_id,
        'super_admin',
        true
    ) ON CONFLICT (user_id, role) DO UPDATE SET
        is_active = true;
END $$;