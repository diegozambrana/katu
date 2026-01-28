"use client";

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
import type { ProductFormValues } from "../hooks/useOnboarding";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingProduct } from "../stores/OnboardingStore";

interface OnboardingProductsStepProps {
  form: UseFormReturn<ProductFormValues>;
  isSubmitting: boolean;
  products: OnboardingProduct[];
  onAddProduct: (data: ProductFormValues) => Promise<void>;
  onContinue: () => void;
}

export const OnboardingProductsStep = ({
  form,
  isSubmitting,
  products,
  onAddProduct,
  onContinue,
}: OnboardingProductsStepProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          Agrega tus primeros productos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onAddProduct)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Café Premium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio base</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-2">
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Agregar otro producto"}
              </Button>
              <Button
                type="button"
                disabled={products.length === 0 || isSubmitting}
                onClick={onContinue}
              >
                Continuar
              </Button>
            </div>
          </form>
        </Form>

        {products.length > 0 && (
          <div className="border rounded-lg p-4 bg-muted/40">
            <p className="text-sm font-medium mb-2">
              Productos agregados ({products.length}):
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
        )}
      </CardContent>
    </Card>
  );
};

