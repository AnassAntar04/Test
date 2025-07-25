-- Phase 2: Create role system and property management
-- Create new roles table (dynamic per organization)
CREATE TABLE public.roles_new (
  role_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES public.organisation(org_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(org_id, name)
);

-- Insert roles equivalent to current app_role enum
INSERT INTO public.roles_new (org_id, name, description) 
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

-- Create property management tables
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

-- Create guest management
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

-- Create reservation system
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