"use client";
import { useSearchParams } from "next/navigation";

export const useMapCoordinates = () => {
  const searchParams = useSearchParams();
  const lat = searchParams.get('Lat'); // Access the `lat` from the query parameters
  const lng = searchParams.get('Lng'); // Access the `lng` from the query parameters

  return { lat, lng };
};
