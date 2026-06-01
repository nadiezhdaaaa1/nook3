import { Sparkles, Send } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";

const exchanges = [
  {
    user: "Is $3,200 fair for a 1BR in Park Slope?",
    wren: "Slightly above median. Park Slope 1BRs averaged $2,950 over the last 90 days. This one's 8% higher — but it has in-unit laundry, which usually adds $150–250. So it's reasonable, not a steal. I'd offer $3,050 and see what happens.",
  },
  {
    user: "Should I be worried about 4 open DOB violations?",
    wren: "Depends what they are. Three are 'Class 3' (non-hazardous, paperwork). One is 'Class 1' — that's serious. It's for a defective fire alarm filed 8 months ago, still unresolved. I'd ask the landlord for proof of repair before signing.",
  },
  {
    user: "What's the catch with rent-stabilized listings under $2,000?",
    wren: "Usually one of: (1) no elevator above floor 4, (2) walk-up with no laundry, (3) succession unit where a family member just moved out. None are dealbreakers — just know what you're getting. Want me to filter for elevator buildings only?",
  },
];

export function WrenAIBlock() {
  return (
    <section
      id="wren"
      className="relative bg-surface-elevated py-24 lg:py-32 overflow-hidden border-y border-charcoal-200/60"
    >
      <div className="absolute inset-0 pattern-grid opacity-30 pattern-fade-mask pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* Left — pitch */}
          <div className="lg:sticky lg:top-24">
            <Eyebrow tone="lavender">Meet Wren</Eyebrow>
            <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 leading-[1.05]">
              An AI that's{" "}
              <span className="accent-italic">read every NYC lease.</span>
            </h2>
            <p className="mt-6 text-lg text-charcoal-700 leading-relaxed">
              Wren is Nook's rental advisor — trained on rent-stabilization
              law, building violation databases, and 12 years of neighborhood
              price data. Ask anything about a listing, a neighborhood, or a
              lease clause. Get an answer that sounds like a friend who
              happens to be a tenant lawyer.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Verifies rent-stabilization claims in seconds",
                "Translates landlord jargon (riders, IAIs, MCIs)",
                "Flags red flags before you tour",
                "Suggests counter-offers based on comparable units",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm text-charcoal-800"
                >
                  <Sparkles className="h-4 w-4 text-peach-700 mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 inline-flex items-center px-3 py-1.5 rounded-pill bg-charcoal-950 text-paper text-[11px] font-mono uppercase tracking-[0.16em] font-semibold">
              Included on Premium · Unlimited on Max
            </div>
          </div>

          {/* Right — chat mock */}
          <div className="rounded-card border border-charcoal-200/60 bg-paper-warm overflow-hidden shadow-card">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-charcoal-200/60 bg-surface-elevated">
              <div className="h-7 w-7 rounded-pill bg-charcoal-950 text-paper flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-charcoal-950">
                  Wren
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-sage-700">
                  ● Online · responds in ~2s
                </div>
              </div>
            </div>

            <div className="p-5 lg:p-6 space-y-6 max-h-[560px] overflow-hidden">
              {exchanges.map((ex, i) => (
                <div key={i} className="space-y-3">
                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-card rounded-tr-sm bg-charcoal-950 text-paper px-4 py-2.5 text-sm leading-snug">
                      {ex.user}
                    </div>
                  </div>
                  {/* Wren bubble */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-6 w-6 rounded-pill bg-peach-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-3 w-3 text-peach-700" />
                    </div>
                    <div className="max-w-[85%] rounded-card rounded-tl-sm bg-surface-elevated border border-charcoal-200/60 px-4 py-3 text-sm text-charcoal-800 leading-relaxed">
                      {ex.wren}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal-200/60 p-3 bg-surface-elevated">
              <div className="flex items-center gap-2 px-3 py-2 rounded-pill bg-paper-warm border border-charcoal-200/60">
                <input
                  type="text"
                  disabled
                  placeholder="Ask Wren about any listing..."
                  className="flex-1 bg-transparent text-sm placeholder:text-charcoal-400 outline-none"
                />
                <button
                  type="button"
                  disabled
                  className="h-7 w-7 rounded-pill bg-charcoal-950 text-paper flex items-center justify-center opacity-60"
                  aria-label="Send"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
