import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Settings } from "lucide-react";
import { ROLE_LABELS, ROLE_HIERARCHY } from "@/constants/roles";
import { AppRole } from "@/types/roles";
import { useRolePrivileges } from "@/hooks/useRolePrivileges";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const RolePrivilegesManagement = () => {
  const {
    permissions,
    loading,
    toggleRolePrivilege,
    hasRolePrivilege,
    getPermissionsByCategory
  } = useRolePrivileges();

  const [sortedRoles, setSortedRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from("roles")
        .select("role_id, name");

      setSortedRoles(data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const permissionsByCategory = getPermissionsByCategory();

  console.log("Permissions by category:", permissionsByCategory);
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gestion des Privilèges par Rôle
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
          <Settings className="h-5 w-5" />
          Gestion des Privilèges par Rôle
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configurez les privilèges accordés à chaque rôle dans le système
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(permissionsByCategory).map(
          ([category, categoryPermissions]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-semibold capitalize">{category}</h3>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 p-3">
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-2">
                    <div className="font-medium text-sm">Privilège</div>
                    {sortedRoles.map((role) => (
                      <div key={role.role_id} className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {role.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="divide-y">
                  {categoryPermissions.map((permission) => (
                    <div key={permission.perm_id} className="p-3">
                      <div className="grid grid-cols-1 md:grid-cols-10 gap-2 items-center">
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {permission.name}
                          </div>
                          {permission.description && (
                            <div className="text-xs text-muted-foreground">
                              {permission.description}
                            </div>
                          )}
                        </div>

                        {sortedRoles.map((role) => (
                          <div key={role} className="flex justify-center">
                            <Switch
                              checked={hasRolePrivilege(role.role_id, permission.perm_id)}
                              onCheckedChange={(checked) =>
                                toggleRolePrivilege(
                                  role.role_id,
                                  permission.perm_id,
                                  !checked
                                )
                              }
                              disabled={role.name === "Owner"} // Super admin has all privileges
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {Object.keys(permissionsByCategory).indexOf(category) <
                Object.keys(permissionsByCategory).length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          )
        )}

        {permissions.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              Aucun privilège configuré
            </p>
            <p className="text-sm">
              Les privilèges doivent d'abord être créés dans la base de données.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
