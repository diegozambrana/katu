"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { useProductCreateStore } from "../stores/ProductCreateStore";
import {
  createProduct,
  updateProduct,
  getProductById,
} from "@/actions/product/ProductActions";
import { ProductImageData, PriceTierData } from "../components";
import type { ProductPrice, ProductImage } from "@/types/Products";
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

export const useProductCreate = (productId?: string) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const hasLoaded = useRef(false);
  const {
    formData,
    images,
    priceTiers,
    slugManuallyEdited,
    error,
    setFormData,
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

  // Cargar datos del producto si estamos en modo edición
  useEffect(() => {
    if (!productId || hasLoaded.current) return;

    const loadProduct = async () => {
      try {
        hasLoaded.current = true;
        const product = await getProductById(productId);

        // Cargar datos del formulario
        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          base_price: product.base_price?.toString() || "",
          currency: product.currency || "BOB",
          is_on_sale: product.is_on_sale ?? false,
          sale_label: product.sale_label || "",
          active: product.active ?? true,
          business_id: product.business_id || "",
        });

        // Actualizar el formulario
        form.reset({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          base_price: product.base_price?.toString() || "",
          currency: product.currency || "BOB",
          is_on_sale: product.is_on_sale ?? false,
          sale_label: product.sale_label || "",
          active: product.active ?? true,
          business_id: product.business_id || "",
        });

        // Convertir product_images a ProductImageData[]
        if (product.product_images && Array.isArray(product.product_images)) {
          const convertedImages: ProductImageData[] = product.product_images
            .sort(
              (a: ProductImage, b: ProductImage) =>
                a.display_order - b.display_order,
            )
            .map((img: ProductImage) => ({
              id: img.id,
              image: img.image,
              image_caption: img.image_caption,
              display_order: img.display_order,
              is_primary: img.is_primary,
            }));
          setImages(convertedImages);
        } else {
          setImages([]);
        }

        // Convertir product_prices a PriceTierData[]
        if (product.product_prices && Array.isArray(product.product_prices)) {
          const convertedPrices: PriceTierData[] = product.product_prices
            .sort(
              (a: ProductPrice, b: ProductPrice) => a.sort_order - b.sort_order,
            )
            .map((price: ProductPrice) => ({
              id: price.id,
              label: price.label,
              price: price.price,
              sort_order: price.sort_order,
              active: price.active,
            }));
          setPriceTiers(convertedPrices);
        } else {
          setPriceTiers([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el producto",
        );
      }
    };

    loadProduct();
  }, [productId, form, setFormData, setImages, setPriceTiers, setError]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  // Generar slug automáticamente desde el nombre (solo en modo creación)
  useEffect(() => {
    if (!productId && !slugManuallyEdited && nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", generatedSlug);
    }
  }, [productId, nameValue, slugManuallyEdited, form]);

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
    if (productId) {
      router.push(`/product/${productId}`);
    } else {
      router.push("/product");
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const formDataToSend = new FormData();

        if (productId) {
          formDataToSend.append("product_id", productId);
        }

        formDataToSend.append("name", data.name);
        formDataToSend.append("slug", data.slug);
        if (data.description)
          formDataToSend.append("description", data.description);
        if (data.base_price)
          formDataToSend.append("base_price", data.base_price);
        if (data.currency) formDataToSend.append("currency", data.currency);
        formDataToSend.append("is_on_sale", data.is_on_sale.toString());
        if (data.sale_label)
          formDataToSend.append("sale_label", data.sale_label);
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

        if (productId) {
          // Modo edición
          await updateProduct(formDataToSend);
          toast.success("Producto actualizado exitosamente");
          router.push(`/product/${productId}`);
        } else {
          // Modo creación
          const result = await createProduct(formDataToSend);
          toast.success("Producto creado exitosamente");
          reset();
          router.push(`/product/${result.id}`);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : productId
              ? "Error al actualizar el producto"
              : "Error al crear el producto",
        );
        toast.error(
          productId
            ? "Error al actualizar producto"
            : "Error al crear producto",
        );
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
