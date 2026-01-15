"use client";

import { MainContainer } from "@/components/layout/container";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCatalogEdit } from "./hooks/useCatalogEdit";
import { CatalogSlidesManager } from "../create/components/CatalogSlidesManager";
import { CatalogSectionsManager } from "../create/components/CatalogSectionsManager";
import { CatalogContactsManager } from "../create/components/CatalogContactsManager";

interface CatalogEditProps {
  catalogId: string;
  products: Array<{
    id: string;
    name: string;
    base_price: number | null;
    currency: string | null;
  }>;
}

export const CatalogEdit = ({ catalogId, products }: CatalogEditProps) => {
  const {
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
  } = useCatalogEdit(catalogId);

  return (
    <MainContainer title="Editar Catálogo">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Actualiza tu catálogo, secciones y productos
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Catalog Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Catálogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre del Catálogo{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del catálogo" {...field} />
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
                    <FormLabel>
                      Slug <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="catalog-slug"
                        {...field}
                        onChange={(e) => {
                          handleSlugChange(e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Usado en la URL: /c/{slugValue || "{slug}"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu catálogo..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Slides Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <CatalogSlidesManager
                slides={slides}
                onChange={handleSlidesChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secciones y Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <CatalogSectionsManager
                sections={sections}
                onChange={handleSectionsChange}
                availableProducts={products}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <CatalogContactsManager
                contacts={contacts}
                onChange={handleContactsChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Activo</FormLabel>
                      <FormDescription>
                        Si está inactivo, el catálogo no será visible.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Form>
    </MainContainer>
  );
};
