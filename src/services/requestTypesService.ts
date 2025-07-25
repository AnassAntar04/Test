import { supabase } from "@/integrations/supabase/client";
import { RequestType } from "@/types/routing";

export const requestTypesService = {
  async fetchAll(): Promise<RequestType[]> {
    const { data, error } = await supabase
      .from('request_types')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  },

  async add(requestType: Omit<RequestType, 'id' | 'created_at' | 'updated_at'>): Promise<RequestType> {
    const { data, error } = await supabase
      .from('request_types')
      .insert(requestType)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('request_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};