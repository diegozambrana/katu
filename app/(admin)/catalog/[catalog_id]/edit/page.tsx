import { CatalogCreate } from "@/features/catalog/create";
import { getProducts } from "@/actions/product/ProductActions";
import { getBusinesses } from "@/actions/business/BusinessActions";

interface CatalogEditPageProps {
  params: Promise<{ catalog_id: string }>;
}

export default async function CatalogEditPage({
  params,
}: CatalogEditPageProps) {
  const { catalog_id } = await params;
  const products = await getProducts();
  const businesses = await getBusinesses();

  const businessOptions = (businesses || []).map((business) => ({
    id: business.id,
    name: business.name,
  }));

  const productOptions = (products || []).map((product) => ({
    id: product.id,
    name: product.name,
    base_price: product.base_price,
    currency: product.currency,
  }));

  return (
    <CatalogCreate
      businesses={businessOptions}
      products={productOptions}
      catalogId={catalog_id}
    />
  );
}
