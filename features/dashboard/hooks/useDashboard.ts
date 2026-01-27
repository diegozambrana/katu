"use client";

import { useEffect, useRef } from "react";
import { useDashboardStore } from "../stores/DashboardStore";
import { getDashboardStats } from "@/actions/dashboard/DashboardActions";
import type { DashboardStats } from "@/services/DashboardService/DashboardServices";

export const useDashboard = (initialStats: DashboardStats | null) => {
  const { stats, loading, error, setStats, setLoading, setError } =
    useDashboardStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
      hasFetched.current = true;
    } else if (!hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);
      setError(null);

      getDashboardStats()
        .then((data) => {
          setStats(data);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Error al cargar estadísticas",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStats]);

  return {
    stats,
    loading,
    error,
  };
};
