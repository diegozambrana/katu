import { create } from "zustand";

export type OnboardingStep = 1 | 2 | 3 | 4;

export interface OnboardingBusiness {
  id: string;
  name: string;
  slug: string;
}

export interface OnboardingProduct {
  id: string;
  name: string;
  base_price: number | null;
  slug: string;
}

export interface OnboardingCatalog {
  id: string;
  name: string;
  slug: string;
}

interface OnboardingState {
  step: OnboardingStep;
  business: OnboardingBusiness | null;
  products: OnboardingProduct[];
  catalog: OnboardingCatalog | null;
  setStep: (step: OnboardingStep) => void;
  setBusiness: (business: OnboardingBusiness) => void;
  addProduct: (product: OnboardingProduct) => void;
  setCatalog: (catalog: OnboardingCatalog) => void;
  reset: () => void;
}

const initialState: Pick<
  OnboardingState,
  "step" | "business" | "products" | "catalog"
> = {
  step: 1,
  business: null,
  products: [],
  catalog: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setBusiness: (business) =>
    set({
      business,
      step: 2,
    }),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  setCatalog: (catalog) =>
    set({
      catalog,
      step: 4,
    }),

  reset: () => set(initialState),
}));
