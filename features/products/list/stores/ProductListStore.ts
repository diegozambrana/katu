import { Product } from "@/types/Products";
import { create } from "zustand";

interface ProductListState {
  productList: Product[];
  loading: boolean;
  error: string | null;
  setProductList: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductListStore = create<ProductListState>((set) => ({
  productList: [],
  loading: false,
  error: null,

  setProductList: (products) => set({ productList: products }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
