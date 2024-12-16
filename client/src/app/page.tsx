import { Metadata } from "next";
import Dashboard from "./dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Itinero",
  description: "Dashboard page of the travel itinerary app",
}

export default function Home() {
  return (
    <div className="flex">
      <Dashboard />

    </div>
  );
}
