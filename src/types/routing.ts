export interface RequestType {
  id: string;
  name: string;
  description: string | null;
  color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface RoutingMatrix {
  id: string;
  request_type_id: string;
  role: string;
  permission_type: 'direct_treatment' | 'entry_point' | 'escalation' | 'read_only' | 'no_access';
  created_at: string;
  updated_at: string;
}

export interface EscalationRule {
  id: string;
  name: string;
  keywords: string[];
  from_role: string;
  to_role: string;
  condition: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}