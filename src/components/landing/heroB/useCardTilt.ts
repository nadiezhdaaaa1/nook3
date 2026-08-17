import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

const MAX_TILT = 3.5;
/** degrees of physical tilt that map to full deflection */
const SENSOR_DIVISOR = 3;
const SENSOR_LERP = 0.14;
const SPRING = { stiffness: 300, damping: 25 } as const;

export type MotionPermission = "idle" | "granted" | "denied" | "unsupported";

export type CardTiltDebug = {
  path: "pointer" | "sensor" | "none";
  permission: MotionPermission;
  beta: number | null;
  gamma: number | null;
  events: number;
};

export type CardTilt = {
  ref: (node: HTMLElement | null) => void;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** true only on iOS-style browsers that gate the sensor behind a user gesture */
  needsMotionPermission: boolean;
  /** call from a click / pointerup handler */
  requestMotion: () => void;
  debug: CardTiltDebug | null;
  handlers: {
    onPointerMove?: (e: React.PointerEvent) => void;
    onPointerEnter?: (e: React.PointerEvent) => void;
    onPointerLeave?: () => void;
    onTouchStart?: () => void;
  };
};

function isTouch() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches;
}

type DOEWithPermission = {
  requestPermission?: () => Promise<PermissionState | string>;
};

function getDOE(): DOEWithPermission | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { DeviceOrientationEvent?: DOEWithPermission })
    .DeviceOrientationEvent;
}

function debugEnabled() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debug") === "motion";
}

/**
 * Cursor-driven press tilt + border-glow hotspot on pointer devices;
 * accelerometer-driven equivalent on touch devices.
 * Writes --x / --y / --glow-o CSS variables on the node.
 */
export function useCardTilt(disabled: boolean): CardTilt {
  const nodeRef = useRef<HTMLElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, SPRING);
  const rotateY = useSpring(rawY, SPRING);

  const [touch, setTouch] = useState(false);
  const [permission, setPermission] = useState<MotionPermission>("idle");
  const [debugOn, setDebugOn] = useState(false);
  const [reading, setReading] = useState<{ beta: number | null; gamma: number | null; events: number }>(
    { beta: null, gamma: null, events: 0 },
  );

  useEffect(() => {
    setTouch(isTouch());
    setDebugOn(debugEnabled());
  }, []);

  /**
   * Spotlight vars are element-local + viewport coordinates.
   */
  const setVars = useCallback((clientX: number, clientY: number, opacity?: number) => {
    const el = nodeRef.current;
    if (!el) return;
    el.style.setProperty("--x", `${clientX}`);
    el.style.setProperty("--y", `${clientY}`);
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${(clientX - r.left).toFixed(2)}`);
    el.style.setProperty("--ly", `${(clientY - r.top).toFixed(2)}`);
    if (typeof window !== "undefined") {
      el.style.setProperty("--xp", `${(clientX / window.innerWidth).toFixed(4)}`);
      el.style.setProperty("--yp", `${(clientY / window.innerHeight).toFixed(4)}`);
    }
    if (opacity !== undefined) el.style.setProperty("--glow-o", `${opacity}`);
  }, []);

  const ref = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  /* ---------- global cursor tracking (spotlight vars) ---------- */
  useEffect(() => {
    if (disabled || typeof window === "undefined" || isTouch()) return;
    const onMove = (e: PointerEvent) => setVars(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [disabled, setVars]);

  /* ---------- pointer ---------- */
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || e.pointerType === "touch") return;
      const el = nodeRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      rawX.set(((py - r.height / 2) / (r.height / 2)) * MAX_TILT);
      rawY.set(((r.width / 2 - px) / (r.width / 2)) * MAX_TILT);
      setVars(e.clientX, e.clientY, 1);
    },
    [disabled, rawX, rawY, setVars],
  );

  const onPointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || e.pointerType === "touch") return;
      setVars(e.clientX, e.clientY, 1);
    },
    [disabled, setVars],
  );

  const onPointerLeave = useCallback(() => {
    if (disabled) return;
    rawX.set(0);
    rawY.set(0);
    const el = nodeRef.current;
    if (el) el.style.setProperty("--glow-o", "0");
  }, [disabled, rawX, rawY]);

  /* ---------- accelerometer (touch) ---------- */
  const cleanupRef = useRef<(() => void) | null>(null);
  const runningRef = useRef(false);
  const debugRef = useRef(false);
  debugRef.current = debugOn;

  const startOrientation = useCallback(() => {
    if (disabled || runningRef.current || typeof window === "undefined") return;
    runningRef.current = true;

    let baseline: { beta: number; gamma: number } | null = null;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let visible = true;
    let raf = 0;
    let events = 0;
    let lastPush = 0;

    const el = nodeRef.current;
    const io =
      el && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              visible = !!entry?.isIntersecting;
              if (visible) baseline = null;
            },
            { threshold: 0.3 },
          )
        : null;
    if (io && el) io.observe(el);

    const clamp = (v: number) => Math.max(-MAX_TILT, Math.min(MAX_TILT, v));

    const onOrient = (e: DeviceOrientationEvent) => {
      events += 1;
      if (debugRef.current) {
        const now = Date.now();
        if (now - lastPush > 150) {
          lastPush = now;
          setReading({ beta: e.beta ?? null, gamma: e.gamma ?? null, events });
        }
      }
      if (!visible || e.beta == null || e.gamma == null) return;
      if (!baseline) baseline = { beta: e.beta, gamma: e.gamma };
      target = {
        x: clamp((e.beta - baseline.beta) / 8),
        y: clamp(-(e.gamma - baseline.gamma) / 8),
      };
    };

    const loop = () => {
      current = {
        x: current.x + (target.x - current.x) * 0.08,
        y: current.y + (target.y - current.y) * 0.08,
      };
      rawX.set(current.x);
      rawY.set(current.y);
      const node = nodeRef.current;
      if (node && visible) {
        const r = node.getBoundingClientRect();
        const gx = r.left + r.width / 2 + (-current.y / MAX_TILT) * (r.width / 2);
        const gy = r.top + r.height / 2 + (current.x / MAX_TILT) * (r.height / 2);
        setVars(gx, gy, 1);
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("deviceorientation", onOrient, true);
    raf = requestAnimationFrame(loop);

    cleanupRef.current = () => {
      window.removeEventListener("deviceorientation", onOrient, true);
      cancelAnimationFrame(raf);
      io?.disconnect();
      runningRef.current = false;
    };
  }, [disabled, rawX, rawY, setVars]);

  useEffect(() => () => cleanupRef.current?.(), []);

  /* ---------- mount-time start on non-gated browsers (Android etc.) ---------- */
  useEffect(() => {
    if (disabled || !touch) return;
    const DOE = getDOE();
    if (!DOE) {
      setPermission("unsupported");
      return;
    }
    if (typeof DOE.requestPermission === "function") return; // iOS: needs gesture
    setPermission("granted");
    startOrientation();
    return () => cleanupRef.current?.();
  }, [disabled, touch, startOrientation]);

  /* ---------- iOS gesture-gated request ---------- */
  const requestMotion = useCallback(() => {
    if (disabled) return;
    const DOE = getDOE();
    const req = DOE?.requestPermission;
    if (typeof req !== "function") {
      if (DOE) {
        setPermission("granted");
        startOrientation();
      } else {
        setPermission("unsupported");
      }
      return;
    }
    try {
      req
        .call(DOE)
        .then((res) => {
          if (res === "granted") {
            setPermission("granted");
            startOrientation();
          } else if (res === "denied") {
            setPermission("denied");
          } else {
            // unexpected result — allow a retry
            setPermission("idle");
          }
        })
        .catch(() => {
          // invalid gesture / transient failure — allow a retry
          setPermission("idle");
        });
    } catch {
      setPermission("idle");
    }
  }, [disabled, startOrientation]);

  const iosGated =
    !disabled && touch && permission !== "granted" && permission !== "denied" &&
    typeof getDOE()?.requestPermission === "function";

  return {
    ref,
    rotateX,
    rotateY,
    needsMotionPermission: iosGated,
    requestMotion,
    debug: debugOn
      ? {
          path: disabled ? "none" : touch ? "sensor" : "pointer",
          permission,
          beta: reading.beta,
          gamma: reading.gamma,
          events: reading.events,
        }
      : null,
    handlers:
      disabled || touch ? {} : { onPointerMove, onPointerEnter, onPointerLeave },
  };
}
