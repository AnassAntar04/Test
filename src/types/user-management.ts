export type UserProfileType = 'agent' | 'comptabilite' | 'femme_de_menage' | 'technicien' | 'administrateur' | 'responsable_logistique' | 'responsable_qualite';
export type GeographicalZoneType = 'paris_centre' | 'paris_ouest' | 'paris_est' | 'paris_nord' | 'paris_sud' | 'ile_de_france' | 'province' | 'international';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  profile_type: UserProfileType;
  geographical_zones: GeographicalZoneType[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface UserFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_type: UserProfileType;
  geographical_zones: GeographicalZoneType[];
  is_active: boolean;
}