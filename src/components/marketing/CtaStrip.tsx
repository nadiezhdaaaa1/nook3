import { useNavigate } from "@tanstack/react-router";

import { OriginButton } from "@/components/ui/origin-button";

const CSS = `
.ctab { position:relative; overflow:hidden; padding:104px 0; background:#2c2415; }
.ctab::before {
  content:""; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(60% 70% at 12% 0%, rgba(255,205,0,0.14) 0%, rgba(255,205,0,0) 60%),
    radial-gradient(58% 68% at 88% 12%, rgba(203,74,10,0.26) 0%, rgba(203,74,10,0) 62%),
    radial-gradient(62% 72% at 82% 100%, rgba(122,143,55,0.30) 0%, rgba(122,143,55,0) 64%),
    radial-gradient(58% 66% at 4% 92%, rgba(120,165,200,0.12) 0%, rgba(120,165,200,0) 64%);
}
.ctab-inner { position:relative; max-width:1200px; margin:0 auto; padding:0 32px;
  display:flex; align-items:center; justify-content:space-between; gap:40px; }
.ctab-left { flex:1 1 auto; display:flex; flex-direction:column; gap:16px; }
.ctab-h2 { font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:48px; line-height:54px; letter-spacing:-1.2px; color:#fff; margin:0; }
.ctab-sub { font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100; font-weight:400; font-size:18px; line-height:1.6; color:#f8f3e1; }
.ctab-btn { flex:0 0 auto; display:inline-flex; align-items:center; justify-content:center;
  background:#d66c38; color:#fff; border-radius:12px; padding:16px 24px; text-decoration:none;
  font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:500; font-size:16px; line-height:1; box-shadow:none;
  transition:background-color .2s ease-out, transform .2s ease-out; }
.ctab-btn:hover { background:#c25e2d; transform:translateY(-1px); }
.ctab-btn:focus-visible { outline:2px solid #f8f3e1; outline-offset:2px; }
@media (max-width:1100px) {
  .ctab-inner { flex-direction:column; align-items:flex-start; gap:28px; }
  .ctab-h2 { font-size:clamp(34px,5vw,44px); line-height:1.14; }
}
@media (max-width:680px) {
  .ctab { padding:72px 0; }
  .ctab-h2 { font-size:clamp(30px,7vw,36px); }
  .ctab-btn { width:100%; max-width:320px; }
}
@media (prefers-reduced-motion:reduce) { .ctab-btn { transition:none; } .ctab-btn:hover { transform:none; } }
`;

export function CtaStrip() {
  const navigate = useNavigate();
  return (
    <section className="ctab">
      <style>{CSS}</style>
      <div className="ctab-inner">
        <div className="ctab-left">
          <h2 className="ctab-h2">Your next apartment is already listed</h2>
          <p className="ctab-sub">Get the alert before everyone else does.</p>
        </div>
        <OriginButton
          variant="main"
          className="ctab-btn-origin"
          onClick={() => navigate({ to: "/signup" })}
        >
          Get alerts — Free
        </OriginButton>
      </div>
    </section>
  );
}
