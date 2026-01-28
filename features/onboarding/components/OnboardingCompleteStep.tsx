"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicURLCard } from "@/components/PublicURL";
import type { OnboardingCatalog } from "../stores/OnboardingStore";

interface OnboardingCompleteStepProps {
  catalog: OnboardingCatalog;
  isSubmitting: boolean;
  onFinish: () => Promise<void>;
}

export const OnboardingCompleteStep = ({
  catalog,
  isSubmitting,
  onFinish,
}: OnboardingCompleteStepProps) => {
  const handlePreview = () => {
    const publicDomain =
      process.env.NEXT_PUBLIC_PUBLIC_DOMAIN || "catalogo.app";
    const url = `${publicDomain}/c/${catalog.slug}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          ¡Listo! Tu catálogo está publicado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Has creado tu negocio, agregado productos y publicado tu primer
          catálogo. Comparte el enlace con tus clientes o sigue
          personalizando desde el dashboard.
        </p>

        <PublicURLCard
          slug={catalog.slug}
          pathPrefix="c"
          title="URL pública de tu catálogo"
          description="Comparte este enlace con tus clientes:"
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handlePreview}>
            Vista previa
          </Button>
          <Button type="button" onClick={onFinish} disabled={isSubmitting}>
            {isSubmitting ? "Redireccionando..." : "Ir al Dashboard"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

