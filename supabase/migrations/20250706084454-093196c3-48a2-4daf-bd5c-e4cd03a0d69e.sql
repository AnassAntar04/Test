-- Créer toutes les permissions manquantes et les assigner au rôle administrateur
DO $$
DECLARE
    perm_id uuid;
BEGIN
    -- Créer les permissions manquantes si elles n'existent pas
    
    -- Administration
    INSERT INTO public.permissions (name, category, description) VALUES
    ('administration.manage', 'administration', 'Gestion complète de l''administration'),
    ('administration.view', 'administration', 'Consultation administration')
    ON CONFLICT (name) DO NOTHING;
    
    -- Analytics 
    INSERT INTO public.permissions (name, category, description) VALUES
    ('analytics.manage', 'analytics', 'Gestion complète des analyses'),
    ('analytics.export', 'analytics', 'Export des données analytiques')
    ON CONFLICT (name) DO NOTHING;
    
    -- Chat
    INSERT INTO public.permissions (name, category, description) VALUES
    ('chat.configuration', 'chat', 'Configuration des paramètres chat'),
    ('chat.templates', 'chat', 'Gestion des templates de réponse')
    ON CONFLICT (name) DO NOTHING;
    
    -- Configuration système
    INSERT INTO public.permissions (name, category, description) VALUES
    ('configuration.manage', 'configuration', 'Gestion configuration système'),
    ('configuration.view', 'configuration', 'Consultation configuration')
    ON CONFLICT (name) DO NOTHING;
    
    -- Finance
    INSERT INTO public.permissions (name, category, description) VALUES
    ('finance.reports', 'finance', 'Rapports financiers'),
    ('finance.export', 'finance', 'Export données financières')
    ON CONFLICT (name) DO NOTHING;
    
    -- Logistique
    INSERT INTO public.permissions (name, category, description) VALUES
    ('logistics.view', 'logistique', 'Consultation logistique'),
    ('logistics.reports', 'logistique', 'Rapports logistique')
    ON CONFLICT (name) DO NOTHING;
    
    -- Maintenance
    INSERT INTO public.permissions (name, category, description) VALUES
    ('maintenance.view', 'maintenance', 'Consultation maintenance'),
    ('maintenance.reports', 'maintenance', 'Rapports maintenance')
    ON CONFLICT (name) DO NOTHING;
    
    -- Qualité
    INSERT INTO public.permissions (name, category, description) VALUES
    ('quality.view', 'qualité', 'Consultation qualité'),
    ('quality.reports', 'qualité', 'Rapports qualité')
    ON CONFLICT (name) DO NOTHING;
    
    -- Nettoyage
    INSERT INTO public.permissions (name, category, description) VALUES
    ('cleaning.view', 'nettoyage', 'Consultation nettoyage'),
    ('cleaning.reports', 'nettoyage', 'Rapports nettoyage')
    ON CONFLICT (name) DO NOTHING;
    
    -- Intégrations
    INSERT INTO public.permissions (name, category, description) VALUES
    ('integrations.view', 'intégrations', 'Consultation intégrations'),
    ('integrations.configure', 'intégrations', 'Configuration intégrations')
    ON CONFLICT (name) DO NOTHING;
    
    -- Notifications
    INSERT INTO public.permissions (name, category, description) VALUES
    ('notifications.view', 'notifications', 'Consultation notifications'),
    ('notifications.configure', 'notifications', 'Configuration notifications')
    ON CONFLICT (name) DO NOTHING;

    -- Maintenant, assigner TOUTES les permissions au rôle administrateur
    INSERT INTO public.role_permissions (role, permission_id)
    SELECT 'administrateur'::app_role, p.id
    FROM public.permissions p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.role_permissions rp 
        WHERE rp.role = 'administrateur'::app_role AND rp.permission_id = p.id
    );
    
    -- Message de confirmation
    RAISE NOTICE 'Toutes les permissions ont été assignées au rôle administrateur';
END $$;