"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PublicURLCardProps {
  slug: string;
  pathPrefix?: string; // Por defecto "b" para business, puede ser "c" para catalog, etc.
  title?: string; // Título personalizado del card
  description?: string; // Descripción personalizada
}

export const PublicURLCard = ({
  slug,
  pathPrefix = "b",
  title = "Public URL",
  description = "Your public catalog page:",
}: PublicURLCardProps) => {
  const publicDomain = process.env.NEXT_PUBLIC_PUBLIC_DOMAIN || "catalogo.app";
  const publicUrl = `${publicDomain}/${pathPrefix}/${slug}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("URL copied to clipboard");
    } catch (err) {
      console.error("Failed to copy URL:", err);
      toast.error("Failed to copy URL");
    }
  };

  const handleVisitPage = () => {
    window.open(publicUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <code className="text-sm flex-1">{publicUrl}</code>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="flex-1"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleVisitPage}
            className="flex-1"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
