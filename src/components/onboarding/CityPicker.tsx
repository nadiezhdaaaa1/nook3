import { useMemo, useRef } from "react";
import { CITY_LIST, type CityId } from "@/data/cities";
import { CITY_TINT, CITY_PHOTO } from "@/data/cities/cards";

interface Props {
  value: CityId | null;
  onChange: (id: CityId) => void;
  /** Live search query — filters the row. */
  query?: string;
}

export function CityPicker({ value, onChange, query = "" }: Props) {
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
      {cities.map((c) => (
        <button
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
        >
          <div
            className="w-full overflow-hidden"
            style={{ height: 136, borderRadius: 14, background: "rgba(0,0,0,0.06)" }}
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
              marginTop: 8,
              padding: "8px 0",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: 1.2,
              letterSpacing: "-0.45px",
              color: "#241c12",
            }}
          >
            {c.displayName}
          </div>
        </button>
      ))}
      {cities.length === 0 && (
        <div className="text-sm" style={{ color: "#5a5a55" }}>
          No cities match that search.
        </div>
      )}
    </div>
  );
}
