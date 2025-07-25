import { AppRole, RolePermission } from "@/types/roles";

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Administrateur",
  Owner: "Super Administrateur",
  administrateur: "Administrateur",
  superviseur: "Superviseur",
  responsable_logistique: "Responsable Logistique",
  responsable_qualite: "Responsable Qualité",
  technicien: "Technicien",
  agent: "Agent",
  comptabilite: "Comptabilité",
  femme_de_menage: "Femme de ménage"
};

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  super_admin: 9,
  administrateur: 8,
  superviseur: 7,
  responsable_logistique: 6,
  responsable_qualite: 5,
  technicien: 4,
  agent: 3,
  comptabilite: 2,
  femme_de_menage: 1
};

export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  super_admin: ["Tous les privilèges", "Gestion système", "Contrôle total"],
  administrateur: ["Gestion utilisateurs", "Configuration système", "Rapports complets", "Gestion des rôles"],
  superviseur: ["Gestion équipe", "Attribution des rôles opérationnels", "Supervision", "Rapports équipe"],
  responsable_logistique: ["Gestion logistique", "Suivi des stocks", "Coordination", "Rapports logistiques"],
  responsable_qualite: ["Contrôle qualité", "Audit", "Standards", "Rapports qualité"],
  technicien: ["Support technique", "Maintenance", "Diagnostics", "Interventions"],
  agent: ["Opérations de base", "Saisie de données", "Chat", "Tâches assignées"],
  comptabilite: ["Gestion financière", "Facturation", "Rapports financiers", "Analytiques"],
  femme_de_menage: ["Accès minimal", "Tâches de nettoyage", "Rapports d'activité"]
};



export const getManageableRoles = (userRole: AppRole): AppRole[] => {
  const userLevel = ROLE_HIERARCHY[userRole];
  
  if (userRole === 'administrateur' || userRole === 'super_admin') {
    return Object.keys(ROLE_HIERARCHY) as AppRole[];
  }
  
  if (userRole === 'superviseur') {
    return Object.keys(ROLE_HIERARCHY).filter(
      role => ROLE_HIERARCHY[role as AppRole] < userLevel
    ) as AppRole[];
  }
  
  return [];
};