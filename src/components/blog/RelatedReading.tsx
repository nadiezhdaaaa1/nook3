import { Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CATEGORY_LABEL, type BlogArticle } from "@/data/blog/articles";

const CSS = `
.rel {
  background:#f5f0e4; padding:104px 0;
}
.rel-inner { max-width:1200px; margin:0 auto; padding:0 40px; }
.rel-head {
  display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap;
}
.rel-h2 {
  margin:0; font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:48px; line-height:1.06; letter-spacing:-1.2px; color:#2b2521;
}
.rel-back {
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:700; font-size:16px; line-height:24px; color:#d66c38; text-decoration:none;
}
.rel-back:hover { text-decoration:underline; }
.rel-back:focus-visible { outline:2px solid #241c12; outline-offset:3px; }
.rel-grid {
  margin-top:48px; display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:24px;
}
.rel-card {
  display:flex; flex-direction:column; text-decoration:none;
  background:#ffffff; border:1px solid rgba(0,0,0,0.2); border-radius:28px; overflow:hidden;
  transition:border-color .2s ease;
}
.rel-card:hover { border-color:rgba(0,0,0,0.32); }
.rel-card:focus-visible { outline:2px solid #241c12; outline-offset:3px; }
.rel-card-img { height:176px; width:100%; overflow:hidden; }
.rel-card-img img { width:100%; height:100%; object-fit:cover; display:block; }
.rel-card-body { padding:20px 24px 24px; display:flex; flex-direction:column; gap:16px; flex:1; }
.rel-cat {
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:750; font-size:11.5px; letter-spacing:1.61px; text-transform:uppercase; color:#6a820a;
}
.rel-card-title {
  margin-top:8px; font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:19px; line-height:24.32px; letter-spacing:-0.19px; color:#241c12;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.rel-card-excerpt {
  margin-top:8px; font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:14px; line-height:21px; color:#7a6f5c;
  display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
}
.rel-card-meta {
  margin-top:auto; padding-top:16px; border-top:1px solid rgba(36,28,18,0.09);
  display:flex; align-items:center; gap:8px;
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:13px; line-height:19.5px; color:#7a6f5c;
}
@media (max-width:1100px) {
  .rel-grid { grid-template-columns:repeat(2, minmax(0,1fr)); }
}
@media (max-width:680px) {
  .rel { padding:64px 0; }
  .rel-inner { padding:0 20px; }
  .rel-h2 { font-size:clamp(30px,7vw,36px); }
  .rel-grid { grid-template-columns:minmax(0,1fr); }
}
`;

export function RelatedReading({ articles }: { articles: BlogArticle[] }) {
  return (
    <section className="rel" aria-labelledby="related-heading">
      <style>{CSS}</style>
      <div className="rel-inner">
        <div className="rel-head">
          <h2 id="related-heading" className="rel-h2">
            Related reading
          </h2>
          <Link to="/blog" className="rel-back">
            ← Back to all articles
          </Link>
        </div>
        <div className="rel-grid">
          {articles.map((r) => (
            <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="rel-card">
              <div className="rel-card-img" style={{ background: r.coverGradient }}>
                <img src={r.coverImage} alt={r.coverImageAlt} loading="lazy" />
              </div>
              <div className="rel-card-body">
                <div>
                  <div className="rel-cat">{CATEGORY_LABEL[r.category]}</div>
                  <h3 className="rel-card-title">{r.title}</h3>
                  <p className="rel-card-excerpt">{r.excerpt}</p>
                </div>
                <div className="rel-card-meta">
                  <span>Nook Team ·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock style={{ width: 13, height: 13 }} aria-hidden="true" />
                    {r.readingTimeMin} min read
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
