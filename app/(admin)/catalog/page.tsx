import { getCatalogs } from "@/actions/catalog/CatalogActions";
import { CatalogList } from "@/features/catalog/list";

export default async function CatalogPage() {
  const catalogs = await getCatalogs();
  return <CatalogList initialCatalogs={catalogs || []} />;
}
