"use client";

import { useCatalogDetail } from "./hooks/useCatalogDetail";
import { MainContainer } from "@/components/layout/container";
import { BREADCRUMB } from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { PublicURLCard } from "@/components/PublicURL";

interface CatalogDetailProps {
  catalogId: string;
}

export const CatalogDetail = ({ catalogId }: CatalogDetailProps) => {
  const router = useRouter();
  const { catalog, loading, error } = useCatalogDetail(catalogId);

  if (!catalog) {
    return (
      <MainContainer
        title="Detalles del Catálogo"
        error={error || undefined}
        loading={loading}
        breadcrumb={BREADCRUMB.CATALOG_DETAIL}
      >
        <div></div>
      </MainContainer>
    );
  }

  const slides = catalog.catalog_slides?.sort(
    (a, b) => a.sort_order - b.sort_order
  ) || [];
  const sections = catalog.catalog_sections?.sort(
    (a, b) => a.sort_order - b.sort_order
  ) || [];

  const totalProducts = sections.reduce(
    (acc, section) => acc + (section.catalog_section_products?.length || 0),
    0
  );

  return (
    <MainContainer
      title="Detalles del Catálogo"
      breadcrumb={BREADCRUMB.CATALOG_DETAIL}
      action={
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/catalog/${catalogId}/edit`)}
            variant="default"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Catálogo
          </Button>
        </div>
      }
      loading={loading}
      error={error || undefined}
    >
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{catalog.name}</h2>
            <p className="text-muted-foreground font-mono text-sm mb-3">
              {catalog.slug}
            </p>
            <Badge variant={catalog.active ? "default" : "outline"}>
              {catalog.active ? "Activo" : "Inactivo"}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6 col-span-12">
            {/* Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Catálogo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                  <p className="font-medium">{catalog.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Descripción
                  </p>
                  <p className="text-sm">
                    {catalog.description ||
                      "No hay descripción disponible para este catálogo."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Slides */}
            {slides.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Slides ({slides.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {slides.slice(0, 4).map((slide) => (
                      <div
                        key={slide.id}
                        className="aspect-video bg-muted rounded-lg overflow-hidden"
                      >
                        <img
                          src={slide.image || ""}
                          alt={slide.title || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sections */}
            {sections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Secciones ({sections.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <div key={section.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{section.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {section.catalog_section_products?.length || 0}{" "}
                          productos
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 col-span-12 space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Slides</p>
                  <p className="text-2xl font-bold">{slides.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Secciones</p>
                  <p className="text-2xl font-bold">{sections.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Productos
                  </p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
              </CardContent>
            </Card>

            {/* Public URL */}
            <PublicURLCard
              slug={catalog.slug}
              pathPrefix="c"
              title="URL Pública"
              description="Tu página pública del catálogo:"
            />
          </div>
        </div>
      </div>
    </MainContainer>
  );
};
