"use client";

import type { Catalog } from "@/types/Catalog";
import type { Product } from "@/types/Products";
import { CatalogSlider, CatalogSection, BusinessHeader } from "./components";
import { Separator } from "@/components/ui/separator";

interface CatalogPublicProps {
  catalog: Catalog & {
    business?: {
      id: string;
      name: string;
      description?: string | null;
      avatar?: string | null;
    };
    catalog_slides?: Array<{
      id: string;
      image: string | null;
      title: string | null;
      description: string | null;
      link_url: string | null;
      sort_order: number;
      active: boolean | null;
    }>;
    catalog_sections?: Array<{
      id: string;
      title: string;
      description: string | null;
      sort_order: number;
      active: boolean;
      catalog_section_products?: Array<{
        id: string;
        active: boolean;
        sort_order: number;
        product: Product;
      }>;
    }>;
    catalog_contacts?: Array<{
      id: string;
      label: string;
      type: string;
      value: string;
      active: boolean;
    }>;
  };
}

export const CatalogPublic = ({ catalog }: CatalogPublicProps) => {
  // Filter and sort data
  const activeSlides =
    catalog.catalog_slides
      ?.filter((s) => s.active)
      .sort((a, b) => a.sort_order - b.sort_order) || [];

  const activeSections =
    catalog.catalog_sections
      ?.filter((s) => s.active)
      .sort((a, b) => a.sort_order - b.sort_order) || [];

  const activeContacts =
    catalog.catalog_contacts?.filter((c) => c.active) || [];

  const navSections = activeSections.map((section) => ({
    id: section.id,
    title: section.title,
  }));

  const domain = process.env.NEXT_PUBLIC_PUBLIC_DOMAIN || "catalogo.cc";

  return (
    <div className="min-h-screen bg-background">
      {/* Business Header */}
      {catalog.business && (
        <BusinessHeader business={catalog.business} sections={navSections} />
      )}

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Catalog Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {catalog.name}
          </h2>
          {catalog.description && (
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {catalog.description}
            </p>
          )}
        </div>

        {/* Slides */}
        <CatalogSlider slides={activeSlides} />

        {/* Sections */}
        <div className="space-y-12">
          {activeSections.map((section) => (
            <CatalogSection key={section.id} section={section} />
          ))}
        </div>

        {/* Contact Information */}
        {activeContacts.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-6">Contactanos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {activeContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <p className="text-sm text-muted-foreground mb-1">
                      {contact.label}
                    </p>
                    <p className="font-medium break-all">{contact.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{" "}
            {catalog.business?.name || catalog.name}. All rights reserved.
          </p>
          <p className="mt-1">Powered by <a className="font-bold hover:underline" href={domain} target="_blank" rel="noreferrer">Catalogo</a></p>
        </footer>
      </main>
    </div>
  );
};
