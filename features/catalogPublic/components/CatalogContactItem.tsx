"use client";

import type { CatalogContact } from "@/types/Catalog";
import { CatalogContactType } from "@/types/Catalog";
import { FC } from "react";
import { Phone, Mail, Globe, MapPin, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogContactItemProps {
  contact: CatalogContact;
}

// Icono de WhatsApp personalizado
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const getContactConfig = (type: string) => {
  switch (type.toLowerCase()) {
    case CatalogContactType.PHONE:
      return {
        icon: Phone,
        borderColor: "border-blue-500",
        iconColor: "text-blue-500",
      };
    case CatalogContactType.EMAIL:
      return {
        icon: Mail,
        borderColor: "border-purple-500",
        iconColor: "text-purple-500",
      };
    case CatalogContactType.WHATSAPP:
      return {
        icon: WhatsAppIcon,
        borderColor: "border-[#25D366]",
        iconColor: "text-[#25D366]",
      };
    case CatalogContactType.WEBSITE:
      return {
        icon: Globe,
        borderColor: "border-cyan-500",
        iconColor: "text-cyan-500",
      };
    case CatalogContactType.ADDRESS:
      return {
        icon: MapPin,
        borderColor: "border-red-500",
        iconColor: "text-red-500",
      };
    default:
      return {
        icon: Info,
        borderColor: "border-gray-500",
        iconColor: "text-gray-500",
      };
  }
};

const getContactAction = (type: string, value: string) => {
  switch (type.toLowerCase()) {
    case CatalogContactType.WHATSAPP: {
      // Limpiar el número: solo mantener dígitos (incluyendo código de país)
      const cleanNumber = value.replaceAll(/\D/g, "");
      if (!cleanNumber) return null;
      return {
        url: `https://wa.me/${cleanNumber}`,
        target: "_blank",
        rel: "noopener noreferrer",
      };
    }
    case CatalogContactType.PHONE: {
      // Limpiar el número para tel: mantener solo dígitos y +
      const cleanNumber = value.replaceAll(/[^\d+]/g, "");
      if (!cleanNumber) return null;
      return {
        url: `tel:${cleanNumber}`,
        target: "_self",
      };
    }
    case CatalogContactType.EMAIL:
      if (!value?.includes("@")) return null;
      return {
        url: `mailto:${value.trim()}`,
        target: "_self",
      };
    case CatalogContactType.WEBSITE: {
      // Verificar si ya tiene http/https
      const trimmedValue = value.trim();
      if (!trimmedValue) return null;
      const url = trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")
        ? trimmedValue
        : `https://${trimmedValue}`;
      return {
        url,
        target: "_blank",
        rel: "noopener noreferrer",
      };
    }
    case CatalogContactType.ADDRESS: {
      // Abrir en Google Maps
      const encodedAddress = encodeURIComponent(value.trim());
      return {
        url: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        target: "_blank",
        rel: "noopener noreferrer",
      };
    }
    default:
      return null;
  }
};

export const CatalogContactItem: FC<CatalogContactItemProps> = ({ contact }) => {
  const config = getContactConfig(contact.type);
  const Icon = config.icon;
  const action = getContactAction(contact.type, contact.value);

  const baseClassName = cn(
    "p-2 rounded-lg border-2 bg-card transition-shadow hover:shadow-md",
    config.borderColor
  );

  const content = (
    <div className="flex items-start gap-3">
      <div className={cn("flex-shrink-0 flex items-center justify-center", config.iconColor)}>
        <Icon className="h-10 w-10" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm mb-1">{contact.label}</p>
        <p className="text-sm break-words">{contact.value}</p>
      </div>
    </div>
  );

  if (action) {
    return (
      <a
        href={action.url}
        target={action.target}
        rel={action.rel}
        className={cn(baseClassName, "cursor-pointer block w-full text-left no-underline")}
      >
        {content}
      </a>
    );
  }

  return <div className={baseClassName}>{content}</div>;
};