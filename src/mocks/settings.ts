
export interface MockIntegrationConfig {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastSync: Date;
  description: string;
  config?: Record<string, any>;
}

export interface MockChatbotConfig {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  description: string;
  settings: Record<string, any>;
}

export interface MockEscalationRule {
  id: string;
  name: string;
  fromRole: string;
  toRole: string;
  condition: string;
  isActive: boolean;
  priority: number;
}

export const mockIntegrations: MockIntegrationConfig[] = [
  {
    id: 'beds24',
    name: 'Beds24',
    status: 'active',
    lastSync: new Date(Date.now() - 300000),
    description: 'Système de gestion des réservations',
    config: { apiKey: '***', propertyId: '12345' }
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    status: 'active',
    lastSync: new Date(Date.now() - 600000),
    description: 'Messagerie WhatsApp pour clients'
  },
  {
    id: 'email',
    name: 'Email SMTP',
    status: 'error',
    lastSync: new Date(Date.now() - 3600000),
    description: 'Service email pour notifications'
  },
  {
    id: 'n8n',
    name: 'n8n Automation',
    status: 'inactive',
    lastSync: new Date(Date.now() - 86400000),
    description: 'Plateforme d\'automatisation'
  }
];

export const mockChatbots: MockChatbotConfig[] = [
  {
    id: 'main-bot',
    name: 'Assistant Principal',
    type: 'openai',
    isActive: true,
    description: 'Chatbot principal pour les requêtes générales',
    settings: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000
    }
  },
  {
    id: 'booking-bot',
    name: 'Assistant Réservations',
    type: 'specialized',
    isActive: true,
    description: 'Spécialisé dans les questions de réservation',
    settings: {
      specialization: 'booking',
      autoEscalate: true
    }
  },
  {
    id: 'technical-bot',
    name: 'Support Technique',
    type: 'rule-based',
    isActive: false,
    description: 'Assistance pour les problèmes techniques',
    settings: {
      knowledgeBase: 'technical-kb'
    }
  }
];

export const mockEscalationRules: MockEscalationRule[] = [
  {
    id: 'urgent-to-supervisor',
    name: 'Urgent vers Superviseur',
    fromRole: 'agent',
    toRole: 'superviseur',
    condition: 'priority = urgent',
    isActive: true,
    priority: 1
  },
  {
    id: 'timeout-escalation',
    name: 'Escalade par timeout',
    fromRole: 'bot',
    toRole: 'agent',
    condition: 'timeout > 30min',
    isActive: true,
    priority: 2
  },
  {
    id: 'technical-to-specialist',
    name: 'Technique vers Spécialiste',
    fromRole: 'agent',
    toRole: 'technicien',
    condition: 'category = technique',
    isActive: true,
    priority: 3
  }
];

export const mockNotificationSettings = [
  { type: 'new_message', enabled: true, methods: ['push', 'email'] },
  { type: 'escalation', enabled: true, methods: ['push', 'sms'] },
  { type: 'timeout', enabled: true, methods: ['push'] },
  { type: 'error', enabled: false, methods: ['email'] }
];
