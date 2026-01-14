import { BusinessEdit } from "@/features/business/edit";

interface BusinessEditPageProps {
  params: Promise<{ business_id: string }>;
}

export default async function BusinessEditPage({
  params,
}: BusinessEditPageProps) {
  const { business_id } = await params;
  return <BusinessEdit businessId={business_id} />;
}
