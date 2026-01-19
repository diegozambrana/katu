"use client";

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
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="border-b  bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {business.avatar && (
            <img
              src={business.avatar}
              alt={business.name}
              className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover border-2 border-border"
            />
          )}
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">{business.name}</h1>
            {business.description && (
              <p className="text-sm text-muted-foreground hidden sm:block">
                {business.description}
              </p>
            )}

          </div>
          {sections && sections.length > 0 && (
              <nav
                className="mt-3 flex justify-center gap-6 overflow-x-auto text-sm md:text-base pb-2"
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
            )}
        </div>
      </div>
    </div>
  );
};
