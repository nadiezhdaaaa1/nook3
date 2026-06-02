import { useState } from "react";
import { Plus } from "lucide-react";
import { Eyebrow } from "./Eyebrow";
import { SectionReveal } from "./anim/SectionReveal";

const faqs = [
  {
    q: "How fast are the alerts?",
    a: "Most listings land in your inbox within 18 minutes of going live. Premium plans get real-time email alerts in seconds.",
  },
  {
    q: "What does rent-stabilized actually mean?",
    a: "Rent-stabilized apartments have legally capped annual increases and lease renewal protections. We cross-check every listing against the NYC HCR registration to confirm status before alerting you.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No long-term contracts. Cancel from your dashboard in two clicks.",
  },
  {
    q: "Do you support cities outside NYC?",
    a: "Not yet. We're laser-focused on getting NYC right first. Other metros are on the roadmap.",
  },
  {
    q: "Where do you get the listings?",
    a: "104+ public sources — major brokerages, listing platforms, building portals, and city datasets (DOB, HPD, HCR, DOHMH). Nothing scraped behind paywalls.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative bg-paper py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <SectionReveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 mb-12">
            Questions, <span className="accent-italic">answered.</span>
          </h2>
        </SectionReveal>

        <div className="divide-y divide-border border-t border-b border-border">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} {...f} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="font-display text-xl lg:text-2xl font-semibold text-charcoal-950 group-hover:text-sage-700 transition-colors">
          {q}
        </span>
        <Plus
          className={`h-5 w-5 text-charcoal-500 shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-soft ${open ? "max-h-40 pb-6" : "max-h-0"}`}
      >
        <p className="text-charcoal-600 leading-relaxed max-w-3xl">{a}</p>
      </div>
    </div>
  );
}
