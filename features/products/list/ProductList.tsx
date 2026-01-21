"use client";

import { MainContainer } from "@/components/layout/container";
import {
  CustomTable,
  type CustomTableColumn,
  type TableAction,
} from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus } from "lucide-react";
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
      accessorKey: "image",
      header: "IMAGEN",
      value: (row) => row.product_images?.[0]?.image ?(
        <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={row.product_images?.[0]?.image}
          alt={row.product_images?.[0]?.image_caption || row.name}
          className="w-full h-full object-cover"
        />
      </div>
      ) : <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
        <ImageIcon className="w-4 h-4 text-gray-500" />
      </div>
    },
    {
      accessorKey: "name",
      header: "NOMBRE",
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
