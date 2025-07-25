-- Enable RLS on organisation and channel tables

-- Enable RLS on organisation table
ALTER TABLE public.organisation ENABLE ROW LEVEL SECURITY;

-- Enable RLS on channel table
ALTER TABLE public.channel ENABLE ROW LEVEL SECURITY;

-- Create policies for organisation table
CREATE POLICY "Authenticated users can view organisation" 
ON public.organisation 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage organisation" 
ON public.organisation 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create policies for channel table
CREATE POLICY "Authenticated users can view channels" 
ON public.channel 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage channels" 
ON public.channel 
FOR ALL 
USING (has_role(auth.uid(), 'administrateur'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));