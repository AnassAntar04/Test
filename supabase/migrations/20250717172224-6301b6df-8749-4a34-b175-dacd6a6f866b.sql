-- Enable RLS on all new tables and create security policies

-- Enable RLS on roles_new table
ALTER TABLE public.roles_new ENABLE ROW LEVEL SECURITY;

-- Enable RLS on property table
ALTER TABLE public.property ENABLE ROW LEVEL SECURITY;

-- Enable RLS on property_channel table
ALTER TABLE public.property_channel ENABLE ROW LEVEL SECURITY;

-- Enable RLS on guest table
ALTER TABLE public.guest ENABLE ROW LEVEL SECURITY;

-- Enable RLS on reservation table
ALTER TABLE public.reservation ENABLE ROW LEVEL SECURITY;

-- Enable RLS on category table
ALTER TABLE public.category ENABLE ROW LEVEL SECURITY;

-- Enable RLS on escalation_rules_new table
ALTER TABLE public.escalation_rules_new ENABLE ROW LEVEL SECURITY;

-- Enable RLS on escalation_categories table
ALTER TABLE public.escalation_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for roles_new table
CREATE POLICY "Authenticated users can view roles" 
ON public.roles_new 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage roles" 
ON public.roles_new 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create policies for property table
CREATE POLICY "Authenticated users can view properties" 
ON public.property 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and supervisors can manage properties" 
ON public.property 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'superviseur'::app_role));

-- Create policies for property_channel table
CREATE POLICY "Authenticated users can view property channels" 
ON public.property_channel 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage property channels" 
ON public.property_channel 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create policies for guest table
CREATE POLICY "Authenticated users can view guests" 
ON public.guest 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Agents and above can manage guests" 
ON public.guest 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'superviseur'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

-- Create policies for reservation table
CREATE POLICY "Authenticated users can view reservations" 
ON public.reservation 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Agents and above can manage reservations" 
ON public.reservation 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'superviseur'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

-- Create policies for category table
CREATE POLICY "Authenticated users can view categories" 
ON public.category 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage categories" 
ON public.category 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create policies for escalation_rules_new table
CREATE POLICY "Authenticated users can view escalation rules" 
ON public.escalation_rules_new 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage escalation rules" 
ON public.escalation_rules_new 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create policies for escalation_categories table
CREATE POLICY "Authenticated users can view escalation categories" 
ON public.escalation_categories 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage escalation categories" 
ON public.escalation_categories 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));