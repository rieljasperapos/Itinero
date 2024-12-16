"use client"
import { useMapCoordinates } from "../_services/map-service";
import MapClient from "./map-client";

const MapClientWrapper = () => {
  const { lat, lng } = useMapCoordinates();
  
  return <MapClient lat={Number(lat)} lng={Number(lng)} />
}

export default MapClientWrapper;