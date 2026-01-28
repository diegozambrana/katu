"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createBusiness,
  createCatalog,
  createProduct,
  completeOnboarding,
} from "@/actions";
import {
  useOnboardingStore,
  type OnboardingStep,
} from "../stores/OnboardingStore";

const businessSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  country: z.string().optional(),
  city: z.string().optional(),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  base_price: z
    .string()
    .min(1, "El precio es requerido")
    .refine((val) => !Number.isNaN(parseFloat(val)), {
      message: "Debe ser un número válido",
    }),
});

export type ProductFormValues = z.infer<typeof productSchema>;

const catalogSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
});

export type CatalogFormValues = z.infer<typeof catalogSchema>;

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const useOnboarding = () => {
  const router = useRouter();
  const onboardingState = useOnboardingStore();
  const {
    step,
    business,
    products,
    catalog,
    setBusiness,
    addProduct,
    setCatalog,
    setStep,
  } = onboardingState;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      slug: "",
      country: "",
      city: "",
    },
  });

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      base_price: "",
    },
  });

  const catalogForm = useForm<CatalogFormValues>({
    resolver: zodResolver(catalogSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // Auto-slug business
  const nameBusinessValue = businessForm.watch("name");
  useEffect(() => {
    const currentSlug = businessForm.getValues("slug");
    if (!currentSlug && nameBusinessValue) {
      businessForm.setValue("slug", generateSlug(nameBusinessValue));
    }
  }, [nameBusinessValue, businessForm]);

  // Auto-slug catalog
  const nameCatalogValue = catalogForm.watch("name");
  useEffect(() => {
    const currentSlug = catalogForm.getValues("slug");
    if (!currentSlug && nameCatalogValue) {
      catalogForm.setValue("slug", generateSlug(nameCatalogValue));
    }
  }, [nameCatalogValue, catalogForm]);

  const handleCreateBusiness = async (data: BusinessFormValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      if (data.country) formData.append("country", data.country);
      if (data.city) formData.append("city", data.city);
      formData.append("active", "true");

      const created = await createBusiness(formData);
      setBusiness({
        id: created.id,
        name: created.name,
        slug: created.slug,
      });
      toast.success("Negocio creado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el negocio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = async (data: ProductFormValues) => {
    if (!business) {
      toast.error("Primero debes crear un negocio");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", generateSlug(data.name));
      formData.append("base_price", data.base_price);
      formData.append("currency", "BOB");
      formData.append("business_id", business.id);
      formData.append("active", "true");
      formData.append("is_on_sale", "false");

      const created = await createProduct(formData);
      addProduct({
        id: created.id,
        name: created.name,
        base_price: created.base_price,
        slug: created.slug,
      });
      toast.success("Producto agregado");
      productForm.reset({
        name: "",
        base_price: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCatalog = async (data: CatalogFormValues) => {
    if (!business) {
      toast.error("Primero debes crear un negocio");
      return;
    }

    if (products.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("business_id", business.id);
      formData.append("active", "true");

      const sections = [
        {
          title: "Productos",
          description: null,
          sort_order: 0,
          active: true,
          products: products.map((product, index) => ({
            product_id: product.id,
            sort_order: index,
            active: true,
          })),
        },
      ];

      formData.append("sections", JSON.stringify(sections));

      const created = await createCatalog(formData);
      setCatalog({
        id: created.id,
        name: created.name,
        slug: created.slug,
      });

      // Marcar onboarding como completado
      await completeOnboarding();

      toast.success("Catálogo creado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el catálogo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      await completeOnboarding();
      toast.success("Onboarding completado");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error al completar el onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (nextStep: OnboardingStep) => {
    setStep(nextStep);
  };

  return {
    step,
    business,
    products,
    catalog,
    isSubmitting,
    businessForm,
    productForm,
    catalogForm,
    handleCreateBusiness,
    handleAddProduct,
    handleCreateCatalog,
    handleFinish,
    goToStep,
  };
};
