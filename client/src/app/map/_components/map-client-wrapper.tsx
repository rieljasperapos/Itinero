"use client"
import { useSession } from "next-auth/react";
import { useMapCoordinates } from "../_services/map-service";
import MapClient from "./map-client";
import { redirect } from "next/navigation";

const MapClientWrapper = () => {
  const { status } = useSession();
  const { lat, lng } = useMapCoordinates();

  if (status === "unauthenticated") redirect("/auth/signin");
  
  return <MapClient lat={Number(lat)} lng={Number(lng)} />
}

export default MapClientWrapper;