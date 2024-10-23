"use client"

import { Button } from "@/components/ui/button";
import { useCounterStore } from "@/stores/counter-store";

export default function Home() {
  const counter = useCounterStore((state) => state);

  return (
    <div className="flex gap-4 p-4">
      <Button onClick={counter.decrement}>minus 1</Button>
      <h1>{counter.count}</h1>
      <Button onClick={counter.increment}>add 1</Button>
    </div>
  );
}
