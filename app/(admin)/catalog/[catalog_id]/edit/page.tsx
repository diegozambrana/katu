import { CatalogEdit } from "@/features/catalog/edit";
import { getProducts } from "@/actions/product/ProductActions";

interface CatalogEditPageProps {
  params: Promise<{ catalog_id: string }>;
}

export default async function CatalogEditPage({
  params,
}: CatalogEditPageProps) {
  const { catalog_id } = await params;
  const products = await getProducts();

  const productOptions = (products || []).map((product) => ({
    id: product.id,
    name: product.name,
    base_price: product.base_price,
    currency: product.currency,
  }));

  return <CatalogEdit catalogId={catalog_id} products={productOptions} />;
}
