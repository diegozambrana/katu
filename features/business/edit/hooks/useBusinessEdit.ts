"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { useBusinessCreateStore } from "../../create/stores/BusinessCreateStore";
import {
  updateBusiness,
  getBusinessById,
} from "@/actions/business/BusinessActions";
import { SocialLink } from "../../create/components/BusinessSocialLinksManager";
import type { BusinessSocialLink } from "@/types/Business";
import { toast } from "sonner";

const businessSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp_phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website_url: z.string().url("URL inválida").optional().or(z.literal("")),
  active: z.boolean(),
  avatar: z.string().nullable().optional(),
  avatar_caption: z.string().optional(),
  cover: z.string().nullable().optional(),
  cover_caption: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export const useBusinessEdit = (businessId: string) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const hasLoaded = useRef(false);
  const {
    formData,
    socialLinks,
    error,
    setFormData,
    setSocialLinks,
    setSlugManuallyEdited,
    setError,
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

  // Cargar datos del business al montar
  useEffect(() => {
    if (!businessId || hasLoaded.current) return;

    const loadBusiness = async () => {
      try {
        hasLoaded.current = true;
        const business = await getBusinessById(businessId);

        // Cargar datos del formulario
        setFormData({
          name: business.name || "",
          slug: business.slug || "",
          description: business.description || "",
          phone: business.phone || "",
          whatsapp_phone: business.whatsapp_phone || "",
          email: business.email || "",
          address: business.address || "",
          city: business.city || "",
          country: business.country || "",
          website_url: business.website_url || "",
          active: business.active ?? true,
          avatar: business.avatar || null,
          avatar_caption: business.avatar_caption || "",
          cover: business.cover || null,
          cover_caption: business.cover_caption || "",
        });

        // Actualizar el formulario
        form.reset({
          name: business.name || "",
          slug: business.slug || "",
          description: business.description || "",
          phone: business.phone || "",
          whatsapp_phone: business.whatsapp_phone || "",
          email: business.email || "",
          address: business.address || "",
          city: business.city || "",
          country: business.country || "",
          website_url: business.website_url || "",
          active: business.active ?? true,
          avatar: business.avatar || null,
          avatar_caption: business.avatar_caption || "",
          cover: business.cover || null,
          cover_caption: business.cover_caption || "",
        });

        // Convertir business_social_links a SocialLink[]
        if (
          business.business_social_links &&
          Array.isArray(business.business_social_links)
        ) {
          const convertedLinks: SocialLink[] =
            business.business_social_links.map((link: BusinessSocialLink) => ({
              id: link.id, // Mantener el ID de la BD para identificar updates/deletes
              platform: link.platform,
              url: link.url,
              sort_order: link.sort_order,
              active: link.active,
            }));
          setSocialLinks(convertedLinks);
        } else {
          setSocialLinks([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el negocio"
        );
      }
    };

    loadBusiness();
  }, [businessId, form, setFormData, setSocialLinks, setError]);

  const slugValue = form.watch("slug");

  // No generar slug automáticamente en modo edición - el slug ya existe

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    form.setValue("slug", value);
  };

  const handleSocialLinksChange = (links: typeof socialLinks) => {
    setSocialLinks(links);
  };

  const handleCancel = () => {
    router.push(`/business/${businessId}`);
  };

  const onSubmit = async (data: BusinessFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("business_id", businessId);
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
        formDataToSend.append("social_links", JSON.stringify(socialLinks));

        await updateBusiness(formDataToSend);
        toast.success("Business updated successfully");
        router.push(`/business/${businessId}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al actualizar el negocio"
        );
        toast.error("Error updating business");
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
