import { ProductDetail } from "@/features/products/detail";

interface ProductDetailPageProps {
  params: Promise<{ product_id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { product_id } = await params;
  return <ProductDetail productId={product_id} />;
}
