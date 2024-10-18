"use client"

import { useCounterStore } from "@/stores/counter-store";

export default function Home() {
  const counter = useCounterStore((state) => state);

  return (
    <div className="flex gap-4">
      <button onClick={counter.decrement}>minus 1</button>
      <h1>{counter.count}</h1>
      <button onClick={counter.increment}>add 1</button>
    </div>
  );
}
