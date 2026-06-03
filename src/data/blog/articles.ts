// Blog content store (Phase 1: file-based, no CMS yet).
// Adding a new article = append an object to ARTICLES. Slugs must be unique.

export type BlogCategory =
  | "renter-rights"
  | "guides"
  | "tools-comparisons"
  | "market-intelligence";

export const CATEGORIES: Array<{ slug: BlogCategory | "all"; label: string }> = [
  { slug: "all", label: "All" },
  { slug: "renter-rights", label: "Renter Rights" },
  { slug: "guides", label: "Guides" },
  { slug: "tools-comparisons", label: "Tools & Comparisons" },
  { slug: "market-intelligence", label: "Market Intelligence" },
];

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  "renter-rights": "Renter Rights",
  guides: "Guides",
  "tools-comparisons": "Tools & Comparisons",
  "market-intelligence": "Market Intelligence",
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "info"; title?: string; text: string }
  | { type: "quote"; text: string; cite?: string };

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string; // ISO
  updatedAt?: string; // ISO
  readingTimeMin: number;
  coverGradient: string; // CSS gradient as cover placeholder
  coverImageAlt: string;
  featured?: boolean;
  body: BlogBlock[];
  faq?: BlogFaq[];
  relatedSlugs?: string[];
}

export const ARTICLES: BlogArticle[] = [
  {
    slug: "best-apartment-search-apps-2026",
    title: "Best Apartment Search Apps in 2026: an Honest Comparison",
    excerpt:
      "We compared the top US apartment-search apps on listing freshness, alert speed, and how loudly they upsell. Here's what we found.",
    category: "tools-comparisons",
    tags: ["Tools comparison", "AI tools", "NYC"],
    publishedAt: "2026-05-22",
    updatedAt: "2026-06-01",
    readingTimeMin: 11,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-terracotta) 0%, var(--color-brand-clay) 100%)",
    coverImageAlt: "Abstract gradient cover representing apartment search apps",
    featured: true,
    body: [
      {
        type: "p",
        text: "Every renter we talk to has the same loop: open StreetEasy, refresh Zillow, scroll Apartments.com, repeat. Most of them couldn't tell you which app actually got them the apartment — just that it took weeks.",
      },
      {
        type: "p",
        text: "We spent a month using the most-recommended apps side by side in NYC, LA, and Chicago. Here's how they actually compare on the three things that matter: how fresh the listings are, how fast alerts arrive, and how aggressively they push you toward paid features.",
      },
      {
        type: "h2",
        id: "what-we-measured",
        text: "What we measured",
      },
      {
        type: "ul",
        items: [
          "Median delay between a listing going live and showing up in the app",
          "Alert latency (email + push) from listing publication",
          "Share of listings flagged as 'no-fee' that actually were no-fee",
          "Friction added by upsells, paid-only filters, and account walls",
        ],
      },
      {
        type: "info",
        title: "Methodology",
        text: "We tracked 642 new NYC listings over 30 days using public broker feeds as the ground truth, then measured when each app surfaced them. Full dataset linked at the bottom.",
      },
      {
        type: "h2",
        id: "the-shortlist",
        text: "The shortlist",
      },
      {
        type: "p",
        text: "These five came up over and over in renter surveys: StreetEasy, Zillow, Apartments.com, Zumper, and Nook. We're listed last because we built this — feel free to skip our section if you want a neutral read.",
      },
      {
        type: "h3",
        id: "streeteasy",
        text: "StreetEasy",
      },
      {
        type: "p",
        text: "Still the default for Manhattan and Brooklyn. Excellent listing coverage in core neighborhoods, but the email alerts arrive in batches and many high-demand listings are gone before you see them.",
      },
      {
        type: "h3",
        id: "zillow",
        text: "Zillow",
      },
      {
        type: "p",
        text: "Best coverage outside NYC. Alerts are slow (often 6–12 hours behind) and a large share of 'available' listings are stale or already rented.",
      },
      {
        type: "h2",
        id: "what-actually-matters",
        text: "What actually matters",
      },
      {
        type: "p",
        text: "Speed beats search filters. The single best predictor of getting an apartment was being one of the first ten people to email about a listing. Pretty filters don't matter if the listing has 40 inquiries by the time you see it.",
      },
    ],
    faq: [
      {
        q: "Which app has the freshest NYC listings?",
        a: "StreetEasy and Nook lead in NYC. StreetEasy because brokers post there first; Nook because we re-index every few minutes across 100+ sources.",
      },
      {
        q: "Are 'no-fee' filters actually accurate?",
        a: "About 60–70% of the time. Brokers sometimes mislabel listings or change terms after you contact them. Always confirm in writing before viewing.",
      },
      {
        q: "Do I need a paid plan to get fast alerts?",
        a: "On most apps, yes — free tiers usually batch alerts hourly or daily. On Nook, free alerts run on a 3-hour delay; real-time alerts are part of Premium.",
      },
    ],
    relatedSlugs: ["how-to-verify-rent-stabilized-apartment-nyc"],
  },
  {
    slug: "how-to-verify-rent-stabilized-apartment-nyc",
    title: "How to Verify a Rent-Stabilized Apartment (and Catch Landlord Lies)",
    excerpt:
      "Landlords lie about rent stabilization more often than you'd think. Here's how to actually verify a unit's status in 4 steps — before you sign.",
    category: "renter-rights",
    tags: ["Rent regulation", "Verification", "Tenant rights", "NYC", "LA", "SF"],
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-02",
    readingTimeMin: 9,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-sage) 0%, var(--color-brand-cream) 100%)",
    coverImageAlt: "Abstract gradient cover representing rent regulation verification",
    body: [
      { type: "p", text: "Your landlord says it's rent-stabilized. The listing has the badge. The lease mentions it. Everything seems fine." },
      { type: "p", text: "Except — landlords lie about this. Not always maliciously. Sometimes through confusion, inheritance from prior owners, or wishful thinking about deregulation thresholds. Sometimes deliberately, because a \"rent-stabilized\" label rents an apartment faster." },
      { type: "p", text: "The cost of believing it without checking is significant. A genuinely rent-stabilized apartment saves a renter $30,000–$100,000 over a decade compared to market-rate equivalents in cities like New York or Los Angeles. A fake-stabilized apartment? You pay market rate for years thinking you have protections you don't." },
      { type: "p", text: "This guide walks through the four-step verification process for the cities where rent regulation actually matters. By the end, you'll know how to confirm a unit's regulatory status before you sign anything." },
      { type: "h2", id: "why-landlords-get-this-wrong", text: "Why landlords get this wrong (and lie about it)" },
      { type: "p", text: "Before getting into verification mechanics, it helps to understand the four common ways landlords misrepresent rent-stabilization status:" },
      { type: "h3", id: "pre-1974-myth", text: "1. \"It's pre-1974, so it must be stabilized\"" },
      { type: "p", text: "Age alone doesn't determine status. A pre-1974 building with fewer than 6 units in NYC may not qualify. A pre-1978 LA building must have 2+ units for RSO coverage. The rules are specific, and shortcuts produce wrong answers." },
      { type: "h3", id: "stabilized-when-i-bought", text: "2. \"It was stabilized when I bought it\"" },
      { type: "p", text: "Many units have been legally deregulated over the years — through high-rent vacancy decontrol (NYC pre-2019), individual apartment improvements (IAI), or other mechanisms. A unit's history doesn't guarantee its current status." },
      { type: "h3", id: "treating-as-stabilized", text: "3. \"I'm treating it as stabilized\"" },
      { type: "p", text: "Some landlords offer \"stabilized-style\" leases voluntarily. This is not the same as legal rent stabilization. You don't get the protections, the rent guidelines board adjustments, or the lease renewal rights. You get marketing." },
      { type: "h3", id: "outright-misrepresentation", text: "4. Outright misrepresentation" },
      { type: "p", text: "This is rarer but happens. The apartment isn't stabilized at all, but calling it so makes the listing more attractive. Once you sign and move in, you discover the truth at lease renewal when rent jumps 15%." },
      { type: "h2", id: "verification-process", text: "The 4-step verification process" },
      { type: "h3", id: "step-1-rent-history", text: "Step 1: Get the official rent history" },
      { type: "p", text: "Every city with rent regulation maintains a public database. For your apartment to be genuinely regulated, it must appear in that database." },
      { type: "h3", id: "nyc-dhcr", text: "New York City — DHCR rent history" },
      { type: "p", text: "The New York State Division of Housing and Community Renewal (DHCR) maintains rent registration records for every rent-stabilized unit going back decades. You can request the rent history for any apartment at no cost." },
      { type: "ul", items: [
        "Visit hcr.ny.gov and search for \"rent history request\"",
        "Submit Form RA-90 with the apartment address and unit number",
        "The response typically arrives in 4–8 weeks (slow, plan ahead)",
        "Faster option: many tenants' rights organizations have direct database access",
      ] },
      { type: "p", text: "What to look for: Continuous registration as a rent-stabilized unit, recorded rent amounts that match what's being advertised, and no recent \"deregulation\" filings." },
      { type: "info", title: "Heads up", text: "The DHCR database is famously incomplete and out of date for some units. An absence from the database does not definitively mean a unit is unregulated. It does, however, mean you should ask harder questions." },
      { type: "h3", id: "la-lahd", text: "Los Angeles — LAHD RSO database" },
      { type: "p", text: "The Los Angeles Housing Department maintains a public RSO (Rent Stabilization Ordinance) database online." },
      { type: "ul", items: [
        "Visit housing.lacity.org",
        "Use the RSO Properties search",
        "Enter the property address",
      ] },
      { type: "p", text: "LAHD lists every parcel and indicates RSO coverage. Coverage typically applies to buildings constructed before October 1, 1978, with 2 or more units." },
      { type: "h3", id: "sf-rent-board", text: "San Francisco — SF Rent Board" },
      { type: "p", text: "The San Francisco Rent Board maintains records for units covered by the San Francisco Rent Ordinance. Visit sfrb.org and search property records. Buildings constructed before June 13, 1979 are generally covered." },
      { type: "h3", id: "dc-dhcd", text: "Washington DC — DHCD" },
      { type: "p", text: "The DC Department of Housing and Community Development maintains records for units covered by the Rental Housing Act. Other cities (Oakland, Berkeley, Portland) maintain similar databases. The principle is consistent: rent regulation requires registration, and registration is publicly verifiable." },
      { type: "h3", id: "step-2-structural", text: "Step 2: Cross-check the structural basics" },
      { type: "p", text: "Even before you get the official rent history, you can verify whether a building is structurally eligible for rent regulation." },
      { type: "p", text: "Building age: Most rent regulation programs apply only to buildings constructed before a specific date. Building age is easy to verify:" },
      { type: "ul", items: [
        "NYC: Department of Buildings (DOB) property records",
        "LA: Los Angeles County Assessor records",
        "SF: SF Planning Department records",
        "Most other cities: County assessor or recorder of deeds",
      ] },
      { type: "p", text: "If the building was constructed after the cutoff date, it's almost certainly not regulated, regardless of what anyone says." },
      { type: "p", text: "Unit count: Many programs have minimum unit thresholds — NYC typically requires 6+ units, LA requires 2+ for RSO, SF varies by program. A small landlord with a 4-unit Brooklyn brownstone may believe they're \"stabilized\" when their building isn't even eligible." },
      { type: "p", text: "Regulatory orders: Some buildings have specific HPD orders or court rulings that establish or modify their status. These are part of the building's permanent record." },
      { type: "h3", id: "step-3-lease", text: "Step 3: Verify the lease language" },
      { type: "p", text: "A genuinely rent-stabilized lease in NYC will include specific language and riders required by law:" },
      { type: "ul", items: [
        "The \"Rent Stabilization Lease Rider for Apartments in New York City\" (Form RTP-8)",
        "Specific renewal terms tied to the Rent Guidelines Board's annual order",
        "Acknowledgement of the tenant's rights to lease renewal at regulated rates",
      ] },
      { type: "p", text: "If your lease doesn't include the required rider, it's a strong signal that either (a) the unit isn't actually stabilized, or (b) your landlord doesn't know how to issue a proper lease and you'll have headaches at renewal." },
      { type: "p", text: "In LA, the lease should reference the RSO and include the required RSO addendum. The LAHD has model language available. If a landlord shows you a generic month-to-month lease and claims the unit is stabilized, that's a red flag. The legal status requires legal paperwork." },
      { type: "h3", id: "step-4-deregulation", text: "Step 4: Check for deregulation events" },
      { type: "p", text: "Even if a unit was historically regulated, it may have been legally deregulated. The most common mechanisms:" },
      { type: "p", text: "NYC (pre-June 2019 Housing Stability and Tenant Protection Act):" },
      { type: "ul", items: [
        "Vacancy decontrol when rent exceeded the threshold (around $2,700 by 2019)",
        "Individual Apartment Improvements (IAI) that raised the rent above the threshold",
        "High-income deregulation (combined household income over $200k for two consecutive years)",
      ] },
      { type: "p", text: "The 2019 law largely closed these pathways for the future — but units deregulated before 2019 generally stayed deregulated." },
      { type: "p", text: "LA RSO: substantial rehabilitation under specific HCD-approved conditions, demolition and reconstruction (different building → no longer the regulated one), some condo conversions." },
      { type: "p", text: "SF Rent Ordinance: Costa-Hawkins Rental Housing Act exempts certain new construction and single-family homes; substantial rehabilitation in limited cases." },
      { type: "p", text: "If your landlord claims a unit was deregulated, ask which mechanism applies and when. They should be able to answer specifically. \"I don't remember\" or \"the previous owner handled that\" is not an answer — it's a problem." },
      { type: "h2", id: "red-flags", text: "Red flags during the apartment viewing" },
      { type: "p", text: "Before you even start the formal verification, certain signs at the viewing should raise your alarm:" },
      { type: "ul", items: [
        "The landlord can't or won't tell you the unit's regulatory status",
        "The asking rent is significantly above the published Rent Guidelines Board increase from the previous registered rent",
        "The landlord describes the unit as \"kind of stabilized\" or \"voluntarily stabilized\"",
        "The lease offered doesn't mention rent regulation",
        "The landlord says the unit was \"renovated to market rate\" or \"improved out of stabilization\"",
        "The landlord pressures you to skip rent history verification",
      ] },
      { type: "p", text: "Any of these alone isn't proof of misrepresentation. Together, they suggest you should slow down and verify carefully." },
      { type: "h2", id: "if-landlord-lied", text: "What to do if you discover the landlord lied" },
      { type: "p", text: "This happens more than you'd expect. You've moved in, lived there a year, and then discover the unit was supposed to be stabilized — and you've been paying market rate." },
      { type: "ol", items: [
        "Document everything immediately. Save the original listing, lease, and any communications. Take screenshots in case anything gets edited online.",
        "File an overcharge complaint. In NYC, file Form RA-89 with DHCR (no fee). The case can result in rent rollback to the legal regulated rent, refund of overcharges (typically up to 6 years back), and treble damages if willful.",
        "Consult a tenant attorney. Many take overcharge cases on contingency. Met Council on Housing, Legal Aid Society, and Tenants & Neighbors in NYC offer free consultations.",
        "Don't withhold rent unilaterally. Continuing to pay the agreed rent while pursuing the complaint protects you from eviction.",
      ] },
      { type: "h2", id: "how-nook-handles", text: "How Nook handles this" },
      { type: "p", text: "When you set up a search on Nook, you can filter for verified rent-regulated listings. Behind the scenes, we cross-reference every listing's address against the relevant public database — DHCR for NYC, LAHD for LA, SF Rent Board for SF." },
      { type: "p", text: "If a listing's address matches the regulatory database, we display a \"Verified rent-regulated\" badge. If it doesn't, we don't. If a landlord claims regulation but the address doesn't appear in official records, you'll see no badge, regardless of what the listing copy says." },
      { type: "p", text: "This isn't a guarantee — public databases have gaps, and a unit's status can change. But it's a substantial improvement over taking the landlord's word for it." },
    ],
    faq: [
      { q: "Can I get the rent history before I apply?", a: "In NYC, the rent history request requires the apartment address — which a landlord typically provides during the application process. You can usually get the request submitted while your application is being reviewed." },
      { q: "What if the building is too new to be regulated?", a: "Then it's not regulated, and any claim otherwise is incorrect. New construction (post-1974 in NYC for most purposes, post-1978 in LA for RSO) is generally exempt." },
      { q: "Is \"rent-controlled\" the same as \"rent-stabilized\"?", a: "No. They're distinct programs with different rules. Rent control is older and much more restrictive, applying to a small set of long-tenured tenants; rent stabilization is broader and governs most regulated units today." },
      { q: "My landlord says the apartment is \"preferential rent\" — what does that mean?", a: "Preferential rent is when a stabilized landlord charges less than the legal maximum. It's a real thing, but it changed significantly under the 2019 NY law. If your lease has preferential rent terms, get the legal regulated rent in writing — that's what determines future increases." },
      { q: "The unit appears unregulated in DHCR but the landlord swears it's stabilized. Who's right?", a: "The DHCR database has gaps but is the authoritative source. If a landlord insists on stabilized status, they should be able to produce documentation — registration receipts, prior leases with the rider, an HPD determination, something. \"Trust me\" isn't documentation." },
      { q: "Should I just walk away from a unit if verification is hard?", a: "Not necessarily — but require documentation before signing. A real stabilized landlord has the paperwork. One who can't produce it is offering you something other than what they claim." },
    ],
    relatedSlugs: ["best-apartment-search-apps-2026"],
  },
  {
    slug: "rent-stabilization-vs-rent-control",
    title: "Rent Stabilization vs Rent Control: What's the Actual Difference",
    excerpt:
      "These terms get used interchangeably, but they're not the same. Plain-English breakdown of how each works and what each gets you.",
    category: "renter-rights",
    tags: ["Rent regulation", "Tenant rights", "NYC", "LA", "SF"],
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-02",
    readingTimeMin: 8,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-clay) 0%, var(--color-brand-sage) 100%)",
    coverImageAlt: "Abstract gradient cover comparing rent control and rent stabilization",
    body: [
      { type: "p", text: "People use these terms interchangeably. They're not the same thing." },
      { type: "p", text: "Rent control and rent stabilization are two distinct legal programs that limit how much landlords can charge for rent. They share a goal — keeping rents affordable for long-term tenants — but they operate through different rules, cover different units, and offer different protections." },
      { type: "p", text: "Confusing the two costs renters money. A unit that's genuinely \"rent-controlled\" in New York City is rare and offers near-permanent rent protection. A unit that's \"rent-stabilized\" is common, but with weaker protections than many tenants assume." },
      { type: "p", text: "This guide explains how each works, where they exist, and which one (if either) might cover an apartment you're considering." },
      { type: "h2", id: "30-second-version", text: "The 30-second version" },
      { type: "p", text: "If you only read one paragraph:" },
      { type: "ul", items: [
        "Rent control is an older, stricter, narrower program. In NYC, it generally applies to tenants who have lived in pre-1947 buildings continuously since 1971. Almost no new tenants qualify.",
        "Rent stabilization is the broader program that protects most regulated apartments in NYC. It limits annual rent increases and guarantees lease renewal rights, but rents can adjust over time within board-set guidelines.",
        "Most \"rent regulated\" apartments you'll encounter as a new renter are rent-stabilized, not rent-controlled.",
        "Outside NYC, the terms are used loosely. \"Rent control\" in Los Angeles or San Francisco usually means something closer to NYC's stabilization.",
      ] },
      { type: "p", text: "Now the detailed version." },
      { type: "h2", id: "rent-control", text: "Rent control (the original)" },
      { type: "p", text: "Rent control in the United States traces back to World War II, when federal price controls extended to housing in many cities to prevent wartime profiteering. Most cities phased out their rent control programs after the war. New York City kept its program — though significantly narrowed." },
      { type: "p", text: "Modern NYC rent control specifically applies to:" },
      { type: "ul", items: [
        "Tenants in buildings constructed before February 1, 1947",
        "Tenants (or their succession-eligible family members) who have continuously occupied the apartment since before July 1, 1971",
        "Specific limited categories under city and state programs",
      ] },
      { type: "p", text: "This is a tiny and shrinking population. As tenants pass away or move out, units exit rent control permanently. In 2024, fewer than 1% of NYC apartments were rent-controlled." },
      { type: "h3", id: "rent-control-mechanics", text: "Rent control mechanics" },
      { type: "ul", items: [
        "Rent increases are set by a Maximum Base Rent (MBR) formula recalculated every two years",
        "Increases are typically very modest (well below market or even below inflation)",
        "The tenant has near-permanent occupancy rights",
        "Succession rights exist for spouses and certain family members who have lived in the unit for two years",
        "When a rent-controlled tenant leaves, the unit typically converts to rent stabilization (not market rate)",
      ] },
      { type: "info", title: "Practical takeaway", text: "If you're a new tenant looking for an apartment, rent control is almost certainly not available to you. The program isn't designed to admit new tenants." },
      { type: "h2", id: "rent-stabilization", text: "Rent stabilization (the relevant one)" },
      { type: "p", text: "Rent stabilization is the program most renters actually encounter. It applies to roughly 1 million apartments in NYC alone, plus units in other cities." },
      { type: "p", text: "Rent stabilization in NYC applies to:" },
      { type: "ul", items: [
        "Buildings with 6 or more units constructed between 1947 and 1973 (mostly)",
        "Buildings receiving certain tax benefits (421-a, J-51, etc.)",
        "Some buildings that voluntarily entered the program",
        "Various other categories under specific programs",
      ] },
      { type: "h3", id: "stabilization-mechanics", text: "Rent stabilization mechanics" },
      { type: "ul", items: [
        "Annual rent increases are set by the NYC Rent Guidelines Board (RGB) based on market conditions and operating costs",
        "Typical increases: 2–5% for one-year leases, slightly more for two-year leases (varies year to year)",
        "Tenants have the right to renew their lease — landlord cannot evict for \"no reason\"",
        "Succession rights exist for family members who lived in the unit for one year (two for non-immediate family)",
        "Specific procedures apply for eviction, including for non-payment",
        "Building must register with DHCR annually and provide tenants with rent registration documentation",
      ] },
      { type: "h3", id: "hstpa-2019", text: "Key NYC change in 2019" },
      { type: "p", text: "The Housing Stability and Tenant Protection Act (HSTPA) closed several pathways landlords previously used to deregulate units:" },
      { type: "ul", items: [
        "Eliminated high-rent vacancy decontrol",
        "Eliminated high-income deregulation",
        "Limited Major Capital Improvement (MCI) and Individual Apartment Improvement (IAI) rent increases",
        "Made preferential rents the new legal rent for purposes of future increases (in most cases)",
      ] },
      { type: "p", text: "In short: HSTPA made rent stabilization stickier, harder to escape, and more renter-favorable." },
      { type: "h2", id: "side-by-side", text: "Side-by-side comparison" },
      { type: "ul", items: [
        "Buildings covered — Control: pre-1947 / Stabilization: 1947–1973 + others",
        "Tenancy required — Control: continuous since pre-1971 / Stabilization: any current lease",
        "Rent increase formula — Control: Maximum Base Rent (MBR) / Stabilization: RGB annual adjustments",
        "Typical annual increase — Control: very low, often below inflation / Stabilization: 2–5% (1-year), 4–7% (2-year)",
        "Lease renewal right — Control: permanent occupancy / Stabilization: yes, renewable",
        "Succession rights — Control: spouse + 2-year family / Stabilization: 1-year immediate family, 2-year other",
        "Share of NYC apartments — Control: <1% / Stabilization: ~50%",
        "Available to new renters — Control: effectively no / Stabilization: yes",
      ] },
      { type: "h2", id: "outside-nyc", text: "Outside of NYC: terminology gets messy" },
      { type: "p", text: "In other US cities, \"rent control\" and \"rent stabilization\" don't follow NYC's strict distinction. The terms are used loosely and the underlying programs vary." },
      { type: "h3", id: "la-rso", text: "Los Angeles — Rent Stabilization Ordinance (RSO)" },
      { type: "p", text: "The LA RSO is often called \"rent control\" colloquially, but functions more like NYC's rent stabilization. Key facts:" },
      { type: "ul", items: [
        "Applies to buildings constructed before October 1, 1978",
        "Covers properties with 2 or more units (apartments, duplexes, some single-family homes with ADUs)",
        "Allows annual rent increases tied to CPI (typically 3–8%)",
        "Provides just-cause eviction protections",
        "Maintained by the Los Angeles Housing Department (LAHD)",
      ] },
      { type: "h3", id: "sf-rent-ordinance", text: "San Francisco — Rent Ordinance" },
      { type: "p", text: "SF's program also gets called \"rent control\" but operates similarly to stabilization:" },
      { type: "ul", items: [
        "Applies to buildings constructed before June 13, 1979",
        "Excludes most single-family homes and condos (Costa-Hawkins Rental Housing Act exemption)",
        "Annual increases set by SF Rent Board (typically 1–2.5%, tied to inflation)",
        "Just-cause eviction protections",
        "Significant tenant protections including relocation assistance for certain evictions",
      ] },
      { type: "h3", id: "ab-1482", text: "Statewide California — AB 1482" },
      { type: "p", text: "California has a statewide rent cap applying to many buildings not covered by local programs:" },
      { type: "ul", items: [
        "Buildings older than 15 years (rolling window — newer buildings age into coverage)",
        "Annual increases capped at 5% plus inflation, or 10% maximum",
        "Just-cause eviction protections",
        "Excludes single-family homes (unless owned by corporations) and certain other categories",
      ] },
      { type: "h3", id: "other-cities", text: "Other cities" },
      { type: "p", text: "Several other cities have rent regulation programs with their own rules:" },
      { type: "ul", items: [
        "Oakland and Berkeley, CA — local rent control programs",
        "Washington DC — Rental Housing Act applies to many buildings",
        "Newark and other NJ cities — local rent control programs",
        "Portland, OR — statewide cap applies (similar to AB 1482)",
        "Saint Paul, MN — newer rent stabilization program",
        "Some Massachusetts cities — pilot programs in progress",
      ] },
      { type: "p", text: "The rules differ in every case. Don't assume your city's \"rent control\" works like NYC's — check the local program specifics." },
      { type: "h2", id: "no-regulation", text: "Cities and states without rent regulation" },
      { type: "p", text: "Many places have no rent regulation at all:" },
      { type: "ul", items: [
        "Most of Texas",
        "Most of Florida",
        "Most of the Southeast",
        "Most of the Mountain West",
        "Several states preempt local rent control laws (Texas, Florida, etc., prohibit cities from creating programs)",
      ] },
      { type: "p", text: "In these markets, landlords can typically raise rents to any amount at lease renewal, subject only to the terms of the existing lease." },
      { type: "h2", id: "financial-difference", text: "Why the financial difference is meaningful" },
      { type: "p", text: "Consider a hypothetical 10-year tenancy in NYC." },
      { type: "p", text: "Market-rate apartment, starting at $3,000/mo:" },
      { type: "ul", items: [
        "Annual rent increases of 5–8% (typical in non-regulated NYC)",
        "Year 10 rent: approximately $4,900–6,500/mo",
        "10-year total rent paid: roughly $480,000",
      ] },
      { type: "p", text: "Rent-stabilized apartment, starting at $3,000/mo:" },
      { type: "ul", items: [
        "Annual rent increases of 2–4% (per RGB)",
        "Year 10 rent: approximately $3,650–4,400/mo",
        "10-year total rent paid: roughly $410,000",
      ] },
      { type: "p", text: "The stabilized apartment costs roughly $70,000 less over the decade. In some cases, where market rents in the neighborhood escalate sharply, the savings can exceed $100,000." },
      { type: "p", text: "This is why rent stabilization is sometimes described as a \"lottery ticket\" — finding one substantially changes long-term financial outcomes for a renter." },
      { type: "h2", id: "misconceptions", text: "Common misconceptions" },
      { type: "ul", items: [
        "\"Rent-controlled apartments still exist for new tenants.\" In NYC, generally no. New tenants typically receive rent-stabilized leases at best.",
        "\"All older buildings are stabilized.\" False. Coverage depends on multiple factors including unit count, tax benefits, and prior deregulation.",
        "\"Once stabilized, always stabilized.\" Mostly true now (post-2019), but not always historically. Units deregulated before 2019 generally stayed deregulated.",
        "\"Stabilized rents can't go up much.\" The RGB sets increases annually — typically 2–5%, which compounds. Stabilized rents do go up, just less than market.",
        "\"My landlord told me it's stabilized, so it must be.\" Verify independently.",
        "\"Stabilized apartments have low rent.\" Not necessarily. The starting rent on a stabilized unit can be high. What's protected is the rate of future increase.",
      ] },
      { type: "h2", id: "how-to-find", text: "How to find rent-regulated apartments" },
      { type: "p", text: "If you're specifically looking for stabilized (or RSO/equivalent) units:" },
      { type: "ol", items: [
        "Filter for them on platforms that surface regulatory status. Most listing sites don't. Some specialized tools do.",
        "Look in eligible building types. Older buildings with 6+ units in NYC; pre-1978 buildings in LA; pre-1979 in SF.",
        "Ask landlords directly. \"Is this unit rent-stabilized?\" If yes, ask for documentation.",
        "Verify before signing — request the DHCR / LAHD / SF Rent Board record yourself.",
      ] },
      { type: "h2", id: "how-nook-handles", text: "How Nook handles this" },
      { type: "p", text: "When you set up a search on Nook in a city with rent regulation, you can filter for verified rent-regulated units. We cross-reference listing addresses against the relevant public database (DHCR for NYC, LAHD for LA, SF Rent Board for SF) and surface badges only for confirmed matches." },
      { type: "p", text: "This doesn't replace your own verification, but it does filter out the units that obviously aren't covered." },
    ],
    faq: [
      { q: "Can a landlord opt out of rent regulation?", a: "Generally no. Coverage is determined by building characteristics, not landlord preference. Landlords can pursue deregulation through limited legal pathways, but cannot simply \"opt out.\"" },
      { q: "Do rent-stabilized leases have to be in writing?", a: "Yes. In NYC, the lease must include the Rent Stabilization Lease Rider (RTP-8) and reference the legal regulated rent." },
      { q: "What happens if I move out of a stabilized apartment?", a: "The unit remains stabilized for the next tenant (with limited exceptions). The next tenant can be charged the vacancy rate increase set by RGB." },
      { q: "Can my rent go down?", a: "In specific circumstances yes — particularly if you discover you've been overcharged. The RGB has also occasionally allowed rent rollbacks during certain years." },
      { q: "Is rent stabilization being phased out?", a: "The opposite. Recent legislation in 2019 (NY) and elsewhere has expanded rent regulation, not shrunk it. Several states are considering new programs." },
      { q: "Does rent stabilization apply to short-term rentals?", a: "Generally no. Most regulations require the tenant to occupy as a primary residence." },
    ],
    relatedSlugs: ["how-to-verify-rent-stabilized-apartment-nyc"],
  },
];

export function getArticle(slug: string): BlogArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getFeatured(): BlogArticle {
  return ARTICLES.find((a) => a.featured) ?? ARTICLES[0]!;
}

export function getRelated(slug: string, limit = 3): BlogArticle[] {
  const article = getArticle(slug);
  if (!article) return [];
  const manual = (article.relatedSlugs ?? [])
    .map((s) => getArticle(s))
    .filter((a): a is BlogArticle => Boolean(a));
  if (manual.length >= limit) return manual.slice(0, limit);
  const more = ARTICLES.filter(
    (a) =>
      a.slug !== slug &&
      !manual.some((m) => m.slug === a.slug) &&
      a.tags.some((t) => article.tags.includes(t)),
  );
  return [...manual, ...more].slice(0, limit);
}
