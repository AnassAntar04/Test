import { useState, useEffect } from "react";
import { mockProfiles } from "@/mocks/users";
import { Profile, UserFormData } from "@/types/user-management";
import { useMockData } from "./useMockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useUserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { useMockData: shouldUseMock } = useMockData();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);

      try {
        // Ici on intégrerait la vraie API Supabase
        const { data } = await supabase
          .from("profiles")
          .select("* , roles(*)")
          .order("created_at", { ascending: false });
        setProfiles(data || []);
        // setProfiles(mockProfiles); // Fallback temporaire
      } catch (error) {
        // Simuler un délai de chargement
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProfiles(mockProfiles);
      }

      setLoading(false);
    };

    loadProfiles(); // Realtime subscription
    const channel = supabase
      .channel("profiles-updates")
      .on(
        "postgres_changes",
        {
          event: "*", // 'INSERT' | 'UPDATE' | 'DELETE' | '*'
          schema: "public",
          table: "profiles"
        },
        (payload) => {
          console.log("🔄 Change detected:", payload);

          // Auto-refresh data
          loadProfiles();
        }
      )
      .subscribe();

    // Cleanup on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [shouldUseMock]);

  const createUser = async (userData: UserFormData) => {
    if (shouldUseMock) {
      // Simuler la création d'utilisateur
      const newProfile: Profile = {
        id: `profile-${Date.now()}`,
        user_id: `user-${Date.now()}`,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        profile_type: userData.profile_type,
        geographical_zones: userData.geographical_zones,
        is_active: userData.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const insertProfile = {
        // auth_user_id: newProfile.user_id,
        org_id: "0550e728-1feb-4e25-9697-cee242003a81",
        auth_user_id: "0550e728-1feb-4e25-9697-cee242003a82",
        email: newProfile.email,
        first_name: newProfile.first_name,
        last_name: newProfile.last_name,
        phone: newProfile.phone,
        hashed_pw: "test",
        role_id: "c581f8a1-3f24-47f1-bd62-aacfcf1ba0fc",
        // profile_type: newProfile.profile_type,
        locale: newProfile.geographical_zones,
        geographical_zones: newProfile.geographical_zones,
        is_active: newProfile.is_active,
        created_at: newProfile.created_at,
        updated_at: newProfile.updated_at
      };

      const { user, session, error } = await supabase.auth.signUp({
        email: newProfile.email,
        password: "admin123456"
      });

      // const { data, error } = await supabase
      //   .from("profiles")
      //   .insert(insertProfile)
      //   .select();

      // console.log("Creating user:", data);
      console.log("Error:", error);
      console.log("Creating user:", user, session);

      setProfiles((prev) => [...prev, newProfile]);
      toast({
        title: "Utilisateur créé",
        description: `${userData.first_name} ${userData.last_name} a été ajouté avec succès.`
      });
    } else {
      // Intégration Supabase réelle
      toast({
        title: "Fonctionnalité non disponible",
        description: "L'intégration Supabase n'est pas encore configurée."
      });
    }
  };

  const updateUser = async (userId: string, userData: UserFormData) => {
    if (shouldUseMock) {
      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === userId
            ? { ...profile, ...userData, updated_at: new Date().toISOString() }
            : profile
        )
      );
      toast({
        title: "Utilisateur modifié",
        description: "Les informations ont été mises à jour avec succès."
      });
    } else {
      toast({
        title: "Fonctionnalité non disponible",
        description: "L'intégration Supabase n'est pas encore configurée."
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (shouldUseMock) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ is_active: !currentStatus })
        .eq("user_id", userId);

      toast({
        title: "Statut modifié",
        description: `L'utilisateur a été ${
          !currentStatus ? "activé" : "désactivé"
        }.`
      });
    } else {
      toast({
        title: "Fonctionnalité non disponible",
        description: "L'intégration Supabase n'est pas encore configurée."
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (shouldUseMock) {
      // setProfiles((prev) => prev.filter((profile) => profile.id !== userId));
      const { data, error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé définitivement."
      });
    } else {
      toast({
        title: "Fonctionnalité non disponible",
        description: "L'intégration Supabase n'est pas encore configurée."
      });
    }
  };

  return {
    profiles,
    loading,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser
  };
};
