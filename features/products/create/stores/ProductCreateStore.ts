import { create } from "zustand";
import {
  ProductImageData,
  PriceTierData,
} from "../components";

export interface ProductCreateFormData {
  name: string;
  slug: string;
  description: string;
  base_price: string;
  currency: string;
  is_on_sale: boolean;
  sale_label: string;
  active: boolean;
  business_id: string;
}

interface ProductCreateState {
  formData: ProductCreateFormData;
  images: ProductImageData[];
  priceTiers: PriceTierData[];
  slugManuallyEdited: boolean;
  error: string | null;
  setFormData: (data: Partial<ProductCreateFormData>) => void;
  setImages: (images: ProductImageData[]) => void;
  setPriceTiers: (tiers: PriceTierData[]) => void;
  setSlugManuallyEdited: (edited: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultFormData: ProductCreateFormData = {
  name: "",
  slug: "",
  description: "",
  base_price: "",
  currency: "BOB",
  is_on_sale: false,
  sale_label: "",
  active: true,
  business_id: "",
};

export const useProductCreateStore = create<ProductCreateState>((set) => ({
  formData: defaultFormData,
  images: [],
  priceTiers: [],
  slugManuallyEdited: false,
  error: null,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setImages: (images) => set({ images }),

  setPriceTiers: (tiers) => set({ priceTiers: tiers }),

  setSlugManuallyEdited: (edited) => set({ slugManuallyEdited: edited }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      formData: defaultFormData,
      images: [],
      priceTiers: [],
      slugManuallyEdited: false,
      error: null,
    }),
}));
