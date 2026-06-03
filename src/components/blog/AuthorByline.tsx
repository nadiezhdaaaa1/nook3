export function AuthorByline({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-6 w-6 text-[11px]" : "h-10 w-10 text-sm";
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dim} rounded-full flex items-center justify-center font-display font-semibold`}
        style={{
          backgroundColor: "var(--color-brand-sage)",
          color: "var(--color-brand-cream)",
        }}
        aria-hidden="true"
      >
        N
      </div>
      <span className="text-sm font-medium text-[var(--color-charcoal-700)]">
        By Nook Team
      </span>
    </div>
  );
}
