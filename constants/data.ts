import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "dashboard",
  },
  {
    title: "Negocio",
    href: "/business",
    icon: "business",
    label: "business",
  },
  {
    title: "Productos",
    href: "/product",
    icon: "products",
    label: "products",
  },
  {
    title: "Catálogos",
    href: "/catalog",
    icon: "catalog",
    label: "catalogs",
  },
  {
    title: "Soporte: mensajes",
    href: "/support/messages",
    icon: "messages",
    label: "support-messages",
    adminOnly: true,
  },
];
