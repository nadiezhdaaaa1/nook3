import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { CITY_LIST, type CityId } from "@/data/cities";
import { CITY_TINT, CITY_PHOTO } from "@/data/cities/cards";

interface Props {
  value: CityId | null;
  onChange: (id: CityId) => void;
  /** Live search query — filters the row. */
  query?: string;
  /** City id currently animating between picker and selected banner. */
  animatingId?: CityId | null;
}

export function CityPicker({ value, onChange, query = "", animatingId = null }: Props) {
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

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label="Pick your city"
      className="ob-cards-row flex gap-3 overflow-x-auto pb-2"
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
      {cities.map((c) => {
        const isAnimating = animatingId === c.id;
        return (
          <motion.button
            key={c.id}
            type="button"
            aria-pressed={value === c.id}
            onClick={() => onChange(c.id)}
            className="ob-city-card shrink-0 text-left"
            style={{
              width: 188,
              borderRadius: 24,
              padding: 12,
              background: CITY_TINT[c.id],
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            layoutId={isAnimating ? `city-card-${c.id}` : undefined}
          >
            <motion.div
              className="overflow-hidden mx-auto"
              style={{ width: 120, height: 120, borderRadius: 9999, background: "rgba(0,0,0,0.06)" }}
              layoutId={isAnimating ? `city-photo-${c.id}` : undefined}
            >
              {CITY_PHOTO[c.id] && (
                <img
                  src={CITY_PHOTO[c.id]}
                  alt={c.displayName}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </motion.div>
            <motion.div
              className="font-display text-center"
              style={{
                marginTop: 14,
                padding: "4px 0",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: 1.25,
                letterSpacing: "-0.2px",
                color: "#241c12",
              }}
              layoutId={isAnimating ? `city-name-${c.id}` : undefined}
            >
              {c.displayName}
            </motion.div>
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
