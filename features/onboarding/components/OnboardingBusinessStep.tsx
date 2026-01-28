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
import type { BusinessFormValues } from "../hooks/useOnboarding";
import type { UseFormReturn } from "react-hook-form";

interface OnboardingBusinessStepProps {
  form: UseFormReturn<BusinessFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: BusinessFormValues) => Promise<void>;
}

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const OnboardingBusinessStep = ({
  form,
  isSubmitting,
  onSubmit,
}: OnboardingBusinessStepProps) => {
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
        <CardTitle className="text-2xl">
          Comencemos creando tu negocio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del negocio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Mi Tienda Online" {...field} />
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
                  <FormLabel>URL de tu negocio</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                        catalogo.cc/b/
                      </span>
                      <Input
                        className="rounded-l-none"
                        placeholder="mi-tienda"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Bolivia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: La Paz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Continuar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

