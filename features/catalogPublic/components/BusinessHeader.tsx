"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Business {
  id: string;
  name: string;
  description?: string | null;
  avatar?: string | null;
}

interface SectionNavItem {
  id: string;
  title: string;
}

interface BusinessHeaderProps {
  business: Business;
  sections?: SectionNavItem[];
}

export const BusinessHeader = ({ business, sections }: BusinessHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // Cerrar el menú móvil si está abierto
    setIsMobileMenuOpen(false);




    // Encontrar el contenedor con scroll (puede ser window o un elemento con overflow)
    const scrollContainer = document.querySelector('[class*="overflow-y-auto"]');

    if (scrollContainer && scrollContainer instanceof HTMLElement) {
      // Si el scroll está en un contenedor
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      const offsetPosition = elementRect.top - containerRect.top + scrollTop - 100;

      scrollContainer.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    } else {
      // Si el scroll está en window
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + globalThis.pageYOffset - 100;

      globalThis.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {business.avatar && (
            <img
              src={business.avatar}
              alt={business.name}
              className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover border-2 border-border flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold truncate">{business.name}</h1>
            {business.description && (
              <p className="text-sm text-muted-foreground hidden sm:block truncate">
                {business.description}
              </p>
            )}
          </div>
          {sections && sections.length > 0 && (
            <>
              {/* Navegación desktop - oculta en móvil */}
              <nav
                className="hidden md:flex justify-center gap-6 overflow-x-auto text-sm md:text-base flex-shrink-0"
                aria-label="Secciones del catálogo"
              >
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleScrollToSection(section.id)}
                    className="text-gray-700 hover:text-black hover:border-b-2 hover:border-black transition-all duration-200 pb-1 whitespace-nowrap"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Menú móvil - solo visible en móvil */}
              <div className="hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
                      aria-label="Abrir menú de navegación"
                    >
                      <MenuIcon className="h-6 w-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Secciones</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-2 mt-6" aria-label="Secciones del catálogo">
                      {sections.map((section) => (
                        <SheetClose key={section.id} asChild>
                          <button
                            type="button"
                            onClick={() => handleScrollToSection(section.id)}
                            className="text-left px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200"
                          >
                            {section.title}
                          </button>
                        </SheetClose>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
