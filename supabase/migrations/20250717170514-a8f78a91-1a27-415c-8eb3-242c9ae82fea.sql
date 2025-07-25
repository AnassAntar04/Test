-- Comprehensive migration to new hospitality management schema
-- Phase 1: Create new schema with data preservation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Step 1: Create the organization table (multi-tenant foundation)
CREATE TABLE public.organisation (
  org_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default organization for existing data
INSERT INTO public.organisation (name) VALUES ('Demo Hotel Management');

-- Step 2: Create channel table for external integrations
CREATE TABLE public.channel (
  channel_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  channel_type TEXT NOT NULL,
  credentials JSONB NOT NULL DEFAULT '{}'
);

-- Insert default channels
INSERT INTO public.channel (name, channel_type) VALUES 
  ('email', 'messaging'),
  ('whatsapp', 'messaging'),
  ('airbnb', 'ota'),
  ('booking', 'ota'),
  ('direct', 'direct');

-- Step 3: Create new roles table (dynamic per organization)
CREATE TABLE public.roles (
  role_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT
);

-- Create unique constraint for role names per org
CREATE UNIQUE INDEX ON public.roles (org_id, name);

-- Insert roles equivalent to current app_role enum
INSERT INTO public.roles (org_id, name, description) 
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  unnest(ARRAY[
    'super_admin',
    'administrateur', 
    'superviseur',
    'responsable_logistique',
    'responsable_qualite',
    'technicien',
    'agent',
    'comptabilite',
    'femme_de_menage'
  ]),
  unnest(ARRAY[
    'Super Administrator',
    'Administrator', 
    'Supervisor',
    'Logistics Manager',
    'Quality Manager',
    'Technician',
    'Agent',
    'Accounting',
    'Housekeeper'
  ]);

-- Step 4: Create new permissions table with codes
CREATE TABLE public.permissions_new (
  perm_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  code TEXT UNIQUE NOT NULL
);

-- Migrate existing permissions to new structure
INSERT INTO public.permissions_new (name, description, code)
SELECT 
  name,
  description,
  UPPER(REPLACE(REPLACE(name, ' ', '_'), '-', '_')) as code
FROM public.permissions;

-- Step 5: Create new role_permissions junction table
CREATE TABLE public.role_permissions_new (
  role_id uuid NOT NULL REFERENCES public.roles(role_id) ON DELETE CASCADE,
  perm_id uuid NOT NULL REFERENCES public.permissions_new(perm_id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, perm_id)
);

-- Migrate existing role permissions
INSERT INTO public.role_permissions_new (role_id, perm_id)
SELECT 
  r.role_id,
  pn.perm_id
FROM public.role_permissions rp
JOIN public.roles r ON r.name = rp.role::text
JOIN public.permissions_new pn ON pn.name = (SELECT name FROM public.permissions WHERE id = rp.permission_id);

-- Step 6: Create property management tables
CREATE TABLE public.property (
  property_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  ext_id TEXT UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  status TEXT NOT NULL DEFAULT 'active',
  amenities JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.property_channel (
  property_id uuid NOT NULL REFERENCES public.property(property_id) ON DELETE CASCADE,
  channel_id uuid NOT NULL REFERENCES public.channel(channel_id) ON DELETE CASCADE,
  external_listing_id TEXT,
  PRIMARY KEY (property_id, channel_id)
);

-- Step 7: Create guest management
CREATE TABLE public.guest (
  guest_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  ext_id TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 8: Create reservation system
CREATE TABLE public.reservation (
  res_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid NOT NULL REFERENCES public.property(property_id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES public.guest(guest_id) ON DELETE SET NULL,
  channel_id uuid NOT NULL REFERENCES public.channel(channel_id),
  ext_res_id TEXT UNIQUE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT NOT NULL,
  adults SMALLINT NOT NULL DEFAULT 1,
  children SMALLINT NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 9: Create category and escalation system
CREATE TABLE public.category (
  cat_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  keywords TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX ON public.category (org_id, name);

-- Insert initial categories based on current system
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

-- Step 10: Create new escalation rules system
CREATE TABLE public.escalation_rules_new (
  esc_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  from_role uuid NOT NULL REFERENCES public.roles(role_id),
  to_role uuid NOT NULL REFERENCES public.roles(role_id),
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

-- Insert initial escalation matrix
WITH role_mapping AS (
  SELECT role_id, name FROM public.roles WHERE org_id = (SELECT org_id FROM public.organisation LIMIT 1)
),
cat_mapping AS (
  SELECT cat_id, name FROM public.category WHERE org_id = (SELECT org_id FROM public.organisation LIMIT 1)
),
escalation_data AS (
  SELECT 
    'Technical Entry' as rule_name,
    'agent' as from_role_name,
    'technicien' as to_role_name,
    'immediate' as condition,
    10 as priority,
    'Technical Issue' as category_name
  UNION ALL
  SELECT 'Technical Blocked', 'technicien', 'superviseur', 'no_reply_for:30', 20, 'Technical Issue'
  UNION ALL  
  SELECT 'Cleaning Entry', 'agent', 'femme_de_menage', 'immediate', 10, 'Cleaning/Housekeeping'
  UNION ALL
  SELECT 'Cleaning Blocked', 'femme_de_menage', 'superviseur', 'no_reply_for:60', 20, 'Cleaning/Housekeeping'
  UNION ALL
  SELECT 'Billing Entry', 'agent', 'comptabilite', 'immediate', 10, 'Billing'
  UNION ALL
  SELECT 'Billing Blocked', 'comptabilite', 'superviseur', 'no_reply_for:30', 20, 'Billing'
  UNION ALL
  SELECT 'Urgent Complaint', 'agent', 'superviseur', 'immediate', 5, 'Urgent Complaint'
)
INSERT INTO public.escalation_rules_new (org_id, name, from_role, to_role, condition, priority)
SELECT 
  (SELECT org_id FROM public.organisation LIMIT 1),
  ed.rule_name,
  fr.role_id,
  tr.role_id,
  ed.condition,
  ed.priority
FROM escalation_data ed
JOIN role_mapping fr ON fr.name = ed.from_role_name
JOIN role_mapping tr ON tr.name = ed.to_role_name;

-- Link escalation rules to categories
INSERT INTO public.escalation_categories (cat_id, esc_id)
SELECT 
  cm.cat_id,
  er.esc_id
FROM escalation_data ed
JOIN cat_mapping cm ON cm.name = ed.category_name
JOIN escalation_rules_new er ON er.name = ed.rule_name;

-- Step 11: Create conversation and messaging system
CREATE TABLE public.conversation (
  conv_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guest(guest_id),
  property_id uuid REFERENCES public.property(property_id),
  channel_id uuid NOT NULL REFERENCES public.channel(channel_id),
  cat_id uuid REFERENCES public.category(cat_id),
  status TEXT NOT NULL DEFAULT 'open',
  is_internal BOOLEAN NOT NULL DEFAULT false,
  is_bot_enabled BOOLEAN NOT NULL DEFAULT true,
  is_bot_resolved BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.conversation_participant (
  conv_id uuid NOT NULL REFERENCES public.conversation(conv_id) ON DELETE CASCADE,
  user_id uuid NOT NULL, -- Will reference new profiles after migration
  PRIMARY KEY (conv_id, user_id)
);

CREATE TABLE public.message (
  msg_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conv_id uuid NOT NULL REFERENCES public.conversation(conv_id) ON DELETE CASCADE,
  direction TEXT NOT NULL,
  sender_type TEXT NOT NULL,
  sender_user_id uuid, -- Will reference new profiles after migration
  external_msg_id TEXT,
  body TEXT,
  attachments JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.bot_event (
  event_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conv_id uuid NOT NULL REFERENCES public.conversation(conv_id) ON DELETE CASCADE,
  msg_id uuid NOT NULL REFERENCES public.message(msg_id) ON DELETE CASCADE,
  intent TEXT,
  cat_id_predicted uuid REFERENCES public.category(cat_id),
  confidence DECIMAL(4,3),
  action_taken TEXT,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 12: Create group messaging system
CREATE TABLE public.group_message (
  segment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  criteria JSONB NOT NULL,
  message TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  last_run TIMESTAMPTZ
);

CREATE TABLE public.group_message_target (
  segment_id uuid NOT NULL REFERENCES public.group_message(segment_id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES public.guest(guest_id),
  PRIMARY KEY (segment_id, guest_id)
);

-- Step 13: Create performance indexes
CREATE INDEX idx_property_location ON public.property (latitude, longitude);
CREATE INDEX idx_guest_email ON public.guest (lower(email));
CREATE INDEX idx_reservation_dates ON public.reservation (check_in, check_out);
CREATE INDEX idx_conversation_status ON public.conversation (status);
CREATE INDEX idx_message_body_trgm ON public.message USING GIN (body gin_trgm_ops);
CREATE INDEX idx_message_conv_created ON public.message (conv_id, created_at);
CREATE INDEX idx_foreign_keys_reservation ON public.reservation (guest_id, property_id, channel_id);
CREATE INDEX idx_fk_conversation ON public.conversation (guest_id, property_id, channel_id, cat_id);