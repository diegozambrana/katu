"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { useCatalogCreateStore } from "../stores/CatalogCreateStore";
import { createCatalog, updateCatalog, getCatalogById } from "@/actions/catalog/CatalogActions";
import type {
  CatalogSlide,
  CatalogSection,
  CatalogContact,
  CatalogSectionProduct,
} from "@/types/Catalog";
import { toast } from "sonner";

const catalogSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().optional(),
  active: z.boolean(),
  business_id: z.string().min(1, "El negocio es requerido"),
  catalog_whatsapp_fab_display: z.boolean(),
  catalog_whatsapp_number: z.string().optional(),
  catalog_whatsapp_text: z.string().optional(),
});

type CatalogFormValues = z.infer<typeof catalogSchema>;

export const useCatalogCreate = (catalogId?: string) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const hasLoaded = useRef(false);
  const {
    formData,
    slides,
    sections,
    contacts,
    slugManuallyEdited,
    error,
    setFormData,
    setSlides,
    setSections,
    setContacts,
    setSlugManuallyEdited,
    setError,
    reset,
  } = useCatalogCreateStore();

  const form = useForm<CatalogFormValues>({
    resolver: zodResolver(catalogSchema),
    defaultValues: {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      active: formData.active,
      business_id: formData.business_id,
      catalog_whatsapp_fab_display: formData.catalog_whatsapp_fab_display,
      catalog_whatsapp_number: formData.catalog_whatsapp_number,
      catalog_whatsapp_text: formData.catalog_whatsapp_text,
    },
  });

  // Load catalog data if in edit mode
  useEffect(() => {
    if (!catalogId || hasLoaded.current) return;

    const loadCatalog = async () => {
      try {
        hasLoaded.current = true;
        const catalog = await getCatalogById(catalogId);

        setFormData({
          name: catalog.name || "",
          slug: catalog.slug || "",
          description: catalog.description || "",
          active: catalog.active ?? true,
          business_id: catalog.business_id || "",
          catalog_whatsapp_fab_display: catalog.catalog_whatsapp_fab_display ?? false,
          catalog_whatsapp_number: catalog.catalog_whatsapp_number || "",
          catalog_whatsapp_text: catalog.catalog_whatsapp_text || "",
        });

        form.reset({
          name: catalog.name || "",
          slug: catalog.slug || "",
          description: catalog.description || "",
          active: catalog.active ?? true,
          business_id: catalog.business_id || "",
          catalog_whatsapp_fab_display: catalog.catalog_whatsapp_fab_display ?? false,
          catalog_whatsapp_number: catalog.catalog_whatsapp_number || "",
          catalog_whatsapp_text: catalog.catalog_whatsapp_text || "",
        });

        // Cargar slides
        if (catalog.catalog_slides && Array.isArray(catalog.catalog_slides)) {
          const convertedSlides = catalog.catalog_slides
            .sort(
              (a: CatalogSlide, b: CatalogSlide) => a.sort_order - b.sort_order
            )
            .map((slide: CatalogSlide) => ({
              id: slide.id.toString(),
              image: slide.image || "",
              image_caption: slide.image_caption,
              title: slide.title,
              description: slide.description,
              link_url: slide.link_url,
              sort_order: slide.sort_order,
              active: slide.active ?? true,
            }));
          setSlides(convertedSlides);
        }

        // Cargar secciones con productos
        if (
          catalog.catalog_sections &&
          Array.isArray(catalog.catalog_sections)
        ) {
          const convertedSections = catalog.catalog_sections
            .sort(
              (a: CatalogSection, b: CatalogSection) =>
                a.sort_order - b.sort_order
            )
            .map((section: CatalogSection) => ({
              id: section.id,
              title: section.title,
              description: section.description,
              sort_order: section.sort_order,
              active: section.active,
              products: (section.catalog_section_products || [])
                .sort(
                  (
                    a: CatalogSectionProduct,
                    b: CatalogSectionProduct
                  ) => a.sort_order - b.sort_order
                )
                .map((csp: CatalogSectionProduct) => ({
                  id: csp.id,
                  product_id: csp.product_id,
                  sort_order: csp.sort_order,
                  active: csp.active,
                })),
            }));
          setSections(convertedSections);
        }

        // Cargar contactos
        if (
          catalog.catalog_contacts &&
          Array.isArray(catalog.catalog_contacts)
        ) {
          const convertedContacts = catalog.catalog_contacts
            .sort(
              (a: CatalogContact, b: CatalogContact) =>
                a.sort_order - b.sort_order
            )
            .map((contact: CatalogContact) => ({
              id: contact.id,
              label: contact.label,
              type: contact.type,
              value: contact.value,
              sort_order: contact.sort_order,
              active: contact.active,
            }));
          setContacts(convertedContacts);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el catálogo"
        );
      }
    };

    loadCatalog();
  }, [
    catalogId,
    form,
    setFormData,
    setSlides,
    setSections,
    setContacts,
    setError,
  ]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  // Generar slug automáticamente desde el nombre (solo en modo creación)
  useEffect(() => {
    if (!catalogId && !slugManuallyEdited && nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", generatedSlug);
    }
  }, [nameValue, slugManuallyEdited, form, catalogId]);

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    form.setValue("slug", value);
  };

  const handleSlidesChange = (newSlides: typeof slides) => {
    setSlides(newSlides);
  };

  const handleSectionsChange = (newSections: typeof sections) => {
    setSections(newSections);
  };

  const handleContactsChange = (newContacts: typeof contacts) => {
    setContacts(newContacts);
  };

  const handleCancel = () => {
    router.push(catalogId ? `/catalog/${catalogId}` : "/catalog");
  };

  const onSubmit = async (data: CatalogFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        if (catalogId) {
          formDataToSend.append("catalog_id", catalogId);
        }
        formDataToSend.append("name", data.name);
        formDataToSend.append("slug", data.slug);
        if (data.description)
          formDataToSend.append("description", data.description);
        formDataToSend.append("active", data.active.toString());
        formDataToSend.append("business_id", data.business_id);
        formDataToSend.append("catalog_whatsapp_fab_display", data.catalog_whatsapp_fab_display.toString());
        if (data.catalog_whatsapp_number)
          formDataToSend.append("catalog_whatsapp_number", data.catalog_whatsapp_number);
        if (data.catalog_whatsapp_text)
          formDataToSend.append("catalog_whatsapp_text", data.catalog_whatsapp_text);

        // Agregar slides al FormData
        if (slides.length > 0) {
          formDataToSend.append("slides", JSON.stringify(slides));
        }

        // Agregar sections al FormData
        if (sections.length > 0) {
          formDataToSend.append("sections", JSON.stringify(sections));
        }

        // Agregar contacts al FormData
        if (contacts.length > 0) {
          formDataToSend.append("contacts", JSON.stringify(contacts));
        }

        if (catalogId) {
          await updateCatalog(formDataToSend);
          toast.success("Catálogo actualizado exitosamente");
          router.push(`/catalog/${catalogId}`);
        } else {
          const result = await createCatalog(formDataToSend);
          toast.success("Catálogo creado exitosamente");
          reset();
          router.push(`/catalog/${result.id}`);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : `Error al ${catalogId ? "actualizar" : "crear"} el catálogo`
        );
        toast.error(`Error al ${catalogId ? "actualizar" : "crear"} catálogo`);
      }
    });
  };

  return {
    form,
    slides,
    sections,
    contacts,
    slugValue,
    isPending,
    error,
    handleSlugChange,
    handleSlidesChange,
    handleSectionsChange,
    handleContactsChange,
    handleCancel,
    onSubmit,
    isEditMode: !!catalogId,
  };
};
