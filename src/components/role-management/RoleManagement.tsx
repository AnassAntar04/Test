import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Shield, Plus, Trash2, Users } from "lucide-react";
import { ROLE_LABELS, ROLE_HIERARCHY } from "@/constants/roles";
import { AppRole } from "@/types/roles";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRoleManagement } from "@/hooks/useRoleManagement";

export const RoleManagement = () => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleKey, setNewRoleKey] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { userRoles, fetchUserRoles } = useRoleManagement();

  // Obtenir les rôles existants triés par hiérarchie
  const sortedRoles = Object.entries(ROLE_HIERARCHY)
    .sort(([, a], [, b]) => b - a)
    .map(([role, level]) => ({ role: role as AppRole, level }));

  const [Roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    const { data, error } = await supabase.from("roles").select("*");
    setRoles(data || []);
  };

  useEffect(()=>{
    fetchRoles();
  },[])

  console.log("RoleManagement: Rendering with userRoles:", ROLE_LABELS['administrateur']);

  // Compter les utilisateurs par rôle
  const getUserCountForRole = (role: AppRole) => {
    return userRoles.filter((ur) => ur.role === role && ur.is_active).length;
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim() || !newRoleKey.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // Note: En production, il faudrait modifier l'enum PostgreSQL
      // Pour l'instant, on simule la création en ajoutant à nos constantes locales
      toast({
        title: "Limitation technique",
        description:
          "La création de nouveaux rôles nécessite une modification de la base de données. Cette fonctionnalité sera bientôt disponible.",
        variant: "destructive"
      });

      setNewRoleName("");
      setNewRoleKey("");
    } catch (error) {
      console.error("Error creating role:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du rôle",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteRole = async (role: AppRole) => {
    const userCount = getUserCountForRole(role);

    if (userCount > 0) {
      toast({
        title: "Impossible de supprimer",
        description: `Ce rôle est encore assigné à ${userCount} utilisateur(s). Retirez d'abord le rôle de tous les utilisateurs.`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Note: Supprimer un rôle d'un enum PostgreSQL est complexe
      toast({
        title: "Limitation technique",
        description:
          "La suppression de rôles nécessite une modification de la base de données. Cette fonctionnalité sera bientôt disponible.",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du rôle",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Créer un nouveau rôle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Créer un nouveau rôle
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ajoutez un nouveau rôle au système avec des privilèges personnalisés
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Nom du rôle (affiché)</Label>
              <Input
                id="role-name"
                placeholder="ex: Responsable Marketing"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-key">Clé technique (unique)</Label>
              <Input
                id="role-key"
                placeholder="ex: responsable_marketing"
                value={newRoleKey}
                onChange={(e) =>
                  setNewRoleKey(
                    e.target.value.toLowerCase().replace(/\s+/g, "_")
                  )
                }
              />
            </div>
          </div>
          <Button
            onClick={handleCreateRole}
            disabled={isCreating || !newRoleName.trim() || !newRoleKey.trim()}
            className="w-full md:w-auto"
          >
            {isCreating ? "Création..." : "Créer le rôle"}
          </Button>
        </CardContent>
      </Card>

      {/* Liste des rôles existants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rôles existants ({Roles.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gérez les rôles existants dans le système
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Roles.map((role , level) => {
              const userCount = getUserCountForRole(role);
              const canDelete =
                userCount === 0 &&
                !["super_admin", "administrateur"].includes(role);

              return (
                <div
                  key={role}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ROLE_LABELS[role.name]}</span>
                        <Badge variant="outline" className="text-xs">
                          Niveau {level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {userCount} utilisateur(s)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {["super_admin", "administrateur"].includes(role) && (
                      <Badge variant="secondary" className="text-xs">
                        Système
                      </Badge>
                    )}

                    {canDelete ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmer la suppression
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer le rôle "
                              {ROLE_LABELS[role]}" ? Cette action est
                              irréversible et supprimera également tous les
                              privilèges associés.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRole(role)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="text-muted-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Information sur les limitations */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Shield className="h-5 w-5" />
            Note importante
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-800">
          <p className="text-sm">
            <strong>Limitation technique actuelle :</strong> La création et
            suppression dynamique de rôles nécessite des modifications de la
            structure de base de données (enum PostgreSQL). Cette fonctionnalité
            nécessite une migration de base de données pour être pleinement
            opérationnelle.
          </p>
          <p className="text-sm mt-2">
            <strong>Rôles protégés :</strong> Les rôles "Super Admin" et
            "Administrateur" ne peuvent pas être supprimés car ils sont
            essentiels au fonctionnement du système.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
