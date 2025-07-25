-- Create app_role enum with hierarchical roles
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'administrateur', 
  'superviseur',
  'responsable_logistique',
  'responsable_qualite',
  'technicien',
  'agent',
  'comptabilite',
  'femme_de_menage'
);

-- Create user_roles table for flexible role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Create function to get user's highest role level (for hierarchy)
CREATE OR REPLACE FUNCTION public.get_user_role_level(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin' AND is_active = true) THEN 9
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'administrateur' AND is_active = true) THEN 8
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'superviseur' AND is_active = true) THEN 7
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'responsable_logistique' AND is_active = true) THEN 6
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'responsable_qualite' AND is_active = true) THEN 5
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'technicien' AND is_active = true) THEN 4
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'agent' AND is_active = true) THEN 3
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'comptabilite' AND is_active = true) THEN 2
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'femme_de_menage' AND is_active = true) THEN 1
    ELSE 0
  END
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins and supervisors can view all roles"
ON public.user_roles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'administrateur') OR 
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'superviseur')
);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (
  public.has_role(auth.uid(), 'administrateur') OR 
  public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Supervisors can manage lower-level roles"
ON public.user_roles
FOR ALL
USING (
  public.has_role(auth.uid(), 'superviseur') AND
  role NOT IN ('super_admin', 'administrateur', 'superviseur')
);

-- Create indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_user_roles_active ON public.user_roles(is_active);

-- Migrate existing profile_type data to user_roles
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT 
  user_id, 
  profile_type::text::app_role,
  created_at
FROM public.profiles
WHERE profile_type IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;