import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Negocio",
    href: "/business",
    icon: "business",
    label: "business",
  },
  {
    title: "Productos",
    href: "/product",
    icon: "business",
    label: "products",
  },
  {
    title: "Catálogos",
    href: "/catalog",
    icon: "media",
    label: "catalogs",
  },
  {
    title: "Soporte: mensajes",
    href: "/support/messages",
    icon: "business",
    label: "support-messages",
    adminOnly: true,
  }

];
