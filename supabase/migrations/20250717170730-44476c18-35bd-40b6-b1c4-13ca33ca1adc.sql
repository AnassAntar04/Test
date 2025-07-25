-- Phase 1: Create basic infrastructure tables
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organisation table (multi-tenant foundation)
CREATE TABLE public.organisation (
  org_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default organization
INSERT INTO public.organisation (name) VALUES ('Demo Hotel Management');

-- Create channel table for external integrations  
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