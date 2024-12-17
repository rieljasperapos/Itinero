import Layout from "@/components/sidebar/layout";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { MapPageProps } from "../_types/map-types";

const MapClient = ({ lat, lng }: MapPageProps) => {
  const position = [
    lat ? lat : 10.3157,
    lng ? lng : 123.8854,
  ];

  const Map = useMemo(() => dynamic(
    () => import('./map'),
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

export default MapClient;