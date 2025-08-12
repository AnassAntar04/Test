import { supabase } from "@/integrations/supabase/client";
import { RoutingMatrix } from "@/types/routing";

export const routingMatrixService = {
  async fetchAll() {
    const { data, error } = await supabase.from("escalation_categories")
      .select(`
    *,
    category(*),
    escalation_rules(
      *,
      from_role:from_role (
      *
      ),
      to_role:to_role (
      *
      )
    )
  `);

    if (error) throw error;
    return data || [];
  },

  async update(
    requestTypeId: string,
    role: string,
    permissionType: RoutingMatrix["permission_type"]
  ): Promise<void> {
    const { error } = await supabase.from("routing_matrix").upsert(
      {
        request_type_id: requestTypeId,
        role,
        permission_type: permissionType
      },
      {
        onConflict: "request_type_id,role"
      }
    );

    if (error) throw error;
  }
};
