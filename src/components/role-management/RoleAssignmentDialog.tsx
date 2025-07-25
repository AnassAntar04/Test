import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Plus, X } from "lucide-react";
import { AppRole } from "@/types/roles";
import { ROLE_LABELS, ROLE_PERMISSIONS, getManageableRoles } from "@/constants/roles";
import { useRoleManagement } from "@/hooks/useRoleManagement";

interface RoleAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  currentRoles: AppRole[];
}

export const RoleAssignmentDialog = ({
  isOpen,
  onClose,
  userId,
  userName,
  currentRoles
}: RoleAssignmentDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  
  const { assignRole, removeRole, currentUserRole } = useRoleManagement();
  
  const manageableRoles = currentUserRole ? getManageableRoles(currentUserRole) : [];
  const availableRoles = manageableRoles.filter(role => !currentRoles.includes(role));

  const handleAssignRole = async () => {
    if (!selectedRole) return;

    const expiresAt = hasExpiration && expirationDate ? expirationDate : undefined;
    await assignRole(userId, selectedRole, expiresAt);
    
    setSelectedRole('');
    setHasExpiration(false);
    setExpirationDate('');
    onClose();
  };

  const handleRemoveRole = async (role: AppRole) => {
    await removeRole(userId, role);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des rôles - {userName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Roles */}
          <div>
            <Label className="text-base font-medium">Rôles actuels</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentRoles.length > 0 ? (
                currentRoles.map((role) => (
                  <Badge key={role} variant="secondary" className="flex items-center gap-2">
                    {ROLE_LABELS[role]}
                    {manageableRoles.includes(role) && (
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveRole(role)}
                      />
                    )}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">Aucun rôle assigné</span>
              )}
            </div>
          </div>

          {/* Assign New Role */}
          {availableRoles.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Assigner un nouveau rôle</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role-select">Rôle</Label>
                  <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={hasExpiration}
                    onCheckedChange={setHasExpiration}
                  />
                  <Label>Expiration</Label>
                </div>
              </div>

              {hasExpiration && (
                <div>
                  <Label htmlFor="expiration-date">Date d'expiration</Label>
                  <Input
                    id="expiration-date"
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              )}

              {/* Role Permissions Preview */}
              {selectedRole && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-sm font-medium">Permissions pour {ROLE_LABELS[selectedRole]}</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ROLE_PERMISSIONS[selectedRole].map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleAssignRole}
                  disabled={!selectedRole}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Assigner le rôle
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};