"use client";

import { useProductDetail } from "./hooks/useProductDetail";
import { MainContainer } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Copy, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductDetailProps {
  productId: string;
}

export const ProductDetail = ({ productId }: ProductDetailProps) => {
  const router = useRouter();
  const { product, loading, error } = useProductDetail(productId);

  if (!product) {
    return (
      <MainContainer
        title="Detalles del Producto"
        error={error || undefined}
        loading={loading}
      >
        <div></div>
      </MainContainer>
    );
  }

  // Datos mock para estadísticas
  const mockData = {
    views: 523,
    orders: 12,
    lastUpdated: new Date(product.updated_at).toLocaleDateString(),
  };

  // Obtener imagen primaria o la primera imagen
  const primaryImage =
    product.product_images?.find((img) => img.is_primary) ||
    product.product_images?.[0];

  // Obtener imágenes de galería (excluir la primaria)
  const galleryImages =
    product.product_images?.filter((img) => !img.is_primary) || [];

  // Ordenar precios por sort_order
  const sortedPrices = product.product_prices
    ? [...product.product_prices]
        .filter((price) => price.active)
        .sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const publicUrl = `catalogo.app/p/${product.slug}`;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
  };

  return (
    <MainContainer
      title="Detalles del Producto"
      action={
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/product/${productId}/edit`)}
            variant="default"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Producto
          </Button>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
        </div>
      }
      loading={loading}
      error={error || undefined}
    >
      <div className="space-y-6">
        {/* Product Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {primaryImage && (
                <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={primaryImage.image}
                    alt={primaryImage.image_caption || product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-muted-foreground font-mono text-sm mb-3">
                  {product.slug}
                </p>
                <div className="flex gap-2">
                  <Badge variant={product.active ? "default" : "outline"}>
                    {product.active ? "Activo" : "Inactivo"}
                  </Badge>
                  {product.is_on_sale && (
                    <Badge variant="default" className="bg-orange-500">
                      {product.sale_label || "En Oferta"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - 8/12 */}
          <div className="lg:col-span-8 space-y-6 col-span-12">
            {/* Product Images Gallery */}
            {galleryImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Galería de Imágenes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {galleryImages.map((image) => (
                      <div
                        key={image.id}
                        className="aspect-square bg-muted rounded-lg overflow-hidden"
                      >
                        <img
                          src={image.image}
                          alt={image.image_caption || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Producto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Slug URL</p>
                  <p className="font-mono text-sm">{product.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Descripción
                  </p>
                  <p className="text-sm">
                    {product.description ||
                      "No hay descripción disponible para este producto."}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Precio Base
                  </p>
                  <p className="text-2xl font-bold">
                    {product.base_price
                      ? `${product.base_price} ${product.currency || "BOB"}`
                      : "No especificado"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Tiers */}
            {sortedPrices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Niveles de Precio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sortedPrices.map((price) => (
                      <div
                        key={price.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{price.label}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {price.price} {product.currency || "BOB"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - 4/12 */}
          <div className="lg:col-span-4 col-span-12 space-y-6">
            {/* Product Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vistas</p>
                  <p className="text-2xl font-bold">{mockData.views}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pedidos</p>
                  <p className="text-2xl font-bold">{mockData.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Última Actualización
                  </p>
                  <p className="font-medium">{mockData.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estado</p>
                  <Badge variant={product.active ? "default" : "outline"}>
                    {product.active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Public URL */}
            <Card>
              <CardHeader>
                <CardTitle>URL Pública</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tu página pública del producto:
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="text-sm flex-1 overflow-hidden text-ellipsis">
                    {publicUrl}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visitar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/product/${productId}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Producto
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    // Toggle active status logic here
                  }}
                >
                  {product.active ? "Desactivar" : "Activar"} Producto
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};
