import { Link } from "@tanstack/react-router";
import { openCookiePreferences } from "@/lib/cookieConsent";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  RedditIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/brand/SocialIcons";
import logoAsset from "@/assets/Nook_Footer.svg.asset.json";
import watermarkAsset from "@/assets/Footer_N.svg.asset.json";

const CSS = `
.ftr { position:relative; overflow:hidden; background:#faf6ee; padding:104px 0 64px; }
.ftr-inner { position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:0 32px;
  display:flex; flex-direction:column; gap:64px; }
.ftr-top { display:flex; align-items:center; justify-content:space-between; gap:40px; }
.ftr-brand { display:flex; flex-direction:column; gap:24px; }
.ftr-logo { width:81px; height:28px; display:block; }
.ftr-tag { margin:0; font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:520; font-size:42px; line-height:46.2px; color:#241c12; }
.ftr-right { display:flex; flex-direction:column; align-items:flex-end; gap:32px; }
.ftr-email { font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100; font-weight:500; font-size:24px; line-height:1.2;
  color:#d66c38; text-decoration:none; transition:color .2s ease; }
.ftr-email:hover { color:#CE4F12; }
.ftr-divider { height:1px; background:rgba(0,0,0,0.20); }
.ftr-cols { display:flex; gap:40px; flex-wrap:wrap; }
.ftr-col { width:220px; }
.ftr-social-col { margin-left:auto; align-self:flex-start; }
.ftr-socials { display:flex; align-items:center; gap:24px; }
.ftr-socials a { color:rgba(36,28,18,0.45); display:inline-flex; transition:color .2s ease-out; }
.ftr-socials a:hover { color:rgba(36,28,18,0.7); }
.ftr-socials svg { width:24px; height:24px; }
.ftr-h { font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100; font-weight:700; font-size:12px;
  letter-spacing:1.92px; text-transform:uppercase; color:#241c12; }
.ftr-list { list-style:none; margin:16px 0 0; padding:0; display:flex; flex-direction:column; gap:10px; }
.ftr-list a, .ftr-list button { font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100; font-weight:400; font-size:14px; line-height:21px;
  color:rgba(36,28,18,0.72); text-decoration:none; background:none; border:0; padding:0; text-align:left;
  cursor:pointer; transition:color .2s ease-out; }
.ftr-list a:hover, .ftr-list button:hover { color:#241c12; }
.ftr-legal { max-width:560px; display:flex; flex-direction:column; gap:4px;
  font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-size:13px; line-height:22.1px; color:rgba(36,28,18,0.72); }
.ftr-legal p { margin:0; }
.ftr-legal-name { font-weight:650; letter-spacing:0.78px; text-transform:uppercase; color:rgba(36,28,18,0.85); }
.ftr-wm { position:absolute; right:32px; bottom:0; width:282px; height:347px;
  pointer-events:none; z-index:0; }
.ftr a:focus-visible, .ftr button:focus-visible { outline:2px solid #241c12; outline-offset:2px; }
@media (max-width:1100px) {
  .ftr-top { flex-direction:column; align-items:flex-start; gap:32px; }
  .ftr-right { align-items:flex-start; }
}
@media (max-width:680px) {
  .ftr { padding:104px 0 48px; }
  .ftr-inner { gap:48px; }
  .ftr-tag { font-size:clamp(30px,7vw,36px); line-height:1.15; }
  .ftr-cols { flex-direction:column; }
  .ftr-col { width:100%; }
  .ftr-wm { width:240px; height:auto; right:0; }
}
`;

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/thenookrent", Icon: InstagramIcon },
  { label: "Reddit", href: "https://www.reddit.com/user/thenookrent/", Icon: RedditIcon },
  { label: "Pinterest", href: "https://www.pinterest.com/01thenookrent01/", Icon: PinterestIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@thenook.rent", Icon: TikTokIcon },
  { label: "YouTube", href: "https://www.youtube.com/@TheNookRent", Icon: YouTubeIcon },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Thenookrent/61592003651488/",
    Icon: FacebookIcon,
  },
];

export function MarketingFooter() {
  return (
    <footer className="ftr">
      <style>{CSS}</style>
      <img className="ftr-wm" src={watermarkAsset.url} alt="" aria-hidden="true" />

      <div className="ftr-inner">
        <div className="ftr-top">
          <div className="ftr-brand">
            <img className="ftr-logo" src={logoAsset.url} alt="Nook" width={81} height={28} />
            <p className="ftr-tag">Where home finds you</p>
          </div>
          <a className="ftr-email" href="mailto:hello@thenook.rent">
            hello@thenook.rent
          </a>
        </div>

        <div className="ftr-divider" />

        <div className="ftr-cols">
          <nav className="ftr-col" aria-label="Legal">
            <div className="ftr-h">Legal</div>
            <ul className="ftr-list">
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li>
                <button type="button" onClick={openCookiePreferences}>
                  Manage Cookie Preferences
                </button>
              </li>
              <li><Link to="/acceptable-use">Acceptable Use</Link></li>
              <li><Link to="/fair-housing">Fair Housing</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/do-not-sell">Do Not Sell or Share</Link></li>
              <li><Link to="/dmca">DMCA</Link></li>
            </ul>
          </nav>

          <nav className="ftr-col" aria-label="Product">
            <div className="ftr-h">Product</div>
            <ul className="ftr-list">
              <li><a href="#how">How it works</a></li>
              <li><a href="#what">What you get</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </nav>

          <nav className="ftr-col" aria-label="Company">
            <div className="ftr-h">Company</div>
            <ul className="ftr-list">
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className="ftr-social-col">
            <div className="ftr-socials">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="ftr-legal">
          <p className="ftr-legal-name">NORELIX LIMITED · Trading as Nook</p>
          <p>
            The Black Church, St Mary's Place, Dublin 7, D07 P4AX, Ireland
            <br />
            Company No. 817569
          </p>
          <p>© 2026 NORELIX LIMITED. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
