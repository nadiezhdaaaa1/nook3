import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, X, ArrowUpRight, Loader2 } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

type Topic =
  | "general"
  | "support"
  | "press"
  | "partnership"
  | "investor"
  | "legal"
  | "other";

const TOPIC_OPTIONS: { value: Topic; label: string }[] = [
  { value: "general", label: "General question" },
  { value: "support", label: "Support / bug report" },
  { value: "press", label: "Press inquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "investor", label: "Investor" },
  { value: "legal", label: "Legal / GDPR" },
  { value: "other", label: "Other" },
];

const CHANNELS = [
  {
    eyebrow: "General",
    email: "hello@thenook.rent",
    description: "General questions, press, anything else",
  },
  {
    eyebrow: "Support",
    email: "support@thenook.rent",
    description: "Bug reports, refunds, account help",
  },
  {
    eyebrow: "Legal",
    email: "legal@thenook.rent",
    description: "Privacy, DMCA, legal matters",
  },
  {
    eyebrow: "Partnerships",
    email: "partners@thenook.rent",
    description: "Brokers, agencies, integrations",
  },
] as const;

const PAGE_TITLE = "Contact Nook — Talk to a human";
const PAGE_DESC =
  "Real people, fast replies. Email us directly, or send a message — we reply within 24h on business days.";
const CANONICAL = "https://thenook.rent/contact";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Nook",
  url: CANONICAL,
  mainEntity: {
    "@type": "Organization",
    name: "Nook",
    legalName: "Zentaro Systems Ltd",
    email: "hello@thenook.rent",
    address: {
      "@type": "PostalAddress",
      streetAddress: "167-169 Great Portland Street, 5th Floor",
      addressLocality: "London",
      postalCode: "W1W 5PF",
      addressCountry: "GB",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@thenook.rent",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        contactType: "technical support",
        email: "support@thenook.rent",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        contactType: "legal",
        email: "legal@thenook.rent",
        availableLanguage: "English",
      },
    ],
  },
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: "Contact Nook" },
      { property: "og:description", content: "Talk to a human. Real people, fast replies." },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Contact Nook" },
      { name: "twitter:description", content: PAGE_DESC },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(JSON_LD),
      },
    ],
  }),
  component: ContactPage,
});

type FieldErrors = Partial<Record<"name" | "email" | "topic" | "message", string>>;

function ContactPage() {
  return (
    <MarketingLayout>
      <div
        className="relative"
        style={{ backgroundColor: "var(--color-brand-cream)" }}
      >
        <ContactHero />
        <ChannelCards />
        <ContactFormSection />
        <div className="h-24" />
      </div>
    </MarketingLayout>
  );
}

function ContactHero() {
  return (
    <section className="px-6 pt-16 md:pt-24 pb-12">
      <div className="max-w-[720px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6"
          style={{ color: "var(--color-brand-sage)" }}
        >
          · Contact ·
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-medium text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.02] tracking-[-0.02em]"
          style={{ color: "var(--color-brand-charcoal)" }}
        >
          Talk to a <span className="italic font-normal" style={{ color: "var(--color-brand-sage)" }}>human.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-[17px] md:text-[19px] leading-relaxed max-w-[620px] mx-auto"
          style={{ color: "color-mix(in oklab, var(--color-brand-charcoal) 70%, transparent)" }}
        >
          Real people, fast replies. Or pick a direct channel below if you already know who you need.
        </motion.p>
      </div>
    </section>
  );
}

function ChannelCards() {
  return (
    <section className="px-6 pb-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {CHANNELS.map((c, i) => (
          <motion.a
            key={c.email}
            href={`mailto:${c.email}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 + i * 0.05 }}
            whileHover={{ y: -2 }}
            className="group block rounded-[12px] p-5 transition-all duration-200 min-h-[120px] md:min-h-[140px]"
            style={{
              backgroundColor: "var(--color-brand-soft)",
              border: "1px solid var(--color-brand-clay)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-brand-terracotta)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(43, 37, 33, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-brand-clay)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              className="text-[11px] font-mono uppercase tracking-[0.18em] font-semibold"
              style={{ color: "var(--color-brand-sage)" }}
            >
              {c.eyebrow}
            </div>
            <div
              className="mt-3 text-[15px] md:text-[16px] font-medium break-all"
              style={{ color: "var(--color-brand-charcoal)" }}
            >
              {c.email}
            </div>
            <div
              className="mt-2 text-[13px] md:text-[14px] italic leading-snug"
              style={{ color: "color-mix(in oklab, var(--color-brand-sage) 95%, var(--color-brand-charcoal) 20%)" }}
            >
              {c.description}
            </div>
            <div
              className="mt-3 inline-flex items-center gap-1 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "var(--color-brand-terracotta)" }}
            >
              Write us <ArrowUpRight className="h-3 w-3" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function ContactFormSection() {
  const [submitted, setSubmitted] = useState<null | { firstName: string; email: string }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [topLevelError, setTopLevelError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "" as Topic | "",
    message: "",
    website: "", // honeypot
  });
  const mountedAt = useRef<number>(Date.now());

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) e.name = "Please tell us your name";
    else if (name.length < 2) e.name = "Name must be at least 2 characters";
    else if (name.length > 100) e.name = "Name must be 100 characters or less";
    else if (/\d/.test(name)) e.name = "Name shouldn't contain numbers";
    else if (/https?:\/\/|www\./i.test(name)) e.name = "Name shouldn't contain links";
    else if (!/^[\p{L}][\p{L}\s'’\-.]*$/u.test(name))
      e.name = "Use letters, spaces, hyphens or apostrophes only";

    if (!email) e.email = "We need your email to reply";
    else if (email.length > 255) e.email = "Email is too long";
    else if (/\s/.test(email)) e.email = "Email can't contain spaces";
    else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email))
      e.email = "That doesn't look like a valid email";
    else if (/\.\./.test(email)) e.email = "Email can't contain consecutive dots";
    else if (/^\.|\.@|@\.|\.$/.test(email))
      e.email = "Check the dots around the @ sign";

    if (!form.topic) e.topic = "Pick a topic so we can route your message";
    if (!form.message.trim()) e.message = "Tell us what's up";
    else if (form.message.trim().length < 10)
      e.message = "Add a bit more detail so we can help";
    return e;
  };

  const canSubmit = useMemo(
    () =>
      form.name.trim() &&
      form.email.trim() &&
      form.topic &&
      form.message.trim().length >= 10 &&
      !submitting,
    [form, submitting],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopLevelError(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          topic: form.topic,
          message: form.message.trim(),
          website: form.website,
          timeToFillMs: Date.now() - mountedAt.current,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Submission failed");
      }
      setSubmitted({
        firstName: form.name.trim().split(/\s+/)[0] || form.name.trim(),
        email: form.email.trim(),
      });
    } catch (err) {
      console.error(err);
      setTopLevelError(
        "Couldn't send your message. Try again, or email us directly at hello@thenook.rent.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(null);
    setForm({ name: "", email: "", topic: "", message: "", website: "" });
    setErrors({});
    setTopLevelError(null);
    mountedAt.current = Date.now();
  };

  return (
    <section className="px-6 mt-12 md:mt-20">
      <div
        className="max-w-[600px] mx-auto rounded-[16px] p-6 md:p-8 relative"
        style={{
          backgroundColor: "var(--color-brand-soft)",
          border: "1px solid color-mix(in oklab, var(--color-brand-clay) 80%, transparent)",
        }}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center py-6"
            >
              <CheckCircle2
                className="mx-auto h-12 w-12"
                style={{ color: "var(--color-brand-sage)" }}
                aria-hidden
              />
              <h2
                className="font-display font-medium mt-4 text-[28px] md:text-[32px]"
                style={{ color: "var(--color-brand-charcoal)" }}
              >
                Message sent
              </h2>
              <p
                className="mt-3 text-[15px] leading-relaxed"
                style={{ color: "color-mix(in oklab, var(--color-brand-charcoal) 70%, transparent)" }}
              >
                Thanks, {submitted.firstName}. We've sent a confirmation to{" "}
                <span style={{ color: "var(--color-brand-charcoal)" }}>{submitted.email}</span>.
                We'll reply within 24h on business days.
              </p>
              <button
                onClick={reset}
                className="mt-6 inline-flex items-center px-5 py-2.5 rounded-pill text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-brand-terracotta)",
                  color: "var(--color-brand-charcoal)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-brand-terracotta)";
                  e.currentTarget.style.color = "var(--color-brand-cream)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-brand-charcoal)";
                }}
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={onSubmit}
              noValidate
            >
              {topLevelError && (
                <div
                  role="alert"
                  className="mb-6 rounded-[8px] p-4 pr-10 relative"
                  style={{
                    backgroundColor: "color-mix(in oklab, var(--color-brand-terracotta) 10%, var(--color-brand-soft))",
                    borderLeft: "4px solid var(--color-brand-terracotta)",
                    color: "var(--color-brand-charcoal)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--color-brand-terracotta)" }} />
                    <div className="text-[14px] leading-snug">
                      <div className="font-medium">Couldn't send your message</div>
                      <div className="mt-1 opacity-80">
                        Try again, or email us directly at{" "}
                        <a
                          href="mailto:hello@thenook.rent"
                          className="underline"
                          style={{ color: "var(--color-brand-terracotta)" }}
                        >
                          hello@thenook.rent
                        </a>
                        .
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={() => setTopLevelError(null)}
                    className="absolute top-3 right-3 opacity-60 hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <Field
                id="contact-name"
                label="Your name"
                required
                error={errors.name}
              >
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  aria-required="true"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls(!!errors.name)}
                  maxLength={100}
                  placeholder="Alex Johnson"
                />
              </Field>

              <Field
                id="contact-email"
                label="Email"
                required
                error={errors.email}
              >
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  aria-required="true"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputCls(!!errors.email)}
                  maxLength={255}
                  placeholder="you@email.com"
                />
              </Field>

              <Field
                id="contact-topic"
                label="Topic"
                required
                error={errors.topic}
              >
                <select
                  id="contact-topic"
                  aria-required="true"
                  value={form.topic}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, topic: e.target.value as Topic }))
                  }
                  className={inputCls(!!errors.topic) + " appearance-none pr-10 bg-no-repeat bg-[right_14px_center]"}
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\'><path d=\'M1 1.5L6 6.5L11 1.5\' stroke=\'%232B2521\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/></svg>")',
                  }}
                >
                  <option value="" disabled>
                    Select a topic…
                  </option>
                  {TOPIC_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="contact-message"
                label="Message"
                required
                error={errors.message}
              >
                <textarea
                  id="contact-message"
                  aria-required="true"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={inputCls(!!errors.message) + " min-h-[120px] resize-y"}
                  rows={5}
                  maxLength={5000}
                  placeholder="Tell us what's going on — the more context, the faster we can help."
                />
              </Field>

              {/* Honeypot — hidden from real users, bots fill it. */}
              <div style={{ display: "none" }} aria-hidden="true">
                <label htmlFor="contact-website">Website (leave empty)</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                />
              </div>

              <p
                className="mt-2 mb-4 text-[13px] italic"
                style={{ color: "var(--color-brand-sage)" }}
              >
                We reply within 24h on business days.
              </p>

              <div className="flex justify-stretch md:justify-end">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  aria-busy={submitting}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-pill text-[15px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--color-brand-terracotta)",
                    color: "var(--color-brand-cream)",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting && canSubmit)
                      e.currentTarget.style.backgroundColor = "var(--color-brand-terracotta-dark)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-brand-terracotta)";
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send message"
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-[11px] font-mono uppercase tracking-[0.08em] font-semibold mb-2"
        style={{ color: "color-mix(in oklab, var(--color-brand-charcoal) 75%, transparent)" }}
      >
        {label}{" "}
        {required && (
          <span style={{ color: "var(--color-brand-terracotta)" }}>*</span>
        )}
      </label>
      {children}
      <div aria-live="polite" className="min-h-[18px] mt-1.5">
        {error && (
          <div
            className="text-[13px] flex items-center gap-1"
            style={{ color: "#A0533F" }}
          >
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-[8px] px-4 py-3 text-[15px] outline-none transition-colors",
    "focus:ring-2 focus:ring-offset-0",
    "disabled:opacity-60",
  ].join(" ") +
    " " +
    [
      "bg-[var(--color-brand-soft)]",
      hasError ? "border border-[var(--color-brand-terracotta)]" : "border border-[var(--color-brand-clay)]",
      "text-[var(--color-brand-charcoal)]",
      "focus:ring-[var(--color-brand-sage)]",
    ].join(" ");
}
