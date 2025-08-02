import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole, AppRole } from "@/types/roles";

export const useRoleManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>(null);
  const { toast } = useToast();


  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('* , roles(role_id , name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
      // console.log("Fetched user roles:", data);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rôles",
        variant: "destructive"
      });
    }
  };
  

  const getCurrentUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('role_id , roles(name)')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCurrentUserRole(data?.roles?.name || null);
    } catch (error) {
      console.error('Error fetching current user role:', error);
    }
  };

  const assignRole = async (userId: string, role: AppRole, expiresAt?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use the new database function to properly handle role assignment
      const { error } = await supabase.rpc('assign_user_role', {
        _user_id: userId,
        _role: role,
        _assigned_by: user.id,
        _expires_at: expiresAt || null  
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Rôle ${role} assigné avec succès`
      });

      await fetchUserRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'attribution du rôle",
        variant: "destructive"
      });
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Rôle ${role} retiré avec succès`
      });

      await fetchUserRoles();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du retrait du rôle",
        variant: "destructive"
      });
    }
  };

  const getUserRoles = (userId: string): AppRole[] => {
    // console.log('Fetching user roles for user:', userId);
    return userRoles
      .filter(ur => ur.user_id === userId && ur.is_active)
      .map(ur => ur.roles?.name);
  };

  const canManageUser = (targetUserId: string): boolean => {
    if (!currentUserRole) return false;
    
    const targetRoles = getUserRoles(targetUserId);
    const currentRoleLevel = getRoleLevel(currentUserRole);
    
    // Admins can manage everyone
    if (currentUserRole === 'administrateur' || currentUserRole === 'super_admin' || currentUserRole === 'Owner') {
      return true;
    }
    
    // Supervisors can manage users with lower-level roles only
    if (currentUserRole === 'superviseur' || currentUserRole === 'Supervisor') {
      return targetRoles.every(role => getRoleLevel(role) < currentRoleLevel);
    }
    
    return false;
  };

  const getRoleLevel = (role: string): number => {
    const levels = {
      super_admin: 9,
      Owner: 9,
      administrateur: 8,
      superviseur: 7,
      Supervisor: 7,
      responsable_logistique: 6,
      responsable_qualite: 5,
      technicien: 4,
      Technician: 4,
      agent: 3,
      'Supper Agent': 3,
      comptabilite: 2,
      femme_de_menage: 1,
      Janitor: 1
    };
    return levels[role] || 0;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserRoles(), getCurrentUserRole()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    userRoles,
    currentUserRole,
    loading,
    assignRole,
    removeRole,
    getUserRoles,
    canManageUser,
    fetchUserRoles
  };
};