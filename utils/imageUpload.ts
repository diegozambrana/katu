import { createClient } from "@/utils/supabase/client";

export interface UploadImageOptions {
  file: File;
  folder: string;
  bucket: string;
  maxSizeMB?: number;
}

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImageToSupabase = async ({
  file,
  folder,
  bucket,
  maxSizeMB = 5,
}: UploadImageOptions): Promise<UploadImageResult> => {
  // Validar archivo
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      success: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`,
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      error: "El archivo debe ser una imagen",
    };
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Usuario no autenticado",
      };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message || "Error al subir la imagen",
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al subir la imagen",
    };
  }
};
