import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      cart: 0,
      increment: () => set((state:any) => ({ cart: state.cart + 1 })),
      decrement: () => set((state:any) => ({ cart: state.cart - 1 })),
    }),
    {
      name: "cart-name", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
