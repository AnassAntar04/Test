import { RoutingMatrix } from "@/types/routing";

export const getPermissionIcon = (permissionType: string): string => {
  switch (permissionType) {
    case 'direct_treatment': return '✅';
    case 'entry_point': return '📨';
    case 'escalation': return '🔔';
    case 'read_only': return '📊';
    case 'no_access': return '❌';
    default: return '❌';
  }
};

export const getPermissionForRole = (routingMatrix: RoutingMatrix[], requestTypeId: string, role: string): RoutingMatrix['permission_type'] => {
  const permission = routingMatrix.find(
    item => item.request_type_id === requestTypeId && item.role === role
  );
  return permission?.permission_type || 'no_access';
};