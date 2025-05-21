import ProductsTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { ProductResponseSchema } from "@/src/schemas";
import { isValidPage } from "@/src/utils";
import { redirect } from "next/navigation";

async function getProducts(take: number, skip: number) {
  const url = `${process.env.SERVER_URL}/products?take=${take}&skip=${skip}`;
  const res = await fetch(url);
  const json = await res.json();
  const data = ProductResponseSchema.parse(json);
  return {
    products: data.products,
    total: data.total,
  };
}

type SearchParams = Promise<{ page: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  if (!isValidPage(+page)) redirect("/admin/products?page=1");

  const productsPerPage = 10;
  const skip = (+page - 1) * productsPerPage;

  console.log("skip", skip);

  const { products, total } = await getProducts(productsPerPage, skip);

  return (
    <>
      <Heading>Admininstrar Productos</Heading>

      <ProductsTable products={products} />
    </>
  );
}
