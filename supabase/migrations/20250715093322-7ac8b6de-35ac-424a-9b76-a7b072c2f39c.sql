-- Cleanup duplicate active roles and add constraints
-- Step 1: Deactivate lower-priority roles when user has multiple active roles
WITH role_priorities AS (
  SELECT 
    user_id,
    role,
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id 
      ORDER BY 
        CASE role
          WHEN 'super_admin' THEN 9
          WHEN 'administrateur' THEN 8
          WHEN 'superviseur' THEN 7
          WHEN 'responsable_logistique' THEN 6
          WHEN 'responsable_qualite' THEN 5
          WHEN 'technicien' THEN 4
          WHEN 'agent' THEN 3
          WHEN 'comptabilite' THEN 2
          WHEN 'femme_de_menage' THEN 1
          ELSE 0
        END DESC,
        created_at ASC
    ) as priority_rank
  FROM public.user_roles
  WHERE is_active = true
),
roles_to_deactivate AS (
  SELECT id
  FROM role_priorities
  WHERE priority_rank > 1
)
UPDATE public.user_roles
SET is_active = false
WHERE id IN (SELECT id FROM roles_to_deactivate);

-- Step 2: Create unique partial index to prevent multiple active roles per user
CREATE UNIQUE INDEX idx_user_roles_single_active 
ON public.user_roles (user_id) 
WHERE is_active = true;

-- Step 3: Update the assignRole function logic to handle role transitions
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id uuid, _role app_role, _assigned_by uuid, _expires_at timestamp with time zone DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Deactivate any existing active roles for this user
  UPDATE public.user_roles
  SET is_active = false
  WHERE user_id = _user_id AND is_active = true;
  
  -- Insert or reactivate the new role
  INSERT INTO public.user_roles (user_id, role, assigned_by, expires_at, is_active)
  VALUES (_user_id, _role, _assigned_by, _expires_at, true)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    is_active = true,
    assigned_by = _assigned_by,
    assigned_at = now(),
    expires_at = _expires_at;
END;
$$;