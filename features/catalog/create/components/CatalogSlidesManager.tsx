"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState, useRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export interface CatalogSlideData {
  id: string;
  image: string;
  image_caption: string | null;
  title: string | null;
  description: string | null;
  link_url: string | null;
  sort_order: number;
  active: boolean;
}

interface CatalogSlidesManagerProps {
  slides: CatalogSlideData[];
  onChange: (slides: CatalogSlideData[]) => void;
}

export const CatalogSlidesManager = ({
  slides,
  onChange,
}: CatalogSlidesManagerProps) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setUploadingIndex(0);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `catalog/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("catalog")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("catalog").getPublicUrl(fileName);

      // Agregar nueva slide
      const newSlide: CatalogSlideData = {
        id: Date.now().toString(),
        image: publicUrl,
        image_caption: null,
        title: null,
        description: null,
        link_url: null,
        sort_order: slides.length,
        active: true,
      };
      onChange([...slides, newSlide]);
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

  const removeSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    // Reordenar sort_order
    const reorderedSlides = newSlides.map((slide, i) => ({
      ...slide,
      sort_order: i,
    }));
    onChange(reorderedSlides);
  };

  const updateSlide = (
    index: number,
    field: keyof CatalogSlideData,
    value: string | boolean | null
  ) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      [field]: value,
    };
    onChange(updatedSlides);
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSlides[index], newSlides[targetIndex]] = [
      newSlides[targetIndex],
      newSlides[index],
    ];

    // Actualizar sort_order
    const reorderedSlides = newSlides.map((slide, i) => ({
      ...slide,
      sort_order: i,
    }));
    onChange(reorderedSlides);
  };

  return (
    <div className="space-y-4">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "flex flex-col gap-4 p-4 border rounded-lg",
            !slide.active && "opacity-50"
          )}
        >
          <div className="flex gap-4">
            {/* Imagen */}
            <div className="relative w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={slide.image}
                alt={slide.title || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Controles */}
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Título del slide"
                value={slide.title || ""}
                onChange={(e) => updateSlide(index, "title", e.target.value)}
              />

              <Textarea
                placeholder="Descripción (opcional)"
                value={slide.description || ""}
                onChange={(e) =>
                  updateSlide(index, "description", e.target.value)
                }
                rows={2}
              />

              <Input
                placeholder="URL del enlace (opcional)"
                value={slide.link_url || ""}
                onChange={(e) => updateSlide(index, "link_url", e.target.value)}
              />

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slide.active}
                    onCheckedChange={(checked) =>
                      updateSlide(index, "active", checked)
                    }
                  />
                  <span className="text-sm">Activo</span>
                </div>

                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveSlide(index, "down")}
                    disabled={index === slides.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSlide(index)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Agregar nueva slide */}
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
              {uploadingIndex !== null ? "Subiendo..." : "Agregar slide/banner"}
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
            Subir Slide
          </Button>
        </div>
      </div>

      {slides.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Aún no hay slides. Agrega imágenes para crear un carrusel atractivo.
        </p>
      )}
    </div>
  );
};
