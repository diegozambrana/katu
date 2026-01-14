import { SupabaseClient } from "@supabase/supabase-js";

export class ProductServices {
  constructor(private supabase: SupabaseClient) {}

  async getProductsByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getProductById(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from("products")
      .select(
        `
        *,
        product_prices (
          id,
          created_at,
          updated_at,
          active,
          label,
          price,
          sort_order
        ),
        product_images (
          id,
          display_order,
          is_primary,
          created_at,
          image,
          image_caption,
          updated_at
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
