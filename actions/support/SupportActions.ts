"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { SupportMessage, SupportMessageStatus } from "@/types/Support";

export async function createSupportMessage(formData: FormData) {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!subject || !message) {
    throw new Error("El asunto y el mensaje son requeridos");
  }

  const { data: supportMessage, error } = await supabase
    .from("support_messages")
    .insert({
      subject,
      message,
      user_id: user.id,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error al enviar el mensaje: ${error.message}`);
  }

  revalidatePath("/support/contact-us");
  return supportMessage;
}

export async function getSupportMessages(): Promise<SupportMessage[]> {
  await cookies();
  const supabase = await createClient();

  // Fetch support messages
  const { data: messages, error: messagesError } = await supabase
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (messagesError) {
    throw new Error(`Error al obtener mensajes: ${messagesError.message}`);
  }

  if (!messages || messages.length === 0) {
    return [];
  }

  // Fetch user emails from profiles
  const userIds = [...new Set(messages.map((msg) => msg.user_id))];
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email")
    .in("id", userIds);

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    // Continue without emails if profiles fetch fails
  }

  // Create a map of user_id -> email
  const emailMap = new Map<string, string>();
  if (profiles) {
    profiles.forEach((profile) => {
      if (profile.email) {
        emailMap.set(profile.id, profile.email);
      }
    });
  }

  // If some emails are missing from profiles, try to get from auth.users
  // Note: We can't directly query auth.users, so we'll use the service role if available
  // For now, we'll just use what we have from profiles

  // Combine messages with emails
  return messages.map((msg) => ({
    ...msg,
    status: msg.status as SupportMessageStatus,
    user_email: emailMap.get(msg.user_id) || undefined,
  }));
}

export async function updateSupportMessageStatus(
  messageId: string,
  status: SupportMessageStatus
): Promise<SupportMessage> {
  await cookies();
  const supabase = await createClient();

  const { data: updatedMessage, error } = await supabase
    .from("support_messages")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", messageId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar el mensaje: ${error.message}`);
  }

  revalidatePath("/support/messages");
  return {
    ...updatedMessage,
    status: updatedMessage.status as SupportMessageStatus,
  };
}
