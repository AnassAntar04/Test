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
  UserProfileType
  // GeographicalZoneType
} from "@/types/user-management";
import { PROFILE_TYPES, GEOGRAPHICAL_ZONES } from "@/constants/user-management";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const userFormSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis." })
    .email({ message: "L'adresse email est invalide." }),
  first_name: z.string().min(1, { message: "Le prénom est requis." }),
  last_name: z.string().min(1, { message: "Le nom est requis." }),
  phone: z.string(),
  profile_type: z.string().refine((val) => val !== "Default", {
    message: "Veuillez sélectionner un profil."
  }),
  geographical_zones: z
    .array(z.string())
    .refine((val) => val.length > 0, {
      message: "Veuillez sélectionner au moins une zone géographique."
    })
    .or(z.string().min(1, { message: "La zone géographique est requise." })),
  is_active: z.boolean(),
  locale: z.string().min(1, { message: "Le local est requis." })
});

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
  const [errors, setErrors] = useState<
    z.ZodError["formErrors"]["fieldErrors"] | null
  >(null);
  const { user, userRole } = useAuth();
  // console.log("UserForm: User and Role", { user, userRole });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = userFormSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors(null);
    await onSubmit(result.data, !!editingUser, editingUser?.id);
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

  useEffect(() => {
    if (!isDialogOpen) {
      setErrors(null);
    }
  }, [isDialogOpen]);

  console.log("UserForm: Roles fetched", editingUser);

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
                disabled={!!editingUser}
              />
                {errors?.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email[0]}
                  </p>
                )}
            </div>
            <div>
              <Label htmlFor="profile_type">Profil</Label>
              <Select
                value={formData.profile_type}
                onValueChange={(value: string) =>
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
                  <SelectItem value="Default" disabled>
                    Sélectionner un profil
                  </SelectItem>
                  {
                  userRole.toLowerCase() === "Supervisor".toLowerCase() ?
                    Roles.filter(
                      (role) =>
                        ![ (editingUser && editingUser.roles?.name === "Supervisor") ? 
                          "Owner".toLowerCase() : 
                          "Supervisor".toLowerCase(),
                          "Owner".toLowerCase(),
                        ].includes(role.name.toLowerCase())
                    ).map((role: any) => (
                      <SelectItem key={role.role_id} value={role.role_id}>
                        {role.name}
                      </SelectItem>
                    ))
                    : Roles.map((role: any) => (
                      <SelectItem key={role.role_id} value={role.role_id}>
                        {role.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              {errors?.profile_type && (
                <p className="text-sm text-destructive mt-1">
                  {errors.profile_type[0]}
                </p>
              )}
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
              {errors?.first_name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.first_name[0]}
                </p>
              )}
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
              {errors?.last_name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.last_name[0]}
                </p>
              )}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="geographical_zones">Zone géographique</Label>
              <Input
                id="geographical_zones"
                value={formData.geographical_zones}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    geographical_zones: [e.target.value]
                  } as any)
                }
              />
              {errors?.geographical_zones && (
                <p className="text-sm text-destructive mt-1">
                  {errors.geographical_zones[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="locale">Local</Label>
              <Input
                id="locale"
                value={(formData as any).locale}
                onChange={(e) =>
                  setFormData({ ...formData, locale: e.target.value } as any)
                }
              />
              {errors?.locale && (
                <p className="text-sm text-destructive mt-1">
                  {errors.locale[0]}
                </p>
              )}
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

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from "@/components/ui/dialog";
// import { Switch } from "@/components/ui/switch";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Plus } from "lucide-react";
// import {
//   Profile,
//   UserFormData,
//   UserProfileType,
//   GeographicalZoneType
// } from "@/types/user-management";
// import { PROFILE_TYPES, GEOGRAPHICAL_ZONES } from "@/constants/user-management";
// import { supabase } from "@/integrations/supabase/client";

// interface UserFormProps {
//   editingUser: Profile | null;
//   onSubmit: (
//     formData: UserFormData,
//     isEdit: boolean,
//     userId?: string
//   ) => Promise<void>;
//   isDialogOpen: boolean;
//   setIsDialogOpen: (open: boolean) => void;
//   formData: UserFormData;
//   setFormData: (data: UserFormData) => void;
//   onNewUser?: () => void;
// }

// export const UserForm = ({
//   editingUser,
//   onSubmit,
//   isDialogOpen,
//   setIsDialogOpen,
//   formData,
//   setFormData,
//   onNewUser
// }: UserFormProps) => {
//   const [Roles, setRoles] = useState([]);
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await onSubmit(formData, !!editingUser, editingUser?.id);
//   };

//   const handleZoneChange = (zone: GeographicalZoneType, checked: boolean) => {
//     if (checked) {
//       setFormData({
//         ...formData,
//         geographical_zones: [...formData.geographical_zones, zone]
//       });
//     } else {
//       setFormData({
//         ...formData,
//         geographical_zones: formData.geographical_zones.filter(
//           (z) => z !== zone
//         )
//       });
//     }
//   };

//   const FetchRoles = async () => {

//     try {
//       const { data, error } = await supabase
//         .from("roles")
//         .select("role_id , name ");

//       if (error) throw error;
//       setRoles(data || []);

//     } catch (error) {
//       console.error("Error fetching roles:", error);
//     }
//   };

//   useEffect(() => {
//     FetchRoles();
//   }, []);

//   console.log("UserForm: Roles fetched", formData);
//   return (
//     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//       <DialogTrigger asChild>
//         <Button onClick={onNewUser}>
//           <Plus className="h-4 w-4 mr-2" />
//           Nouvel utilisateur
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>
//             {editingUser ? "Modifier" : "Créer"} un utilisateur
//           </DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//                 disabled={!!editingUser}
//               />
//             </div>
//             <div>
//               <Label htmlFor="profile_type">Profil</Label>
//               <Select
//                 value={formData.profile_type}
//                 onValueChange={(value: string) =>
//                   setFormData({ ...formData, profile_type: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {/* {Object.entries(PROFILE_TYPES).map(([key, label]) => (
//                     <SelectItem key={key} value={key}>
//                       {label}
//                     </SelectItem>
//                   ))} */}
//                   <SelectItem value="Default" disabled>
//                     Sélectionner un profil
//                   </SelectItem>
//                   {
//                     Roles.map((role: any) => (
//                       <SelectItem key={role.role_id} value={role.role_id}>
//                         {role.name}
//                       </SelectItem>
//                     ))
//                   }
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="first_name">Prénom</Label>
//               <Input
//                 id="first_name"
//                 value={formData.first_name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, first_name: e.target.value })
//                 }
//               />
//             </div>
//             <div>
//               <Label htmlFor="last_name">Nom</Label>
//               <Input
//                 id="last_name"
//                 value={formData.last_name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, last_name: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="phone">Téléphone</Label>
//             <Input
//               id="phone"
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <Label>Zones géographiques</Label>
//             <div className="grid grid-cols-2 gap-2 mt-2">
//               {Object.entries(GEOGRAPHICAL_ZONES).map(([key, label]) => (
//                 <div key={key} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={key}
//                     checked={formData.geographical_zones.includes(
//                       key as GeographicalZoneType
//                     )}
//                     onCheckedChange={(checked) =>
//                       handleZoneChange(key as GeographicalZoneType, !!checked)
//                     }
//                   />
//                   <Label htmlFor={key} className="text-sm">
//                     {label}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Switch
//               checked={formData.is_active}
//               onCheckedChange={(checked) =>
//                 setFormData({ ...formData, is_active: checked })
//               }
//             />
//             <Label>Utilisateur actif</Label>
//           </div>

//           <div className="flex justify-end space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsDialogOpen(false)}
//             >
//               Annuler
//             </Button>
//             <Button type="submit">{editingUser ? "Modifier" : "Créer"}</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };
