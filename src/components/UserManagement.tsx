import { useState } from "react";
import { Users } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserForm } from "@/components/user-management/UserForm";
import { UserTable } from "@/components/user-management/UserTable";
import { UserFilters } from "@/components/user-management/UserFilters";
import { Profile, UserFormData, UserProfileType, GeographicalZoneType } from "@/types/user-management";

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
    profile_type: "agent",
    geographical_zones: ["paris_centre"],
    is_active: true
  });
  
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
      profile_type: "agent",
      geographical_zones: ["paris_centre"],
      is_active: true
    });
  };

  const handleFormSubmit = async (formData: UserFormData, isEdit: boolean, userId?: string) => {
    if (isEdit && userId) {
      await updateUser(userId, formData);
    } else {
      await createUser(formData);
    }
    setEditingUser(null);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEditUser = (user: Profile) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      profile_type: user.profile_type,
      geographical_zones: user.geographical_zones,
      is_active: user.is_active
    });
    setIsDialogOpen(true);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfile = selectedProfile === "all" || profile.profile_type === selectedProfile;
    
    return matchesSearch && matchesProfile;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground">Gérez les profils et permissions des utilisateurs</p>
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
