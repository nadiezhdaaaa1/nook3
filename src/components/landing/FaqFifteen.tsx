import { Eyebrow } from "@/components/marketing/Eyebrow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How fast are the alerts, really?",
    a: "Most listings reach our system within minutes of going live. From there, the alert is sent to you almost immediately if you're on Premium or Max. Free tier alerts are batched and sent on a 3-hour delay. In practice, Premium users see new matches before the listing has been shared on Reddit or refreshed on the major sites.",
  },
  {
    q: "What does \"verified regulated\" or \"rent-stabilized\" actually mean?",
    a: "In cities with rent regulations (NYC, LA, SF, and others), public databases list which buildings or units qualify. We cross-reference every listing's address against the official database for that city. If we find a match, we show the green \"Verified\" badge. If a landlord claims regulation but the address doesn't match official records, we show no badge. This protects you from being misled.",
  },
  {
    q: "Which cities does Nook work in?",
    a: "We're launching city-by-city, starting with New York. Los Angeles, San Francisco, and additional US cities follow over the coming months. If your city isn't live yet, you can join the waitlist — we'll notify you when we open up. Each new city goes through the same verification setup, so coverage quality stays consistent.",
  },
  {
    q: "Where do the listings come from?",
    a: "We aggregate publicly available rental listings from across the market — agency feeds, public databases, syndicated networks, and direct landlord submissions. Our data sources are legal-first, which means we don't violate terms of service to get listings. This is part of why we can give you accurate verified information instead of stale or fake listings.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings in two clicks — no \"schedule a call\", no retention specialist, no friction. If you cancel within 7 days of a paid charge, we'll refund you in full. After 7 days, refunds are prorated based on time used.",
  },
  {
    q: "What happens during the free trial?",
    a: "When you start a Premium or Max trial, you give us a payment method up front. For 3 days you get full access to all paid features. If you don't cancel before the trial ends, the first month bills automatically. Cancel anytime during the trial and you won't be charged. We send a reminder 24 hours before billing starts.",
  },
  {
    q: "How is this different from generic listing portals?",
    a: "Those are search portals — you log in, you search, you scroll. They monetize by selling lead placement to landlords, which means their algorithms aren't optimized for your interests. Nook is alerts-first — you tell us what you want once, we watch for you. We don't sell your inquiries to landlords. We don't show sponsored listings. We're paid by you, not by them.",
  },
  {
    q: "What is Wren AI?",
    a: "Wren is an AI assistant trained specifically for rental decisions. Premium and Max users can chat with Wren about any listing — ask if a price seems high for the neighborhood, what the building's permit history looks like, whether a commute makes sense, or anything else you'd normally ask a friend who knows the market. Wren has context on your active searches, so its answers are specific to what you're actually looking for.",
  },
  {
    q: "What's the difference between Premium and Max?",
    a: "Premium ($14.99/month) is built for someone searching in one general area — you get 3 parallel saved searches, real-time email alerts, and Wren AI. Max ($29/month) is built for relocators or aggressive hunters — unlimited saved searches, roommate mode (share with 2 others), cross-search Wren comparison, and priority support. If you're moving cities or hunting across many neighborhoods at once, Max usually pays for itself in saved time.",
  },
  {
    q: "Do you sell my data to landlords or brokers?",
    a: "No. Never. Nook is paid by users, not by landlords or brokers. We don't share your contact information with any third party unless you explicitly choose to contact a landlord through a listing link. We have no incentive to \"generate leads\" because we're not in the lead-generation business.",
  },
  {
    q: "What if I find an apartment but I'm still on a paid plan?",
    a: "Pause your search instead of canceling. Pause keeps your filters and history intact — useful if your lease falls through, if you decide to keep looking, or if you're helping a friend look later. Or just cancel — your data is preserved for 30 days in case you come back.",
  },
  {
    q: "Can I share my account with my partner or roommate?",
    a: "Free and Premium are single-user accounts. Max includes \"roommate mode\" — up to 3 user seats on one plan, each with their own login but shared searches and alerts. Useful for couples or groups searching together. If you're on Premium and need to add seats, upgrading to Max is one click.",
  },
  {
    q: "What does \"move-out listing\" mean and how does it pay $50?",
    a: "If you have an apartment you're leaving — you list it on Nook. Other Nook users see it before it hits public sites. If someone signs a lease on your listing through Nook, we pay you $50. It's our way of building a pipeline of real listings from real people, without paying brokers. You don't have to do anything beyond submitting the details and a few photos.",
  },
  {
    q: "Is this just for first-time renters or also for experienced ones?",
    a: "Both. First-time renters benefit most from the Wren AI assistant and verified badges — there's a lot of city-specific stuff you don't know if you've never rented in this market. Experienced renters benefit most from the alerts speed and filter precision — you already know what you want, you just want it faster than scrolling daily.",
  },
  {
    q: "What happens if you don't have listings in my budget?",
    a: "You won't get alerts. We'd rather send you 2 great matches per week than 20 mediocre ones. If your filters are too narrow and you're not seeing matches, Wren AI can suggest reasonable adjustments — like expanding by one neighborhood or adding $100 to budget — based on what's actually available in the market right now. You decide whether to adjust.",
  },
];

export function FaqFifteen() {
  return (
    <section
      id="faq"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "var(--color-brand-soft)" }}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
            Questions before you start.
          </h2>
          <p className="mt-5 text-base lg:text-lg text-[var(--color-charcoal-600)]">
            Honest answers. If you have a question that isn't here, email us — we read everything.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="mt-12 space-y-2"
        >
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-card border px-5 data-[state=open]:shadow-card transition-shadow"
              style={{
                borderColor: "var(--color-brand-clay)",
                backgroundColor: "var(--color-brand-cream)",
              }}
            >
              <AccordionTrigger className="font-display text-lg lg:text-xl font-medium text-[var(--color-brand-charcoal)] hover:no-underline py-5 text-left">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-[var(--color-charcoal-700)] pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="font-display text-xl text-[var(--color-brand-charcoal)]">
            Still have questions?
          </p>
          <a
            href="mailto:hello@thenook.rent"
            className="mt-2 inline-block text-base font-semibold story-link"
            style={{ color: "var(--color-brand-terracotta)" }}
          >
            hello@thenook.rent
          </a>
        </div>
      </div>
    </section>
  );
}
