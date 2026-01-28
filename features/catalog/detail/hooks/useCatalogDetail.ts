"use client";

import { useEffect, useRef } from "react";
import { useCatalogDetailStore } from "../stores/CatalogDetailStore";
import { getCatalogById } from "@/actions/catalog/CatalogActions";

export const useCatalogDetail = (catalogId: string) => {
  const { catalog, loading, error, setCatalog, setLoading, setError, reset } =
    useCatalogDetailStore();
  const hasFetched = useRef(false);
  const currentCatalogId = useRef<string | null>(null);

  useEffect(() => {
    if (!catalogId) return;

    if (currentCatalogId.current !== catalogId) {
      hasFetched.current = false;
      currentCatalogId.current = catalogId;
    }

    const fetchCatalog = async () => {
      if (!hasFetched.current) {
        hasFetched.current = true;
        setLoading(true);
        setError(null);
        try {
          const data = await getCatalogById(catalogId);
          setCatalog(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el catálogo",
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogId]);

  useEffect(() => {
    return () => {
      reset();
      hasFetched.current = false;
    };
  }, []);

  return {
    catalog,
    loading,
    error,
  };
};
