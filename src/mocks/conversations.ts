
import { generateRandomId, generateRandomDate, randomChoice, randomInt, mockNames, mockProperties, mockMessages as commonMockMessages } from './common';

export interface MockAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageUrl: string;
}

export interface MockMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  senderName: string;
  isInternal?: boolean;
  attachments?: MockAttachment[];
}

export interface MockConversation {
  id: string;
  guestName: string;
  property: string;
  channel: 'whatsapp' | 'email' | 'beds24';
  status: 'new' | 'active' | 'waiting' | 'resolved';
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  assignedAgent?: string;
  hasChildren?: boolean;
  isRecurrent?: boolean;
}

const generateMockMessage = (conversationId: string, index: number): MockMessage => {
  const senders = [
    { type: 'user' as const, name: `${randomChoice(mockNames.first)} ${randomChoice(mockNames.last)}` },
    { type: 'agent' as const, name: 'Youssef Bennani' },
    { type: 'bot' as const, name: 'Assistant SynergyAI' }
  ];
  
  const sender = randomChoice(senders);
  
  return {
    id: `${conversationId}-msg-${index}`,
    content: randomChoice(commonMockMessages),
    sender: sender.type,
    timestamp: generateRandomDate(0, 5),
    status: randomChoice(['sent', 'delivered', 'read'] as const),
    senderName: sender.name,
    isInternal: sender.type === 'agent' && Math.random() > 0.8,
    attachments: Math.random() > 0.9 ? [{ id: 'att1', fileName: 'image.jpg', fileType: 'image/jpeg', fileSize: 1024, storageUrl: '/mock-image.jpg' }] : undefined
  };
};

const generateMockConversation = (index: number): MockConversation => {
  const channels: ('whatsapp' | 'email' | 'beds24')[] = ['whatsapp', 'email', 'beds24'];
  const statuses: ('new' | 'active' | 'waiting' | 'resolved')[] = ['new', 'active', 'waiting', 'resolved'];
  const priorities: ('low' | 'medium' | 'high' | 'urgent')[] = ['low', 'medium', 'high', 'urgent'];
  const tags = ['urgent', 'wifi', 'accès', 'climatisation', 'transport', 'excursion', 'médina', 'hammam'];
  
  return {
    id: `conv-${index}`,
    guestName: `${randomChoice(mockNames.first)} ${randomChoice(mockNames.last)}`,
    property: randomChoice(mockProperties),
    channel: randomChoice(channels),
    status: randomChoice(statuses),
    lastMessage: randomChoice(commonMockMessages),
    timestamp: generateRandomDate(0, 10),
    unreadCount: randomInt(0, 5),
    priority: randomChoice(priorities),
    tags: Math.random() > 0.5 ? [randomChoice(tags), randomChoice(tags)] : [],
    assignedAgent: Math.random() > 0.3 ? 'Youssef Bennani' : undefined,
    hasChildren: Math.random() > 0.8,
    isRecurrent: Math.random() > 0.7
  };
};

// Générer les données mock
export const mockConversations: MockConversation[] = Array.from({ length: 25 }, (_, i) => generateMockConversation(i));

export const mockConversationMessages: MockMessage[] = Array.from({ length: 50 }, (_, i) => 
  generateMockMessage(`conv-${Math.floor(i / 2)}`, i)
);

// Messages pour une conversation spécifique (utilisé dans ChatLayout)
export const getMockMessagesForConversation = (conversationId: string): MockMessage[] => {
  return [
    {
      id: `${conversationId}-1`,
      content: 'Hello! I will arrive at your apartment soon. Can you give me the access codes?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
      senderName: 'James Smith'
    },
    {
      id: `${conversationId}-2`,
      content: 'Bonjour James ! Bienvenue chez Samy Conciergerie. Je vais vous transmettre toutes les informations d\'accès.',
      sender: 'bot',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
      senderName: 'Assistant SynergyAI'
    },
    {
      id: `${conversationId}-3`,
      content: 'Code porte d\'entrée: 1234A - Code appartement: 5678B. L\'appartement se situe au 3ème étage, porte droite.',
      sender: 'agent',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read',
      senderName: 'Youssef Bennani'
    },
    {
      id: `${conversationId}-4`,
      content: 'Perfect, thank you! One last question: what is the WiFi password?',
      sender: 'user',
      timestamp: new Date(Date.now() - 300000),
      status: 'read',
      senderName: 'James Smith'
    }
  ];
};
