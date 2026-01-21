import { ProductCreate } from "@/features/products/create";
import { getBusinesses } from "@/actions/business/BusinessActions";

interface ProductEditPageProps {
  params: Promise<{ product_id: string }>;
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { product_id } = await params;
  const businesses = await getBusinesses();
  
  // Transformar los datos para que solo incluyan id y name
  const businessOptions = (businesses || []).map((business) => ({
    id: business.id,
    name: business.name,
  }));

  return <ProductCreate businesses={businessOptions} productId={product_id} />;
}
