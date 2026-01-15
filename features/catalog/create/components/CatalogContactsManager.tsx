"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export interface CatalogContactData {
  id: string;
  label: string;
  type: string;
  value: string;
  sort_order: number;
  active: boolean;
}

interface CatalogContactsManagerProps {
  contacts: CatalogContactData[];
  onChange: (contacts: CatalogContactData[]) => void;
}

const CONTACT_TYPES = [
  { value: "phone", label: "Teléfono" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Sitio Web" },
  { value: "address", label: "Dirección" },
  { value: "other", label: "Otro" },
];

export const CatalogContactsManager = ({
  contacts,
  onChange,
}: CatalogContactsManagerProps) => {
  const addContact = () => {
    const newContact: CatalogContactData = {
      id: Date.now().toString(),
      label: "",
      type: "phone",
      value: "",
      sort_order: contacts.length,
      active: true,
    };
    onChange([...contacts, newContact]);
  };

  const removeContact = (id: string) => {
    onChange(contacts.filter((contact) => contact.id !== id));
  };

  const updateContact = (
    id: string,
    field: keyof CatalogContactData,
    value: string | number | boolean
  ) => {
    onChange(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 border rounded-lg"
        >
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <Input
              placeholder="Etiqueta (ej: Ventas)"
              value={contact.label}
              onChange={(e) => updateContact(contact.id, "label", e.target.value)}
            />

            <Select
              value={contact.type}
              onValueChange={(value) => updateContact(contact.id, "type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Valor (ej: +591 123456)"
              value={contact.value}
              onChange={(e) => updateContact(contact.id, "value", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <div className="flex items-center gap-2">
              <Switch
                checked={contact.active}
                onCheckedChange={(checked) =>
                  updateContact(contact.id, "active", checked)
                }
              />
              <span className="text-sm">Activo</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeContact(contact.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addContact}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Agregar Contacto
      </Button>

      {contacts.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          No hay contactos. Agrega información de contacto para que tus clientes
          puedan comunicarse contigo.
        </p>
      )}
    </div>
  );
};
