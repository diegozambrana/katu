import { create } from "zustand";
import type { Product } from "@/types/Products";

interface ProductDetailState {
  product: Product | null;
  loading: boolean;
  error: string | null;
  setProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductDetailStore = create<ProductDetailState>((set) => ({
  product: null,
  loading: false,
  error: null,

  setProduct: (product) => set({ product }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
