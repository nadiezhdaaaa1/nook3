import { useNavigate } from "@tanstack/react-router";
import { OriginButton } from "@/components/ui/origin-button";
import icon1 from "@/assets/Problem_1.png.asset.json";
import icon2 from "@/assets/Problem_2.png.asset.json";
import icon3 from "@/assets/Prblem_3.png.asset.json";
import icon4 from "@/assets/Problem_4.png.asset.json";

const CARDS = [
  {
    icon: icon1.url,
    pain: "Refreshing rental sites every 30 minutes hoping something new appears.",
    fix: "Get a text when it does.",
  },
  {
    icon: icon2.url,
    pain: "Showing up to a viewing and finding the listing was a bait price.",
    fix: "We strip out 'starting from' pricing before you ever see the listing.",
  },
  {
    icon: icon3.url,
    pain: "Asking a landlord about rent-stabilization and hearing 'oh that's not really regulated'.",
    fix: "We verify against public records. The badge means it's real.",
  },
  {
    icon: icon4.url,
    pain: "Losing the apartment because you saw it 4 hours after it posted.",
    fix: "Median alert time: minutes after listing goes live.",
  },
];


export function TiredOfSection() {
  const navigate = useNavigate();
  return (
    <section className="prob-section">
      <style>{`
        .prob-section {
          background: #2c2415;
          padding: 104px 24px;
        }
        .prob-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        .prob-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0, "ROND" 0, "wdth" 100;
          font-weight: 500;
          font-size: 14px;
          color: #f8f3e1;
        }
        .prob-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #ffd1aa;
          flex-shrink: 0;
        }
        .prob-h2 {
          margin-top: 20px;
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0, "WONK" 1;
          font-weight: 600;
          font-size: 48px;
          line-height: 54px;
          letter-spacing: -1.2px;
          color: #ffffff;
          max-width: 760px;
        }
        .prob-sub {
          margin-top: 16px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0, "ROND" 0, "wdth" 100;
          font-weight: 400;
          font-size: 18px;
          line-height: 1.6;
          color: #f8f3e1;
        }
        .prob-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          align-items: stretch;
        }
        .prob-card {
          min-height: 220px;
          background: rgba(248, 243, 225, 0.06);
          border: 1px solid rgba(248, 243, 225, 0.20);
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 18px;
        }
        .prob-icon {
          width: 56px;
          height: 56px;
          object-fit: contain;
          display: block;
          flex-shrink: 0;
        }

        .prob-pain {
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0, "WONK" 1;
          font-weight: 500;
          font-size: 18px;
          line-height: 24px;
          color: #ffd1aa;
        }
        .prob-fix {
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0, "ROND" 0, "wdth" 100;
          font-weight: 400;
          font-size: 15px;
          line-height: 20px;
          color: #ffffff;
        }
        .prob-close {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 8px 0;
        }
        .prob-close-line {
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0, "WONK" 1;
          font-weight: 520;
          font-size: 30px;
          line-height: 45px;
          color: #ffffff;
        }
        .prob-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          color: #241c12;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0, "ROND" 0, "wdth" 100;
          font-weight: 500;
          font-size: 16px;
          border-radius: 12px;
          padding: 16px 24px;
          box-shadow: none;
          white-space: nowrap;
          transition: background-color 0.18s ease, transform 0.18s ease;
        }
        .prob-btn:hover {
          background: #f8f3e1;
          transform: translateY(-1px);
        }
        .prob-btn:focus-visible {
          outline: 2px solid #f8f3e1;
          outline-offset: 2px;
        }
        @media (max-width: 1100px) {
          .prob-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .prob-close {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
        }
        @media (max-width: 680px) {
          .prob-section { padding: 72px 24px; }
          .prob-grid { grid-template-columns: minmax(0, 1fr); }
          .prob-card { min-height: 0; }
          .prob-h2 { font-size: clamp(32px, 6vw, 40px); line-height: 1.1; }
          .prob-close-line { font-size: clamp(24px, 5vw, 30px); line-height: 1.3; }
        }
      `}</style>

      <div className="prob-inner">
        <div>
          <div className="prob-eyebrow">
            <span className="prob-dot" />
            Built for active renters
          </div>
          <h2 className="prob-h2">You probably know this apartment-hunting burnout feeling</h2>
          <p className="prob-sub">
            Apartment hunting is broken. We rebuilt the part you actually use
          </p>
        </div>

        <div className="prob-grid">
          {CARDS.map((c) => (
            <div key={c.pain} className="prob-card">
              <img src={c.icon} alt="" className="prob-icon" loading="lazy" />
              <p className="prob-pain">{c.pain}</p>
              <p className="prob-fix">{c.fix}</p>
            </div>

          ))}
        </div>

        <div className="prob-close">
          <div className="prob-close-line">
            Start&nbsp;— see what comes in this week.
          </div>
          <OriginButton
            variant="main"
            onClick={() => navigate({ to: "/onboarding" })}
          >
            Find my apartment
          </OriginButton>
        </div>
      </div>
    </section>
  );
}
