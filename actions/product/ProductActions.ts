"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductServices } from "@/services";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getProducts() {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const productService = new ProductServices(supabase);
  const products = await productService.getProductsByUserId(user.id);
  return products;
}

export async function createProduct(formData: FormData) {
  await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const base_price = formData.get("base_price") as string | null;
  const currency = formData.get("currency") as string | null;
  const is_on_sale = formData.get("is_on_sale") === "true";
  const sale_label = formData.get("sale_label") as string | null;
  const active = formData.get("active") === "true";
  const business_id = formData.get("business_id") as string;

  const productData: any = {
    name,
    slug,
    user_id: user.id,
    business_id,
    active,
    is_on_sale,
  };

  if (description) productData.description = description;
  if (base_price) productData.base_price = parseFloat(base_price);
  if (currency) productData.currency = currency;
  if (sale_label) productData.sale_label = sale_label;

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (productError) throw productError;

  // Crear product_images si existen
  const imagesJson = formData.get("images") as string | null;
  if (imagesJson && product) {
    try {
      const images = JSON.parse(imagesJson);

      if (Array.isArray(images) && images.length > 0) {
        const imagesData = images
          .filter((img: any) => img.image && img.image.trim() !== "")
          .map((img: any) => ({
            product_id: product.id,
            image: img.image,
            image_caption: img.image_caption || null,
            display_order: img.display_order || 0,
            is_primary: img.is_primary || false,
          }));

        if (imagesData.length > 0) {
          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imagesData);

          if (imagesError) throw imagesError;
        }
      }
    } catch (parseError) {
      console.error("Error parsing images:", parseError);
    }
  }

  // Crear product_prices si existen
  const pricesJson = formData.get("prices") as string | null;
  if (pricesJson && product) {
    try {
      const prices = JSON.parse(pricesJson);

      if (Array.isArray(prices) && prices.length > 0) {
        const pricesData = prices
          .filter((price: any) => price.label && price.price)
          .map((price: any) => ({
            product_id: product.id,
            label: price.label,
            price: parseFloat(price.price),
            sort_order: price.sort_order || 0,
            active: price.active !== false,
          }));

        if (pricesData.length > 0) {
          const { error: pricesError } = await supabase
            .from("product_prices")
            .insert(pricesData);

          if (pricesError) throw pricesError;
        }
      }
    } catch (parseError) {
      console.error("Error parsing prices:", parseError);
    }
  }

  revalidatePath("/product");
  return product;
}

export async function getProductById(productId: string) {
  await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("No autenticado");
  }

  const productService = new ProductServices(supabase);
  const product = await productService.getProductById(productId, user.id);
  return product;
}

export async function updateProduct(formData: FormData) {
  await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const productId = formData.get("product_id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string | null;
  const base_price = formData.get("base_price") as string | null;
  const currency = formData.get("currency") as string | null;
  const is_on_sale = formData.get("is_on_sale") === "true";
  const sale_label = formData.get("sale_label") as string | null;
  const active = formData.get("active") === "true";

  // Verificar que el producto pertenece al usuario
  const productService = new ProductServices(supabase);
  const existingProduct = await productService.getProductById(
    productId,
    user.id
  );

  if (!existingProduct) {
    throw new Error("Producto no encontrado o no autorizado");
  }

  // Actualizar el producto
  const productData: any = {
    name,
    slug,
    active,
    is_on_sale,
    updated_at: new Date().toISOString(),
  };

  if (description !== null) productData.description = description;
  if (base_price !== null) productData.base_price = parseFloat(base_price);
  if (currency !== null) productData.currency = currency;
  if (sale_label !== null) productData.sale_label = sale_label;

  const { data: product, error: productError } = await supabase
    .from("products")
    .update(productData)
    .eq("id", productId)
    .select()
    .single();

  if (productError) throw productError;

  // Manejar product_images
  const imagesJson = formData.get("images") as string | null;
  if (imagesJson) {
    try {
      const newImages = JSON.parse(imagesJson) as Array<{
        id: string;
        image: string;
        image_caption: string | null;
        display_order: number;
        is_primary: boolean;
      }>;

      // Obtener las imágenes actuales de la BD
      const { data: existingImages, error: imagesError } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId);

      if (imagesError) throw imagesError;

      const existingImagesMap = new Map(
        (existingImages || []).map((img) => [img.id, img])
      );
      const newImagesMap = new Map(
        newImages
          .filter((img) => img.image && img.image.trim() !== "")
          .map((img) => [img.id, img])
      );

      // Identificar imágenes a eliminar
      const imagesToDelete = (existingImages || []).filter(
        (img) => !newImagesMap.has(img.id)
      );

      // Identificar imágenes nuevas
      const imagesToInsert = newImages.filter(
        (img) =>
          img.image &&
          img.image.trim() !== "" &&
          !existingImagesMap.has(img.id)
      );

      // Identificar imágenes a actualizar
      const imagesToUpdate = newImages.filter(
        (img) =>
          img.image &&
          img.image.trim() !== "" &&
          existingImagesMap.has(img.id)
      );

      // Eliminar imágenes
      if (imagesToDelete.length > 0) {
        const idsToDelete = imagesToDelete.map((img) => img.id);
        const { error: deleteError } = await supabase
          .from("product_images")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      // Insertar nuevas imágenes
      if (imagesToInsert.length > 0) {
        const imagesToInsertData = imagesToInsert.map((img) => ({
          product_id: productId,
          image: img.image,
          image_caption: img.image_caption || null,
          display_order: img.display_order || 0,
          is_primary: img.is_primary || false,
        }));

        const { error: insertError } = await supabase
          .from("product_images")
          .insert(imagesToInsertData);

        if (insertError) throw insertError;
      }

      // Actualizar imágenes existentes
      for (const img of imagesToUpdate) {
        const { error: updateError } = await supabase
          .from("product_images")
          .update({
            image: img.image,
            image_caption: img.image_caption || null,
            display_order: img.display_order || 0,
            is_primary: img.is_primary || false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", img.id);

        if (updateError) throw updateError;
      }
    } catch (parseError) {
      console.error("Error parsing images:", parseError);
      throw new Error("Error al procesar las imágenes");
    }
  }

  // Manejar product_prices
  const pricesJson = formData.get("prices") as string | null;
  if (pricesJson) {
    try {
      const newPrices = JSON.parse(pricesJson) as Array<{
        id: string;
        label: string;
        price: number;
        sort_order: number;
        active: boolean;
      }>;

      // Obtener los precios actuales de la BD
      const { data: existingPrices, error: pricesError } = await supabase
        .from("product_prices")
        .select("*")
        .eq("product_id", productId);

      if (pricesError) throw pricesError;

      const existingPricesMap = new Map(
        (existingPrices || []).map((price) => [price.id, price])
      );
      const newPricesMap = new Map(
        newPrices
          .filter((price) => price.label && price.price)
          .map((price) => [price.id, price])
      );

      // Identificar precios a eliminar
      const pricesToDelete = (existingPrices || []).filter(
        (price) => !newPricesMap.has(price.id)
      );

      // Identificar precios nuevos
      const pricesToInsert = newPrices.filter(
        (price) =>
          price.label &&
          price.price &&
          !existingPricesMap.has(price.id)
      );

      // Identificar precios a actualizar
      const pricesToUpdate = newPrices.filter(
        (price) =>
          price.label &&
          price.price &&
          existingPricesMap.has(price.id)
      );

      // Eliminar precios
      if (pricesToDelete.length > 0) {
        const idsToDelete = pricesToDelete.map((price) => price.id);
        const { error: deleteError } = await supabase
          .from("product_prices")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      // Insertar nuevos precios
      if (pricesToInsert.length > 0) {
        const pricesToInsertData = pricesToInsert.map((price) => ({
          product_id: productId,
          label: price.label,
          price: parseFloat(price.price.toString()),
          sort_order: price.sort_order || 0,
          active: price.active !== false,
        }));

        const { error: insertError } = await supabase
          .from("product_prices")
          .insert(pricesToInsertData);

        if (insertError) throw insertError;
      }

      // Actualizar precios existentes
      for (const price of pricesToUpdate) {
        const { error: updateError } = await supabase
          .from("product_prices")
          .update({
            label: price.label,
            price: parseFloat(price.price.toString()),
            sort_order: price.sort_order || 0,
            active: price.active !== false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", price.id);

        if (updateError) throw updateError;
      }
    } catch (parseError) {
      console.error("Error parsing prices:", parseError);
      throw new Error("Error al procesar los precios");
    }
  }

  revalidatePath("/product");
  revalidatePath(`/product/${productId}`);
  return product;
}

export async function deleteProduct(productId: string) {
  await cookies();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  if (error) throw error;
  revalidatePath("/product");
  return data;
}
