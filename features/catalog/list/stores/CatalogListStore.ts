import { Catalog } from "@/types/Catalog";
import { create } from "zustand";

interface CatalogListState {
  catalogList: Catalog[];
  loading: boolean;
  error: string | null;
  setCatalogList: (catalogs: Catalog[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCatalogListStore = create<CatalogListState>((set) => ({
  catalogList: [],
  loading: false,
  error: null,

  setCatalogList: (catalogs) => set({ catalogList: catalogs }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
