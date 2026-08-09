import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OriginButton } from "@/components/ui/origin-button";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent } from "@/lib/cookieConsent";


export function CookieBanner() {
  const [hydrated, setHydrated] = useState(false);
  const decidedAt = useCookieConsent((s) => s.decidedAt);
  const modalOpen = useCookieConsent((s) => s.modalOpen);
  const needsDecision = useCookieConsent((s) => s.needsDecision);
  const acceptAll = useCookieConsent((s) => s.acceptAll);
  const rejectAll = useCookieConsent((s) => s.rejectAll);
  const openModal = useCookieConsent((s) => s.openModal);
  const closeModal = useCookieConsent((s) => s.closeModal);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const showBanner = needsDecision();

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          className="ckt animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          <div className="ckt-inner">
            <p className="ckt-text">
              We use cookies for product functionality and analytics. You can
              choose what to allow.{" "}
              <a href="/cookies" className="ckt-link">
                See Cookie Policy
              </a>
            </p>
            <div className="ckt-actions">
              <button onClick={rejectAll} className="ckt-btn ckt-btn-outline">
                Reject all
              </button>
              <button onClick={openModal} className="ckt-btn ckt-btn-outline">
                Manage
              </button>
              <button onClick={acceptAll} className="ckt-btn ckt-btn-accept">
                Accept all
              </button>
            </div>
          </div>

          <style>{`
            .ckt {
              position: fixed;
              left: 0;
              right: 0;
              bottom: 16px;
              z-index: 9999;
              display: flex;
              justify-content: center;
              padding: 0 16px;
              font-family: "Google Sans Flex", system-ui, sans-serif;
              font-variation-settings: "GRAD" 0, "ROND" 0, "wdth" 100;
            }
            .ckt-inner {
              width: 100%;
              max-width: 1024px;
              display: flex;
              align-items: center;
              gap: 40px;
              background: #2c2415;
              border: 1px solid rgba(255,255,255,0.4);
              border-radius: 24px;
              padding: 20px 40px;
            }
            .ckt-text {
              flex: 1;
              margin: 0;
              font-size: 14px;
              line-height: 24px;
              color: #f5ede0;
            }
            .ckt-link { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
            .ckt-actions { display: flex; gap: 8px; flex-shrink: 0; }
            .ckt-btn {
              border-radius: 12px;
              padding: 12px 20px;
              font-size: 16px;
              font-weight: 500;
              color: #ffffff;
              cursor: pointer;
              white-space: nowrap;
              transition: background-color .15s ease;
            }
            .ckt-btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.4); }
            .ckt-btn-outline:hover { background: rgba(255,255,255,0.1); }
            .ckt-btn-accept { background: #d66c38; border: none; }
            .ckt-btn-accept:hover { background: #c25e2d; }
            .ckt-btn:focus-visible { outline: 2px solid #f8f3e1; outline-offset: 2px; }
            @media (max-width: 680px) {
              .ckt-inner {
                flex-direction: column;
                align-items: stretch;
                gap: 16px;
                padding: 20px;
                border-radius: 20px;
              }
              .ckt-actions { width: 100%; }
              .ckt-btn { flex: 1; }
            }
          `}</style>
        </div>
      )}

      <CookieManageModal
        open={modalOpen}
        onClose={closeModal}
        initialDecided={decidedAt !== null}
      />
    </>
  );
}

function CookieManageModal({
  open,
  onClose,
  initialDecided,
}: {
  open: boolean;
  onClose: () => void;
  initialDecided: boolean;
}) {
  const current = useCookieConsent((s) => s.consent);
  const setConsent = useCookieConsent((s) => s.setConsent);

  const [analytics, setAnalytics] = useState(current.analytics);
  const [functional, setFunctional] = useState(current.functional);
  const [advertising, setAdvertising] = useState(current.advertising);

  // Sync local toggles when modal reopens.
  useEffect(() => {
    if (open) {
      setAnalytics(current.analytics);
      setFunctional(current.functional);
      setAdvertising(current.advertising);
    }
  }, [open, current.analytics, current.functional, current.advertising]);

  const save = () => {
    setConsent({
      analytics,
      functional,
      advertising,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Cookie preferences</DialogTitle>
          <DialogDescription className="font-sans">
            Choose which categories of cookies Nook can use. You can change
            these anytime from the Cookie Policy page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <ToggleRow
            title="Strictly necessary"
            description="Required for the site to function. Keep you signed in and remember your search settings."
            checked
            disabled
          />
          <ToggleRow
            title="Performance & analytics"
            description="Help us understand how you use Nook. (Google Analytics, Mixpanel)"
            checked={analytics}
            onChange={setAnalytics}
          />
          <ToggleRow
            title="Functional"
            description="Remember your preferences (timezone, theme)."
            checked={functional}
            onChange={setFunctional}
          />
          <ToggleRow
            title="Targeting & advertising"
            description="Personalize ads on other sites based on your activity here. (Meta Pixel, Google Ads)"
            checked={advertising}
            onChange={setAdvertising}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2 sm:space-x-0">
          {initialDecided && (
            <OriginButton variant="tertiary" size="medium" onClick={onClose}>
              Cancel
            </OriginButton>
          )}
          <OriginButton variant="dark" size="medium" onClick={save}>
            Save preferences
          </OriginButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-charcoal-100 last:border-0">
      <div className="flex-1">
        <div className="text-sm font-semibold text-charcoal-950 flex items-center gap-2">
          {title}
          {disabled && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400">
              always on
            </span>
          )}
        </div>
        <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">{description}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        aria-label={title}
      />
    </div>
  );
}
