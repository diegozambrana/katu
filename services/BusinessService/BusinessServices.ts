import { SupabaseClient } from "@supabase/supabase-js";

export class BusinessServices {
  constructor(private supabase: SupabaseClient) {}

  async getBusinessesByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getBusinessById(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from("businesses")
      .select(
        `
        *,
        business_social_links (
          id,
          created_at,
          updated_at,
          active,
          platform,
          url,
          sort_order
        )
      `
      )
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }
}
