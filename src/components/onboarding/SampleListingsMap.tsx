import { useEffect, useRef, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
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

const PIN_STYLES: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  left: "0",
  top: "0",
  display: "inline-flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "8px 12px",
  fontFamily: "var(--font-sans), 'Google Sans Flex', ui-sans-serif, system-ui, sans-serif",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "120%",
  color: "#1C1C1E",
  borderRadius: "24px",
  border: "1px solid rgba(0, 0, 0, 0.20)",
  background: "#FFF",
  boxShadow: "0 1px 1px -0.25px rgba(0,0,0,0.08), 0 1px 1px -0.25px rgba(0,0,0,0.04)",
  cursor: "pointer",
  pointerEvents: "auto",
  whiteSpace: "nowrap",
  userSelect: "none",
};


function formatRent(rent: number): string {
  return `$${Math.round(rent / 100) / 10}k`;
}

function createPinElement(): HTMLDivElement {
  const pin = document.createElement("div");
  Object.assign(pin.style, PIN_STYLES);
  return pin;
}

class PinOverlay {
  private overlay: google.maps.OverlayView;
  private pin: HTMLDivElement;
  private position: google.maps.LatLng;
  private clickHandlers: Array<() => void> = [];
  private map: google.maps.Map | null = null;
  private scale = 1;
  private active = false;

  constructor(position: google.maps.LatLng, rent: number) {
    this.position = position;
    this.pin = createPinElement();
    this.pin.textContent = formatRent(rent);
    this.pin.addEventListener("click", (e) => {
      e.stopPropagation();
      this.clickHandlers.forEach((h) => h());
    });

    this.overlay = new google.maps.OverlayView();
    this.overlay.onAdd = () => {
      this.getPanes()?.overlayMouseTarget.appendChild(this.pin);
    };
    this.overlay.draw = () => {
      const projection = this.getProjection();
      if (!projection) return;
      const pixel = projection.fromLatLngToDivPixel(this.position);
      if (!pixel) return;
      this.pin.style.transform = `translate(${pixel.x}px, ${pixel.y}px) translate(-50%, -50%) scale(${this.scale})`;
    };
    this.overlay.onRemove = () => {
      if (this.pin.parentNode) {
        this.pin.parentNode.removeChild(this.pin);
      }
    };
  }

  private getPanes() {
    return this.overlay.getPanes();
  }

  private getProjection() {
    return this.overlay.getProjection();
  }

  setMap(map: google.maps.Map | null) {
    this.map = map;
    this.overlay.setMap(map);
  }

  addListener(event: string, handler: () => void) {
    if (event === "click") {
      this.clickHandlers.push(handler);
      return {
        remove: () => {
          this.clickHandlers = this.clickHandlers.filter((h) => h !== handler);
        },
      };
    }
    return { remove: () => {} };
  }

  getPosition() {
    return this.position;
  }

  setActive(isActive: boolean) {
    this.active = isActive;
    this.scale = isActive ? 1.05 : 1;
    if (isActive) {
      this.pin.style.background = "#6A820A";
      this.pin.style.color = "#FFFFFF";
      this.pin.style.borderColor = "#6A820A";
      this.pin.style.boxShadow = "0 0 0 2px rgba(106, 130, 10, 0.25), 0 1px 1px -0.25px rgba(0,0,0,0.08), 0 1px 1px -0.25px rgba(0,0,0,0.04)";
    } else {
      this.pin.style.background = "#FFF";
      this.pin.style.color = "#1C1C1E";
      this.pin.style.borderColor = "rgba(0, 0, 0, 0.20)";
      this.pin.style.boxShadow = PIN_STYLES.boxShadow as string;
    }
    this.overlay.draw();
  }


  panTo(map: google.maps.Map) {
    map.panTo(this.position);
  }
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
  const markersRef = useRef<Map<string, PinOverlay>>(new Map());
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
      const position = new google.maps.LatLng(l.coords[0], l.coords[1]);
      const overlay = new PinOverlay(position, l.rent);
      overlay.addListener("click", () => onSelectRef.current?.(l.id));
      overlay.setMap(map);
      markersRef.current.set(l.id, overlay);
      bounds.extend(position);
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
      m.setActive(isActive);
      if (isActive) m.panTo(mapRef.current!);
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
    // The new pill pins are ~34px tall and centered on the location; anchor the
    // card above the pin with a small gap.
    inner.style.transform = "translate(-50%, calc(-100% - 24px))";
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
      {ready && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 rounded-[12px] border border-black/20 bg-[#fffdf7]/90 p-1 shadow-sm backdrop-blur-sm">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => {
              const map = mapRef.current;
              if (!map) return;
              map.setZoom((map.getZoom() ?? 10) + 1);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[#241c12] transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#241c12]"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => {
              const map = mapRef.current;
              if (!map) return;
              map.setZoom((map.getZoom() ?? 10) - 1);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[#241c12] transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#241c12]"
          >
            <Minus size={16} />
          </button>
        </div>
      )}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-charcoal-500">
          Loading map…
        </div>
      )}
    </div>
  );
}
