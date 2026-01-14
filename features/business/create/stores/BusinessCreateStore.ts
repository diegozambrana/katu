import { create } from "zustand";
import { SocialLink } from "../components/BusinessSocialLinksManager";

export interface BusinessCreateFormData {
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
  avatar: string | null;
  avatar_caption: string;
  cover: string | null;
  cover_caption: string;
}

interface BusinessCreateState {
  formData: BusinessCreateFormData;
  socialLinks: SocialLink[];
  slugManuallyEdited: boolean;
  error: string | null;
  setFormData: (data: Partial<BusinessCreateFormData>) => void;
  setSocialLinks: (links: SocialLink[]) => void;
  setSlugManuallyEdited: (edited: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultFormData: BusinessCreateFormData = {
  name: "",
  slug: "",
  description: "",
  phone: "",
  whatsapp_phone: "",
  email: "",
  address: "",
  city: "",
  country: "",
  website_url: "",
  active: true,
  avatar: null,
  avatar_caption: "",
  cover: null,
  cover_caption: "",
};

export const useBusinessCreateStore = create<BusinessCreateState>((set) => ({
  formData: defaultFormData,
  socialLinks: [],
  slugManuallyEdited: false,
  error: null,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setSocialLinks: (links) => set({ socialLinks: links }),

  setSlugManuallyEdited: (edited) => set({ slugManuallyEdited: edited }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      formData: defaultFormData,
      socialLinks: [],
      slugManuallyEdited: false,
      error: null,
    }),
}));
