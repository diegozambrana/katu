import { create } from "zustand";
import {
  CatalogSlideData,
  CatalogSectionData,
  CatalogContactData,
} from "../components";

export interface CatalogCreateFormData {
  name: string;
  slug: string;
  description: string;
  active: boolean;
  business_id: string;
  catalog_whatsapp_fab_display: boolean;
  catalog_whatsapp_number: string;
  catalog_whatsapp_text: string;
}

interface CatalogCreateState {
  formData: CatalogCreateFormData;
  slides: CatalogSlideData[];
  sections: CatalogSectionData[];
  contacts: CatalogContactData[];
  slugManuallyEdited: boolean;
  error: string | null;
  setFormData: (data: Partial<CatalogCreateFormData>) => void;
  setSlides: (slides: CatalogSlideData[]) => void;
  setSections: (sections: CatalogSectionData[]) => void;
  setContacts: (contacts: CatalogContactData[]) => void;
  setSlugManuallyEdited: (edited: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultFormData: CatalogCreateFormData = {
  name: "",
  slug: "",
  description: "",
  active: true,
  business_id: "",
  catalog_whatsapp_fab_display: false,
  catalog_whatsapp_number: "",
  catalog_whatsapp_text: "",
};

export const useCatalogCreateStore = create<CatalogCreateState>((set) => ({
  formData: defaultFormData,
  slides: [],
  sections: [],
  contacts: [],
  slugManuallyEdited: false,
  error: null,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setSlides: (slides) => set({ slides }),

  setSections: (sections) => set({ sections }),

  setContacts: (contacts) => set({ contacts }),

  setSlugManuallyEdited: (edited) => set({ slugManuallyEdited: edited }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      formData: defaultFormData,
      slides: [],
      sections: [],
      contacts: [],
      slugManuallyEdited: false,
      error: null,
    }),
}));
