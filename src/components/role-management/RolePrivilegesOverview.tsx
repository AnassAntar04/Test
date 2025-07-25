import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { ROLE_LABELS, ROLE_HIERARCHY } from "@/constants/roles";
import { AppRole } from "@/types/roles";
import { useRolePrivileges } from "@/hooks/useRolePrivileges";

export const RolePrivilegesOverview = () => {
  const { rolePrivileges, loading } = useRolePrivileges();
  
  const sortedRoles = Object.entries(ROLE_HIERARCHY)
    .sort(([, a], [, b]) => b - a)
    .map(([role]) => role as AppRole);

  const getRolePrivileges = (role: AppRole) => {
    return rolePrivileges
      .filter(rp => rp.role === role)
      .map(rp => rp.permission);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privilèges par rôle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Chargement des privilèges...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privilèges par rôle
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Aperçu des privilèges actuellement assignés à chaque rôle
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedRoles.map((role) => {
          const privileges = getRolePrivileges(role);
          return (
            <div key={role} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {ROLE_LABELS[role]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Niveau {ROLE_HIERARCHY[role]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({privileges.length} privilège{privileges.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {privileges.length > 0 ? (
                  privileges.map((permission) => (
                    <Badge key={permission.id} variant="outline" className="text-xs">
                      {permission.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Aucun privilège assigné
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};