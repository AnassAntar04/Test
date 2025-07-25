-- Donner les privilèges admin au compte actuellement connecté
DO $$
DECLARE
    current_user_id uuid := '13cd9434-811e-4b7e-8545-4e63341e3e30';
BEGIN
    -- Créer le profil admin
    INSERT INTO public.profiles (
        user_id, 
        email, 
        first_name, 
        last_name, 
        profile_type, 
        is_active
    ) VALUES (
        current_user_id,
        'contact@internationalits.com',
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
        current_user_id,
        'administrateur',
        true
    ) ON CONFLICT (user_id, role) DO UPDATE SET
        is_active = true;
        
    -- Assigner le rôle super_admin
    INSERT INTO public.user_roles (
        user_id,
        role,
        is_active
    ) VALUES (
        current_user_id,
        'super_admin',
        true
    ) ON CONFLICT (user_id, role) DO UPDATE SET
        is_active = true;
END $$;