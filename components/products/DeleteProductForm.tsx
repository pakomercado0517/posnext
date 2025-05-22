import { Product } from "@/src/schemas";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export default function DeleteProductForm({
  productId,
}: {
  productId: Product["id"];
}) {
  const handleDeleteForm = async () => {
    "use server";

    const url = `${process.env.SERVER_URL}/products/${productId}`;
    const req = await fetch(url, {
      method: "DELETE",
    });

    if (!req.ok) {
      notFound();
    }
    await req.json();
    revalidatePath("/admin/products");
  };

  return (
    <form action={handleDeleteForm}>
      <input
        type="submit"
        className="text-red-600 hover:text-red-800"
        value="Eliminar"
      />
    </form>
  );
}
