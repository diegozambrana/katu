export type Product = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number | null;
  currency: string | null;
  is_on_sale: boolean | null;
  sale_label: string | null;
  active: boolean | null;
  business_id: string;
  user_id: string;
  product_prices?: ProductPrice[];
  product_images?: ProductImage[];
};

export type ProductPrice = {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  label: string;
  price: number;
  sort_order: number;
  product_id: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
  image: string;
  image_caption: string | null;
  updated_at: string;
};
