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
import { useProductList } from "./hooks/useProductList";
import type { Product } from "@/types/Products";

interface Props {
  initialProducts: Product[];
}

export const ProductList = ({ initialProducts }: Props) => {
  const router = useRouter();
  const {
    productList,
    loading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    productToDelete,
    setProductToDelete,
    handleDelete,
    handleCloseDialog,
  } = useProductList(initialProducts);

  const columns: CustomTableColumn<Product>[] = [
    {
      accessorKey: "name",
      header: "NOMBRE",
    },
    {
      accessorKey: "slug",
      header: "SLUG",
    },
    {
      accessorKey: "base_price",
      header: "PRECIO BASE",
      value: (row) => (
        <span>
          {row.base_price
            ? `${row.base_price} ${row.currency || "BOB"}`
            : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "is_on_sale",
      header: "EN OFERTA",
      value: (row) => (
        <Badge variant={row.is_on_sale ? "default" : "outline"}>
          {row.is_on_sale ? "Sí" : "No"}
        </Badge>
      ),
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

  const handleAction = (row: Product, action: TableAction) => {
    switch (action) {
      case "view":
        router.push(`/product/${row.id}`);
        break;
      case "edit":
        router.push(`/product/${row.id}/edit`);
        break;
      case "delete":
        setProductToDelete(row);
        setDeleteDialogOpen(true);
        break;
    }
  };

  return (
    <MainContainer
      title="Lista de Productos"
      action={
        <Button onClick={() => router.push("/product/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      }
      loading={loading}
    >
      <CustomTable
        data={productList}
        columns={columns}
        actions={["view", "edit", "delete"]}
        onAction={handleAction}
        searchable={true}
        searchPlaceholder="Buscar productos..."
        searchKey="name"
        pagination={true}
        pageSize={10}
        rowId="id"
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        title="Eliminar Producto"
        description={`¿Estás seguro de que quieres eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </MainContainer>
  );
};
