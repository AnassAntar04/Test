import { UserProfileType, GeographicalZoneType } from "@/types/user-management";

export const PROFILE_TYPES: Record<UserProfileType, string> = {
  agent: "Agent",
  comptabilite: "Comptabilité", 
  femme_de_menage: "Femme de ménage",
  technicien: "Technicien",
  administrateur: "Administrateur/Superviseur",
  responsable_logistique: "Responsable logistique",
  responsable_qualite: "Responsable qualité"
};

export const GEOGRAPHICAL_ZONES: Record<GeographicalZoneType, string> = {
  paris_centre: "Paris Centre",
  paris_ouest: "Paris Ouest",
  paris_est: "Paris Est", 
  paris_nord: "Paris Nord",
  paris_sud: "Paris Sud",
  ile_de_france: "Île-de-France",
  province: "Province",
  international: "International"
};

export const getPermissionsByProfile = (profileType: string): string[] => {
  const profilePermissions: Record<string, string[]> = {
    agent: ['dashboard.view', 'chat.view', 'chat.manage'],
    comptabilite: ['dashboard.view', 'dashboard.stats', 'analytics.view'],
    administrateur: ['Tous les privilèges'],
    // ... other profiles
  };
  return profilePermissions[profileType] || [];
};
