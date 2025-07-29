import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import {
  Profile,
  UserFormData,
  UserProfileType,
  GeographicalZoneType
} from "@/types/user-management";
import { PROFILE_TYPES, GEOGRAPHICAL_ZONES } from "@/constants/user-management";
import { supabase } from "@/integrations/supabase/client";

interface UserFormProps {
  editingUser: Profile | null;
  onSubmit: (
    formData: UserFormData,
    isEdit: boolean,
    userId?: string
  ) => Promise<void>;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  onNewUser?: () => void;
}

export const UserForm = ({
  editingUser,
  onSubmit,
  isDialogOpen,
  setIsDialogOpen,
  formData,
  setFormData,
  onNewUser
}: UserFormProps) => {
  const [Roles, setRoles] = useState([]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData, !!editingUser, editingUser?.id);
  };

  const handleZoneChange = (zone: GeographicalZoneType, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        geographical_zones: [...formData.geographical_zones, zone]
      });
    } else {
      setFormData({
        ...formData,
        geographical_zones: formData.geographical_zones.filter(
          (z) => z !== zone
        )
      });
    }
  };

  const FetchRoles = async () => {

    try {
      const { data, error } = await supabase
        .from("roles")
        .select("role_id , name ");


      if (error) throw error;
      setRoles(data || []);


    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    FetchRoles();
  }, []);

  // console.log("UserForm: Roles fetched", formData);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={onNewUser}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Modifier" : "Créer"} un utilisateur
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={!!editingUser}
              />
            </div>
            <div>
              <Label htmlFor="profile_type">Profil</Label>
              <Select
                value={formData.profile_type}
                onValueChange={(value: UserProfileType) =>
                  setFormData({ ...formData, profile_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* {Object.entries(PROFILE_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))} */}
                  {
                    Roles.map((role: any) => (
                      <SelectItem key={role.role_id} value={role.role_id}>
                        {role.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Zones géographiques</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(GEOGRAPHICAL_ZONES).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData.geographical_zones.includes(
                      key as GeographicalZoneType
                    )}
                    onCheckedChange={(checked) =>
                      handleZoneChange(key as GeographicalZoneType, !!checked)
                    }
                  />
                  <Label htmlFor={key} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label>Utilisateur actif</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit">{editingUser ? "Modifier" : "Créer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
