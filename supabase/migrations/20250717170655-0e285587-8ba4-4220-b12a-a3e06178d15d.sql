-- Step 2: Complete the escalation rules migration and transform profiles table

-- Fix the escalation rules insertion with proper syntax
INSERT INTO public.escalation_rules_new (org_id, name, from_role, to_role, condition, priority)
WITH role_mapping AS (
  SELECT role_id, name FROM public.roles WHERE org_id = (SELECT org_id FROM public.organisation LIMIT 1)
)
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Technical Entry',
  (SELECT role_id FROM role_mapping WHERE name = 'agent'),
  (SELECT role_id FROM role_mapping WHERE name = 'technicien'),
  'immediate',
  10
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Technical Blocked',
  (SELECT role_id FROM role_mapping WHERE name = 'technicien'),
  (SELECT role_id FROM role_mapping WHERE name = 'superviseur'),
  'no_reply_for:30',
  20
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Cleaning Entry',
  (SELECT role_id FROM role_mapping WHERE name = 'agent'),
  (SELECT role_id FROM role_mapping WHERE name = 'femme_de_menage'),
  'immediate',
  10
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Cleaning Blocked',
  (SELECT role_id FROM role_mapping WHERE name = 'femme_de_menage'),
  (SELECT role_id FROM role_mapping WHERE name = 'superviseur'),
  'no_reply_for:60',
  20
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Billing Entry',
  (SELECT role_id FROM role_mapping WHERE name = 'agent'),
  (SELECT role_id FROM role_mapping WHERE name = 'comptabilite'),
  'immediate',
  10
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Billing Blocked',
  (SELECT role_id FROM role_mapping WHERE name = 'comptabilite'),
  (SELECT role_id FROM role_mapping WHERE name = 'superviseur'),
  'no_reply_for:30',
  20
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Urgent Complaint',
  (SELECT role_id FROM role_mapping WHERE name = 'agent'),
  (SELECT role_id FROM role_mapping WHERE name = 'superviseur'),
  'immediate',
  5;

-- Link escalation rules to categories
INSERT INTO public.escalation_categories (cat_id, esc_id)
SELECT 
  (SELECT cat_id FROM public.category WHERE name = 'Technical Issue'),
  (SELECT esc_id FROM public.escalation_rules_new WHERE name IN ('Technical Entry', 'Technical Blocked'))
UNION ALL
SELECT 
  (SELECT cat_id FROM public.category WHERE name = 'Cleaning/Housekeeping'),
  (SELECT esc_id FROM public.escalation_rules_new WHERE name IN ('Cleaning Entry', 'Cleaning Blocked'))
UNION ALL
SELECT 
  (SELECT cat_id FROM public.category WHERE name = 'Billing'),
  (SELECT esc_id FROM public.escalation_rules_new WHERE name IN ('Billing Entry', 'Billing Blocked'))
UNION ALL
SELECT 
  (SELECT cat_id FROM public.category WHERE name = 'Urgent Complaint'),
  (SELECT esc_id FROM public.escalation_rules_new WHERE name = 'Urgent Complaint');

-- Step 14: Transform profiles table to new schema
-- First backup current profiles
CREATE TABLE public.profiles_backup AS SELECT * FROM public.profiles;

-- Create new profiles table structure
CREATE TABLE public.profiles_new (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id uuid NOT NULL UNIQUE,
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  hashed_pw TEXT NOT NULL DEFAULT '',
  role_id uuid NOT NULL REFERENCES public.roles(role_id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'Morocco',
  is_active BOOLEAN NOT NULL DEFAULT true,
  geographic_zones TEXT[] DEFAULT ARRAY['*'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migrate existing profiles to new structure
INSERT INTO public.profiles_new (
  auth_user_id,
  org_id,
  email,
  first_name,
  last_name,
  phone,
  role_id,
  is_active,
  geographic_zones,
  created_at,
  updated_at
)
SELECT 
  p.user_id as auth_user_id,
  (SELECT org_id FROM public.organisation LIMIT 1),
  p.email,
  p.first_name,
  p.last_name,
  p.phone,
  (SELECT r.role_id FROM public.roles r 
   JOIN public.user_roles ur ON ur.role::text = r.name 
   WHERE ur.user_id = p.user_id AND ur.is_active = true 
   LIMIT 1),
  COALESCE(p.is_active, true),
  COALESCE(p.geographical_zones::text[], ARRAY['*']),
  p.created_at,
  p.updated_at
FROM public.profiles p;

-- Add foreign key constraints for conversation/message tables
ALTER TABLE public.conversation_participant 
ADD CONSTRAINT fk_conversation_participant_user 
FOREIGN KEY (user_id) REFERENCES public.profiles_new(user_id);

ALTER TABLE public.message 
ADD CONSTRAINT fk_message_sender 
FOREIGN KEY (sender_user_id) REFERENCES public.profiles_new(user_id);

-- Step 15: Create sample data for demonstration
INSERT INTO public.property (org_id, name, address, latitude, longitude, amenities)
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  unnest(ARRAY['Demo Hotel Paris', 'Demo Apartment Nice', 'Demo Villa Cannes']),
  unnest(ARRAY['123 Champs Elysées, Paris', '456 Promenade des Anglais, Nice', '789 Croisette, Cannes']),
  unnest(ARRAY[48.8566, 43.6962, 43.5502]),
  unnest(ARRAY[2.3522, 7.2583, 7.0128]),
  unnest(ARRAY[
    '{"wifi": true, "parking": true, "pool": false}',
    '{"wifi": true, "parking": false, "pool": true}',
    '{"wifi": true, "parking": true, "pool": true}'
  ]::jsonb[]);

-- Insert sample guests
INSERT INTO public.guest (org_id, first_name, last_name, email, phone, country)
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  unnest(ARRAY['John', 'Marie', 'Ahmed']),
  unnest(ARRAY['Doe', 'Dubois', 'Hassan']),
  unnest(ARRAY['john.doe@email.com', 'marie.dubois@email.com', 'ahmed.hassan@email.com']),
  unnest(ARRAY['+33123456789', '+33987654321', '+212654321987']),
  unnest(ARRAY['USA', 'France', 'Morocco']);

-- Step 16: Enable RLS on all new tables
ALTER TABLE public.organisation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_channel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_rules_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participant ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_message_target ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_new ENABLE ROW LEVEL SECURITY;

-- Create helper function to get user's org_id
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT org_id FROM public.profiles_new WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- Create helper function to get user's role_id
CREATE OR REPLACE FUNCTION public.get_user_role_id()
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role_id FROM public.profiles_new WHERE auth_user_id = auth.uid() LIMIT 1;
$$;