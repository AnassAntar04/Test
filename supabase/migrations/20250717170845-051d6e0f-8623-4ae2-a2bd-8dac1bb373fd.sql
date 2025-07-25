-- Phase 3: Create conversation and escalation system

-- Create category and escalation system
CREATE TABLE public.category (
  cat_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  keywords TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(org_id, name)
);

-- Insert initial categories
INSERT INTO public.category (org_id, name, keywords) 
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  unnest(ARRAY[
    'Technical Issue',
    'Cleaning/Housekeeping', 
    'Booking/Reservation',
    'Billing',
    'Urgent Complaint'
  ]),
  unnest(ARRAY[
    'wifi,internet,tv,air conditioning,heating,technical,maintenance',
    'cleaning,housekeeping,towels,sheets,dirty,clean',
    'booking,reservation,check-in,check-out,availability',
    'billing,payment,invoice,charge,refund,money',
    'urgent,emergency,complaint,problem,issue'
  ]);

-- Create new escalation rules system
CREATE TABLE public.escalation_rules_new (
  esc_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  from_role uuid NOT NULL REFERENCES public.roles_new(role_id),
  to_role uuid NOT NULL REFERENCES public.roles_new(role_id),
  condition TEXT NOT NULL DEFAULT 'immediate',
  priority INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.escalation_categories (
  cat_id uuid NOT NULL REFERENCES public.category(cat_id),
  esc_id uuid NOT NULL REFERENCES public.escalation_rules_new(esc_id),
  PRIMARY KEY (cat_id, esc_id)
);

-- Insert escalation rules with proper role references
INSERT INTO public.escalation_rules_new (org_id, name, from_role, to_role, condition, priority)
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Technical Entry',
  (SELECT role_id FROM public.roles_new WHERE name = 'agent'),
  (SELECT role_id FROM public.roles_new WHERE name = 'technicien'),
  'immediate',
  10
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Technical Blocked',
  (SELECT role_id FROM public.roles_new WHERE name = 'technicien'),
  (SELECT role_id FROM public.roles_new WHERE name = 'superviseur'),
  'no_reply_for:30',
  20
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Cleaning Entry',
  (SELECT role_id FROM public.roles_new WHERE name = 'agent'),
  (SELECT role_id FROM public.roles_new WHERE name = 'femme_de_menage'),
  'immediate',
  10
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Cleaning Blocked',
  (SELECT role_id FROM public.roles_new WHERE name = 'femme_de_menage'),
  (SELECT role_id FROM public.roles_new WHERE name = 'superviseur'),
  'no_reply_for:60',
  20
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Billing Entry',
  (SELECT role_id FROM public.roles_new WHERE name = 'agent'),
  (SELECT role_id FROM public.roles_new WHERE name = 'comptabilite'),
  'immediate',
  10
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Billing Blocked',
  (SELECT role_id FROM public.roles_new WHERE name = 'comptabilite'),
  (SELECT role_id FROM public.roles_new WHERE name = 'superviseur'),
  'no_reply_for:30',
  20
UNION ALL
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  'Urgent Complaint',
  (SELECT role_id FROM public.roles_new WHERE name = 'agent'),
  (SELECT role_id FROM public.roles_new WHERE name = 'superviseur'),
  'immediate',
  5;