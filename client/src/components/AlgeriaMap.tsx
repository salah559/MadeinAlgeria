import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Factory {
  id: string;
  name: string;
  nameAr: string;
  wilaya: string;
  latitude?: string;
  longitude?: string;
}

interface AlgeriaMapProps {
  factories: Factory[];
  onFactoryClick?: (factoryId: string) => void;
  className?: string;
}

function MapBoundsUpdater({ factories }: { factories: Factory[] }) {
  const map = useMap();

  useEffect(() => {
    const factoriesWithCoords = factories.filter(
      (f) => f.latitude && f.longitude
    );

    if (factoriesWithCoords.length > 0) {
      const bounds = L.latLngBounds(
        factoriesWithCoords.map((f) => [
          parseFloat(f.latitude!),
          parseFloat(f.longitude!),
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [factories, map]);

  return null;
}

export default function AlgeriaMap({
  factories,
  onFactoryClick,
  className = "h-[400px] md:h-[500px] w-full rounded-md overflow-hidden border",
}: AlgeriaMapProps) {
  const algeriaCenter: [number, number] = [28.0339, 1.6596];

  const factoriesWithCoords = factories.filter(
    (f) => f.latitude && f.longitude
  );

  const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className={className} data-testid="map-algeria">
      <MapContainer
        center={algeriaCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {factoriesWithCoords.map((factory) => (
          <Marker
            key={factory.id}
            position={[parseFloat(factory.latitude!), parseFloat(factory.longitude!)]}
            icon={customIcon}
            eventHandlers={{
              click: () => onFactoryClick && onFactoryClick(factory.id),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-foreground">{factory.nameAr}</p>
                <p className="text-xs text-muted-foreground">{factory.wilaya}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {factoriesWithCoords.length > 0 && (
          <MapBoundsUpdater factories={factoriesWithCoords} />
        )}
      </MapContainer>
    </div>
  );
}
