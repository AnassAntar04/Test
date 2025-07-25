import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { ROLE_LABELS } from '@/constants/roles';

interface UnauthorizedAccessProps {
  title?: string;
  message?: string;
  requiredPermission?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
  showCurrentPermissions?: boolean;
}

export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  title = "Accès non autorisé",
  message = "Vous n'avez pas les privilèges nécessaires pour accéder à cette page.",
  requiredPermission,
  onGoBack,
  onGoHome,
  showCurrentPermissions = true
}) => {
  const { userRole } = useAuth();
  const { permissions } = usePermissions();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dashboard">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Privilèges insuffisants</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          {requiredPermission && (
            <div className="text-sm text-muted-foreground">
              <p><strong>Privilège requis:</strong> {requiredPermission}</p>
            </div>
          )}

          {showCurrentPermissions && userRole && (
            <div className="space-y-2">
              <div className="text-sm">
                <p><strong>Votre rôle:</strong> {ROLE_LABELS[userRole]}</p>
              </div>
              
              {permissions.length > 0 && (
                <div className="text-sm">
                  <p><strong>Vos privilèges actuels:</strong></p>
                  <div className="bg-muted p-2 rounded mt-1 max-h-32 overflow-y-auto">
                    <ul className="text-xs space-y-1">
                      {permissions.map((permission) => (
                        <li key={permission} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-primary rounded-full"></span>
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {onGoBack && (
              <Button variant="outline" onClick={onGoBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            {onGoHome && (
              <Button onClick={onGoHome} className="flex-1">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};