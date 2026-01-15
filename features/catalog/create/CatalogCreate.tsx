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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogCreate } from "./hooks/useCatalogCreate";
import { CatalogSlidesManager } from "./components/CatalogSlidesManager";
import { CatalogSectionsManager } from "./components/CatalogSectionsManager";
import { CatalogContactsManager } from "./components/CatalogContactsManager";

interface CatalogCreateProps {
  businesses: Array<{ id: string; name: string }>;
  products: Array<{
    id: string;
    name: string;
    base_price: number | null;
    currency: string | null;
  }>;
}

export const CatalogCreate = ({ businesses, products }: CatalogCreateProps) => {
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
  } = useCatalogCreate();

  return (
    <MainContainer title="Crear Catálogo">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Crea y organiza tus secciones de catálogo, productos y slides
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
                name="business_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Negocio <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un negocio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businesses.map((business) => (
                          <SelectItem key={business.id} value={business.id}>
                            {business.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Input placeholder="Ej: Spring Collection 2024" {...field} />
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
                      Usado en la URL del catálogo: /c/{slugValue || "{slug}"}
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

          {/* Slides Manager */}
          <Card>
            <CardHeader>
              <CardTitle>Slides Manager</CardTitle>
              <p className="text-sm text-muted-foreground">
                Agrega banners e imágenes promocionales para tu catálogo
              </p>
            </CardHeader>
            <CardContent>
              <CatalogSlidesManager
                slides={slides}
                onChange={handleSlidesChange}
              />
            </CardContent>
          </Card>

          {/* Sections & Products */}
          <Card>
            <CardHeader>
              <CardTitle>Secciones y Productos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Organiza tus productos en secciones (ej: "Ropa de Mujer",
                "Accesorios")
              </p>
            </CardHeader>
            <CardContent>
              <CatalogSectionsManager
                sections={sections}
                onChange={handleSectionsChange}
                availableProducts={products}
              />
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <p className="text-sm text-muted-foreground">
                Agrega formas para que tus clientes se comuniquen contigo
              </p>
            </CardHeader>
            <CardContent>
              <CatalogContactsManager
                contacts={contacts}
                onChange={handleContactsChange}
              />
            </CardContent>
          </Card>

          {/* Status */}
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
                        Si está inactivo, el catálogo no será visible
                        públicamente.
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

          {/* Action Buttons */}
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
              {isPending ? "Guardando..." : "Guardar Catálogo"}
            </Button>
          </div>
        </form>
      </Form>
    </MainContainer>
  );
};
