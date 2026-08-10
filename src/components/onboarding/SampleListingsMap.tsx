import { useEffect, useRef, useState, type ReactNode } from "react";
import { Maximize2, Minimize2, Minus, Plus } from "lucide-react";
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
  hoveredId?: string | null;
  onSelect?: (id: string | null) => void;
  card?: ReactNode;
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  topLeftControls?: ReactNode;
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

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

interface Cluster {
  id: string;
  anchor: google.maps.LatLng;
  members: ListingPin[];
}

const CLUSTER_THRESHOLD_PX = 44;

function computeClusters(
  map: google.maps.Map,
  listings: ListingPin[],
  threshold = CLUSTER_THRESHOLD_PX,
): Cluster[] {
  const toCluster = (l: ListingPin): Cluster => ({
    id: `cluster:${l.id}`,
    anchor: new google.maps.LatLng(l.coords[0], l.coords[1]),
    members: [l],
  });

  const projection = map.getProjection();
  const zoom = map.getZoom();
  if (!projection || zoom == null) return listings.map(toCluster);

  const scale = Math.pow(2, zoom);
  const points = listings.map((l) => {
    const point = projection.fromLatLngToPoint(new google.maps.LatLng(l.coords[0], l.coords[1]));
    return { listing: l, x: (point?.x ?? 0) * scale, y: (point?.y ?? 0) * scale };
  });

  const used = new Set<number>();
  const clusters: Cluster[] = [];
  points.forEach((p, i) => {
    if (used.has(i)) return;
    used.add(i);
    const members = [p.listing];
    points.forEach((q, j) => {
      if (j <= i || used.has(j)) return;
      if (Math.hypot(p.x - q.x, p.y - q.y) <= threshold) {
        used.add(j);
        members.push(q.listing);
      }
    });
    clusters.push({
      id: `cluster:${p.listing.id}`,
      anchor: new google.maps.LatLng(p.listing.coords[0], p.listing.coords[1]),
      members,
    });
  });
  return clusters;
}

function clusterSignature(clusters: Cluster[]): string {
  return clusters.map((c) => c.members.map((m) => m.id).join("+")).join("|");
}

function createPinElement(): HTMLDivElement {
  const pin = document.createElement("div");
  Object.assign(pin.style, PIN_STYLES);
  return pin;
}


type PinVariant = "price" | "count" | "dot";

class PinOverlay {
  private overlay: google.maps.OverlayView;
  private pin: HTMLDivElement;
  private position: google.maps.LatLng;
  private clickHandlers: Array<() => void> = [];
  private map: google.maps.Map | null = null;
  private scale = 1;
  private active = false;
  private variant: PinVariant;
  private offset: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    position: google.maps.LatLng,
    label: string,
    variant: PinVariant = "price",
    animate = false,
  ) {
    this.position = position;
    this.variant = variant;
    this.pin = createPinElement();
    if (variant === "dot") {
      this.pin.style.padding = "0";
      this.pin.style.width = "8px";
      this.pin.style.height = "8px";
      this.pin.style.borderRadius = "9999px";
      this.pin.style.background = "rgba(36, 28, 18, 0.35)";
      this.pin.style.border = "1px solid rgba(255,255,255,0.7)";
      this.pin.style.boxShadow = "none";
      this.pin.style.cursor = "default";
      this.pin.style.pointerEvents = "none";
    } else {
      this.pin.textContent = label;
      if (variant === "count") {
        this.pin.style.padding = "10px 16px";
        this.pin.style.fontSize = "17px";
        this.pin.style.minWidth = "44px";
      }
    }
    if (animate && !prefersReducedMotion()) {
      this.pin.style.transition = "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)";
    }
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
      this.pin.style.transform = `translate(${pixel.x}px, ${pixel.y}px) translate(-50%, -50%) translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale})`;
    };
    this.overlay.onRemove = () => {
      if (this.pin.parentNode) {
        this.pin.parentNode.removeChild(this.pin);
      }
    };
  }

  setOffset(x: number, y: number) {
    this.offset = { x, y };
    this.overlay.draw();
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

  bringToFront() {
    if (this.pin.parentNode) {
      this.pin.parentNode.appendChild(this.pin);
    }
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
  hoveredId,
  onSelect,
  card,
  className,
  isFullscreen,
  onToggleFullscreen,
  topLeftControls,
}: Props) {


  const ready = useGoogleMaps();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, PinOverlay>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const signatureRef = useRef<string>("");


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

  // Clicking the map base clears the active selection and collapses any stack.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const listener = map.addListener("click", () => {
      setExpandedId(null);
      onSelectRef.current?.(null);
    });
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [ready]);


  // Fit the viewport to the listing set (does not depend on clustering).
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    if (listings.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      listings.forEach((l) => bounds.extend(new google.maps.LatLng(l.coords[0], l.coords[1])));
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

  // Recompute clusters whenever the map settles or the listing set changes.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    const recompute = () => {
      const next = computeClusters(map, listings);
      const signature = clusterSignature(next);
      if (signature === signatureRef.current) return;
      signatureRef.current = signature;
      setClusters(next);
    };

    recompute();
    const idle = map.addListener("idle", recompute);
    const zoom = map.addListener("zoom_changed", () => setExpandedId(null));
    const drag = map.addListener("dragstart", () => setExpandedId(null));
    return () => {
      google.maps.event.removeListener(idle);
      google.maps.event.removeListener(zoom);
      google.maps.event.removeListener(drag);
    };
  }, [ready, listings]);

  // Render pins for the current clustering / expansion state.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current.clear();

    clusters.forEach((cluster) => {
      const collapsed = cluster.members.length > 1 && expandedId !== cluster.id;

      if (collapsed) {
        const pin = new PinOverlay(cluster.anchor, String(cluster.members.length), "count");
        pin.addListener("click", () => {
          setExpandedId(cluster.id);
        });
        pin.setMap(map);
        markersRef.current.set(cluster.id, pin);
        return;
      }

      if (cluster.members.length > 1) {
        const dot = new PinOverlay(cluster.anchor, "", "dot");
        dot.setMap(map);
        markersRef.current.set(`${cluster.id}:dot`, dot);
      }

      const count = cluster.members.length;
      const radius = count > 1 ? 40 + count * 2 : 0;
      cluster.members.forEach((l, index) => {
        const position = new google.maps.LatLng(l.coords[0], l.coords[1]);
        const pin = new PinOverlay(position, formatRent(l.rent), "price", count > 1);
        if (count > 1) {
          const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
          pin.setOffset(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        pin.addListener("click", () => {
          if (count === 1) setExpandedId(null);
          onSelectRef.current?.(l.id);
        });
        pin.setMap(map);
        markersRef.current.set(l.id, pin);
      });
    });
  }, [ready, clusters, expandedId]);

  // Update marker active state without re-fitting bounds.
  // Hover takes visual priority over the selected pin.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const clusterOf = new Map<string, Cluster>();
    clusters.forEach((c) => c.members.forEach((m) => clusterOf.set(m.id, c)));

    const highlightIds = new Set<string>();
    [hoveredId, activeId].forEach((id) => {
      if (!id) return;
      if (markersRef.current.has(id)) {
        highlightIds.add(id);
        return;
      }
      const cluster = clusterOf.get(id);
      if (cluster && markersRef.current.has(cluster.id)) highlightIds.add(cluster.id);
    });

    markersRef.current.forEach((m, id) => {
      if (id.endsWith(":dot")) return;
      const highlighted = highlightIds.has(id);
      m.setActive(highlighted);
      if (highlighted) m.bringToFront();
    });

    if (activeId && !hoveredId) {
      const target = markersRef.current.get(activeId) ?? markersRef.current.get(clusterOf.get(activeId)?.id ?? "");
      target?.panTo(mapRef.current);
    }
  }, [ready, activeId, hoveredId, clusters, expandedId]);



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
