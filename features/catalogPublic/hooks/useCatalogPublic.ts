"use client";

import { useEffect } from "react";
import { useCatalogPublicStore } from "../stores/CatalogPublicStore";
import type { Catalog } from "@/types/Catalog";

export const useCatalogPublic = (catalog: Catalog) => {
  const {
    activeSlides,
    activeSections,
    activeContacts,
    navSections,
    domain,
    setCatalog,
  } = useCatalogPublicStore();

  useEffect(() => {
    if (catalog) {
      setCatalog(catalog);
    }
  }, [catalog, setCatalog]);

  return {
    catalog,
    activeSlides,
    activeSections,
    activeContacts,
    navSections,
    domain,
  };
};
