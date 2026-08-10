import { useEffect, useRef, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
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
  onSelect?: (id: string | null) => void;
  card?: ReactNode;
  className?: string;
}

function createMarker(listing: ListingPin): google.maps.Marker {
  return new google.maps.Marker({
    position: { lat: listing.coords[0], lng: listing.coords[1] },
    label: {
      text: `$${Math.round(listing.rent / 100) / 10}k`,
      color: "#ffffff",
      fontSize: "11px",
      fontWeight: "700",
    },
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 22,
      fillColor: "#6A820A",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    },
  });
}

function createOverlay(
  position: google.maps.LatLng,
  container: HTMLDivElement,
): google.maps.OverlayView {
  class ListingOverlay extends google.maps.OverlayView {
    position: google.maps.LatLng;
    private container: HTMLDivElement;

    constructor(position: google.maps.LatLng, container: HTMLDivElement) {
      super();
      this.position = position;
      this.container = container;
    }

    onAdd() {
      this.getPanes()?.overlayMouseTarget.appendChild(this.container);
    }

    draw() {
      const projection = this.getProjection();
      if (!projection) return;
      const pixel = projection.fromLatLngToDivPixel(this.position);
      if (!pixel) return;
      this.container.style.transform = `translate(${pixel.x}px, ${pixel.y}px)`;
    }

    onRemove() {
      if (this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  }

  return new ListingOverlay(position, container);
}

export function SampleListingsMap({
  city,
  listings,
  activeId,
  onSelect,
  card,
  className,
}: Props) {
  const ready = useGoogleMaps();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const overlayRef = useRef<{
    overlay: google.maps.OverlayView;
    root: Root;
  } | null>(null);

  // Initialize map once.
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const data = CITY_MAP[city.id];
    mapRef.current = new google.maps.Map(containerRef.current, {
      center: { lat: data.center[0], lng: data.center[1] },
      zoom: data.zoom,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      clickableIcons: false,
      zoomControl: false,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { elementType: "geometry", stylers: [{ color: "#f5f2ea" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#6e6459" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f7f4ec" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe3ef" }] },
      ],
    });
  }, [ready, city.id]);

  // Clicking the map base clears the active selection.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const listener = map.addListener("click", () => {
      onSelectRef.current?.(null);
    });
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [ready]);

  // Render/update markers when the listing set changes.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current.clear();

    const bounds = new google.maps.LatLngBounds();
    listings.forEach((l) => {
      const m = createMarker(l);
      m.addListener("click", () => onSelectRef.current?.(l.id));
      m.setMap(map);
      markersRef.current.set(l.id, m);
      bounds.extend({ lat: l.coords[0], lng: l.coords[1] });
    });

    if (listings.length > 1) {
      map.fitBounds(bounds, 60);
    } else if (listings.length === 1) {
      map.setCenter({ lat: listings[0].coords[0], lng: listings[0].coords[1] });
      map.setZoom(14);
    } else {
      const data = CITY_MAP[city.id];
      map.setCenter({ lat: data.center[0], lng: data.center[1] });
      map.setZoom(data.zoom);
    }
  }, [ready, city.id, listings]);

  // Update marker active state without re-fitting bounds.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    markersRef.current.forEach((m, id) => {
      const isActive = id === activeId;
      const label = m.getLabel() as google.maps.MarkerLabel;
      label.color = isActive ? "#6A820A" : "#ffffff";
      m.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 22,
        fillColor: isActive ? "#ffffff" : "#6A820A",
        fillOpacity: 1,
        strokeColor: "#6A820A",
        strokeWeight: 2,
      });
      m.setLabel(label);
    });
  }, [ready, activeId]);

  // Render the card overlay anchored to the active pin.
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    if (overlayRef.current) {
      overlayRef.current.root.unmount();
      overlayRef.current.overlay.setMap(null);
      overlayRef.current = null;
    }

    if (!activeId || !card) return;

    const active = listings.find((l) => l.id === activeId);
    if (!active) return;

    const position = new google.maps.LatLng(active.coords[0], active.coords[1]);

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "0";
    container.style.top = "0";
    container.style.pointerEvents = "none";

    const inner = document.createElement("div");
    inner.style.position = "absolute";
      inner.style.transform = "translate(-50%, calc(-100% - 22px))";
    inner.style.pointerEvents = "auto";
    container.appendChild(inner);

    const root = createRoot(inner);
    root.render(card);

    const overlay = createOverlay(position, container);
    overlay.setMap(mapRef.current);
    overlayRef.current = { overlay, root };

    return () => {
      if (overlayRef.current) {
        overlayRef.current.root.unmount();
        overlayRef.current.overlay.setMap(null);
        overlayRef.current = null;
      }
    };
  }, [ready, activeId, card, listings]);

  return (
    <div
      className={
        className ??
        "relative w-full h-[420px] md:h-[540px] rounded-card overflow-hidden border border-border bg-charcoal-100"
      }
    >
      <div ref={containerRef} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-charcoal-500">
          Loading map…
        </div>
      )}
    </div>
  );
}
