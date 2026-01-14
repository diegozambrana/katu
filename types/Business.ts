export type Business = {
  id: string;
  created_at: string;
  udpated_at: string;
  name: string;
  slug: string;
  description: string;
  phone: string;
  whatsapp_phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  website_url: string;
  active: boolean;
  user_id: string;
  avatar: string;
  avatar_caption: string;
  cover: string;
  cover_caption: string;
  business_social_links?: BusinessSocialLink[];
};

export type BusinessSocialLink = {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  business_id: string;
  platform: string;
  url: string;
  sort_order: number;
};
