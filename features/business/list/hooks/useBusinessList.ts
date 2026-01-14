import { useEffect, useRef, useState } from "react";
import { useBusinessListStore } from "../stores/BusinessListStores";
import { Business } from "@/types/Business";
import { deleteBusiness } from "@/actions";
import { toast } from "sonner";

export const useBusinessList = (initialBusinesses: any[]) => {
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
    await deleteBusiness(businessToDelete?.id as string);
    toast.success("Business deleted successfully");
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
