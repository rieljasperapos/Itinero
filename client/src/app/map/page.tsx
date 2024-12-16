import { Metadata } from "next"
import MapClientWrapper from "./_components/map-client-wrapper"

export const metadata: Metadata = {
  title: "Map | Itinero",
  description: "Map page of the travel itinerary app"
};

const MapPage = () => {
  return (
    <MapClientWrapper />
  )
}

export default MapPage;