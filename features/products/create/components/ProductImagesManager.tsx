"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Upload, X, ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState, useRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export interface ProductImageData {
  id: string;
  image: string;
  image_caption: string | null;
  display_order: number;
  is_primary: boolean;
}

interface ProductImagesManagerProps {
  images: ProductImageData[];
  onChange: (images: ProductImageData[]) => void;
}

export const ProductImagesManager = ({
  images,
  onChange,
}: ProductImagesManagerProps) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File, index?: number) => {
    if (index !== undefined) {
      setUploadingIndex(index);
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `products/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      if (index !== undefined && images[index]) {
        // Actualizar imagen existente
        const updatedImages = [...images];
        updatedImages[index] = {
          ...updatedImages[index],
          image: publicUrl,
        };
        onChange(updatedImages);
      } else {
        // Agregar nueva imagen
        const newImage: ProductImageData = {
          id: Date.now().toString(),
          image: publicUrl,
          image_caption: null,
          display_order: images.length,
          is_primary: images.length === 0, // Primera imagen es primaria por defecto
        };
        onChange([...images, newImage]);
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reordenar display_order
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      display_order: i,
    }));
    onChange(reorderedImages);
  };

  const updateCaption = (index: number, caption: string) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      image_caption: caption,
    };
    onChange(updatedImages);
  };

  const togglePrimary = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(updatedImages);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];

    // Actualizar display_order
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      display_order: i,
    }));
    onChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            "flex flex-col gap-4 p-4 border rounded-lg",
            image.is_primary && "border-primary"
          )}
        >
          <div className="flex gap-4">
            {/* Imagen */}
            <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={image.image}
                alt={image.image_caption || `Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Primaria
                </div>
              )}
            </div>

            {/* Controles */}
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Descripción de la imagen (opcional)"
                value={image.image_caption || ""}
                onChange={(e) => updateCaption(index, e.target.value)}
              />

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={image.is_primary}
                    onCheckedChange={() => togglePrimary(index)}
                  />
                  <span className="text-sm">Primaria</span>
                </div>

                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Agregar nueva imagen */}
      <div className="border-2 border-dashed rounded-lg p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {uploadingIndex !== null
                ? "Subiendo..."
                : "Agregar imagen del producto"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, hasta 5MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingIndex !== null}
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir Imagen
          </Button>
        </div>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Aún no hay imágenes. Agrega al menos una imagen para tu producto.
        </p>
      )}
    </div>
  );
};
