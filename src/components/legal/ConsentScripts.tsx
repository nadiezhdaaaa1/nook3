import { useEffect } from "react";
import { useCookieConsent } from "@/lib/cookieConsent";

/**
 * Conditional script loader. Honors user cookie consent before injecting any
 * third-party tag. Tag IDs come from build-time env vars so devops can flip
 * them on per environment without code changes. If an env var is absent the
 * corresponding tag simply never loads.
 *
 * - Analytics consent gates Google Analytics (VITE_GA_ID) and Mixpanel
 *   (VITE_MIXPANEL_TOKEN, loaded lazily from CDN).
 * - Advertising consent gates Meta Pixel (VITE_META_PIXEL_ID).
 *
 * On revocation the injected <script> tags are removed and the related
 * globals nulled so subsequent page views send no further beacons until
 * consent is granted again.
 */
export function ConsentScripts() {
  const analytics = useCookieConsent((s) => s.consent.analytics);
  const advertising = useCookieConsent((s) => s.consent.advertising);
  const decidedAt = useCookieConsent((s) => s.decidedAt);

  // Wait for an explicit decision before injecting anything (GDPR / CPRA: no
  // pre-consent tracking).
  const hasDecided = decidedAt !== null;

  useEffect(() => {
    if (!hasDecided) return;

    const gaId = import.meta.env.VITE_GA_ID as string | undefined;
    if (analytics && gaId) {
      injectScript("nook-ga-loader", `https://www.googletagmanager.com/gtag/js?id=${gaId}`, true);
      injectInline(
        "nook-ga-init",
        `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`,
      );
    } else {
      removeScript("nook-ga-loader");
      removeScript("nook-ga-init");
      // Signal disabled state to any already-loaded gtag instance.
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      w.gtag?.("consent", "update", { analytics_storage: "denied" });
    }
  }, [analytics, hasDecided]);

  useEffect(() => {
    if (!hasDecided) return;

    const pixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
    if (advertising && pixelId) {
      injectInline(
        "nook-meta-pixel",
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`,
      );
    } else {
      removeScript("nook-meta-pixel");
      const w = window as unknown as { fbq?: ((...a: unknown[]) => void) | null };
      if (w.fbq) w.fbq = null;
    }
  }, [advertising, hasDecided]);

  return null;
}

function injectScript(id: string, src: string, async: boolean) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = async;
  document.head.appendChild(s);
}

function injectInline(id: string, code: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.text = code;
  document.head.appendChild(s);
}

function removeScript(id: string) {
  const el = document.getElementById(id);
  if (el) el.remove();
}
