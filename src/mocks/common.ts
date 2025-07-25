
// Utilitaires communs pour générer des données mock
export const generateRandomId = () => Math.random().toString(36).substr(2, 9);

export const generateRandomDate = (daysAgo: number = 0, daysRange: number = 7) => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysRange) + daysAgo;
  return new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
};

export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Noms diversifiés pour une clientèle internationale au Maroc
export const mockNames = {
  first: [
    // Noms français (importante clientèle française)
    'Jean', 'Marie', 'Pierre', 'Sophie', 'Thomas', 'Julie', 'Michel', 'Catherine',
    // Noms anglais/américains (tourisme international)
    'James', 'Emma', 'William', 'Olivia', 'John', 'Sarah', 'David', 'Emily',
    // Noms espagnols (proximité géographique)
    'Carlos', 'María', 'Antonio', 'Carmen', 'José', 'Ana', 'Manuel', 'Isabel',
    // Noms allemands (marché touristique important)
    'Hans', 'Greta', 'Klaus', 'Ingrid', 'Wolfgang', 'Heidi', 'Franz', 'Ursula',
    // Noms italiens (tourisme méditerranéen)
    'Marco', 'Giulia', 'Alessandro', 'Francesca', 'Lorenzo', 'Chiara', 'Roberto', 'Elena',
    // Noms arabes (région MENA)
    'Omar', 'Fatima', 'Ahmed', 'Aicha', 'Hassan', 'Khadija', 'Youssef', 'Nadia'
  ],
  last: [
    // Noms de famille français
    'Dupont', 'Martin', 'Bernard', 'Durand', 'Moreau', 'Laurent', 'Simon', 'Michel',
    // Noms de famille anglais/américains
    'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson', 'Anderson', 'Taylor',
    // Noms de famille espagnols
    'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez',
    // Noms de famille allemands
    'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker',
    // Noms de famille italiens
    'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci',
    // Noms de famille arabes
    'Al-Mansouri', 'Ben Ali', 'El-Fassi', 'Benkirane', 'Al-Idrissi', 'Bennani', 'El-Othmani', 'Benomar'
  ]
};

// Propriétés dans les principales villes touristiques du Maroc
export const mockProperties = [
  // Casablanca
  'Appartement Marina Casablanca', 'Studio Ain Diab', 'Loft Maarif Centre', 'Suite Anfa Place',
  'Penthouse Twin Center', 'Appartement Boulevard Corniche', 'Studio CFC Casablanca',
  // Marrakech
  'Riad Hivernage Marrakech', 'Appartement Gueliz', 'Villa Palmeraie', 'Suite Medina View',
  'Penthouse Atlas Mountains', 'Riad Majorelle Garden', 'Appartement Carré Eden',
  // Rabat
  'Appartement Agdal Rabat', 'Studio Hassan Centre', 'Loft Souissi', 'Suite Hay Riad',
  'Penthouse Tour Hassan', 'Appartement Océan Rabat', 'Villa Ambassadeurs',
  // Agadir
  'Appartement Marina Agadir', 'Studio Baie d\'Agadir', 'Penthouse Souss-Massa',
  // Fès
  'Riad Ville Nouvelle Fès', 'Appartement Atlas Fès'
];

// Messages multilingues typiques d'une clientèle internationale
export const mockMessages = [
  // Français
  'Bonjour, je souhaite des informations sur mon séjour',
  'Pouvez-vous me donner les codes d\'accès ?',
  'Y a-t-il un problème avec le WiFi ?',
  'Comment puis-je régler la climatisation ?',
  'Où puis-je garer ma voiture ?',
  'Pouvez-vous recommander un bon restaurant local ?',
  'Comment aller à la médina depuis l\'appartement ?',
  'Y a-t-il un hammam près d\'ici ?',
  
  // Anglais (traduit automatiquement pour simulation)
  'Hello, I need information about airport transfer',
  'Can you help me book a taxi to the medina?',
  'Is there air conditioning in the apartment?',
  'Where can I exchange money nearby?',
  'What time is check-out?',
  'Can you recommend local attractions?',
  'Is the rooftop terrace accessible?',
  'Thank you for your help, everything is perfect!',
  
  // Contexte marocain spécifique
  'Puis-je avoir des informations sur les horaires du Ramadan ?',
  'Y a-t-il des restrictions pendant les fêtes religieuses ?',
  'Comment puis-je réserver une excursion dans le désert ?',
  'Pouvez-vous m\'aider à trouver un guide pour la kasbah ?',
  'Le ménage est-il prévu aujourd\'hui ?',
  'Puis-je avoir des serviettes supplémentaires ?'
];

// Formats de téléphone marocains
export const generateMoroccanPhone = () => {
  const prefixes = ['6', '7']; // Mobiles au Maroc
  const prefix = randomChoice(prefixes);
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `+212 ${prefix} ${number.toString().substring(0, 2)} ${number.toString().substring(2, 4)} ${number.toString().substring(4, 6)} ${number.toString().substring(6, 8)}`;
};

// Zones géographiques marocaines
export const moroccanZones = [
  'casablanca_centre', 'casablanca_ain_diab', 'casablanca_maarif',
  'marrakech_gueliz', 'marrakech_hivernage', 'marrakech_medina',
  'rabat_agdal', 'rabat_hassan', 'rabat_souissi',
  'agadir_marina', 'agadir_centre',
  'fes_ville_nouvelle', 'tanger_ville'
];
