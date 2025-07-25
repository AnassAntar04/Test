
import { generateRandomId, randomChoice, mockNames, moroccanZones, generateMoroccanPhone } from './common';
import { Profile, UserProfileType, GeographicalZoneType } from '@/types/user-management';

const profileTypes: UserProfileType[] = ['agent', 'administrateur', 'technicien', 'comptabilite', 'femme_de_menage', 'responsable_logistique', 'responsable_qualite'];

// Noms d'équipe marocains pour les employés locaux
const moroccanTeamNames = {
  first: ['Youssef', 'Fatima', 'Omar', 'Aicha', 'Hassan', 'Khadija', 'Ahmed', 'Nadia', 'Khalid', 'Samira', 'Rachid', 'Zineb'],
  last: ['Bennani', 'El-Fassi', 'Benkirane', 'Al-Idrissi', 'El-Othmani', 'Benomar', 'Tazi', 'Alami', 'Berrada', 'Sekkat', 'Lahlou', 'Chraibi']
};

const generateMockProfile = (index: number): Profile => {
  const firstName = randomChoice(moroccanTeamNames.first);
  const lastName = randomChoice(moroccanTeamNames.last);
  
  return {
    id: `profile-${index}`,
    user_id: `user-${index}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@samyconciergerie.ma`,
    first_name: firstName,
    last_name: lastName,
    phone: generateMoroccanPhone(),
    profile_type: randomChoice(profileTypes),
    geographical_zones: [randomChoice(moroccanZones), randomChoice(moroccanZones)] as GeographicalZoneType[],
    is_active: Math.random() > 0.1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const mockProfiles: Profile[] = Array.from({ length: 15 }, (_, i) => generateMockProfile(i));

export const mockUserRoles = [
  { userId: 'user-0', roles: ['super_admin'] },
  { userId: 'user-1', roles: ['administrateur'] },
  { userId: 'user-2', roles: ['superviseur'] },
  { userId: 'user-3', roles: ['agent'] },
  { userId: 'user-4', roles: ['technicien'] },
  { userId: 'user-5', roles: ['comptabilite'] }
];
