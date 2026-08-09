import { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CITY_LIST, type CityId } from "@/data/cities";
import { CITY_TINT, CITY_PHOTO } from "@/data/cities/cards";

interface Props {
  value: CityId | null;
  onChange: (id: CityId) => void;
  /** Live search query — filters the row. */
  query?: string;
  /** City id currently animating out of the picker. */
  animatingId?: CityId | null;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function CityPicker({ value, onChange, query = "", animatingId = null }: Props) {
  const reduce = useReducedMotion();
  const cities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CITY_LIST;
    return CITY_LIST.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q),
    );
  }, [query]);

  const rowRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = rowRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: 0 };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rowRef.current;
    if (!drag.current.active || !el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) {
      drag.current.moved = Math.abs(dx);
      el.classList.add("is-dragging");
      el.setPointerCapture?.(e.pointerId);
    }
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rowRef.current;
    drag.current.active = false;
    if (!el) return;
    el.releasePointerCapture?.(e.pointerId);
    // keep the class one frame so the click that follows a drag is swallowed
    requestAnimationFrame(() => el.classList.remove("is-dragging"));
  };

  const pressedIndex = animatingId ? cities.findIndex((c) => c.id === animatingId) : -1;

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label="Pick your city"
      className="ob-cards-row flex gap-4 overflow-x-auto pb-2"
      style={animatingId ? { pointerEvents: "none" } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDragStart={(e) => e.preventDefault()}
      onClickCapture={(e) => {
        if (drag.current.moved > 4) {
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = 0;
        }
      }}
    >
      {cities.map((c, i) => {
        const isPressed = animatingId === c.id;
        const others = Boolean(animatingId) && !isPressed;
        const stagger =
          pressedIndex >= 0 ? Math.min(Math.abs(i - pressedIndex) * 0.06, 0.24) : 0;

        let animate: Record<string, number> = { opacity: 1, scale: 1 };
        let transition: Record<string, unknown> = { duration: 0.25, ease: EASE };

        if (reduce) {
          if (animatingId) animate = { opacity: 0, scale: 1 };
          transition = { duration: 0.15, ease: "linear" };
        } else if (isPressed) {
          animate = { opacity: 0, scale: 1.1 };
          transition = {
            scale: { duration: 0.35, ease: EASE },
            opacity: { duration: 0.2, delay: 0.35, ease: EASE },
          };
        } else if (others) {
          animate = { opacity: 0, scale: 0.98 };
          transition = { duration: 0.3, delay: stagger, ease: EASE };
        }

        return (
          <motion.button
            key={c.id}
            type="button"
            aria-pressed={value === c.id}
            onClick={() => onChange(c.id)}
            className="ob-city-card shrink-0 flex flex-col items-center justify-center"
            style={{
              width: 188,
              height: 219,
              borderRadius: 24,
              padding: "32px 24px",
              gap: 16,
              background: CITY_TINT[c.id],
              zIndex: isPressed ? 2 : 1,
            }}
            animate={animate}
            transition={transition}
          >
            <div
              className="overflow-hidden shrink-0"
              style={{
                width: 120,
                height: 120,
                borderRadius: 9999,
                background: "rgba(0,0,0,0.06)",
              }}
            >
              {CITY_PHOTO[c.id] && (
                <img
                  src={CITY_PHOTO[c.id]}
                  alt={c.displayName}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div
              className="font-display text-center"
              style={{
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.2,
                letterSpacing: "-0.45px",
                color: "#241c12",
              }}
            >
              {c.displayName}
            </div>
          </motion.button>
        );
      })}
      {cities.length === 0 && (
        <div className="text-sm" style={{ color: "#5a5a55" }}>
          No cities match that search.
        </div>
      )}
    </div>
  );
}
