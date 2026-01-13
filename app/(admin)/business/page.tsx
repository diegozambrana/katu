import { getBusinesses } from "@/actions/business/BusinessActions";
import { BusinessList } from "@/features/business/list";

export default async function BusinessPage() {
  const businesses = await getBusinesses();
  return <BusinessList initialBusinesses={businesses || []} />;
}
