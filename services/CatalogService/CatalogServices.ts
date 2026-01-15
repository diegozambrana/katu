import { SupabaseClient } from "@supabase/supabase-js";

export class CatalogServices {
  constructor(private supabase: SupabaseClient) {}

  async getCatalogsByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("catalogs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getCatalogById(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from("catalogs")
      .select(
        `
        *,
        catalog_slides (
          id,
          created_at,
          updated_at,
          active,
          title,
          description,
          link_url,
          sort_order,
          image,
          image_caption
        ),
        catalog_sections (
          id,
          created_at,
          updated_at,
          title,
          description,
          sort_order,
          active,
          catalog_section_products (
            id,
            created_at,
            updated_at,
            active,
            product_id,
            sort_order,
            product:products (
              id,
              name,
              slug,
              base_price,
              currency,
              is_on_sale,
              sale_label
            )
          )
        ),
        catalog_contacts (
          id,
          created_at,
          updated_at,
          active,
          sort_order,
          label,
          type,
          value
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
