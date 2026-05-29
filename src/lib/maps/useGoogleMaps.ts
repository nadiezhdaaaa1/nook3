import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: typeof google;
    __nookMapsCallback?: () => void;
    __nookMapsPromise?: Promise<void>;
  }
}

const SCRIPT_ID = "nook-gmaps-js";

/**
 * Loads the Google Maps JS API once, with async + callback per platform best practice.
 * Returns true once `google.maps` is ready.
 */
export function useGoogleMaps(): boolean {
  const [ready, setReady] = useState(
    () => typeof window !== "undefined" && !!window.google?.maps,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.maps) {
      setReady(true);
      return;
    }
    if (!window.__nookMapsPromise) {
      const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
      const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
      if (!key) {
        console.error("Missing VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY");
        return;
      }
      window.__nookMapsPromise = new Promise<void>((resolve) => {
        window.__nookMapsCallback = () => resolve();
        const s = document.createElement("script");
        s.id = SCRIPT_ID;
        s.async = true;
        s.defer = true;
        s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&libraries=places&callback=__nookMapsCallback${
          channel ? `&channel=${channel}` : ""
        }`;
        document.head.appendChild(s);
      });
    }
    let cancelled = false;
    window.__nookMapsPromise.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
