import { getProducts } from "@/actions/product/ProductActions";
import { ProductList } from "@/features/products/list";

export default async function ProductPage() {
  const products = await getProducts();
  return <ProductList initialProducts={products || []} />;
}
