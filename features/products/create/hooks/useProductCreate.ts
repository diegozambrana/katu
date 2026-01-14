"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useProductCreateStore } from "../stores/ProductCreateStore";
import { createProduct } from "@/actions/product/ProductActions";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().optional(),
  base_price: z.string().optional(),
  currency: z.string().optional(),
  is_on_sale: z.boolean(),
  sale_label: z.string().optional(),
  active: z.boolean(),
  business_id: z.string().min(1, "El negocio es requerido"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const useProductCreate = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    formData,
    images,
    priceTiers,
    slugManuallyEdited,
    error,
    setImages,
    setPriceTiers,
    setSlugManuallyEdited,
    setError,
    reset,
  } = useProductCreateStore();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      base_price: formData.base_price,
      currency: formData.currency,
      is_on_sale: formData.is_on_sale,
      sale_label: formData.sale_label,
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

  const handleImagesChange = (newImages: typeof images) => {
    setImages(newImages);
  };

  const handlePriceTiersChange = (newTiers: typeof priceTiers) => {
    setPriceTiers(newTiers);
  };

  const handleCancel = () => {
    router.push("/product");
  };

  const onSubmit = async (data: ProductFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", data.name);
        formDataToSend.append("slug", data.slug);
        if (data.description)
          formDataToSend.append("description", data.description);
        if (data.base_price) formDataToSend.append("base_price", data.base_price);
        if (data.currency) formDataToSend.append("currency", data.currency);
        formDataToSend.append("is_on_sale", data.is_on_sale.toString());
        if (data.sale_label) formDataToSend.append("sale_label", data.sale_label);
        formDataToSend.append("active", data.active.toString());
        formDataToSend.append("business_id", data.business_id);

        // Agregar imágenes al FormData
        if (images.length > 0) {
          formDataToSend.append("images", JSON.stringify(images));
        }

        // Agregar price tiers al FormData
        if (priceTiers.length > 0) {
          formDataToSend.append("prices", JSON.stringify(priceTiers));
        }

        const result = await createProduct(formDataToSend);
        toast.success("Producto creado exitosamente");
        reset();
        router.push(`/product/${result.id}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al crear el producto"
        );
        toast.error("Error al crear producto");
      }
    });
  };

  return {
    form,
    images,
    priceTiers,
    slugValue,
    isPending,
    error,
    handleSlugChange,
    handleImagesChange,
    handlePriceTiersChange,
    handleCancel,
    onSubmit,
  };
};
