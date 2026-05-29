import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";

export function MarketingFooter() {
  return (
    <footer className="bg-charcoal-950 text-paper relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-peach-700 opacity-15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-sage-700 opacity-15 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 lg:pt-24 pb-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-end pb-16 border-b border-paper/10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <LogoMark size={36} />
              <Logo className="text-2xl" accentClassName="text-peach-300 italic font-normal" />
            </div>
            <h3 className="font-display font-bold text-4xl lg:text-[56px] leading-[0.98] tracking-[-0.02em] max-w-xl">
              Where home{" "}
              <span className="italic font-normal text-peach-300">finds you.</span>
            </h3>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-4">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 h-13 px-7 py-3.5 rounded-pill text-sm font-semibold bg-cream-100 text-charcoal-950 hover:bg-paper-elevated transition-colors"
            >
              Get alerts — free
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <a href="mailto:hello@thenook.rent" className="text-sm text-paper/60 hover:text-paper transition-colors">
              hello@thenook.rent
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-14">
          <FooterCol title="Product">
            <FooterAnchor href="#how">How it works</FooterAnchor>
            <FooterAnchor href="#sources">Sources</FooterAnchor>
            <FooterAnchor href="#pricing">Pricing</FooterAnchor>
            <FooterAnchor href="#faq">FAQ</FooterAnchor>
          </FooterCol>
          <FooterCol title="Company">
            <FooterAnchor href="mailto:hello@thenook.rent">Contact</FooterAnchor>
            <FooterAnchor href="#">About</FooterAnchor>
          </FooterCol>
          <FooterCol title="Legal">
            <FooterAnchor href="#">Terms</FooterAnchor>
            <FooterAnchor href="#">Privacy</FooterAnchor>
          </FooterCol>
          <FooterCol title="Account">
            <FooterLink to="/login">Sign in</FooterLink>
            <FooterLink to="/signup">Get started</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-16 pt-6 border-t border-paper/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-paper/45">
            © {new Date().getFullYear()} Nook. All rights reserved.
          </span>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-paper/45">
            Made with care · New York
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-paper/40 mb-5 font-semibold">
        {title}
      </div>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} className="text-sm text-paper/70 hover:text-paper transition-colors">
        {children}
      </a>
    </li>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-sm text-paper/70 hover:text-paper transition-colors">
        {children}
      </Link>
    </li>
  );
}
