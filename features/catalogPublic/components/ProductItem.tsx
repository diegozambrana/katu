"use client";

import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { ShoppingCart } from "lucide-react";

interface ProductPrice {
  id: string;
  label: string;
  price: number;
  active: boolean;
}

interface ProductImage {
  id: string;
  image: string;
  is_primary: boolean;
}

interface ProductItemProps {
  product: {
    id: string;
    name: string;
    description?: string | null;
    base_price: number | null;
    currency: string | null;
    is_on_sale?: boolean | null;
    sale_label?: string | null;
    product_images?: ProductImage[];
    product_prices?: ProductPrice[];
  };
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const primaryImage = product.product_images?.find((img) => img.is_primary);
  const activePrices = product.product_prices?.filter((p) => p.active) || [];

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
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
      <CardContent className="p-4">
        <h4 className="font-semibold text-base mb-1 line-clamp-2">
          {product.name}
        </h4>

        {product.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Pricing */}
        <div className="space-y-2">
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
          {activePrices.slice(0, 2).map((priceItem) => (
            <div
              key={priceItem.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{priceItem.label}:</span>
              <span className="font-semibold text-emerald-600">
                {priceItem.price.toFixed(2)} {product.currency || "Bs"}{" "}
              </span>
            </div>
          ))}
        </div>

        {/* Add to Cart Button */}
        {/* <Button className="w-full mt-4" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button> */}
      </CardContent>
    </Card>
  );
};
