import type { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "peach" | "lavender" | "ink";
}) {
  const toneClass = {
    default: "text-sage-700",
    peach: "text-[#6b2f1c]",
    lavender: "text-[#2e2557]",
    ink: "text-white/70",
  }[tone];
  return (
    <div
      className={`text-[11px] font-mono uppercase tracking-[0.2em] ${toneClass} mb-6 font-semibold`}
    >
      {children}
    </div>
  );
}
