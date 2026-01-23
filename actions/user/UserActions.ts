"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { UserRole } from "@/stores/UserProfileStore";

export interface UserProfile {
  id: string;
  role: UserRole;
  email?: string;
  full_name?: string;
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
    .select("id, role, email, full_name")
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
  };
}
