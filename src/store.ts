/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Coupon, CouponResponseSchema, Product, ShoppingCart } from "./schemas";

interface Store {
  total: number;
  contents: ShoppingCart;
  coupon: Coupon;
  discount: number;
  addToCart: (product: Product) => void;
  updateQuantity: (id: Product["id"], quantity: number) => void;
  removeFromCart: (id: Product["id"]) => void;
  calculateTotal: () => void;
  applyCoupon: (couponName: string) => Promise<void>;
  applyDiscount: () => void;
  clearOrder: () => void;
}

const initialState = {
  total: 0,
  contents: [],
  coupon: {
    name: "",
    message: "",
    percentage: 0,
  },
  discount: 0,
};

export const useStore = create<Store>()(
  devtools((set, get) => ({
    ...initialState,
    addToCart: (product) => {
      const { id: productId, categoryId, ...data } = product;
      let contents: ShoppingCart = [];
      const duplicated = get().contents.findIndex(
        (item) => item.productId === productId
      );

      if (duplicated >= 0) {
        if (
          get().contents[duplicated].quantity >=
          get().contents[duplicated].inventory
        )
          return;
        contents = get().contents.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        contents = [
          ...get().contents,
          {
            ...data,
            quantity: 1,
            productId,
          },
        ];
      }

      set(() => ({
        contents,
      }));

      get().calculateTotal();
    },
    updateQuantity: (id, quantity) => {
      set((state) => ({
        contents: state.contents.map((item) =>
          item.productId === id ? { ...item, quantity } : item
        ),
      }));

      get().calculateTotal();
    },
    removeFromCart: (id) => {
      set((state) => ({
        contents: state.contents.filter((item) => item.productId !== id),
      }));

      if (!get().contents.length) {
        get().clearOrder();
      }

      get().calculateTotal();
    },
    calculateTotal: () => {
      const total = get().contents.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      set(() => ({
        total,
      }));

      if (get().coupon.percentage) {
        get().applyDiscount();
      }
    },
    applyCoupon: async (couponName) => {
      const req = await fetch("/coupons/api", {
        method: "POST",
        body: JSON.stringify({ coupon_name: couponName.toUpperCase() }),
      });
      const json = await req.json();
      const coupon = CouponResponseSchema.parse(json);

      set(() => ({
        coupon,
      }));

      if (coupon.percentage) {
        get().applyDiscount();
      }
    },
    applyDiscount: () => {
      const { contents, coupon } = get();
      const subtotal = contents.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      const discount = (coupon.percentage / 100) * subtotal;
      const total = subtotal - discount;

      set(() => ({
        total,
        discount,
      }));
    },
    clearOrder: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
