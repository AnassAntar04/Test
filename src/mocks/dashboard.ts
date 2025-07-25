
import { generateRandomDate, randomInt } from './common';

export interface MockDashboardStats {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export interface MockChannelDistribution {
  channel: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MockTeamMember {
  name: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  avatar: string;
}

export const mockDashboardStats: MockDashboardStats[] = [
  {
    title: "Conversations Aujourd'hui",
    value: "147",
    change: "+12%",
    trend: "up",
    color: "primary"
  },
  {
    title: "Taux Résolution IA",
    value: "78%",
    change: "+5%",
    trend: "up",
    color: "accent"
  },
  {
    title: "Satisfaction Client",
    value: "4.6/5",
    change: "+0.2",
    trend: "up",
    color: "warning"
  },
  {
    title: "Temps Réponse Moyen",
    value: "2.3 min",
    change: "-15%",
    trend: "down",
    color: "secondary"
  }
];

export const mockChannelDistribution: MockChannelDistribution[] = [
  { channel: 'Beds24 (OTAs)', count: 68, percentage: 46, color: 'primary' },
  { channel: 'WhatsApp', count: 52, percentage: 35, color: 'accent' },
  { channel: 'Email', count: 27, percentage: 19, color: 'warning' }
];

// Équipe marocaine avec des noms locaux
export const mockTeamMembers: MockTeamMember[] = [
  { name: 'Youssef Bennani', role: 'Téléconseiller', status: 'online', avatar: 'Y' },
  { name: 'Fatima El-Fassi', role: 'Superviseure', status: 'busy', avatar: 'F' },
  { name: 'Omar Benkirane', role: 'Agent', status: 'online', avatar: 'O' },
  { name: 'Aicha Al-Idrissi', role: 'Technicienne', status: 'offline', avatar: 'A' }
];

export const mockHourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  conversations: randomInt(5, 25),
  resolved: randomInt(3, 20),
  escalated: randomInt(0, 5)
}));

export const mockWeeklyData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
  conversations: randomInt(80, 200),
  satisfaction: randomInt(80, 95) / 10
}));
