"use client";

import type { CatalogContact } from "@/types/Catalog";
import { CatalogContactType } from "@/types/Catalog";
import { FC } from "react";
import { Phone, Mail, Globe, MapPin, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/CustomIcons";

interface CatalogContactItemProps {
  contact: CatalogContact;
}


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