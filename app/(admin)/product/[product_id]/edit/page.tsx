import { ProductEdit } from "@/features/products/edit";

interface ProductEditPageProps {
  params: Promise<{ product_id: string }>;
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { product_id } = await params;
  return <ProductEdit productId={product_id} />;
}
