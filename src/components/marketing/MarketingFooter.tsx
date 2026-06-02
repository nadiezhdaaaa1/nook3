import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";

export function MarketingFooter() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-brand-charcoal)",
        color: "var(--color-brand-cream)",
      }}
    >
      <div
        className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: "var(--color-brand-terracotta)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: "var(--color-brand-sage)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 lg:pt-24 pb-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-end pb-16 border-b" style={{ borderColor: "color-mix(in oklab, var(--color-brand-cream) 12%, transparent)" }}>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <LogoMark size={36} />
              <Logo
                className="text-2xl"
                accentClassName="italic font-normal"
              />
            </div>
            <h3 className="font-display font-medium text-4xl lg:text-[56px] leading-[0.98] tracking-[-0.02em] max-w-xl">
              Where home{" "}
              <span className="italic font-normal" style={{ color: "var(--color-brand-sage)" }}>finds you.</span>
            </h3>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-4">
            <Link
              to="/onboarding"
              className="group inline-flex items-center gap-2 h-13 px-7 py-3.5 rounded-pill text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--color-brand-terracotta)" }}
            >
              Start free
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <a
              href="mailto:hello@thenook.rent"
              className="text-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              hello@thenook.rent
            </a>
          </div>
        </div>

        {/* Company info */}
        <div
          className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-8 pb-12 border-b text-sm leading-relaxed"
          style={{
            borderColor: "color-mix(in oklab, var(--color-brand-cream) 12%, transparent)",
            color: "color-mix(in oklab, var(--color-brand-cream) 70%, transparent)",
          }}
        >
          <div className="space-y-1">
            <p>
              Nook is a product of <span className="font-semibold" style={{ color: "var(--color-brand-cream)" }}>Zentaro Systems Ltd</span>, registered in England and Wales.
            </p>
            <p>Company No. TBD</p>
            <p>Registered address: TBD, United Kingdom</p>
            <p>Operating in the US under the trade name "The Nook".</p>
          </div>
          <div className="lg:text-right">
            <p>
              Support:{" "}
              <a
                href="mailto:hello@thenook.rent"
                className="hover:underline"
                style={{ color: "var(--color-brand-cream)" }}
              >
                hello@thenook.rent
              </a>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-12">
          <FooterCol title="Product">
            <FooterAnchor href="#how">How it works</FooterAnchor>
            <FooterAnchor href="#what">What you get</FooterAnchor>
            <FooterAnchor href="#pricing">Pricing</FooterAnchor>
            <FooterAnchor href="#faq">FAQ</FooterAnchor>
            <FooterAnchor href="#blog">Blog</FooterAnchor>
          </FooterCol>
          <FooterCol title="Company">
            <FooterAnchor href="mailto:hello@thenook.rent">Contact</FooterAnchor>
            <FooterAnchor href="mailto:press@thenook.rent">Press kit</FooterAnchor>
          </FooterCol>
          <FooterCol title="Legal">
            <FooterAnchor href="#">Terms of Service</FooterAnchor>
            <FooterAnchor href="#">Privacy Policy</FooterAnchor>
            <FooterAnchor href="#">Cookie Policy</FooterAnchor>
            <FooterAnchor href="#">Acceptable Use</FooterAnchor>
          </FooterCol>
          <FooterCol title="Account">
            <FooterLink to="/login">Sign in</FooterLink>
            <FooterLink to="/onboarding">Start free</FooterLink>
            <FooterAnchor href="mailto:hello@thenook.rent">Help center</FooterAnchor>
          </FooterCol>
        </div>

        <div
          className="mt-16 pt-6 border-t"
          style={{ borderColor: "color-mix(in oklab, var(--color-brand-cream) 12%, transparent)" }}
        >
          <span
            className="text-[11px] font-mono uppercase tracking-[0.15em]"
            style={{ color: "color-mix(in oklab, var(--color-brand-cream) 45%, transparent)" }}
          >
            © {new Date().getFullYear()} Zentaro Systems Ltd. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="text-[11px] font-mono uppercase tracking-[0.2em] mb-5 font-semibold"
        style={{ color: "color-mix(in oklab, var(--color-brand-cream) 40%, transparent)" }}
      >
        {title}
      </div>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm opacity-70 hover:opacity-100 transition-opacity"
      >
        {children}
      </a>
    </li>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm opacity-70 hover:opacity-100 transition-opacity"
      >
        {children}
      </Link>
    </li>
  );
}
