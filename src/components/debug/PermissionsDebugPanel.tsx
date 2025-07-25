import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { RefreshCw, User, Shield, Key } from "lucide-react";

export const PermissionsDebugPanel = () => {
  const { user, userRole } = useAuth();
  const { permissions, loading, error, refetch } = usePermissions();

  if (!user) {
    return (
      <Card className="border-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Shield className="h-5 w-5" />
            Debug Permissions - Non connecté
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucun utilisateur connecté</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Debug Permissions
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="ml-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations utilisateur */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">Utilisateur</span>
          </div>
          <div className="ml-6 space-y-1 text-sm">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rôle détecté:</strong> 
              {userRole ? (
                <Badge variant="default" className="ml-2">{userRole}</Badge>
              ) : (
                <Badge variant="destructive" className="ml-2">Aucun rôle</Badge>
              )}
            </p>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="font-medium">Permissions ({permissions.length})</span>
          </div>
          
          {loading && (
            <div className="ml-6">
              <Badge variant="outline">Chargement...</Badge>
            </div>
          )}
          
          {error && (
            <div className="ml-6">
              <Badge variant="destructive">{error}</Badge>
            </div>
          )}
          
          {!loading && !error && (
            <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {permissions.length > 0 ? (
                permissions.map((permission) => (
                  <Badge key={permission} variant="secondary" className="text-xs">
                    {permission}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Aucune permission trouvée
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Tests de permissions critiques */}
        <div className="space-y-2">
          <span className="font-medium">Tests de permissions critiques:</span>
          <div className="ml-6 space-y-1 text-sm">
            {[
              'users.manage',
              'settings.manage', 
              'dashboard.view',
              'chat.view',
              'analytics.view',
              'settings.view'
            ].map((permission) => {
              const hasPermission = userRole === 'super_admin' || permissions.includes(permission);
              return (
                <div key={permission} className="flex items-center justify-between">
                  <span>{permission}</span>
                  <Badge variant={hasPermission ? "default" : "destructive"}>
                    {hasPermission ? "✓" : "✗"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statut Super Admin */}
        <div className="space-y-2">
          <span className="font-medium">Statut Super Admin:</span>
          <div className="ml-6">
            <Badge variant={userRole === 'super_admin' ? "default" : "outline"}>
              {userRole === 'super_admin' ? "✓ Super Admin actif" : "✗ Pas Super Admin"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};