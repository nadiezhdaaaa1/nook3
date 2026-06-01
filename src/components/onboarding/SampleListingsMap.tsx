import { useEffect, useRef } from "react";
import type { CityConfig } from "@/data/cities";
import { useGoogleMaps } from "@/lib/maps/useGoogleMaps";
import { CITY_MAP } from "@/data/cities/mapData";

interface ListingPin {
  id: string;
  coords: [number, number];
  rent: number;
  label?: string;
}

interface Props {
  city: CityConfig;
  listings: ListingPin[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}

export function SampleListingsMap({ city, listings, activeId, onSelect }: Props) {
  const ready = useGoogleMaps();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const data = CITY_MAP[city.id];
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(containerRef.current, {
        center: { lat: data.center[0], lng: data.center[1] },
        zoom: data.zoom,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      });
    }
    const map = mapRef.current;

    // Clear stale markers
    for (const m of markersRef.current.values()) m.setMap(null);
    markersRef.current.clear();

    const bounds = new google.maps.LatLngBounds();
    listings.forEach((l) => {
      const isActive = l.id === activeId;
      const m = new google.maps.Marker({
        position: { lat: l.coords[0], lng: l.coords[1] },
        map,
        label: {
          text: `$${Math.round(l.rent / 100) / 10}k`,
          color: isActive ? "#fafaf7" : "#0d0d0d",
          fontSize: "11px",
          fontWeight: "700",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 22,
          fillColor: isActive ? "#0d0d0d" : "#fafaf7",
          fillOpacity: 1,
          strokeColor: "#0d0d0d",
          strokeWeight: 2,
        },
      });
      m.addListener("click", () => onSelect?.(l.id));
      markersRef.current.set(l.id, m);
      bounds.extend({ lat: l.coords[0], lng: l.coords[1] });
    });

    if (listings.length > 1) {
      map.fitBounds(bounds, 60);
    } else if (listings.length === 1) {
      map.setCenter({ lat: listings[0].coords[0], lng: listings[0].coords[1] });
      map.setZoom(14);
    }
  }, [ready, city.id, listings, activeId, onSelect]);

  return (
    <div className="relative w-full h-72 rounded-card overflow-hidden border border-border bg-charcoal-100">
      <div ref={containerRef} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-charcoal-500">
          Loading map…
        </div>
      )}
    </div>
  );
}
