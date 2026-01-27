"use server";

import { createClient } from "@/lib/supabase/server";
import { DashboardServices } from "@/services";
import { cookies } from "next/headers";

export async function getDashboardStats() {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const dashboardService = new DashboardServices(supabase);
  const stats = await dashboardService.getDashboardStats(user.id);
  return stats;
}
