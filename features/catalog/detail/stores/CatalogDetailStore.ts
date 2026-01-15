import { create } from "zustand";
import type { Catalog } from "@/types/Catalog";

interface CatalogDetailState {
  catalog: Catalog | null;
  loading: boolean;
  error: string | null;
  setCatalog: (catalog: Catalog | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCatalogDetailStore = create<CatalogDetailState>((set) => ({
  catalog: null,
  loading: false,
  error: null,

  setCatalog: (catalog) => set({ catalog }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
