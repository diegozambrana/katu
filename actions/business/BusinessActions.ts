"use server";

import { createClient } from "@/lib/supabase/server";
import { BusinessServices } from "@/services";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getBusinesses() {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const businessService = new BusinessServices(supabase);
  const businesses = await businessService.getBusinessesByUserId(user.id);
  return businesses;
}

export async function createBusiness(formData: FormData) {
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

export async function getBusinessById(businessId: string) {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const businessService = new BusinessServices(supabase);
  const business = await businessService.getBusinessById(businessId, user.id);
  return business;
}

export async function deleteBusiness(businessId: string) {
  await cookies();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .delete()
    .eq("id", businessId);
  if (error) throw error;
  revalidatePath("/business");
  return data;
}
