import { Metadata } from "next"
import MapClientWrapper from "./_components/map-client-wrapper"
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Map | Itinero",
  description: "Map page of the travel itinerary app"
};

const MapPage = () => {
  return (
    <Suspense>
      <MapClientWrapper />
    </Suspense>
  )
}

export default MapPage;