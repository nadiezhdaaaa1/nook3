import { Clock, Inbox, EyeOff, Repeat } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";

const pains = [
  {
    icon: Clock,
    stat: "47 min",
    label: "Median age of a StreetEasy listing when you see it",
    body: "By the time it shows up in your feed, 14 people have already toured. The 'available' ones are scraps.",
  },
  {
    icon: Inbox,
    stat: "6 tabs",
    label: "Sites you're refreshing right now",
    body: "StreetEasy, Zillow, Apartments.com, Compass, Craigslist, Reddit. None of them talk to each other. None of them are real-time.",
  },
  {
    icon: EyeOff,
    stat: "73%",
    label: "Of rent-stabilized listings never reach big portals",
    body: "Small landlords post once on their own site and rent it within a day. You'd never know it existed.",
  },
  {
    icon: Repeat,
    stat: "3 months",
    label: "Average search time for a 1-bed under market",
    body: "Refresh, scroll, email, no reply. Then start over tomorrow. The system isn't broken — it was never built for you.",
  },
];

export function WhyStillLooking() {
  return (
    <section
      id="why"
      className="relative bg-paper-warm border-y border-charcoal-200/60 py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <Eyebrow tone="peach">The problem</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 leading-[1.05]">
            Still looking after{" "}
            <span className="accent-italic">three months?</span>
          </h2>
          <p className="mt-6 text-lg text-charcoal-700 leading-relaxed max-w-2xl">
            The apartment search isn't slow because you're not trying hard
            enough. It's slow because the tools you're using all show you the
            same picked-over listings, hours after they post.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-charcoal-200/60 rounded-card overflow-hidden border border-charcoal-200/60">
          {pains.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="bg-paper-warm p-8 lg:p-10 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-pill bg-charcoal-950 text-paper flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="font-display text-3xl lg:text-4xl font-bold text-charcoal-950 tracking-[-0.02em]">
                    {p.stat}
                  </div>
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-charcoal-600 mb-3 font-semibold">
                  {p.label}
                </div>
                <p className="text-charcoal-700 leading-relaxed text-sm lg:text-base">
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
