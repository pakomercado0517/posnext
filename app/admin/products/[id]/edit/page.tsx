import EditProductsForm from "@/components/products/EditProductForm";
import ProductForm from "@/components/products/ProductForm";
import Heading from "@/components/ui/Heading";
import { ProductSchema } from "@/src/schemas";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
  const url = `${process.env.SERVER_URL}/products/${id}`;
  const req = await fetch(url);
  if (!req.ok) {
    notFound();
  }
  const json = await req.json();
  const product = ProductSchema.parse(json);
  return product;
}

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <>
      <Link
        href={`/admin/products?page=1`}
        className="rounded bg-green-400 font-gold py-2 px-10"
      >
        Volver
      </Link>

      <Heading>Editar producto: {product.name}</Heading>

      <EditProductsForm>
        <ProductForm product={product} />
      </EditProductsForm>
    </>
  );
}
