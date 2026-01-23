"use client";

import { useState, useTransition } from "react";
import { MainContainer } from "@/components/layout/container";
import {
  CustomTable,
  type CustomTableColumn,
} from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Dialog/Modal";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { SupportMessage, SupportMessageStatus } from "@/types/Support";
import { updateSupportMessageStatus } from "@/actions/support/SupportActions";

// Date formatting helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Status badge helper
const getStatusBadge = (status: SupportMessageStatus) => {
  const variants: Record<SupportMessageStatus, "default" | "secondary" | "outline"> = {
    PENDING: "outline",
    SOLVED: "default",
    CLOSED: "secondary",
  };

  const labels: Record<SupportMessageStatus, string> = {
    PENDING: "Pendiente",
    SOLVED: "Resuelto",
    CLOSED: "Cerrado",
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

interface Props {
  initialMessages: SupportMessage[];
}

export const SupportMessages = ({ initialMessages }: Props) => {
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages);

  const handleViewMessage = (message: SupportMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const updateMessageInState = (updatedMessage: SupportMessage) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
    );
    setSelectedMessage(updatedMessage);
  };

  const handleUpdateStatus = async (status: SupportMessageStatus) => {
    if (!selectedMessage) return;

    startTransition(async () => {
      try {
        const updatedMessage = await updateSupportMessageStatus(
          selectedMessage.id,
          status
        );
        updateMessageInState(updatedMessage);
        toast.success(`Estado actualizado a ${status === "SOLVED" ? "Resuelto" : "Cerrado"}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al actualizar el estado";
        toast.error(errorMessage);
      }
    });
  };


  // Column value renderers
  const renderDate = (row: SupportMessage) => formatDate(row.created_at);
  const renderMessage = (row: SupportMessage) => (
    <div className="max-w-md truncate" title={row.message}>
      {row.message}
    </div>
  );
  const renderUserEmail = (row: SupportMessage) => row.user_email || "N/A";
  const renderStatus = (row: SupportMessage) => getStatusBadge(row.status);

  const columns: CustomTableColumn<SupportMessage>[] = [
    {
      accessorKey: "created_at",
      header: "FECHA",
      value: renderDate,
    },
    {
      accessorKey: "subject",
      header: "ASUNTO",
    },
    {
      accessorKey: "message",
      header: "MENSAJE",
      value: renderMessage,
    },
    {
      accessorKey: "user_email",
      header: "USUARIO",
      value: renderUserEmail,
    },
    {
      accessorKey: "status",
      header: "ESTADO",
      value: renderStatus,
    },
  ];

  return (
    <>
      <MainContainer title="Mensajes de Soporte" loading={isPending}>
        <CustomTable
          data={messages}
          columns={columns}
          actions={["view"]}
          onAction={(row) => handleViewMessage(row)}
          searchable={true}
          searchPlaceholder="Buscar mensajes..."
          searchKey="subject"
          pagination={true}
          pageSize={10}
          rowId="id"
        />
      </MainContainer>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedMessage?.subject || "Detalles del Mensaje"}
        description={`Mensaje enviado el ${selectedMessage ? formatDate(selectedMessage.created_at) : ""}`}
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Estado
              </h3>
              {getStatusBadge(selectedMessage.status)}
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Usuario
              </h3>
              <p className="text-sm">
                {selectedMessage.user_email || "N/A"}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Asunto
              </h3>
              <p className="text-sm">{selectedMessage.subject}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Mensaje
              </h3>
              <p className="text-sm whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Fechas
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Creado:</span>{" "}
                  {formatDate(selectedMessage.created_at)}
                </p>
                <p>
                  <span className="font-medium">Actualizado:</span>{" "}
                  {formatDate(selectedMessage.updated_at)}
                </p>
              </div>
            </div>

            <Separator />

            {selectedMessage.status !== "SOLVED" &&
              selectedMessage.status !== "CLOSED" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="default"
                    onClick={() => handleUpdateStatus("SOLVED")}
                    disabled={isPending}
                    className="flex-1"
                  >
                    Marcar como Resuelto
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateStatus("CLOSED")}
                    disabled={isPending}
                    className="flex-1"
                  >
                    Cerrar
                  </Button>
                </div>
              )}

            {selectedMessage.status === "SOLVED" && (
              <div className="pt-4">
                <Button
                  variant="secondary"
                  onClick={() => handleUpdateStatus("CLOSED")}
                  disabled={isPending}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
