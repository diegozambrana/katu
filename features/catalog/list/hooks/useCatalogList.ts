"use client";

import { useEffect, useState } from "react";
import { useCatalogListStore } from "../stores/CatalogListStore";
import { Catalog } from "@/types/Catalog";
import { deleteCatalog } from "@/actions/catalog/CatalogActions";
import { toast } from "sonner";

export const useCatalogList = (initialCatalogs: any[]) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState<Catalog | null>(null);
  const { catalogList, loading, error, setCatalogList } = useCatalogListStore();

  useEffect(() => {
    if (initialCatalogs) {
      setCatalogList((initialCatalogs as Catalog[]) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCatalogs]);

  const handleDelete = async () => {
    await deleteCatalog(catalogToDelete?.id as string);
    toast.success("Catálogo eliminado exitosamente");
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setCatalogToDelete(null);
  };

  return {
    catalogList,
    loading,
    error,
    deleteDialogOpen,
    setDeleteDialogOpen,
    catalogToDelete,
    setCatalogToDelete,
    handleDelete,
    handleCloseDialog,
  };
};
