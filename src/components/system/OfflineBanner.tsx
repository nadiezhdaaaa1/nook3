import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * Fixed banner shown while the browser reports it is offline.
 * Auto-hides when connectivity is restored.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-[60] bg-charcoal-950 text-paper text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2 shadow-lg"
    >
      <WifiOff className="h-3.5 w-3.5" />
      You're offline — changes will sync when you reconnect.
    </div>
  );
}
