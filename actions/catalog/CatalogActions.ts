"use server";

import { createClient } from "@/lib/supabase/server";
import { CatalogServices } from "@/services";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getCatalogs() {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const catalogService = new CatalogServices(supabase);
  const catalogs = await catalogService.getCatalogsByUserId(user.id);
  return catalogs;
}

export async function createCatalog(formData: FormData) {
  await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const active = formData.get("active") === "true";
  const business_id = formData.get("business_id") as string;

  const catalogData: any = {
    name,
    slug,
    user_id: user.id,
    business_id,
    active,
  };

  if (description) catalogData.description = description;

  const { data: catalog, error: catalogError } = await supabase
    .from("catalogs")
    .insert(catalogData)
    .select()
    .single();

  if (catalogError) throw catalogError;

  // Crear catalog_slides si existen
  const slidesJson = formData.get("slides") as string | null;
  if (slidesJson && catalog) {
    try {
      const slides = JSON.parse(slidesJson);

      if (Array.isArray(slides) && slides.length > 0) {
        const slidesData = slides
          .filter((slide: any) => slide.image && slide.image.trim() !== "")
          .map((slide: any) => ({
            catalog_id: catalog.id,
            image: slide.image,
            image_caption: slide.image_caption || null,
            title: slide.title || null,
            description: slide.description || null,
            link_url: slide.link_url || null,
            sort_order: slide.sort_order || 0,
            active: slide.active !== false,
          }));

        if (slidesData.length > 0) {
          const { error: slidesError } = await supabase
            .from("catalog_slides")
            .insert(slidesData);

          if (slidesError) throw slidesError;
        }
      }
    } catch (parseError) {
      console.error("Error parsing slides:", parseError);
    }
  }

  // Crear catalog_sections y catalog_section_products si existen
  const sectionsJson = formData.get("sections") as string | null;
  if (sectionsJson && catalog) {
    try {
      const sections = JSON.parse(sectionsJson);

      if (Array.isArray(sections) && sections.length > 0) {
        for (const section of sections) {
          const { data: createdSection, error: sectionError } = await supabase
            .from("catalog_sections")
            .insert({
              catalog_id: catalog.id,
              title: section.title,
              description: section.description || null,
              sort_order: section.sort_order || 0,
              active: section.active !== false,
            })
            .select()
            .single();

          if (sectionError) throw sectionError;

          // Agregar productos a la sección
          if (
            createdSection &&
            section.products &&
            Array.isArray(section.products) &&
            section.products.length > 0
          ) {
            const sectionProductsData = section.products.map(
              (product: any, index: number) => ({
                catalog_section_id: createdSection.id,
                product_id: product.product_id,
                sort_order: product.sort_order || index,
                active: product.active !== false,
              })
            );

            const { error: sectionProductsError } = await supabase
              .from("catalog_section_products")
              .insert(sectionProductsData);

            if (sectionProductsError) throw sectionProductsError;
          }
        }
      }
    } catch (parseError) {
      console.error("Error parsing sections:", parseError);
    }
  }

  // Crear catalog_contacts si existen
  const contactsJson = formData.get("contacts") as string | null;
  if (contactsJson && catalog) {
    try {
      const contacts = JSON.parse(contactsJson);

      if (Array.isArray(contacts) && contacts.length > 0) {
        const contactsData = contacts
          .filter((contact: any) => contact.value && contact.value.trim() !== "")
          .map((contact: any) => ({
            catalog_id: catalog.id,
            label: contact.label,
            type: contact.type,
            value: contact.value,
            sort_order: contact.sort_order || 0,
            active: contact.active !== false,
          }));

        if (contactsData.length > 0) {
          const { error: contactsError } = await supabase
            .from("catalog_contacts")
            .insert(contactsData);

          if (contactsError) throw contactsError;
        }
      }
    } catch (parseError) {
      console.error("Error parsing contacts:", parseError);
    }
  }

  revalidatePath("/catalog");
  return catalog;
}

export async function getCatalogById(catalogId: string) {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const catalogService = new CatalogServices(supabase);
  const catalog = await catalogService.getCatalogById(catalogId, user.id);
  return catalog;
}

export async function updateCatalog(formData: FormData) {
  await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const catalogId = formData.get("catalog_id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const active = formData.get("active") === "true";

  // Verificar que el catálogo pertenece al usuario
  const catalogService = new CatalogServices(supabase);
  const existingCatalog = await catalogService.getCatalogById(
    catalogId,
    user.id
  );

  if (!existingCatalog) {
    throw new Error("Catálogo no encontrado o no autorizado");
  }

  // Actualizar el catálogo
  const catalogData: any = {
    name,
    slug,
    active,
    updated_at: new Date().toISOString(),
  };

  if (description !== null) catalogData.description = description;

  const { data: catalog, error: catalogError } = await supabase
    .from("catalogs")
    .update(catalogData)
    .eq("id", catalogId)
    .select()
    .single();

  if (catalogError) throw catalogError;

  // Manejar catalog_slides
  const slidesJson = formData.get("slides") as string | null;
  if (slidesJson) {
    try {
      const newSlides = JSON.parse(slidesJson) as Array<{
        id: string;
        image: string;
        image_caption: string | null;
        title: string | null;
        description: string | null;
        link_url: string | null;
        sort_order: number;
        active: boolean;
      }>;

      const { data: existingSlides, error: slidesError } = await supabase
        .from("catalog_slides")
        .select("*")
        .eq("catalog_id", catalogId);

      if (slidesError) throw slidesError;

      const existingSlidesMap = new Map(
        (existingSlides || []).map((slide) => [slide.id.toString(), slide])
      );
      const newSlidesMap = new Map(
        newSlides
          .filter((slide) => slide.image && slide.image.trim() !== "")
          .map((slide) => [slide.id, slide])
      );

      // Eliminar slides
      const slidesToDelete = (existingSlides || []).filter(
        (slide) => !newSlidesMap.has(slide.id.toString())
      );

      if (slidesToDelete.length > 0) {
        const idsToDelete = slidesToDelete.map((slide) => slide.id);
        const { error: deleteError } = await supabase
          .from("catalog_slides")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      // Insertar y actualizar slides
      for (const slide of newSlides) {
        if (!slide.image || slide.image.trim() === "") continue;

        if (!existingSlidesMap.has(slide.id)) {
          // Insertar nuevo
          const { error: insertError } = await supabase
            .from("catalog_slides")
            .insert({
              catalog_id: catalogId,
              image: slide.image,
              image_caption: slide.image_caption || null,
              title: slide.title || null,
              description: slide.description || null,
              link_url: slide.link_url || null,
              sort_order: slide.sort_order || 0,
              active: slide.active !== false,
            });

          if (insertError) throw insertError;
        } else {
          // Actualizar existente
          const { error: updateError } = await supabase
            .from("catalog_slides")
            .update({
              image: slide.image,
              image_caption: slide.image_caption || null,
              title: slide.title || null,
              description: slide.description || null,
              link_url: slide.link_url || null,
              sort_order: slide.sort_order || 0,
              active: slide.active !== false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", slide.id);

          if (updateError) throw updateError;
        }
      }
    } catch (parseError) {
      console.error("Error parsing slides:", parseError);
      throw new Error("Error al procesar los slides");
    }
  }

  // Manejar catalog_sections y catalog_section_products
  const sectionsJson = formData.get("sections") as string | null;
  if (sectionsJson) {
    try {
      const newSections = JSON.parse(sectionsJson) as Array<{
        id: string;
        title: string;
        description: string | null;
        sort_order: number;
        active: boolean;
        products: Array<{
          id: string;
          product_id: string;
          sort_order: number;
          active: boolean;
        }>;
      }>;

      const { data: existingSections, error: sectionsError } = await supabase
        .from("catalog_sections")
        .select("*, catalog_section_products(*)")
        .eq("catalog_id", catalogId);

      if (sectionsError) throw sectionsError;

      const existingSectionsMap = new Map(
        (existingSections || []).map((section) => [section.id, section])
      );
      const newSectionsMap = new Map(
        newSections.map((section) => [section.id, section])
      );

      // Eliminar secciones
      const sectionsToDelete = (existingSections || []).filter(
        (section) => !newSectionsMap.has(section.id)
      );

      if (sectionsToDelete.length > 0) {
        const idsToDelete = sectionsToDelete.map((section) => section.id);
        const { error: deleteError } = await supabase
          .from("catalog_sections")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      // Insertar/actualizar secciones
      for (const section of newSections) {
        if (!existingSectionsMap.has(section.id)) {
          // Insertar nueva sección
          const { data: createdSection, error: insertError } = await supabase
            .from("catalog_sections")
            .insert({
              catalog_id: catalogId,
              title: section.title,
              description: section.description || null,
              sort_order: section.sort_order || 0,
              active: section.active !== false,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          // Insertar productos de la sección
          if (
            createdSection &&
            section.products &&
            section.products.length > 0
          ) {
            const productsData = section.products.map((product, index) => ({
              catalog_section_id: createdSection.id,
              product_id: product.product_id,
              sort_order: product.sort_order || index,
              active: product.active !== false,
            }));

            const { error: productsError } = await supabase
              .from("catalog_section_products")
              .insert(productsData);

            if (productsError) throw productsError;
          }
        } else {
          // Actualizar sección existente
          const { error: updateError } = await supabase
            .from("catalog_sections")
            .update({
              title: section.title,
              description: section.description || null,
              sort_order: section.sort_order || 0,
              active: section.active !== false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", section.id);

          if (updateError) throw updateError;

          // Manejar productos de la sección
          const existingSection = existingSectionsMap.get(section.id);
          const existingProducts = existingSection?.catalog_section_products || [];

          const existingProductsMap = new Map(
            existingProducts.map((p: any) => [p.id, p])
          );
          const newProductsMap = new Map(
            (section.products || []).map((p) => [p.id, p])
          );

          // Eliminar productos
          const productsToDelete = existingProducts.filter(
            (p: any) => !newProductsMap.has(p.id)
          );

          if (productsToDelete.length > 0) {
            const idsToDelete = productsToDelete.map((p: any) => p.id);
            const { error: deleteError } = await supabase
              .from("catalog_section_products")
              .delete()
              .in("id", idsToDelete);

            if (deleteError) throw deleteError;
          }

          // Insertar/actualizar productos
          for (const product of section.products || []) {
            if (!existingProductsMap.has(product.id)) {
              // Insertar nuevo
              const { error: insertError } = await supabase
                .from("catalog_section_products")
                .insert({
                  catalog_section_id: section.id,
                  product_id: product.product_id,
                  sort_order: product.sort_order || 0,
                  active: product.active !== false,
                });

              if (insertError) throw insertError;
            } else {
              // Actualizar existente
              const { error: updateError } = await supabase
                .from("catalog_section_products")
                .update({
                  product_id: product.product_id,
                  sort_order: product.sort_order || 0,
                  active: product.active !== false,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", product.id);

              if (updateError) throw updateError;
            }
          }
        }
      }
    } catch (parseError) {
      console.error("Error parsing sections:", parseError);
      throw new Error("Error al procesar las secciones");
    }
  }

  // Manejar catalog_contacts
  const contactsJson = formData.get("contacts") as string | null;
  if (contactsJson) {
    try {
      const newContacts = JSON.parse(contactsJson) as Array<{
        id: string;
        label: string;
        type: string;
        value: string;
        sort_order: number;
        active: boolean;
      }>;

      const { data: existingContacts, error: contactsError } = await supabase
        .from("catalog_contacts")
        .select("*")
        .eq("catalog_id", catalogId);

      if (contactsError) throw contactsError;

      const existingContactsMap = new Map(
        (existingContacts || []).map((contact) => [contact.id, contact])
      );
      const newContactsMap = new Map(
        newContacts
          .filter((contact) => contact.value && contact.value.trim() !== "")
          .map((contact) => [contact.id, contact])
      );

      // Eliminar contactos
      const contactsToDelete = (existingContacts || []).filter(
        (contact) => !newContactsMap.has(contact.id)
      );

      if (contactsToDelete.length > 0) {
        const idsToDelete = contactsToDelete.map((contact) => contact.id);
        const { error: deleteError } = await supabase
          .from("catalog_contacts")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      // Insertar y actualizar contactos
      for (const contact of newContacts) {
        if (!contact.value || contact.value.trim() === "") continue;

        if (!existingContactsMap.has(contact.id)) {
          // Insertar nuevo
          const { error: insertError } = await supabase
            .from("catalog_contacts")
            .insert({
              catalog_id: catalogId,
              label: contact.label,
              type: contact.type,
              value: contact.value,
              sort_order: contact.sort_order || 0,
              active: contact.active !== false,
            });

          if (insertError) throw insertError;
        } else {
          // Actualizar existente
          const { error: updateError } = await supabase
            .from("catalog_contacts")
            .update({
              label: contact.label,
              type: contact.type,
              value: contact.value,
              sort_order: contact.sort_order || 0,
              active: contact.active !== false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", contact.id);

          if (updateError) throw updateError;
        }
      }
    } catch (parseError) {
      console.error("Error parsing contacts:", parseError);
      throw new Error("Error al procesar los contactos");
    }
  }

  revalidatePath("/catalog");
  revalidatePath(`/catalog/${catalogId}`);
  return catalog;
}

export async function deleteCatalog(catalogId: string) {
  await cookies();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalogs")
    .delete()
    .eq("id", catalogId);
  if (error) throw error;
  revalidatePath("/catalog");
  return data;
}
