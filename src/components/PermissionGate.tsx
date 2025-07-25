import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  showMessage = false
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return showMessage ? (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Shield className="h-4 w-4 animate-pulse" />
        <span>Vérification des privilèges...</span>
      </div>
    ) : null;
  }


  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showMessage) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous n'avez pas les privilèges nécessaires pour accéder à cette fonctionnalité.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  return <>{children}</>;
};