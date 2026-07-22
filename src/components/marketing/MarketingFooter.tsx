import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { openCookiePreferences } from "@/lib/cookieConsent";
import {
  SocialIcon,
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  RedditIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/brand/SocialIcons";

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-12">
          <FooterCol title="Product">
            <FooterAnchor href="#how">How it works</FooterAnchor>
            <FooterAnchor href="#what">What you get</FooterAnchor>
            <FooterAnchor href="#pricing">Pricing</FooterAnchor>
            <FooterAnchor href="#faq">FAQ</FooterAnchor>
            <FooterAnchor href="/blog">Blog</FooterAnchor>
          </FooterCol>
          <FooterCol title="Company">
            <FooterLink to="/contact">Contact</FooterLink>
          </FooterCol>
          <FooterCol title="Legal">
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/cookies">Cookie Policy</FooterLink>
            <li>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 transition-opacity text-left"
              >
                Manage Cookie Preferences
              </button>
            </li>
            <FooterLink to="/acceptable-use">Acceptable Use</FooterLink>
            <FooterLink to="/fair-housing">Fair Housing</FooterLink>
            <FooterLink to="/accessibility">Accessibility</FooterLink>
            <li>
              <Link
                to="/do-not-sell"
                className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                Do Not Sell or Share <span aria-hidden>→</span>
              </Link>
            </li>
            <FooterLink to="/dmca">DMCA</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 pt-10 border-t flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ borderColor: "color-mix(in oklab, var(--color-brand-cream) 12%, transparent)" }}>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold" style={{ color: "color-mix(in oklab, var(--color-brand-cream) 40%, transparent)" }}>
            Follow us
          </span>
          <div className="flex items-center gap-1" style={{ color: "var(--color-brand-cream)" }}>
            <SocialIcon href="https://www.instagram.com/thenookrent" label="Instagram">
              <InstagramIcon />
            </SocialIcon>
            <SocialIcon href="https://www.reddit.com/user/thenookrent/" label="Reddit">
              <RedditIcon />
            </SocialIcon>
            <SocialIcon href="https://www.tiktok.com/@thenook.rent" label="TikTok">
              <TikTokIcon />
            </SocialIcon>
            <SocialIcon href="https://www.pinterest.com/01thenookrent01/" label="Pinterest">
              <PinterestIcon />
            </SocialIcon>
            <SocialIcon label="Facebook" disabled>
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon label="YouTube" disabled>
              <YouTubeIcon />
            </SocialIcon>
          </div>
        </div>

        <div
          className="mt-8 pt-8 pb-6 border-t"
          style={{ borderColor: "color-mix(in oklab, var(--color-brand-cream) 12%, transparent)" }}
        >
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--color-brand-cream)" }}
          >
            Zentaro Systems Ltd · Trading as Nook
          </p>
          <div
            className="mt-2 text-[12px] leading-[1.6]"
            style={{ color: "color-mix(in oklab, var(--color-brand-cream) 65%, transparent)" }}
          >
            <p>167-169 Great Portland Street, 5th Floor</p>
            <p>London, W1W 5PF</p>
            <p>Company No. 17178666</p>
          </div>
          <p className="mt-3 text-[12px]">
            <a
              href="mailto:hello@thenook.rent"
              className="hover:underline"
              style={{ color: "var(--color-brand-terracotta)" }}
            >
              hello@thenook.rent
            </a>
          </p>
          <p
            className="mt-2 text-[12px]"
            style={{ color: "color-mix(in oklab, var(--color-brand-cream) 65%, transparent)" }}
          >
            © {new Date().getFullYear()} Zentaro Systems Ltd. All rights reserved.
          </p>
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
