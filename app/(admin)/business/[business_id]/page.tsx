import { BusinessDetail } from "@/features/business/detail";

interface BusinessDetailPageProps {
  params: Promise<{ business_id: string }>;
}

export default async function BusinessDetailPage({
  params,
}: BusinessDetailPageProps) {
  const { business_id } = await params;
  return <BusinessDetail businessId={business_id} />;
}
