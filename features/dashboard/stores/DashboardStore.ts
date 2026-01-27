import { create } from "zustand";
import type { DashboardStats } from "@/services/DashboardService/DashboardServices";

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  setStats: (stats: DashboardStats | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,
  error: null,

  setStats: (stats) => set({ stats }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
