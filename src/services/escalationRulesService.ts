import { supabase } from "@/integrations/supabase/client";
import { EscalationRule } from "@/types/routing";

export const escalationRulesService = {
  async fetchAll(): Promise<EscalationRule[]> {
    const { data, error } = await supabase
      .from('escalation_rules')
      .select('*')
      .order('priority');
    
    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<EscalationRule>): Promise<void> {
    const { error } = await supabase
      .from('escalation_rules')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }
};