import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CatalogPublic } from "@/features/catalogPublic";
import { getCatalogBySlugPublic } from "@/actions/catalog/CatalogActions";
import { Spinner } from "@/components/ui/spinner";

interface PageProps {
  params: Promise<{ catalogSlug: string }>;
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
