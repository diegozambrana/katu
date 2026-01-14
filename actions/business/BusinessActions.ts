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
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const phone = formData.get("phone") as string | null;
  const whatsapp_phone = formData.get("whatsapp_phone") as string | null;
  const email = formData.get("email") as string | null;
  const address = formData.get("address") as string | null;
  const city = formData.get("city") as string | null;
  const country = formData.get("country") as string | null;
  const website_url = formData.get("website_url") as string | null;
  const active = formData.get("active") === "true";
  const avatar = formData.get("avatar") as string | null;
  const avatar_caption = formData.get("avatar_caption") as string | null;
  const cover = formData.get("cover") as string | null;
  const cover_caption = formData.get("cover_caption") as string | null;

  const businessData: any = {
    name,
    slug,
    user_id: user.id,
    active,
  };

  if (description) businessData.description = description;
  if (phone) businessData.phone = phone;
  if (whatsapp_phone) businessData.whatsapp_phone = whatsapp_phone;
  if (email) businessData.email = email;
  if (address) businessData.address = address;
  if (city) businessData.city = city;
  if (country) businessData.country = country;
  if (website_url) businessData.website_url = website_url;
  if (avatar) businessData.avatar = avatar;
  if (avatar_caption) businessData.avatar_caption = avatar_caption;
  if (cover) businessData.cover = cover;
  if (cover_caption) businessData.cover_caption = cover_caption;

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .insert(businessData)
    .select()
    .single();

  if (businessError) throw businessError;

  // Crear business_social_links si existen
  const socialLinksJson = formData.get("social_links") as string | null;
  if (socialLinksJson && business) {
    try {
      const socialLinks = JSON.parse(socialLinksJson);

      if (Array.isArray(socialLinks) && socialLinks.length > 0) {
        const socialLinksData = socialLinks
          .filter((link: any) => link.url && link.url.trim() !== "") // Solo links con URL válida
          .map((link: any) => ({
            business_id: business.id,
            platform: link.platform,
            url: link.url,
            sort_order: link.sort_order || 0,
            active: link.active !== false, // Por defecto true
          }));

        if (socialLinksData.length > 0) {
          const { error: socialLinksError } = await supabase
            .from("business_social_links")
            .insert(socialLinksData);

          if (socialLinksError) throw socialLinksError;
        }
      }
    } catch (parseError) {
      console.error("Error parsing social links:", parseError);
      // No lanzamos error para no fallar la creación del business
    }
  }

  revalidatePath("/business");
  return business;
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

export async function updateBusiness(formData: FormData) {
  await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const businessId = formData.get("business_id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const phone = formData.get("phone") as string | null;
  const whatsapp_phone = formData.get("whatsapp_phone") as string | null;
  const email = formData.get("email") as string | null;
  const address = formData.get("address") as string | null;
  const city = formData.get("city") as string | null;
  const country = formData.get("country") as string | null;
  const website_url = formData.get("website_url") as string | null;
  const active = formData.get("active") === "true";
  const avatar = formData.get("avatar") as string | null;
  const avatar_caption = formData.get("avatar_caption") as string | null;
  const cover = formData.get("cover") as string | null;
  const cover_caption = formData.get("cover_caption") as string | null;

  // Verificar que el business pertenece al usuario
  const businessService = new BusinessServices(supabase);
  const existingBusiness = await businessService.getBusinessById(
    businessId,
    user.id
  );

  if (!existingBusiness) {
    throw new Error("Business no encontrado o no autorizado");
  }

  // Actualizar el business
  const businessData: any = {
    name,
    slug,
    active,
    udpated_at: new Date().toISOString(),
  };

  if (description !== null) businessData.description = description;
  if (phone !== null) businessData.phone = phone;
  if (whatsapp_phone !== null) businessData.whatsapp_phone = whatsapp_phone;
  if (email !== null) businessData.email = email;
  if (address !== null) businessData.address = address;
  if (city !== null) businessData.city = city;
  if (country !== null) businessData.country = country;
  if (website_url !== null) businessData.website_url = website_url;
  if (avatar !== null) businessData.avatar = avatar;
  if (avatar_caption !== null) businessData.avatar_caption = avatar_caption;
  if (cover !== null) businessData.cover = cover;
  if (cover_caption !== null) businessData.cover_caption = cover_caption;

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .update(businessData)
    .eq("id", businessId)
    .select()
    .single();

  if (businessError) throw businessError;

  // Manejar business_social_links
  const socialLinksJson = formData.get("social_links") as string | null;
  if (socialLinksJson) {
    try {
      const newSocialLinks = JSON.parse(socialLinksJson) as Array<{
        id: string;
        platform: string;
        url: string;
        sort_order: number;
        active: boolean;
      }>;

      // Obtener los social links actuales de la BD
      const { data: existingLinks, error: linksError } = await supabase
        .from("business_social_links")
        .select("*")
        .eq("business_id", businessId);

      if (linksError) throw linksError;

      const existingLinksMap = new Map(
        (existingLinks || []).map((link) => [link.id, link])
      );
      const newLinksMap = new Map(
        newSocialLinks
          .filter((link) => link.url && link.url.trim() !== "")
          .map((link) => [link.id, link])
      );

      // Identificar links a eliminar (están en BD pero no en el nuevo array)
      const linksToDelete = (existingLinks || []).filter(
        (link) => !newLinksMap.has(link.id)
      );

      // Identificar links nuevos (no están en la BD - IDs temporales o nuevos)
      const linksToInsert = newSocialLinks.filter(
        (link) =>
          link.url &&
          link.url.trim() !== "" &&
          !existingLinksMap.has(link.id)
      );

      // Identificar links a actualizar (están en la BD y en el nuevo array)
      const linksToUpdate = newSocialLinks.filter(
        (link) =>
          link.url &&
          link.url.trim() !== "" &&
          existingLinksMap.has(link.id)
      );

      // Eliminar links
      if (linksToDelete.length > 0) {
        const idsToDelete = linksToDelete.map((link) => link.id);
        const { error: deleteError } = await supabase
          .from("business_social_links")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      // Insertar nuevos links
      if (linksToInsert.length > 0) {
        const linksToInsertData = linksToInsert.map((link) => ({
          business_id: businessId,
          platform: link.platform,
          url: link.url,
          sort_order: link.sort_order || 0,
          active: link.active !== false,
        }));

        const { error: insertError } = await supabase
          .from("business_social_links")
          .insert(linksToInsertData);

        if (insertError) throw insertError;
      }

      // Actualizar links existentes
      for (const link of linksToUpdate) {
        const { error: updateError } = await supabase
          .from("business_social_links")
          .update({
            platform: link.platform,
            url: link.url,
            sort_order: link.sort_order || 0,
            active: link.active !== false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", link.id);

        if (updateError) throw updateError;
      }
    } catch (parseError) {
      console.error("Error parsing social links:", parseError);
      throw new Error("Error al procesar los social links");
    }
  }

  revalidatePath("/business");
  revalidatePath(`/business/${businessId}`);
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
