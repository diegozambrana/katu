"use client";

interface Business {
  id: string;
  name: string;
  description?: string | null;
  avatar?: string | null;
}

interface BusinessHeaderProps {
  business: Business;
}

export const BusinessHeader = ({ business }: BusinessHeaderProps) => {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        </div>
      </div>
    </div>
  );
};
