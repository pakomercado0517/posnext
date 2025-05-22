import ProductsTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import Pagination from "@/components/ui/Pagination";
import { ProductResponseSchema } from "@/src/schemas";
import { isValidPage } from "@/src/utils";
import Link from "next/link";
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
  const { products, total } = await getProducts(productsPerPage, skip);

  const totalPages = Math.ceil(total / productsPerPage);
  if (totalPages < +page) redirect(`/admin/products?page=${totalPages}`);
  // if (+page > totalPages) redirect(`/admin/products?page=1`);

  return (
    <>
      <Link
        href={`/admin/products/new`}
        className="rounded bg-green-400 font-gold py-2 px-10"
      >
        Nuevo Producto
      </Link>
      <Heading>Admininstrar Productos</Heading>

      <ProductsTable products={products} />

      <Pagination
        page={+page}
        totalPages={totalPages}
        baseUrl="/admin/products"
      />
    </>
  );
}
