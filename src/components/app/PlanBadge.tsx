import { cn } from "@/lib/utils";

export type PlanKey = "intro" | "pro";

const LABEL_CLASS =
  "text-[11px] font-bold leading-[14px] tracking-[1.5px] uppercase";

/** 4-glow aurora layers (top-left, top-right, bottom-right, bottom-left). */
function aurora(c1: string, c2: string, c3: string, c4: string) {
  return [
    `radial-gradient(60% 120% at 0% 0%, ${c1} 0%, rgba(0,0,0,0) 60%)`,
    `radial-gradient(60% 120% at 100% 0%, ${c2} 0%, rgba(0,0,0,0) 60%)`,
    `radial-gradient(60% 120% at 100% 100%, ${c3} 0%, rgba(0,0,0,0) 60%)`,
    `radial-gradient(60% 120% at 0% 100%, ${c4} 0%, rgba(0,0,0,0) 60%)`,
  ].join(", ");
}

const PREMIUM_AURORA = aurora(
  "rgba(255, 205, 0, 0.14)",
  "rgba(203, 74, 10, 0.26)",
  "rgba(122, 143, 55, 0.30)",
  "rgba(120, 165, 200, 0.12)",
);


export function PlanBadge({
  plan,
  className,
}: {
  plan: PlanKey;
  className?: string;
}) {
  const base =
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[999px] px-2 py-1";

  if (plan === "intro") {
    return (
      <span
        className={cn(
          base,
          "w-[62px] border border-black/20 bg-white text-[#241C12]",
          className,
        )}
      >
        <span className={LABEL_CLASS}>Intro</span>
      </span>
    );
  }

  return (
    <span
      className={cn(base, "w-[54px] text-white", className)}
      style={{ backgroundColor: "#6A820A" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: PREMIUM_AURORA }}
      />
      <span className={cn(LABEL_CLASS, "relative")}>Pro</span>
    </span>
  );
}
