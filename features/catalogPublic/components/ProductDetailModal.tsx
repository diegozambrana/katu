"use client";

import { Modal } from "@/components/Dialog/Modal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/types/Products";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailModal = ({
  product,
  open,
  onOpenChange,
}: ProductDetailModalProps) => {
  if (!product) return null;

  const images = product.product_images
    ?.sort((a, b) => a.display_order - b.display_order) || [];
  const activePrices = product.product_prices?.filter((p) => p.active) || [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={product.name}
    // description={product.description || undefined}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Product Images */}
        {images.length > 0 ? (
          <div className="w-full">
            {images.length > 1 ? (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {images.map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={image.image}
                          alt={image.image_caption || product.name}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                        {image.image_caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs sm:text-sm">
                            {image.image_caption}
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={images[0].image}
                  alt={images[0].image_caption || product.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
                {images[0].image_caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs sm:text-sm">
                    {images[0].image_caption}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Sin imagen</span>
          </div>
        )}

        {/* Sale Badge */}
        {product.is_on_sale && product.sale_label && (
          <div className="flex justify-center">
            <Badge className="bg-red-500 hover:bg-red-600">
              {product.sale_label}
            </Badge>
          </div>
        )}

        <Separator />

        {/* Product Description */}
        {product.description && (
          <div>
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        )}

        {/* Pricing */}
        <div>
          <h3 className="font-semibold mb-3">Precios</h3>
          <div className="space-y-1">
            {/* Base Price */}
            {product.base_price !== null && (
              <div className="flex items-center justify-between ">
                <span className="text-muted-foreground">Precio Base</span>
                <span className="text-lg font-bold">
                  {product.base_price.toFixed(2)} {product.currency || "Bs"}
                </span>
              </div>
            )}

            {/* Additional Prices */}
            {activePrices
              .toSorted((a, b) => a.sort_order - b.sort_order)
              .map((priceItem) => (
                <div
                  key={priceItem.id}
                  className="flex items-center justify-between "
                >
                  <span className="text-muted-foreground">{priceItem.label}</span>
                  <span className="text-muted-foreground">
                    {priceItem.price.toFixed(2)} {product.currency || "Bs"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
