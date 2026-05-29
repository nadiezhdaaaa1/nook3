import { Counter } from "./anim/Counter";
import { Eyebrow } from "./Eyebrow";
import { SectionReveal } from "./anim/SectionReveal";

const stats = [
  { value: 53, suffix: "k+", label: "Renters helped" },
  { value: 5800000, suffix: "+", label: "Alerts delivered", format: (n: number) => (n / 1_000_000).toFixed(1) + "M+", to: 5.8, isDecimal: true },
  { value: 104, suffix: "+", label: "Sources monitored" },
];

const testimonials = [
  {
    quote:
      "Reading through every email the premium subscription would send me, I finally secured one that hit every single checkbox: rent-stabilized, right off the L train, 2 bed 1 bath, under $2,200.",
    name: "Leann Acosta",
    where: "Williamsburg",
  },
  {
    quote:
      "It's an excellent service that I got a couple friends clued into and I'm sure I will resubscribe when I'm next apartment hunting.",
    name: "Ashley Nguyen",
    where: "Upper East Side",
  },
];

export function StatsSection() {
  return (
    <section className="relative bg-charcoal-950 text-paper py-24 lg:py-32 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-sage-700 opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-peach-700 opacity-15 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <SectionReveal>
          <Eyebrow tone="ink">By the numbers</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] max-w-3xl mb-6">
            Why NYC renters switch{" "}
            <span className="italic font-normal text-peach-300">to Nook.</span>
          </h2>
          <p className="text-lg text-paper/70 max-w-2xl mb-20">
            Real numbers from our platform. Every day, thousands of New Yorkers use Nook to find
            apartments before anyone else.
          </p>
        </SectionReveal>

        <div className="grid sm:grid-cols-3 gap-8 lg:gap-12 mb-24 pb-20 border-b border-paper/10">
          <Stat value={53} suffix="k+" label="Renters helped" />
          <StatDecimal value={5.8} suffix="M+" label="Alerts delivered" />
          <Stat value={104} suffix="+" label="Sources monitored" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((t) => (
            <SectionReveal key={t.name}>
              <figure className="bg-charcoal-900 border border-paper/10 rounded-card p-8 lg:p-10 h-full">
                <blockquote className="font-display text-xl lg:text-2xl leading-snug text-paper mb-8">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption>
                  <div className="text-sm font-semibold text-paper">{t.name}</div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-paper/50 mt-1">
                    {t.where}
                  </div>
                </figcaption>
              </figure>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  return (
    <SectionReveal>
      <div>
        <div className="font-display font-bold text-6xl lg:text-7xl tracking-[-0.02em] text-paper mb-3">
          <Counter to={value} suffix={suffix} duration={2.2} />
        </div>
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-paper/55 font-semibold">
          {label}
        </div>
      </div>
    </SectionReveal>
  );
}

function StatDecimal({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  return (
    <SectionReveal>
      <div>
        <div className="font-display font-bold text-6xl lg:text-7xl tracking-[-0.02em] text-paper mb-3">
          {value}
          {suffix}
        </div>
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-paper/55 font-semibold">
          {label}
        </div>
      </div>
    </SectionReveal>
  );
}
