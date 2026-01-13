"use server";

import { createClient } from "@/lib/supabase/server";
import { BusinessServices } from "@/services";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getBusinesses() {
  // Acceder primero a datos dinámicos para evitar el error de Date.now() de Console Ninja
  await cookies();
  const supabase = await createClient();

  // Obtener usuario autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  console.log("user:", user?.id || "No user");

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const businessService = new BusinessServices(supabase);
  const businesses = await businessService.getBusinessesByUserId(user.id);
  console.log("businesses", businesses);
  return businesses;
}

export async function createBusiness(formData: FormData) {
  // Acceder primero a datos dinámicos para evitar el error de Date.now() de Console Ninja
  await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const name = formData.get("name") as string;

  const { data, error } = await supabase
    .from("businesses")
    .insert({ name, user_id: user.id })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/business");
  return data;
}
