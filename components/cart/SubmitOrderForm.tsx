import { submitOrder } from "@/actions/submit-order-action";
import { useStore } from "@/src/store";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export default function SubmitOrderForm() {
  const total = useStore((state) => state.total);
  const coupon = useStore((state) => state.coupon.name);
  const contents = useStore((state) => state.contents);
  const clearOrder = useStore((state) => state.clearOrder);

  const order = {
    total,
    coupon,
    contents,
  };

  const submitOrderWithData = submitOrder.bind(null, order);

  const [state, dispatch] = useActionState(submitOrderWithData, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) =>
        toast.error(error, {
          theme: "colored",
        })
      );
    }

    if (state.success) {
      toast.success(state.success, {
        theme: "colored",
        autoClose: 3000,
      });
      clearOrder();
    }
  }, [state]);

  return (
    <form action={dispatch}>
      <input
        type="submit"
        className="mt-5 w-full bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white uppercase font-bold p-3"
        value={"Confirmar compra"}
      />
    </form>
  );
}
