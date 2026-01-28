"use client";
import { useEffect, useRef } from "react";
import { useProductDetailStore } from "../stores/ProductDetailStore";
import { getProductById } from "@/actions/product/ProductActions";

export const useProductDetail = (productId: string) => {
  const { product, loading, error, setProduct, setLoading, setError } =
    useProductDetailStore();
  const hasFetched = useRef(false);
  const currentProductId = useRef<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    // Reset if productId changes
    if (currentProductId.current !== productId) {
      hasFetched.current = false;
      currentProductId.current = productId;
    }

    const fetchProduct = async () => {
      if (!hasFetched.current) {
        hasFetched.current = true;
        setLoading(true);
        setError(null);
        try {
          const data = await getProductById(productId);
          setProduct(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el producto",
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    hasFetched.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return {
    product,
    loading,
    error,
  };
};
