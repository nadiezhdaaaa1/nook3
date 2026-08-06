import { useState } from "react";


export const FAQS: { q: string; a: string }[] = [
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

const CSS = `
.faq15 { background:#faf6ee; padding:104px 0; }
.faq15-inner { display:flex; flex-direction:column; gap:48px; }
.faq15-head { text-align:center; max-width:860px; margin:0 auto; padding:0 32px; }
.faq15-eyebrow { display:flex; align-items:center; justify-content:center; gap:8px;
  font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:500; font-size:14px; color:#3a3a37; }
.faq15-dot { width:8px; height:8px; border-radius:9999px; background:#cb4a0a; }
.faq15-h2 { margin-top:20px; font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:48px; line-height:54px; letter-spacing:-1.2px; color:#2b2521; }
.faq15-sub { margin-top:16px; font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100; font-weight:400; font-size:18px; line-height:1.6; color:#4a4a46; }
.faq15-list { max-width:860px; margin:0 auto; padding:0 32px; display:flex; flex-direction:column; gap:16px; width:100%; }
.faq15-item { background:#fff; border:1px solid rgba(36,28,18,0.1); border-radius:18px; overflow:hidden; }
.faq15-summary { width:100%; display:flex; align-items:center; justify-content:space-between; gap:24px;
  padding:21px 21px 21px 26px; background:transparent; border:0; text-align:left; cursor:pointer;
  transition:background-color .2s ease-out; }
.faq15-summary:hover { background:rgba(36,28,18,0.03); }
.faq15-summary:focus-visible { outline:2px solid #241c12; outline-offset:-2px; border-radius:18px; }
.faq15-q { font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:560; font-size:18px; line-height:27px; color:#241c12; }
.faq15-chev { flex:0 0 auto; color:#d66c38; transition:transform .25s ease-out; }
.faq15-item[data-open="true"] .faq15-chev { transform:rotate(180deg); }
.faq15-panel { display:grid; grid-template-rows:0fr; transition:grid-template-rows .25s ease-out; }
.faq15-item[data-open="true"] .faq15-panel { grid-template-rows:1fr; }
.faq15-panel > div { overflow:hidden; opacity:0; transition:opacity .25s ease-out; }
.faq15-item[data-open="true"] .faq15-panel > div { opacity:1; }
.faq15-a { padding:0 26px 24px; max-width:605px;
  font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:15px; line-height:22.5px; color:#7a6f5c; }
.faq15-foot { text-align:center; display:flex; flex-direction:column; gap:8px; }
.faq15-foot-t { font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:540; font-size:24px; line-height:40px; color:#241c12; }
.faq15-foot-a { font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100; font-weight:650; font-size:16px; line-height:24px; color:#d66c38; text-decoration:none; }
@media (max-width:680px) {
  .faq15 { padding:72px 0; }
  .faq15-h2 { font-size:clamp(32px,6vw,40px); line-height:1.12; }
  .faq15-summary { padding:18px 20px; align-items:flex-start; }
  .faq15-q { font-size:16px; line-height:24px; }
  .faq15-a { padding:0 20px 20px; max-width:100%; }
}
@media (prefers-reduced-motion:reduce) {
  .faq15-chev, .faq15-panel, .faq15-panel > div, .faq15-summary { transition:none; }
  .faq15-item[data-open="true"] .faq15-chev { transform:none; }
}
`;

export function FaqFifteen() {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });

  return (
    <section id="faq" className="faq15">
      <style>{CSS}</style>
      <div className="faq15-inner">
        <div className="faq15-head">
          <div className="faq15-eyebrow">
            <span className="faq15-dot" aria-hidden="true" />
            FAQ
          </div>
          <h2 className="faq15-h2">Questions before you start</h2>
          <p className="faq15-sub">
            Honest answers. If you have a question that isn't here, email us — we read everything.
          </p>
        </div>

        <div className="faq15-list">
          {FAQS.map((f, i) => {
            const isOpen = !!open[i];
            return (
              <div className="faq15-item" key={i} data-open={isOpen}>
                <button
                  type="button"
                  className="faq15-summary"
                  aria-expanded={isOpen}
                  aria-controls={`faq15-panel-${i}`}
                  onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
                >
                  <span className="faq15-q">{f.q}</span>
                  <svg
                    className="faq15-chev"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className="faq15-panel" id={`faq15-panel-${i}`} role="region">
                  <div>
                    <p className="faq15-a">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq15-foot">
          <p className="faq15-foot-t">Still have questions?</p>
          <a className="faq15-foot-a" href="mailto:hello@thenook.rent">
            hello@thenook.rent
          </a>
        </div>
      </div>
    </section>
  );
}

