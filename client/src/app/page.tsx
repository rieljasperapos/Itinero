"use client"

import { useCounterStore } from "@/stores/counter-store";
import Dashboard from "./dashboard";

export default function Home() {
  const counter = useCounterStore((state) => state);

  return (
    <div className="flex gap-4">
      <Dashboard />
    </div>
  );
}
