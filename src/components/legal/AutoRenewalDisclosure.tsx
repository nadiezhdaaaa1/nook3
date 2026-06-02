/**
 * Auto-renewal disclosure shown directly under any paid-plan CTA.
 * Per US consumer-protection / NY auto-renewal best practice the disclosure
 * must be the same visual weight as the price, in immediate proximity to
 * the CTA, and state: amount, cadence, that it auto-renews, and how to cancel.
 */
export function AutoRenewalDisclosure({
  price,
  cadence = "month",
  align = "center",
  tone = "default",
}: {
  /** Display price, e.g. "$14.99" or "$119" */
  price: string;
  /** "month" or "year" */
  cadence?: "month" | "year";
  align?: "left" | "center";
  /** "default" = on light bg; "onDark" = on charcoal/dark cards */
  tone?: "default" | "onDark";
}) {
  const color = tone === "onDark" ? "text-paper/75" : "text-charcoal-600";
  const accent = tone === "onDark" ? "text-paper" : "text-charcoal-950";
  return (
    <p
      className={`mt-2 text-xs leading-relaxed ${color} ${align === "center" ? "text-center" : "text-left"}`}
    >
      Auto-renews at <span className={`font-semibold ${accent}`}>{price}/{cadence}</span> until cancelled.
      Cancel anytime in{" "}
      <span className={`font-semibold ${accent}`}>Account → Subscription</span>.
      No hidden fees.
    </p>
  );
}
