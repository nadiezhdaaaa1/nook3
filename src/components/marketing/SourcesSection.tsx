import { Eyebrow } from "./Eyebrow";
import { SectionReveal } from "./anim/SectionReveal";

const groups = [
  {
    label: "Major brokerages",
    items: ["Compass", "Corcoran", "Serhant", "Nest Seekers", "Douglas Elliman"],
  },
  {
    label: "Listing platforms",
    items: ["StreetEasy", "RentHop", "Zillow", "Citysnap", "Apartments.com"],
  },
  {
    label: "Private portals",
    items: ["StuyTown", "Glenwood", "Avalon", "Equity Residential", "TF Cornerstone"],
  },
  {
    label: "City records",
    items: ["DOB", "HPD", "HCR", "DOHMH", "311"],
  },
];

export function SourcesSection() {
  return (
    <section id="sources" className="relative bg-paper py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pattern-cross opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <SectionReveal>
          <Eyebrow>Sources</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 max-w-3xl mb-6">
            104+ sources.{" "}
            <span className="accent-italic">One inbox.</span>
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mb-16">
            We crawl every public rental site and every relevant city dataset so you don't
            have to keep twenty tabs open.
          </p>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {groups.map((g) => (
            <SectionReveal key={g.label}>
              <div className="bg-surface-elevated border border-border rounded-card p-6 h-full hover-lift">
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-sage-700 font-semibold mb-4">
                  {g.label}
                </div>
                <ul className="space-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="text-sm text-charcoal-800 font-medium">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
