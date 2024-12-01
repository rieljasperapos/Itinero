"use client"

import { useCounterStore } from "@/stores/counter-store";
import Dashboard from "./dashboard";
import ItineraryDetails from "@/components/itinerary_details";

export default function Home() {
  const counter = useCounterStore((state) => state);

  return (
    <div className="flex">
      <Dashboard />
      <ItineraryDetails 
        title="Sample Title" 
        dateStart="2023-10-01" 
        dateEnd="2023-10-02"
        collaborators={3}
      />
    </div>
  );
}
