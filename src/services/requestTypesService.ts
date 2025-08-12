import { supabase } from "@/integrations/supabase/client";
import { RequestType } from "@/types/routing";

export const requestTypesService = {
  async fetchAll() {
    const { data, error } = await supabase.from("category").select("*");

    if (error) throw error;
    return data || [];
  },

  async add(requestType) {
    const { data: org_data, error: org_error } = await supabase
      .from("organisation")
      .select("org_id")
      .single();

    const categoryData = {
      ...requestType,
      org_id: org_data?.org_id
    };
    const { data, error } = await supabase
      .from("category")
      .insert(categoryData);

    if (error) throw error;
    return true;
  },

  async update(cat_id: string, requestType) {
    const { data: org_data, error: org_error } = await supabase
      .from("organisation")
      .select("org_id")
      .single();

    const categoryData = {
      ...requestType,
      org_id: org_data?.org_id
    };

    const { data, error } = await supabase
      .from("category")
      .update(categoryData)
      .eq("cat_id", cat_id);

    if (error) throw error;
    return true;
  },

  async delete(id: string) {
    const { error  } = await supabase
      .from("escalation_categories")
      .delete()
      .eq("cat_id", id);

    const { error : delete_error } = await supabase.from("category").delete().eq("cat_id", id);

    if (error || delete_error) throw error || delete_error;
  }
};
