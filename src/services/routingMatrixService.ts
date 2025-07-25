import { supabase } from "@/integrations/supabase/client";
import { RoutingMatrix } from "@/types/routing";

export const routingMatrixService = {
  async fetchAll(): Promise<RoutingMatrix[]> {
    const { data, error } = await supabase
      .from('routing_matrix')
      .select('*');
    
    if (error) throw error;
    return (data || []) as RoutingMatrix[];
  },

  async update(requestTypeId: string, role: string, permissionType: RoutingMatrix['permission_type']): Promise<void> {
    const { error } = await supabase
      .from('routing_matrix')
      .upsert({
        request_type_id: requestTypeId,
        role,
        permission_type: permissionType
      }, {
        onConflict: 'request_type_id,role'
      });

    if (error) throw error;
  }
};