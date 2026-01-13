"use client";

import { TabLayoutContent } from "@/components/layout/container";
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
import { useBusinessList } from "./hooks/useBusinessList";
import type { Business } from "@/types/Business";

interface Props {
  initialBusinesses: Business[];
}

export const BusinessList = ({ initialBusinesses }: Props) => {
  const router = useRouter();
  const {
    businessList,
    loading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    businessToDelete,
    setBusinessToDelete,
    handleDelete,
    handleCloseDialog,
  } = useBusinessList(initialBusinesses);

  const columns: CustomTableColumn<Business>[] = [
    {
      accessorKey: "name",
      header: "NAME",
    },
    {
      accessorKey: "active",
      header: "ACTIVE",
      value: (row) => (
        <Badge variant={row.active ? "default" : "outline"}>
          {row.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const handleAction = (row: Business, action: TableAction) => {
    switch (action) {
      case "view":
        router.push(`/business/${row.id}`);
        break;
      case "edit":
        router.push(`/business/${row.id}/edit`);
        break;
      case "delete":
        setBusinessToDelete(row);
        setDeleteDialogOpen(true);
        break;
    }
  };

  return (
    <TabLayoutContent
      title="Business List"
      action={
        <Button onClick={() => router.push("/business/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Business
        </Button>
      }
      loading={loading}
    >
      <CustomTable
        data={businessList}
        columns={columns}
        actions={["view", "edit", "delete"]}
        onAction={handleAction}
        searchable={true}
        searchPlaceholder="Search businesses..."
        searchKey="name"
        pagination={true}
        pageSize={10}
        rowId="id"
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        title="Delete Business"
        description={`Are you sure you want to delete "${businessToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </TabLayoutContent>
  );
};
