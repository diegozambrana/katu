export type Catalog = {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  name: string;
  slug: string;
  description: string | null;
  business_id: string;
  user_id: string;
  catalog_slides?: CatalogSlide[];
  catalog_sections?: CatalogSection[];
  catalog_contacts?: CatalogContact[];
};

export type CatalogSlide = {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean | null;
  title: string | null;
  description: string | null;
  link_url: string | null;
  sort_order: number;
  catalog_id: string;
  image: string | null;
  image_caption: string | null;
};

export type CatalogSection = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  sort_order: number;
  active: boolean;
  catalog_id: string;
  catalog_section_products?: CatalogSectionProduct[];
};

export type CatalogSectionProduct = {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  product_id: string;
  catalog_section_id: string;
  sort_order: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    base_price: number | null;
    currency: string | null;
    is_on_sale: boolean | null;
    sale_label: string | null;
  };
};

export type CatalogContact = {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  sort_order: number;
  label: string;
  type: string;
  value: string;
  catalog_id: string;
};

export enum CatalogContactType {
  PHONE = "phone",
  EMAIL = "email",
  WHATSAPP = "whatsapp",
  WEBSITE = "website",
  ADDRESS = "address",
  OTHER = "other",
}