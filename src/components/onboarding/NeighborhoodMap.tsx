import { useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { useGoogleMaps } from "@/lib/maps/useGoogleMaps";
import type { CityConfig } from "@/data/cities";
import { CITY_MAP } from "@/data/cities/mapData";
import { cn } from "@/lib/utils";

interface Props {
  city: CityConfig;
  selected: string[];
  onToggle: (name: string) => void;
}

interface PlaceSuggestion {
  placeId: string;
  text: string;
}

/**
 * Distance in km between two lat/lng using Haversine.
 */
function distanceKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function NeighborhoodMap({ city, selected, onToggle }: Props) {
  const ready = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Record<string, google.maps.Marker>>({});
  const searchMarkerRef = useRef<google.maps.Marker | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [nearestHint, setNearestHint] = useState<{
    name: string;
    distanceKm: number;
  } | null>(null);

  const map = CITY_MAP[city.id];
  const knownEntries = useMemo(() => Object.entries(map.neighborhoods), [map]);

  // Init map
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current) return;
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: map.center[0], lng: map.center[1] },
      zoom: map.zoom,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "greedy",
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      ],
    });
  }, [ready, map]);

  // Re-center when city changes
  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setCenter({ lat: map.center[0], lng: map.center[1] });
    mapInstance.current.setZoom(map.zoom);
  }, [map]);

  // Render / update markers
  useEffect(() => {
    if (!ready || !mapInstance.current) return;
    // Drop old markers
    for (const m of Object.values(markersRef.current)) m.setMap(null);
    markersRef.current = {};

    for (const [name, [lat, lng]] of knownEntries) {
      const isSelected = selected.includes(name);
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 10 : 6,
          fillColor: isSelected ? "#1f1f1f" : "#ffffff",
          fillOpacity: 1,
          strokeColor: "#1f1f1f",
          strokeWeight: 2,
        },
        label: isSelected
          ? { text: "✓", color: "#fff", fontSize: "12px", fontWeight: "700" }
          : undefined,
        zIndex: isSelected ? 100 : 10,
      });
      marker.addListener("click", () => onToggle(name));
      markersRef.current[name] = marker;
    }
  }, [ready, knownEntries, selected, onToggle]);

  // Places Autocomplete (New) — debounced
  useEffect(() => {
    if (!ready) return;
    const handle = setTimeout(async () => {
      const trimmed = query.trim();
      if (trimmed.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const { AutocompleteSuggestion, AutocompleteSessionToken } =
          (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }
        const { suggestions: raw } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: trimmed,
            sessionToken: sessionTokenRef.current,
            locationBias: {
              center: { lat: map.center[0], lng: map.center[1] },
              radius: 30000,
            },
          });
        const items: PlaceSuggestion[] = [];
        for (const s of raw) {
          const p = s.placePrediction;
          if (!p) continue;
          items.push({
            placeId: p.placeId,
            text: p.text?.toString() ?? "",
          });
        }
        setSuggestions(items);
      } catch (err) {
        console.error("autocomplete failed", err);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query, ready, map]);

  const selectSuggestion = async (s: PlaceSuggestion) => {
    if (!mapInstance.current) return;
    try {
      const { Place } = (await google.maps.importLibrary(
        "places",
      )) as google.maps.PlacesLibrary;
      const place = new Place({ id: s.placeId });
      await place.fetchFields({ fields: ["location", "displayName"] });
      const loc = place.location;
      if (!loc) return;
      const coords: [number, number] = [loc.lat(), loc.lng()];
      mapInstance.current.panTo({ lat: coords[0], lng: coords[1] });
      mapInstance.current.setZoom(14);

      // Drop a temporary search marker
      if (searchMarkerRef.current) searchMarkerRef.current.setMap(null);
      searchMarkerRef.current = new google.maps.Marker({
        position: { lat: coords[0], lng: coords[1] },
        map: mapInstance.current,
        animation: google.maps.Animation.DROP,
      });

      // Find nearest known neighborhood within 2 km
      let nearest: { name: string; distanceKm: number } | null = null;
      for (const [name, c] of knownEntries) {
        const d = distanceKm(coords, c);
        if (!nearest || d < nearest.distanceKm) nearest = { name, distanceKm: d };
      }
      if (nearest && nearest.distanceKm <= 2.5) setNearestHint(nearest);
      else setNearestHint(null);

      setQuery(s.text);
      setSearchOpen(false);
      sessionTokenRef.current = null; // start a new session after a selection
    } catch (err) {
      console.error("place details failed", err);
    }
  };

  if (!ready) {
    return (
      <div className="h-72 sm:h-96 rounded-card bg-surface-elevated border border-border flex items-center justify-center text-sm text-charcoal-500">
        Loading map…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Address search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder={`Search an address or place in ${city.displayName}…`}
          className="w-full h-12 pl-11 pr-10 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium placeholder:text-charcoal-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setNearestHint(null);
              if (searchMarkerRef.current) {
                searchMarkerRef.current.setMap(null);
                searchMarkerRef.current = null;
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-pill hover:bg-charcoal-950/5"
          >
            <X className="h-3.5 w-3.5 text-charcoal-500" />
          </button>
        )}
        {searchOpen && suggestions.length > 0 && (
          <div className="absolute z-10 top-full mt-1 left-0 right-0 rounded-md bg-paper border border-border shadow-lg max-h-72 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={s.placeId}
                type="button"
                onClick={() => selectSuggestion(s)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-charcoal-950/5 text-sm"
              >
                <MapPin className="h-4 w-4 text-charcoal-400 shrink-0" />
                <span className="text-charcoal-800">{s.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {nearestHint && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-sage-100/60 border border-sage-300/50">
          <div className="text-sm text-sage-900">
            Nearest neighborhood: <strong>{nearestHint.name}</strong>{" "}
            <span className="text-xs text-sage-700">
              · {nearestHint.distanceKm.toFixed(1)} km away
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onToggle(nearestHint.name);
              setNearestHint(null);
            }}
            className={cn(
              "h-9 px-3 rounded-pill text-xs font-semibold",
              selected.includes(nearestHint.name)
                ? "bg-charcoal-200 text-charcoal-700"
                : "bg-charcoal-950 text-paper",
            )}
          >
            {selected.includes(nearestHint.name) ? "Remove" : "Add neighborhood"}
          </button>
        </div>
      )}

      <div
        ref={mapRef}
        className="h-72 sm:h-96 rounded-card overflow-hidden border border-border bg-surface-elevated"
      />

      {knownEntries.length === 0 ? (
        <p className="text-xs text-charcoal-500">
          Map markers for {city.displayName} are coming — use search above to pinpoint an address.
        </p>
      ) : (
        <p className="text-xs text-charcoal-500">
          Tap a dot to add or remove a neighborhood. {knownEntries.length} mapped in {city.displayName}.
        </p>
      )}
    </div>
  );
}
