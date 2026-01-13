import { useEffect, useRef, useState } from "react";
import { useBusinessListStore } from "../stores/BusinessListStores";
import { Business } from "@/types/Business";

export const useBusinessList = (initialBusinesses: any[]) => {
  console.log(initialBusinesses);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(
    null
  );
  const { businessList, loading, error, setBusinessList } =
    useBusinessListStore();

  useEffect(() => {
    // Cargar los datos al montar el componente solo una vez
    if (initialBusinesses) {
      setBusinessList((initialBusinesses as Business[]) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBusinesses]);

  const handleDelete = async () => {
    // TODO: Implement delete business
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setBusinessToDelete(null);
  };

  return {
    businessList,
    loading,
    error,
    deleteDialogOpen,
    setDeleteDialogOpen,
    businessToDelete,
    setBusinessToDelete,
    handleDelete,
    handleCloseDialog,
  };
};
