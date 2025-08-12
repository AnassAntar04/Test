import { supabase } from "@/integrations/supabase/client";
import { EscalationRule } from "@/types/routing";

export const escalationRulesService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("escalation_rules")
      .select(
        `
        * , 
        from_role_data:roles!escalation_rules_from_role_fkey(role_id, name),
        to_role_data:roles!escalation_rules_to_role_fkey(role_id, name)
      `
      )
      .order("priority");

    const rulesWithCategories = await Promise.all(
      (data || []).map(async (rule) => {
        const { data: ruleCategoriesData } = await supabase
          .from("escalation_categories")
          .select(
            `
                  category:category(*)
                `
          )
          .eq("esc_id", rule.esc_id);

        return {
          ...rule,
          categories: ruleCategoriesData?.map((rc) => rc.category) || []
        };
      })
    );

    if (error) throw error;
    return rulesWithCategories || [];
  },

  async update(updates) {
    const { error: ErrorEscalationRules } = await supabase
      .from("escalation_rules")
      .update({
        name: updates.escalation_rules.name,
        from_role: updates.escalation_rules.from_role.role_id,
        to_role: updates.escalation_rules.to_role.role_id
      })
      .eq("esc_id", updates.escalation_rules.esc_id);

    const { error: ErrorCategory } = await supabase
      .from("category")
      .update({
        name: updates.category.name,
        keywords: updates.category.keywords
      })
      .eq("cat_id", updates.category.cat_id);

    console.log(ErrorEscalationRules, ErrorCategory);
    if (ErrorEscalationRules || ErrorCategory)
      throw ErrorEscalationRules || ErrorCategory;
  }
};
