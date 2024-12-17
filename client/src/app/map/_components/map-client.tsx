import Layout from "@/components/sidebar/layout";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { MapPageProps } from "../_types/map-types";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const MapClient = ({ lat, lng }: MapPageProps) => {
  const position = [lat ? lat : 10.3157, lng ? lng : 123.8854];

  const Map = useMemo(
    () =>
      dynamic(() => import("./map"), {
        loading: () => (
          <div className="flex justify-center items-center">
            <DotLottieReact
              className="w-[50%]"
              src="https://lottie.host/aa2eba8e-913d-420f-b307-890f5a41365f/EaQL3x2VpA.lottie"
              loop
              autoplay
            />
            <span className="sr-only">Loading...</span>
          </div>
        ),
        ssr: false,
      }),
    []
  );

  return (
    <Layout breadcrumb="Map">
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-5xl font-bold">Map</h1>
        <span className="text-muted-foreground text-sm">
          Locate the place that you want to visit in our map
        </span>
        <Map position={position} zoom={13} />
      </div>
    </Layout>
  );
};

export default MapClient;
