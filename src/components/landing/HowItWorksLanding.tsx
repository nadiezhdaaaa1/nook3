import { Search, ShieldCheck, BellRing } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "We watch 100+ sources, 24/7",
    body: "Brokerages, listing platforms, private landlord portals, niche Reddit boards. The second a unit posts anywhere, we see it.",
    bullets: [
      "StreetEasy · Zillow · Apartments.com",
      "Compass · Corcoran · Serhant · Douglas Elliman",
      "Private landlord sites + 90 more",
    ],
    quote: {
      text: "I got an alert for a Crown Heights 1BR seventeen minutes before it showed up on StreetEasy. Signed the lease the next day.",
      author: "Maya R.",
      role: "Renter · Brooklyn",
    },
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "We verify every listing against city data",
    body: "Rent-stabilization status, DOB violations, 311 complaints, bedbug history. You see the truth before you tour.",
    bullets: [
      "Rent-stabilized flag from HCR records",
      "DOB · HPD violations surfaced",
      "Health inspections + bedbug history",
    ],
    quote: {
      text: "Nook flagged a 'luxury' building with 14 open HPD violations. I would've signed without checking. Saved me a year of hell.",
      author: "Daniel K.",
      role: "Renter · Astoria",
    },
  },
  {
    n: "03",
    icon: BellRing,
    title: "You hear about it first — in seconds",
    body: "Email the instant a listing matches your filters. One tap to view, message, or save. No daily digest. No noise.",
    bullets: [
      "Median delivery: 47 seconds",
      "Email · one-tap actions",
      "Quiet hours + filter tuning anytime",
    ],
    quote: {
      text: "Three apartments in two weeks, all under market. I stopped refreshing StreetEasy on day one and never went back.",
      author: "Priya S.",
      role: "Renter · Jersey City",
    },
  },
];

export function HowItWorksLanding() {
  return (
    <section id="how" className="bg-surface py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 leading-[1.05]">
            Three things happen{" "}
            <span className="accent-italic">while you sleep.</span>
          </h2>
          <p className="mt-6 text-lg text-charcoal-700 leading-relaxed max-w-2xl">
            Set your filters once. Nook does the watching, the vetting, and
            the alerting — so when a real match drops, you're the first to
            know.
          </p>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="grid lg:grid-cols-[1fr_1.1fr] gap-px bg-charcoal-200/60 rounded-card overflow-hidden border border-charcoal-200/60 shadow-card"
              >
                {/* Left — narrative */}
                <div className="bg-surface-elevated p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-sage-700 font-semibold">
                      Step {s.n}
                    </div>
                    <div className="h-9 w-9 rounded-pill bg-sage-100 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-sage-700" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-2xl lg:text-3xl tracking-[-0.02em] text-charcoal-950 leading-tight mb-4">
                    {s.title}
                  </h3>
                  <p className="text-charcoal-700 leading-relaxed mb-6">
                    {s.body}
                  </p>
                  <ul className="space-y-2.5">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-sm text-charcoal-800"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-pill bg-sage-500 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right — testimonial */}
                <div className="bg-paper-warm p-8 lg:p-12 relative flex flex-col justify-center">
                  <div className="absolute top-6 right-8 font-display text-7xl lg:text-8xl text-charcoal-950/10 leading-none select-none">
                    “
                  </div>
                  <blockquote className="relative font-display text-xl lg:text-2xl text-charcoal-950 leading-snug tracking-[-0.01em]">
                    {s.quote.text}
                  </blockquote>
                  <figcaption className="relative mt-6 flex items-center gap-3">
                    <div
                      aria-hidden
                      className="h-10 w-10 rounded-pill bg-charcoal-950 text-paper flex items-center justify-center font-display font-bold text-sm"
                    >
                      {s.quote.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-charcoal-950">
                        {s.quote.author}
                      </div>
                      <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-charcoal-600">
                        {s.quote.role}
                      </div>
                    </div>
                    <div className="ml-auto text-[10px] font-mono uppercase tracking-[0.16em] text-sage-700 font-semibold hidden sm:block">
                      Verified renter #{1207 + i * 41}
                    </div>
                  </figcaption>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
