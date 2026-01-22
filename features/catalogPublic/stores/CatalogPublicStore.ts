import { create } from "zustand";
import type {
  Catalog,
  CatalogSlide,
  CatalogSection,
  CatalogContact,
} from "@/types/Catalog";
import type { Product } from "@/types/Products";

export interface SectionNavItem {
  id: string;
  title: string;
}

interface CatalogPublicState {
  catalog: Catalog | null;
  activeSlides: CatalogSlide[];
  activeSections: CatalogSection[];
  activeContacts: CatalogContact[];
  navSections: SectionNavItem[];
  domain: string;
  selectedProduct: Product | null;
  openProductDetailModal: boolean;
  setCatalog: (catalog: Catalog) => void;
  setSelectedProduct: (product: Product | null) => void;
  setOpenProductDetailModal: (open: boolean) => void;
  reset: () => void;
}

const defaultState = {
  catalog: null,
  activeSlides: [],
  activeSections: [],
  activeContacts: [],
  navSections: [],
  domain: process.env.NEXT_PUBLIC_PUBLIC_DOMAIN || "catalogo.cc",
  selectedProduct: null,
  openProductDetailModal: false,
};

export const useCatalogPublicStore = create<CatalogPublicState>((set) => ({
  ...defaultState,

  setCatalog: (catalog) => {
    // Filter and sort slides
    const activeSlides =
      catalog.catalog_slides
        ?.filter((s) => s.active)
        .sort((a, b) => a.sort_order - b.sort_order) || [];

    // Filter and sort sections
    const activeSections =
      catalog.catalog_sections
        ?.filter((s) => s.active)
        .sort((a, b) => a.sort_order - b.sort_order) || [];

    // Filter contacts
    const activeContacts =
      catalog.catalog_contacts?.filter((c) => c.active) || [];

    // Create nav sections
    const navSections = activeSections.map((section) => ({
      id: section.id,
      title: section.title,
    }));

    set({
      catalog,
      activeSlides,
      activeSections,
      activeContacts,
      navSections,
    });
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  setOpenProductDetailModal: (open) => set({ openProductDetailModal: open }),

  reset: () => set(defaultState),
}));
