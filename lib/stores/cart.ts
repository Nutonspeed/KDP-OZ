import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock_quantity) {
              console.warn(`Cannot add more than available stock for ${product.name}. Current stock: ${product.stock_quantity}`);
              return state;
            }
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: newQuantity } : item
              ),
            };
          } else {
            if (quantity > product.stock_quantity) {
              console.warn(`Cannot add more than available stock for ${product.name}. Current stock: ${product.stock_quantity}`);
              return state;
            }
            return { items: [...state.items, { ...product, quantity }] };
          }
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateItemQuantity: (productId, quantity) =>
        set((state) => {
          const itemToUpdate = state.items.find((item) => item.id === productId);
          if (itemToUpdate) {
            if (quantity <= 0) {
              return { items: state.items.filter((item) => item.id !== productId) };
            }
            if (quantity > itemToUpdate.stock_quantity) {
              console.warn(`Cannot set quantity more than available stock for ${itemToUpdate.name}. Current stock: ${itemToUpdate.stock_quantity}`);
              return state;
            }
            return {
              items: state.items.map((item) =>
                item.id === productId ? { ...item, quantity } : item
              ),
            };
          }
          return state;
        }),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.base_price * item.quantity, 0),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
