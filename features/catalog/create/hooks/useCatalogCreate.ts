"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useCatalogCreateStore } from "../stores/CatalogCreateStore";
import { createCatalog } from "@/actions/catalog/CatalogActions";
import { toast } from "sonner";

const catalogSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().optional(),
  active: z.boolean(),
  business_id: z.string().min(1, "El negocio es requerido"),
});

type CatalogFormValues = z.infer<typeof catalogSchema>;

export const useCatalogCreate = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    formData,
    slides,
    sections,
    contacts,
    slugManuallyEdited,
    error,
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
    },
  });

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  // Generar slug automáticamente desde el nombre
  useEffect(() => {
    if (!slugManuallyEdited && nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", generatedSlug);
    }
  }, [nameValue, slugManuallyEdited, form]);

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
    router.push("/catalog");
  };

  const onSubmit = async (data: CatalogFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", data.name);
        formDataToSend.append("slug", data.slug);
        if (data.description)
          formDataToSend.append("description", data.description);
        formDataToSend.append("active", data.active.toString());
        formDataToSend.append("business_id", data.business_id);

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

        const result = await createCatalog(formDataToSend);
        toast.success("Catálogo creado exitosamente");
        reset();
        router.push(`/catalog/${result.id}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al crear el catálogo"
        );
        toast.error("Error al crear catálogo");
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
  };
};
