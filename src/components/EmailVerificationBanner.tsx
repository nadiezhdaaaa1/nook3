import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DISMISS_KEY = "nook.emailVerify.dismissedAt";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export function EmailVerificationBanner() {
  const [email, setEmail] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean>(true);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted || !data.user) return;
      setEmail(data.user.email ?? null);
      setVerified(!!data.user.email_confirmed_at);
      try {
        const raw = localStorage.getItem(DISMISS_KEY);
        if (raw && Date.now() - Number(raw) < DISMISS_TTL_MS) setDismissed(true);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (verified || dismissed || !email) return null;

  async function resend() {
    if (!email) return;
    setSending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/preferences` },
    });
    setSending(false);
    if (error) {
      toast.error("Could not resend", { description: error.message });
      return;
    }
    toast.success("Verification email sent", { description: `Check ${email}.` });
  }

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-2.5 flex items-center gap-3 text-sm">
        <span className="flex-1">
          Please verify <span className="font-semibold">{email}</span> to receive apartment alerts.
        </span>
        <button
          type="button"
          onClick={resend}
          disabled={sending}
          className="font-semibold underline underline-offset-2 hover:no-underline disabled:opacity-60"
        >
          {sending ? "Sending…" : "Resend email"}
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-amber-900/70 hover:text-amber-900"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
