import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, MapPin, Shield, UserCog, Trash2, X } from "lucide-react";
import { Profile } from "@/types/user-management";
import {
  PROFILE_TYPES,
  GEOGRAPHICAL_ZONES,
  getPermissionsByProfile
} from "@/constants/user-management";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { RoleAssignmentDialog } from "@/components/role-management/RoleAssignmentDialog";
import { ROLE_LABELS } from "@/constants/roles";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface UserTableProps {
  profiles: Profile[];
  onEditUser: (user: Profile) => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserTable = ({
  profiles,
  onEditUser,
  onToggleStatus,
  onDeleteUser
}: UserTableProps) => {
  console.log("UserTable: Rendering with profiles:", profiles);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const { getUserRoles, canManageUser, removeRole } = useRoleManagement();

  console.log("Profiles in UserTable:", profiles);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs ({profiles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Profil</TableHead>
              <TableHead>Zones</TableHead>
              <TableHead>Rôles</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {profile.first_name} {profile.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {profile.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{profile.roles?.name}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {/* {profile.geographical_zones.map((zone) => ( */}
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {profile.locale}
                    </Badge>
                    {/* ))} */}
                  </div>
                </TableCell>
                <TableCell>
                  {/* <div className="flex flex-wrap gap-1">
                    {(() => {
                      const userRoles = getUserRoles(profile.user_id);
                      const displayRoles = userRoles.slice(0, 2);
                      return (
                        <>
                          {displayRoles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {ROLE_LABELS[role]}
                              {canManageUser(profile.user_id) && (
                                <X 
                                  className="h-3 w-3 cursor-pointer hover:text-destructive ml-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeRole(profile.user_id, role);
                                  }}
                                />
                              )}
                            </Badge>
                          ))}
                          {userRoles.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{userRoles.length - 2}
                            </Badge>
                          )}
                          {userRoles.length === 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              {PROFILE_TYPES[profile.profile_type as keyof typeof PROFILE_TYPES]}
                            </Badge>
                          )}
                        </>
                      );
                    })()}
                  </div> */}
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.roles?.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={profile.is_active}
                    onCheckedChange={() =>
                      onToggleStatus(profile.user_id, profile.is_active)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditUser(profile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modifier l'utilisateur</p>
                        </TooltipContent>
                      </Tooltip>
                      {canManageUser(profile.user_id) && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(profile);
                                  setRoleDialogOpen(true);
                                }}
                              >
                                <UserCog className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Gérer les rôles</p>
                            </TooltipContent>
                          </Tooltip>
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Supprimer l'utilisateur</p>
                              </TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Supprimer l'utilisateur
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer{" "}
                                  {profile.first_name} {profile.last_name} ?
                                  Cette action est irréversible et supprimera
                                  définitivement l'utilisateur et tous ses
                                  rôles.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeleteUser(profile.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {selectedUser && (
        <RoleAssignmentDialog
          isOpen={roleDialogOpen}
          onClose={() => {
            setRoleDialogOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.user_id}
          userName={
            `${selectedUser.first_name || ""} ${
              selectedUser.last_name || ""
            }`.trim() || selectedUser.email
          }
          currentRoles={getUserRoles(selectedUser.user_id)}
        />
      )}
    </Card>
  );
};
