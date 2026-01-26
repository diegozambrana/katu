"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useCatalogPublicStore } from "../stores/CatalogPublicStore";
import type { Product } from "@/types/Products";


interface ProductItemProps {
  product: Product;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const { setSelectedProduct, setOpenProductDetailModal } =
    useCatalogPublicStore();
  const primaryImage = product.product_images?.find((img) => img.is_primary);
  // const activePrices = product.product_prices?.filter((p) => p.active) || [];

  const handleViewDetails = () => {
    setSelectedProduct(product);
    setOpenProductDetailModal(true);
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square bg-muted overflow-hidden flex-shrink-0">
        {primaryImage?.image ? (
          <img
            src={primaryImage.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <span className="text-muted-foreground text-sm">Sin imagen</span>
          </div>
        )}

        {/* Sale Badge */}
        {product.is_on_sale && product.sale_label && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
            {product.sale_label}
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-1 line-clamp-2">
            {product.name}
          </h4>

          {product.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Pricing */}
          <div className="space-y-1">
            {/* Base Price */}
            {product.base_price !== null && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Precio:</span>
                <span className="font-bold">
                  {product.base_price.toFixed(2)} {product.currency || "Bs"}{" "}
                </span>
              </div>
            )}

            {/* Additional Prices */}
            {/* activePrices.map((priceItem) => (
              <div
                key={priceItem.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{priceItem.label}:</span>
                <span className="text-muted-foreground ">
                  {priceItem.price.toFixed(2)} {product.currency || "Bs"}{" "}
                </span>
              </div>
            )) */}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Button
            className="w-full"
            size="sm"
            onClick={handleViewDetails}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
