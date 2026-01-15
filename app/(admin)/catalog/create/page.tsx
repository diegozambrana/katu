import { CatalogCreate } from "@/features/catalog/create";
import { getBusinesses } from "@/actions/business/BusinessActions";
import { getProducts } from "@/actions/product/ProductActions";

export default async function CatalogCreatePage() {
  const businesses = await getBusinesses();
  const products = await getProducts();
  
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

  return <CatalogCreate businesses={businessOptions} products={productOptions} />;
}
