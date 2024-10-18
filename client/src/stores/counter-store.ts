import { create } from "zustand";
import { CounterStoreType } from "@/types/counter-store";

export const useCounterStore = create<CounterStoreType>((set) => ({
  count: 0,
  increment: () => {
    set((state) => ({count: state.count + 1}))
  },
  decrement: () => {
    set((state) => ({count: state.count - 1}))
  }
}))