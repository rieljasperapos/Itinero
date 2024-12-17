import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function MyMap(props: any) {
  const { position, zoom } = props

  return (
    <div className="h-[75vh]">
    <MapContainer attributionControl={false} center={position} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%", borderRadius: "30px", zIndex: 5 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          The location of the activity is here.
        </Popup>
      </Marker>
    </MapContainer>
    </div>
  )
}