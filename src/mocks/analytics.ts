
import { randomInt, generateRandomDate } from './common';

export interface MockAnalyticsData {
  period: string;
  conversations: number;
  resolved: number;
  avgResponseTime: number;
  satisfaction: number;
}

export interface MockChannelAnalytics {
  channel: string;
  volume: number;
  resolutionRate: number;
  avgTime: number;
  satisfaction: number;
}

export interface MockAgentPerformance {
  agentName: string;
  conversations: number;
  resolutionRate: number;
  avgResponseTime: number;
  satisfaction: number;
}

export const mockAnalyticsData: MockAnalyticsData[] = Array.from({ length: 30 }, (_, i) => ({
  period: new Date(Date.now() - i * 86400000).toLocaleDateString('fr-FR'),
  conversations: randomInt(50, 200),
  resolved: randomInt(40, 180),
  avgResponseTime: randomInt(120, 600),
  satisfaction: randomInt(35, 50) / 10
}));

export const mockChannelAnalytics: MockChannelAnalytics[] = [
  {
    channel: 'WhatsApp',
    volume: 1250,
    resolutionRate: 85,
    avgTime: 180,
    satisfaction: 4.3
  },
  {
    channel: 'Email',
    volume: 890,
    resolutionRate: 92,
    avgTime: 340,
    satisfaction: 4.1
  },
  {
    channel: 'Beds24',
    volume: 1580,
    resolutionRate: 78,
    avgTime: 220,
    satisfaction: 4.5
  }
];

// Performances des agents marocains
export const mockAgentPerformance: MockAgentPerformance[] = [
  {
    agentName: 'Youssef Bennani',
    conversations: 156,
    resolutionRate: 89,
    avgResponseTime: 145,
    satisfaction: 4.6
  },
  {
    agentName: 'Fatima El-Fassi',
    conversations: 134,
    resolutionRate: 85,
    avgResponseTime: 167,
    satisfaction: 4.4
  },
  {
    agentName: 'Omar Benkirane',
    conversations: 98,
    resolutionRate: 94,
    avgResponseTime: 123,
    satisfaction: 4.7
  },
  {
    agentName: 'Aicha Al-Idrissi',
    conversations: 87,
    resolutionRate: 82,
    avgResponseTime: 189,
    satisfaction: 4.2
  }
];

export const mockTopIssues = [
  { issue: 'Codes d\'accès', count: 245, trend: '+12%' },
  { issue: 'Climatisation', count: 189, trend: '-8%' },
  { issue: 'Transport/Taxi', count: 167, trend: '+5%' },
  { issue: 'Recommandations locales', count: 134, trend: '+15%' },
  { issue: 'Check-in/Check-out', count: 123, trend: '+3%' }
];

export const mockSatisfactionTrend = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleDateString('fr-FR', { month: 'short' }),
  score: randomInt(38, 48) / 10,
  responses: randomInt(50, 150)
}));
