"use client";

import { MainContainer } from "@/components/layout/container";
import {
  CustomTable,
  type CustomTableColumn,
  type TableAction,
} from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/Dialog";
import { useCatalogList } from "./hooks/useCatalogList";
import type { Catalog } from "@/types/Catalog";

interface Props {
  initialCatalogs: Catalog[];
}

export const CatalogList = ({ initialCatalogs }: Props) => {
  const router = useRouter();
  const {
    catalogList,
    loading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    catalogToDelete,
    setCatalogToDelete,
    handleDelete,
    handleCloseDialog,
  } = useCatalogList(initialCatalogs);

  const columns: CustomTableColumn<Catalog>[] = [
    {
      accessorKey: "name",
      header: "NOMBRE",
    },
    {
      accessorKey: "slug",
      header: "SLUG",
    },
    {
      accessorKey: "active",
      header: "ACTIVO",
      value: (row) => (
        <Badge variant={row.active ? "default" : "outline"}>
          {row.active ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
  ];

  const handleAction = (row: Catalog, action: TableAction) => {
    switch (action) {
      case "view":
        router.push(`/catalog/${row.id}`);
        break;
      case "edit":
        router.push(`/catalog/${row.id}/edit`);
        break;
      case "delete":
        setCatalogToDelete(row);
        setDeleteDialogOpen(true);
        break;
    }
  };

  return (
    <MainContainer
      title="Lista de Catálogos"
      action={
        <Button onClick={() => router.push("/catalog/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Catálogo
        </Button>
      }
      loading={loading}
    >
      <CustomTable
        data={catalogList}
        columns={columns}
        actions={["view", "edit", "delete"]}
        onAction={handleAction}
        searchable={true}
        searchPlaceholder="Buscar catálogos..."
        searchKey="name"
        pagination={true}
        pageSize={10}
        rowId="id"
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        title="Eliminar Catálogo"
        description={`¿Estás seguro de que quieres eliminar "${catalogToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </MainContainer>
  );
};
