export type AppRole = 
  | 'super_admin'
  | 'administrateur' 
  | 'superviseur'
  | 'responsable_logistique'
  | 'responsable_qualite'
  | 'technicien'
  | 'agent'
  | 'comptabilite'
  | 'femme_de_menage'
  | 'Owner';
  ;

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by: string | null;
  assigned_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface RolePermission {
  role: AppRole;
  permissions: string[];
  level: number;
  canManage: AppRole[];
}