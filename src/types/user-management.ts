export type UserProfileType = 'agent' | 'comptabilite' | 'femme_de_menage' | 'technicien' | 'administrateur' | 'responsable_logistique' | 'responsable_qualite';
export type GeographicalZoneType = 'paris_centre' | 'paris_ouest' | 'paris_est' | 'paris_nord' | 'paris_sud' | 'ile_de_france' | 'province' | 'international';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  profile_type: string;
  geographical_zones: string | string[]; // Can be a single string or an array of strings
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
  id?: string; // Optional for new users
  user_id?: string; // Optional for new users
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_type: string ;
  geographical_zones: string | string[]; // Can be a single string or an array of strings
  is_active: boolean;
}