// Core conversation workflow types

export type ConversationState = 
  | "NOUVELLE" 
  | "EN_COURS" 
  | "EN_ATTENTE" 
  | "TRANSFÉRÉE" 
  | "RÉSOLUE" 
  | "CLÔTURÉE" 
  | "ARCHIVÉE";

export type JourneyPhase = 
  | "PRE_RESERVATION"
  | "POST_RESERVATION"
  | "SEJOUR_COURS"
  | "PRE_CHECKOUT"
  | "POST_CHECKOUT";

export type ChannelType = "whatsapp" | "email" | "beds24" | "direct";
export type BookingSource = "booking" | "airbnb" | "expedia" | "ctrip" | "direct";
export type UserRole = "agent" | "comptabilite" | "femme_menage" | "technicien" | "superviseur" | "responsable_logistique" | "responsable_qualite";

export interface Conversation {
  id: string;
  state: ConversationState;
  phase: JourneyPhase;
  channel: ChannelType;
  bookingSource: BookingSource;
  travelerName: string;
  propertyName: string;
  arrivalDate: Date;
  departureDate: Date;
  lastMessage: string;
  lastActivity: Date;
  assignedAgent?: string;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  hasChildren: boolean;
  isRecurrent: boolean;
}

export interface EscalationRule {
  id: string;
  name: string;
  keywords: string[];
  fromRole: UserRole;
  toRole: UserRole;
  condition: "immediate" | "timeout" | "manual";
  timeoutMinutes?: number;
  priority: number;
}

export interface ChatbotConfig {
  id: string;
  name: string;
  type: "principal" | "secondaire" | "attribution_auto" | "attribution_manuel" | "interne";
  description: string;
  autoAssignCriteria?: AssignmentCriteria;
  allowedRoles: UserRole[];
  isActive: boolean;
}

export interface AssignmentCriteria {
  temporal?: {
    checkinToday?: boolean;
    checkoutToday?: boolean;
    currentStays?: boolean;
    futureStays?: boolean;
    pastStays?: boolean;
  };
  geographical?: {
    propertyIds: string[];
  };
  bookingSource?: BookingSource[];
  channels?: ChannelType[];
  profile?: {
    withChildren?: boolean;
    recurrent?: boolean;
  };
}

export interface AutoMessage {
  id: string;
  name: string;
  trigger: "booking_confirmed" | "day_before_checkin" | "day_before_checkout" | "post_checkout";
  template: string;
  scheduledTime?: string; // "13:00" format
  channels: ChannelType[];
  variables: Record<string, string>;
  isActive: boolean;
}

export const CONVERSATION_STATES: Record<ConversationState, { label: string; color: string; description: string }> = {
  NOUVELLE: { label: "Nouvelle", color: "primary", description: "Conversation entrante non traitée" },
  EN_COURS: { label: "En cours", color: "accent", description: "Conversation assignée à un agent/chatbot" },
  EN_ATTENTE: { label: "En attente", color: "warning", description: "En attente de réponse voyageur" },
  TRANSFÉRÉE: { label: "Transférée", color: "secondary", description: "Escaladée vers un spécialiste" },
  RÉSOLUE: { label: "Résolue", color: "success", description: "Terminée avec confirmation voyageur" },
  CLÔTURÉE: { label: "Clôturée", color: "muted", description: "Fermée définitivement" },
  ARCHIVÉE: { label: "Archivée", color: "muted", description: "Stockée après délai de rétention" }
};

export const JOURNEY_PHASES: Record<JourneyPhase, { label: string; color: string; description: string }> = {
  PRE_RESERVATION: { label: "Pré-réservation", color: "primary", description: "Profilage voyageur, choix appartement" },
  POST_RESERVATION: { label: "Post-réservation", color: "accent", description: "Préparation arrivée" },
  SEJOUR_COURS: { label: "Séjour en cours", color: "warning", description: "Support technique et services" },
  PRE_CHECKOUT: { label: "Pré-check-out", color: "secondary", description: "Organisation départ" },
  POST_CHECKOUT: { label: "Post-check-out", color: "success", description: "Satisfaction et fidélisation" }
};