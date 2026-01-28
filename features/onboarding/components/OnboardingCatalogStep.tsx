"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CatalogFormValues } from "../hooks/useOnboarding";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingProduct } from "../stores/OnboardingStore";

interface OnboardingCatalogStepProps {
  form: UseFormReturn<CatalogFormValues>;
  isSubmitting: boolean;
  products: OnboardingProduct[];
  onSubmit: (data: CatalogFormValues) => Promise<void>;
}

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const OnboardingCatalogStep = ({
  form,
  isSubmitting,
  products,
  onSubmit,
}: OnboardingCatalogStepProps) => {
  const nameValue = form.watch("name");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [lastGeneratedSlug, setLastGeneratedSlug] = useState<string>("");

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) {
      const generatedSlug = generateSlug(nameValue);
      const currentSlug = form.getValues("slug");

      if (!slugManuallyEdited) {
        // Auto-update slug if it's empty or matches the last generated one
        if (!currentSlug || currentSlug === lastGeneratedSlug) {
          if (generatedSlug !== currentSlug) {
            form.setValue("slug", generatedSlug, { shouldValidate: false });
            setLastGeneratedSlug(generatedSlug);
          }
        }
      } else {
        // If slug was manually edited but now matches the generated one, reset the flag
        if (currentSlug === generatedSlug) {
          setSlugManuallyEdited(false);
          setLastGeneratedSlug(generatedSlug);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue, slugManuallyEdited]);
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Crea tu catálogo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del catálogo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Catálogo Principal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug del catálogo</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                        catalogo.cc/c/
                      </span>
                      <Input
                        className="rounded-l-none"
                        placeholder="mi-catalogo"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const generatedSlug = generateSlug(nameValue || "");
                          // Mark as manually edited if user types something different from auto-generated
                          if (e.target.value !== generatedSlug && e.target.value !== "") {
                            setSlugManuallyEdited(true);
                          } else if (e.target.value === generatedSlug) {
                            setSlugManuallyEdited(false);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border rounded-lg p-4 bg-muted/40">
              <p className="text-sm font-medium mb-2">
                Productos en este catálogo
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Por defecto, se incluirán todos tus productos en una
                sección llamada &quot;Productos&quot;.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {products.map((product) => (
                  <li key={product.id} className="flex justify-between">
                    <span>{product.name}</span>
                    {product.base_price !== null && (
                      <span className="font-medium">
                        {product.base_price} BOB
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear catálogo"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

