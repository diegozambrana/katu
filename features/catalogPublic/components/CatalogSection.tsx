"use client";

import type { CatalogSection as CatalogSectionType } from "@/types/Catalog";
import { ProductItem } from "./ProductItem";
import { Product } from "@/types";

interface CatalogSectionProps {
  section: CatalogSectionType;
}

export const CatalogSection = ({ section }: CatalogSectionProps) => {
  const activeProducts =
    section.catalog_section_products
      ?.filter((csp) => csp.active && csp.product)
      .sort((a, b) => a.sort_order - b.sort_order) || [];

  if (activeProducts.length === 0) return null;

  return (
    <section className="mb-16" id={section.id}>
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">{section.title}</h3>
        {section.description && (
          <p className="text-muted-foreground">{section.description}</p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {activeProducts.map((csp) => (
          <ProductItem key={csp.id} product={csp.product as Product} />
        ))}
      </div>
    </section>
  );
};
