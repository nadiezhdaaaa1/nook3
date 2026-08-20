import { Link } from "@tanstack/react-router";
import { ARTICLES, CATEGORY_LABEL } from "@/data/blog/articles";

const TEASER_ARTICLES = ARTICLES.slice(0, 3);

const CSS = `
.blogt { background:#f5f0e4; padding:104px 24px; }
.blogt-inner { max-width:1200px; margin:0 auto; display:flex; flex-direction:column; gap:48px; }
.blogt-eyebrow { display:flex; align-items:center; gap:8px;
  font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:500; font-size:14px; color:#3a3a37; }
.blogt-dot { width:8px; height:8px; border-radius:9999px; background:#cb4a0a; }
.blogt-row { margin-top:20px; display:flex; align-items:flex-end; justify-content:space-between; gap:32px; }
.blogt-left { max-width:760px; display:flex; flex-direction:column; gap:16px; }
.blogt-h2 { font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:48px; line-height:54px; letter-spacing:-1.2px; color:#2b2521; }
.blogt-sub { font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:18px; line-height:1.6; color:#4a4a46; }
.blogt-all { font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:650; font-size:16px; line-height:24px; color:#d66c38; text-decoration:none; white-space:nowrap; }
.blogt-all:hover { text-decoration:underline; }
.blogt-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; align-items:stretch; }
.blogt-card { display:flex; flex-direction:column; background:#fff; border:1px solid rgba(0,0,0,0.2);
  border-radius:28px; overflow:hidden; text-decoration:none; cursor:pointer; height:100%;
  transition:border-color .2s ease-out; }
.blogt-card:hover { border-color:rgba(0,0,0,0.32); }
.blogt-card:focus-visible { outline:2px solid #241c12; outline-offset:2px; }
.blogt-cover { display:block; width:100%; height:176px; object-fit:cover; object-position:center; }
.blogt-body { flex:1; display:flex; flex-direction:column; gap:16px; padding:20px 24px 24px; }
.blogt-cat { font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:750; font-size:11.5px; letter-spacing:1.61px; text-transform:uppercase; color:#6a820a; }
.blogt-title { font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:19px; line-height:24.32px; letter-spacing:-0.19px; color:#241c12; margin:0; }
.blogt-exc { margin-top:8px; font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100; font-weight:400; font-size:14px; line-height:21px; color:#7a6f5c; }
.blogt-meta { margin-top:auto; display:flex; align-items:center; gap:8px; padding-top:16px;
  border-top:1px solid rgba(36,28,18,0.09);
  font-family:"Google Sans Flex",system-ui,sans-serif; font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:13px; line-height:19.5px; color:#7a6f5c; }
.blogt-meta svg { flex:0 0 auto; }
@media (max-width:1100px) { .blogt-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:680px) {
  .blogt { padding:72px 24px; }
  .blogt-grid { grid-template-columns:minmax(0,1fr); }
  .blogt-row { flex-direction:column; align-items:flex-start; gap:16px; }
  .blogt-h2 { font-size:clamp(32px,6vw,40px); line-height:1.12; }
}
`;

export function BlogTeaser() {
  return (
    <section id="blog" className="blogt">
      <style>{CSS}</style>
      <div className="blogt-inner">
        <div>
          <div className="blogt-eyebrow">
            <span className="blogt-dot" aria-hidden="true" />
            Reading
          </div>
          <div className="blogt-row">
            <div className="blogt-left">
              <h2 className="blogt-h2">Notes from the rental market</h2>
              <p className="blogt-sub">
                Guides, neighborhood deep-dives, and what we've learned from helping renters move
              </p>
            </div>
            <Link to="/blog" className="blogt-all">
              See all articles →
            </Link>
          </div>
        </div>

        <div className="blogt-grid">
          {TEASER_ARTICLES.map((a) => (
            <Link
              key={a.slug}
              to="/blog/$slug"
              params={{ slug: a.slug }}
              className="blogt-card"
            >
              <img className="blogt-cover" src={a.coverImage} alt={a.title} loading="lazy" />
              <div className="blogt-body">
                <div className="blogt-cat">{CATEGORY_LABEL[a.category]}</div>
                <div>
                  <h3 className="blogt-title">{a.title}</h3>
                  <p className="blogt-exc">{a.excerpt}</p>
                </div>
                <div className="blogt-meta">
                  <span>Nook Team ·</span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>{a.readingTimeMin} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
