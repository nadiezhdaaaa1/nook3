import { useEffect, useRef } from "react";
import type { CityId } from "@/data/cities";
import { useLandingStore } from "./landingStore";

const CACHE_KEY = "nook_detected_city";

// City name + region → supported CityId.
const CITY_MAP: Record<string, CityId> = {
  "New York": "nyc",
  Brooklyn: "nyc",
  Queens: "nyc",
  "Jersey City": "nyc",
  "Los Angeles": "la",
  "Long Beach": "la",
  Hollywood: "la",
  "San Francisco": "sf-bay",
  Oakland: "sf-bay",
  Berkeley: "sf-bay",
  "San Jose": "sf-bay",
  Chicago: "chicago",
  Washington: "dc",
  Boston: "boston",
  Cambridge: "boston",
  Somerville: "boston",
  Seattle: "seattle",
  Miami: "miami",
  "Miami Beach": "miami",
  Austin: "austin",
  Philadelphia: "philadelphia",
};

function match(city?: string): CityId | null {
  if (!city) return null;
  return CITY_MAP[city] ?? null;
}

export function useDetectedCity() {
  const setCity = useLandingStore((s) => s.setCity);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || typeof window === "undefined") return;
    ran.current = true;

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setCity(cached as CityId);
      return;
    }

    const ctrl = new AbortController();
    fetch("https://ipapi.co/json/", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const id = match(data?.city) ?? "nyc";
        sessionStorage.setItem(CACHE_KEY, id);
        setCity(id);
      })
      .catch(() => {
        /* keep default nyc */
      });

    return () => ctrl.abort();
  }, [setCity]);
}
