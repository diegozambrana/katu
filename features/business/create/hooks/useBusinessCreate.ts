"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTransition } from "react";
import { useBusinessCreateStore } from "../stores/BusinessCreateStore";
import { createBusiness } from "@/actions/business/BusinessActions";

const businessSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp_phone: z.string().optional(),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website_url: z
    .string()
    .url({ message: "URL inválida" })
    .optional()
    .or(z.literal("")),
  active: z.boolean(),
  avatar: z.string().nullable().optional(),
  avatar_caption: z.string().optional(),
  cover: z.string().nullable().optional(),
  cover_caption: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export const useBusinessCreate = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    formData,
    socialLinks,
    slugManuallyEdited,
    error,
    setSocialLinks,
    setSlugManuallyEdited,
    setError,
    reset,
  } = useBusinessCreateStore();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      phone: formData.phone,
      whatsapp_phone: formData.whatsapp_phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      website_url: formData.website_url,
      active: formData.active,
      avatar: formData.avatar,
      avatar_caption: formData.avatar_caption,
      cover: formData.cover,
      cover_caption: formData.cover_caption,
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

  const handleSocialLinksChange = (links: typeof socialLinks) => {
    setSocialLinks(links);
  };

  const handleCancel = () => {
    router.push("/business");
  };

  const onSubmit = async (data: BusinessFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", data.name);
        formDataToSend.append("slug", data.slug);
        if (data.description)
          formDataToSend.append("description", data.description);
        if (data.phone) formDataToSend.append("phone", data.phone);
        if (data.whatsapp_phone)
          formDataToSend.append("whatsapp_phone", data.whatsapp_phone);
        if (data.email) formDataToSend.append("email", data.email);
        if (data.address) formDataToSend.append("address", data.address);
        if (data.city) formDataToSend.append("city", data.city);
        if (data.country) formDataToSend.append("country", data.country);
        if (data.website_url)
          formDataToSend.append("website_url", data.website_url);
        formDataToSend.append("active", data.active.toString());
        if (data.avatar) formDataToSend.append("avatar", data.avatar);
        if (data.avatar_caption)
          formDataToSend.append("avatar_caption", data.avatar_caption);
        if (data.cover) formDataToSend.append("cover", data.cover);
        if (data.cover_caption)
          formDataToSend.append("cover_caption", data.cover_caption);

        // Agregar social links al FormData
        if (socialLinks.length > 0) {
          formDataToSend.append("social_links", JSON.stringify(socialLinks));
        }

        const result = await createBusiness(formDataToSend);
        reset();
        router.push(`/business/${result.id}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al crear el negocio"
        );
      }
    });
  };

  return {
    form,
    socialLinks,
    slugValue,
    isPending,
    error,
    handleSlugChange,
    handleSocialLinksChange,
    handleCancel,
    onSubmit,
  };
};
