import { create } from "zustand";
import type { Business } from "@/types/Business";

interface BusinessDetailState {
  business: Business | null;
  loading: boolean;
  error: string | null;
  setBusiness: (business: Business | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBusinessDetailStore = create<BusinessDetailState>((set) => ({
  business: null,
  loading: false,
  error: null,

  setBusiness: (business) => set({ business }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
