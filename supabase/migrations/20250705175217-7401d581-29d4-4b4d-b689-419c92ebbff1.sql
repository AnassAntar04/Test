-- Insert default routing matrix data
INSERT INTO public.routing_matrix (request_type_id, role, permission_type)
SELECT 
  rt.id,
  roles.role,
  CASE 
    WHEN rt.name = 'Réservation/Commercial' AND roles.role = 'agent' THEN 'direct_treatment'
    WHEN rt.name = 'Réservation/Commercial' AND roles.role = 'superviseur' THEN 'read_only'
    WHEN rt.name = 'Réservation/Commercial' THEN 'no_access'
    
    WHEN rt.name = 'Problème technique' AND roles.role = 'agent' THEN 'entry_point'
    WHEN rt.name = 'Problème technique' AND roles.role = 'technicien' THEN 'direct_treatment'
    WHEN rt.name = 'Problème technique' AND roles.role = 'superviseur' THEN 'escalation'
    WHEN rt.name = 'Problème technique' THEN 'no_access'
    
    WHEN rt.name = 'Ménage/Propreté' AND roles.role = 'agent' THEN 'entry_point'
    WHEN rt.name = 'Ménage/Propreté' AND roles.role = 'femme_de_menage' THEN 'direct_treatment'
    WHEN rt.name = 'Ménage/Propreté' AND roles.role = 'superviseur' THEN 'escalation'
    WHEN rt.name = 'Ménage/Propreté' THEN 'no_access'
    
    WHEN rt.name = 'Facturation' AND roles.role = 'agent' THEN 'entry_point'
    WHEN rt.name = 'Facturation' AND roles.role = 'comptabilite' THEN 'direct_treatment'
    WHEN rt.name = 'Facturation' AND roles.role = 'superviseur' THEN 'escalation'
    WHEN rt.name = 'Facturation' THEN 'no_access'
    
    WHEN rt.name = 'Réclamation urgente' AND roles.role = 'superviseur' THEN 'direct_treatment'
    WHEN rt.name = 'Réclamation urgente' THEN 'entry_point'
    
    ELSE 'no_access'
  END
FROM public.request_types rt
CROSS JOIN (
  SELECT unnest(ARRAY['agent', 'technicien', 'femme_de_menage', 'comptabilite', 'superviseur']) as role
) roles;