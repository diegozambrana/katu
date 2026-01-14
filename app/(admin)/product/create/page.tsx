import { ProductCreate } from "@/features/products/create";
import { getBusinesses } from "@/actions/business/BusinessActions";

export default async function ProductCreatePage() {
  const businesses = await getBusinesses();
  
  // Transformar los datos para que solo incluyan id y name
  const businessOptions = (businesses || []).map((business) => ({
    id: business.id,
    name: business.name,
  }));

  return <ProductCreate businesses={businessOptions} />;
}
