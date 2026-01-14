"use client";
import { useEffect, useState } from "react";
import { useProductListStore } from "../stores/ProductListStore";
import { Product } from "@/types/Products";
import { deleteProduct } from "@/actions/product/ProductActions";
import { toast } from "sonner";

export const useProductList = (initialProducts: any[]) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { productList, loading, error, setProductList } = useProductListStore();

  useEffect(() => {
    // Cargar los datos al montar el componente solo una vez
    if (initialProducts) {
      setProductList((initialProducts as Product[]) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts]);

  const handleDelete = async () => {
    await deleteProduct(productToDelete?.id as string);
    toast.success("Producto eliminado exitosamente");
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return {
    productList,
    loading,
    error,
    deleteDialogOpen,
    setDeleteDialogOpen,
    productToDelete,
    setProductToDelete,
    handleDelete,
    handleCloseDialog,
  };
};
