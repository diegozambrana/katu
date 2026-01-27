import { SupabaseClient } from "@supabase/supabase-js";

export interface DashboardStats {
  activeCatalogs: number;
  totalProducts: number;
  activeProducts: number;
  recentCatalogs: Array<{
    id: string;
    name: string;
    slug: string;
    active: boolean;
    updated_at: string;
  }>;
}

export class DashboardServices {
  constructor(private supabase: SupabaseClient) {}

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Obtener catálogos activos
    const { data: activeCatalogsData, error: catalogsError } =
      await this.supabase
        .from("catalogs")
        .select("id, name, slug, active, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(3);

    if (catalogsError) throw catalogsError;

    // Obtener todos los productos
    const { data: productsData, error: productsError } = await this.supabase
      .from("products")
      .select("id, active, product_images(id)")
      .eq("user_id", userId);

    if (productsError) throw productsError;

    // Calcular productos activos
    const activeProducts = (productsData || []).filter(
      (product) => product.active === true,
    ).length;

    return {
      activeCatalogs: activeCatalogsData?.length || 0,
      totalProducts: productsData?.length || 0,
      activeProducts,
      recentCatalogs: activeCatalogsData || [],
    };
  }
}
