"use client"
import Layout from "@/components/layout";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useMapCoordinates } from "./_services/map-service";

const MapPage = () => {
  const { lat, lng } = useMapCoordinates();
  const defaultLat = 10.3157;
  const defaultLng = 123.8854;

  const position = [
    lat ? lat : defaultLat,
    lng ? lng : defaultLng,
  ];

  const Map = useMemo(() => dynamic(
    () => import('./_components/map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return (
    <Layout breadcrumb="Map">
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-5xl font-bold">Map</h1>
        <span className="text-muted-foreground text-sm">Locate the place that you want to visit in our map</span>
        <Map position={position} zoom={13} />
      </div>
    </Layout>
  )
}

export default MapPage;