import { CatalogDetail } from "@/features/catalog/detail";

interface CatalogDetailPageProps {
  params: Promise<{ catalog_id: string }>;
}

export default async function CatalogDetailPage({
  params,
}: CatalogDetailPageProps) {
  const { catalog_id } = await params;
  return <CatalogDetail catalogId={catalog_id} />;
}
