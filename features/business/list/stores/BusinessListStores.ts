import { Business } from "@/types/Business";
import { create } from "zustand";

interface BusinessListState {
  businessList: Business[];
  loading: boolean;
  error: string | null;
  setBusinessList: (businesses: Business[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBusinessListStore = create<BusinessListState>((set) => ({
  businessList: [],
  loading: false,
  error: null,

  setBusinessList: (businesses) => set({ businessList: businesses }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
