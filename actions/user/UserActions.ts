"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { UserRole } from "@/stores/UserProfileStore";

export interface UserProfile {
  id: string;
  role: UserRole;
  email?: string;
  full_name?: string;
  onboarding_completed: boolean;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Obtener el perfil desde la tabla profiles donde id = user.id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, email, full_name, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    id: profile.id,
    role: (profile.role as UserRole) || "USER",
    email: profile.email || user.email,
    full_name: profile.full_name || null,
    onboarding_completed: profile.onboarding_completed || false,
  };
}

export async function completeOnboarding() {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  if (error) {
    throw error;
  }

  return { success: true };
}
