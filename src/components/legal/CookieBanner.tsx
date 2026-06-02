import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
          aria-label="Cookie preferences"
          className="fixed inset-x-0 bottom-0 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{
            backgroundColor: "var(--color-brand-charcoal, #2B2521)",
            color: "var(--color-brand-cream, #F5EFE6)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <div className="flex-1 text-sm leading-relaxed">
              We use cookies for product functionality and analytics. You can
              choose what to allow.{" "}
              <a
                href="/cookies"
                className="underline underline-offset-2 hover:opacity-80"
              >
                See Cookie Policy →
              </a>
            </div>
            <div className="flex flex-wrap gap-2 justify-end shrink-0">
              <button
                onClick={rejectAll}
                className="h-10 px-4 rounded-full text-sm font-medium border border-current/30 hover:bg-white/5 transition-colors"
              >
                Reject all
              </button>
              <button
                onClick={openModal}
                className="h-10 px-4 rounded-full text-sm font-medium border border-current/30 hover:bg-white/5 transition-colors"
              >
                Manage
              </button>
              <button
                onClick={acceptAll}
                className="h-10 px-5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-brand-terracotta, #C2664E)",
                  color: "white",
                }}
              >
                Accept all
              </button>
            </div>
          </div>
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
      necessary: true,
      analytics,
      functional,
      advertising,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cookie preferences</DialogTitle>
          <DialogDescription>
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

        <DialogFooter className="gap-2 sm:gap-2">
          {initialDecided && (
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-full text-sm font-medium border border-charcoal-300 hover:bg-charcoal-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={save}
            className="h-10 px-5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-brand-charcoal, #2B2521)" }}
          >
            Save preferences
          </button>
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
