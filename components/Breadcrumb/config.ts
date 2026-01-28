export enum BREADCRUMB {
  BUSINESS_DETAIL = "BUSINESS_DETAIL",
  BUSINESS_CREATE = "BUSINESS_CREATE",
  BUSINESS_EDIT = "BUSINESS_EDIT",
  PRODUCT_DETAIL = "PRODUCT_DETAIL",
  PRODUCT_CREATE = "PRODUCT_CREATE",
  PRODUCT_EDIT = "PRODUCT_EDIT",
  CATALOG_DETAIL = "CATALOG_DETAIL",
  CATALOG_CREATE = "CATALOG_CREATE",
  CATALOG_EDIT = "CATALOG_EDIT",
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export const BREADCRUMB_CONFIG: Record<BREADCRUMB, BreadcrumbItem[]> = {
  [BREADCRUMB.BUSINESS_DETAIL]: [
    { label: "Negocios", href: "/business" },
    { label: "Detalle de Negocio", href: "#" },
  ],
  [BREADCRUMB.BUSINESS_CREATE]: [
    { label: "Negocios", href: "/business" },
    { label: "Crear Negocio", href: "#" },
  ],
  [BREADCRUMB.BUSINESS_EDIT]: [
    { label: "Negocios", href: "/business" },
    { label: "Editar Negocio", href: "#" },
  ],
  [BREADCRUMB.PRODUCT_DETAIL]: [
    { label: "Productos", href: "/product" },
    { label: "Detalle de Producto", href: "#" },
  ],
  [BREADCRUMB.PRODUCT_CREATE]: [
    { label: "Productos", href: "/product" },
    { label: "Crear Producto", href: "#" },
  ],
  [BREADCRUMB.PRODUCT_EDIT]: [
    { label: "Productos", href: "/product" },
    { label: "Editar Producto", href: "#" },
  ],
  [BREADCRUMB.CATALOG_DETAIL]: [
    { label: "Catálogos", href: "/catalog" },
    { label: "Detalle de Catálogo", href: "#" },
  ],
  [BREADCRUMB.CATALOG_CREATE]: [
    { label: "Catálogos", href: "/catalog" },
    { label: "Crear Catálogo", href: "#" },
  ],
  [BREADCRUMB.CATALOG_EDIT]: [
    { label: "Catálogos", href: "/catalog" },
    { label: "Editar Catálogo", href: "#" },
  ],
};
