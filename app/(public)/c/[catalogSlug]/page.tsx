import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPublic } from "@/features/catalogPublic";
import { getCatalogBySlugPublic } from "@/actions/catalog/CatalogActions";
import { Spinner } from "@/components/ui/spinner";

interface PageProps {
  params: Promise<{ catalogSlug: string }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ catalogSlug: string }> }
): Promise<Metadata> {
  const { catalogSlug } = await params;

  try {
    const catalog = await getCatalogBySlugPublic(catalogSlug);

    const title = catalog.name;
    const description =
      catalog.description ||
      "Explora este catálogo de productos creado con Katu.";

    const image = catalog.business?.avatar || "/opengraph-image.png";

    const domain =
      process.env.NEXT_PUBLIC_PUBLIC_DOMAIN || "https://catalogo.cc";
    const url = `${domain}/c/${catalogSlug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return {
      title: "Catálogo no encontrado",
      description: "El catálogo que buscas no está disponible.",
    };
  }
}

async function CatalogContent({
  params,
}: {
  params: Promise<{ catalogSlug: string }>;
}) {
  const { catalogSlug } = await params;

  try {
    const catalog = await getCatalogBySlugPublic(catalogSlug);
    return <CatalogPublic catalog={catalog} />;
  } catch (error) {
    console.error("Error loading catalog:", error);
    notFound();
  }
}

export default function CatalogPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      }
    >
      <CatalogContent params={params} />
    </Suspense>
  );
}
