import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppRole } from "@/types/roles";
import { Permission } from "@/types/user-management";

interface RolePrivilege {
  role: AppRole;
  permission_id: string;
  permission: Permission;
}

export const useRolePrivileges = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePrivileges, setRolePrivileges] = useState<RolePrivilege[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les privilèges",
        variant: "destructive"
      });
    }
  };

  const fetchRolePrivileges = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          role,
          permission_id,
          permissions:permission_id (
            id,
            name,
            description,
            category
          )
        `);

      if (error) throw error;
      
      const mappedData: RolePrivilege[] = (data || []).map(item => ({
        role: item.role as AppRole,
        permission_id: item.permission_id,
        permission: item.permissions as Permission
      }));
      
      setRolePrivileges(mappedData);
    } catch (error) {
      console.error('Error fetching role privileges:', error);
    }
  };

  const toggleRolePrivilege = async (role: AppRole, permissionId: string, hasPrivilege: boolean) => {
    try {
      if (hasPrivilege) {
        // Remove privilege
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', role)
          .eq('permission_id', permissionId);

        if (error) throw error;
      } else {
        // Add privilege
        const { error } = await supabase
          .from('role_permissions')
          .insert({
            role,
            permission_id: permissionId
          });

        if (error) throw error;
      }

      await fetchRolePrivileges();
      toast({
        title: "Succès",
        description: `Privilège ${hasPrivilege ? 'retiré' : 'accordé'} avec succès`
      });
    } catch (error) {
      console.error('Error toggling role privilege:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du privilège",
        variant: "destructive"
      });
    }
  };

  const getRolePrivileges = (role: AppRole): string[] => {
    return rolePrivileges
      .filter(rp => rp.role === role)
      .map(rp => rp.permission_id);
  };

  const hasRolePrivilege = (role: AppRole, permissionId: string): boolean => {
    return rolePrivileges.some(rp => rp.role === role && rp.permission_id === permissionId);
  };

  const getPermissionsByCategory = () => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPermissions(), fetchRolePrivileges()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    permissions,
    rolePrivileges,
    loading,
    toggleRolePrivilege,
    getRolePrivileges,
    hasRolePrivilege,
    getPermissionsByCategory,
    fetchRolePrivileges
  };
};