import { useState } from "react";
import { Users } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserForm } from "@/components/user-management/UserForm";
import { UserTable } from "@/components/user-management/UserTable";
import { UserFilters } from "@/components/user-management/UserFilters";
import axios from "axios";
import {
  Profile,
  UserFormData,
  UserProfileType,
  GeographicalZoneType
} from "@/types/user-management";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    profile_type: "Default",
    geographical_zones: "",
    is_active: true,
    locale: ""
  } as UserFormData);

  const {
    profiles,
    loading,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser
  } = useUserManagement();

  const resetForm = () => {
    setFormData({
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      profile_type: "Default",
      geographical_zones: "",
      is_active: true,
      locale: ""
    } as UserFormData);
  };

  const handleFormSubmit = async (
    formData: UserFormData,
    isEdit: boolean,
    userId?: string
  ) => {
    const submittedData = formData as any;

    try {
      const { data: OrganisationInfo, error: ErrorOrganisationInfo } =
        await supabase.from("organisation").select("*").single();

        // console.log('Submitted Data:', submittedData);
      if (OrganisationInfo.org_id) {
        // const { data, error } = await supabase.auth.signUp({
        //   email: formData.email,
        //   password: ""
        // });

        const { data: existingUser, error: existingUserError } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", formData.email)
          .single();

        if (!existingUser) {
          const res = await axios.post(
            "https://supabase.iits.ma/functions/v1/create-user",
            {
              email: submittedData.email,
              password: OrganisationInfo.name
            },
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );

          const { data: User, error: ErrorUser } = await supabase
            .from("profiles")
            .insert({
              org_id: OrganisationInfo.org_id,
              auth_user_id: res.data?.user?.id,
              email: submittedData.email,
              first_name: submittedData.first_name,
              last_name: submittedData.last_name,
              phone: submittedData.phone,
              role_id: submittedData.profile_type,
              geographical_zones: [submittedData.geographical_zones] as GeographicalZoneType[],
              locale: submittedData.locale,
              is_active: submittedData.is_active,
              hashed_pw: "test"
            });
        }
        else {
          const { data: User, error: ErrorUser } = await supabase
          .from("profiles")
          .update({
            email: submittedData.email,
            first_name: submittedData.first_name,
            last_name: submittedData.last_name,
            phone: submittedData.phone,
            role_id: submittedData.profile_type,
            geographical_zones: [submittedData.geographical_zones] as GeographicalZoneType[],
            locale: submittedData.locale,
            is_active: submittedData.is_active,
            hashed_pw: "test"
          })
          .eq("user_id", existingUser.user_id);

          console.log('Error User:', ErrorUser);
        }
      }
    } catch (error) {
      console.error("Error fetching organisation info:", error);
      if (error.response?.data) {
        toast({
          title: "Erreur technique",
          description:
            error.response.data?.error ||
            "Une erreur est survenue lors de la création de l'utilisateur.",
          variant: "destructive"
        });
      }
    }

    // console.log("Form submitted:", formData);
    setEditingUser(null);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditUser = (user: Profile) => {
    // console.log("Editing user:", user);
    setEditingUser(user);
    setFormData({
      id: user.user_id,
      email: user.email,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      profile_type: user.profile_type || user.role_id || "Default",
      geographical_zones: user.geographical_zones[0] || "",
      is_active: user.is_active,
      locale: user.locale || ""
    });
    // console.log("Form data:", formData);
    setIsDialogOpen(true);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${profile.first_name} ${profile.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesProfile =
      selectedProfile === "all" || profile.role_id === selectedProfile;

    return matchesSearch && matchesProfile;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // console.log("Submitted Form Data:", formData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground">
              Gérez les profils et permissions des utilisateurs
            </p>
          </div>
        </div>
        <UserForm
          editingUser={editingUser}
          onSubmit={handleFormSubmit}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onNewUser={handleNewUser}
        />
      </div>

      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
      />

      <UserTable
        profiles={filteredProfiles}
        onEditUser={handleEditUser}
        onToggleStatus={toggleUserStatus}
        onDeleteUser={deleteUser}
      />
    </div>
  );
};
