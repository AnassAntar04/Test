import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SupabaseRolePermission {
  permission_id: string;
  permissions: {
    id: string;
    name: string;
    category: string;
    description: string | null;
  } | null;
}

export const usePermissions = () => {
  const { user, userRole } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  console.log('usePermissions: Initializing permissions hook', { user, userRole });


  const fetchUserPermissions = async () => {
    if (!user || !userRole) {
      // console.log('usePermissions: No user or role', { user: !!user, userRole });
      setPermissions([]);
      setLoading(false);
      return;
    }

    console.log('usePermissions: Fetching permissions for role:', userRole);

    try {
      // Super admin gets all permissions automatically
      if (userRole === 'super_admin') {
        // console.log('usePermissions: User is super_admin, granting all permissions');
        
        // Fetch all available permissions for super admin
        const { data: allPermissions, error: permError } = await supabase
          .from('permissions')
          .select('name');

        // console.log('usePermissions: Fetched all permissions for super_admin:', allPermissions);
        if (permError) {
          console.error('Error fetching all permissions for super_admin:', permError);
          throw permError;
        }

        const allPermissionNames = allPermissions?.map(p => p.name) || [];
        // console.log('usePermissions: Super admin permissions:', allPermissionNames);
        setPermissions(allPermissionNames);
        setError(null);
        setLoading(false);
        return;
      }

      // console.log('usePermissions: Fetching role permissions for user:', user);

      const { data : RoleId , error: roleError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('auth_user_id', user.id)
        .single();

        console.log('usePermissions: Fetched role ID:', RoleId);

      // console.log('usePermissions: Fetched role ID:', user.id);
      // Regular role permission fetching
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          perm_id,
          permissions:perm_id (
            perm_id,
            name,
            code,
            description
          )
        `)
        .eq('role_id', RoleId.role_id);

        console.log('usePermissions: Fetched role permissions:', data);

      if (error) {
        console.error('Error fetching role permissions:', error);
        throw error;
      }

      const userPermissions = (data as SupabaseRolePermission[])
        ?.filter(item => item.permissions !== null)
        ?.map(item => item.permissions!.code) || [];
      
      console.log('usePermissions: Regular role permissions:', userPermissions);
      setPermissions(userPermissions);
      // console.log('usePermissions: Regular role permissions:', permissions);

      setError(null);
    } catch (err) {
      console.error('Error fetching user permissions:', err);
      setError('Erreur lors du chargement des privilèges');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, [user, userRole]);

  const hasPermission = (permission: string): boolean => {
    // Super admin has all permissions
    if (userRole === 'super_admin') return true;
    
    // Check if user has the specific permission
    // console.log('usePermissions: Checking permission:', permission, 'for role:', userRole);
    const res =  permissions.includes(permission);
    // console.log('usePermissions: Permission check result:', res);
    return res; 

  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    if (userRole === 'super_admin') return true;
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    if (userRole === 'super_admin') return true;
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refetch: fetchUserPermissions
  };
};