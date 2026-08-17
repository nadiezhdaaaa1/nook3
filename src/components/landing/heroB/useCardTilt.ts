import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

const MAX_TILT = 2.5;
const SPRING = { stiffness: 300, damping: 25 } as const;

export type CardTilt = {
  ref: (node: HTMLElement | null) => void;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
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

  /**
   * Spotlight vars are VIEWPORT coordinates because the glow gradients use
   * background-attachment: fixed (GlowCard pattern).
   */
  const setVars = useCallback((clientX: number, clientY: number, opacity?: number) => {
    const el = nodeRef.current;
    if (!el) return;
    el.style.setProperty("--x", `${clientX}`);
    el.style.setProperty("--y", `${clientY}`);
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
      // corner under the cursor presses INTO the page
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
  const permission = useRef<"idle" | "granted" | "denied">("idle");

  const startOrientation = useCallback(() => {
    if (disabled || permission.current === "granted") return;
    permission.current = "granted";

    let baseline: { beta: number; gamma: number } | null = null;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let visible = true;
    let raf = 0;

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
        // hotspot slides toward the edge tilted down
        const gx = r.width / 2 + (-current.y / MAX_TILT) * (r.width / 2);
        const gy = r.height / 2 + (current.x / MAX_TILT) * (r.height / 2);
        setVars(gx, gy, visible ? 1 : 0);
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("deviceorientation", onOrient, true);
    raf = requestAnimationFrame(loop);

    cleanupRef.current = () => {
      window.removeEventListener("deviceorientation", onOrient, true);
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [disabled, rawX, rawY, setVars]);

  const cleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanupRef.current?.(), []);

  const onTouchStart = useCallback(() => {
    if (disabled || permission.current !== "idle") return;
    const DOE = (window as unknown as {
      DeviceOrientationEvent?: { requestPermission?: () => Promise<PermissionState | string> };
    }).DeviceOrientationEvent;
    if (!DOE) {
      permission.current = "denied";
      return;
    }
    if (typeof DOE.requestPermission === "function") {
      DOE.requestPermission()
        .then((res) => {
          if (res === "granted") startOrientation();
          else permission.current = "denied";
        })
        .catch(() => {
          permission.current = "denied";
        });
      return;
    }
    startOrientation();
  }, [disabled, startOrientation]);

  return {
    ref,
    rotateX,
    rotateY,
    handlers: disabled
      ? {}
      : isTouch()
        ? { onTouchStart }
        : { onPointerMove, onPointerEnter, onPointerLeave },
  };
}
