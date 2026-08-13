import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { OriginButton } from "@/components/ui/origin-button";
import { devSetAccountState } from "@/lib/dev.functions";
import { accessQueryKey } from "@/lib/queries/access";
import { profileQueryKey } from "@/lib/queries/profile";
import { BILLING_RETURN_KEY } from "@/components/billing/BillingDunningBanner";
import stripeWordmark from "@/assets/stripe-wordmark.svg?url";

/**
 * MOCK BILLING PORTAL / HOSTED INVOICE — stand-in for the two Stripe surfaces
 * that repair a `past_due` subscription. Neither creates a subscription: the
 * subscription already exists and only the payment needs to land.
 *
 * Real wiring: `mode="portal"` becomes a redirect to the Billing Portal
 * session URL, `mode="invoice"` to `invoice.hosted_invoice_url`, and the state
 * write below moves to the `invoice.paid` webhook.
 */
export function MockRepairScreen({ mode }: { mode: "portal" | "invoice" }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const setState = useServerFn(devSetAccountState);
  const [busy, setBusy] = useState(false);

  const isInvoice = mode === "invoice";

  async function onPay() {
    setBusy(true);
    try {
      // Repair, not re-subscribe: status returns to active, past_due cleared.
      await setState({ data: { status: "active", clearPastDue: true } as never });
      await qc.invalidateQueries({ queryKey: accessQueryKey });
      await qc.invalidateQueries({ queryKey: profileQueryKey });
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(BILLING_RETURN_KEY, "1");
      }
      navigate({ to: "/home", replace: true });
    } catch (e) {
      setBusy(false);
      toast.error("Mock payment failed", {
        description: e instanceof Error ? e.message : "Try again",
      });
    }
  }

  function onBack() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(BILLING_RETURN_KEY, "1");
    }
    navigate({ to: "/home", replace: true });
  }

  return (
    <div className="min-h-dvh bg-[#FAF6EE]">
      <div
        role="status"
        className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-[#FFE7A3] px-4 py-2.5 text-center text-[13px] font-semibold text-[#5A4200]"
        style={{ borderBottom: "2px dashed #C99700" }}
      >
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          MOCK {isInvoice ? "HOSTED INVOICE" : "BILLING PORTAL"} — no real payment is taken.
        </span>
      </div>

      <div className="mx-auto w-full max-w-[520px] px-5 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display m-0 text-[26px] font-bold text-charcoal-950">
            {isInvoice ? "Confirm this payment" : "Update your payment method"}
          </h1>
          <img src={stripeWordmark} alt="Stripe" height={26} className="h-[26px] w-auto" />
        </div>

        <p className="mt-3 text-[15px] leading-[22px] text-charcoal-600">
          {isInvoice
            ? "Your bank asked to confirm this charge. Approving it here settles the outstanding invoice — a new card wouldn't resolve the prompt."
            : "Add a working card and we'll retry the outstanding invoice right away. Your subscription stays as it is — nothing new is created."}
        </p>

        <div className="mt-8 rounded-[16px] border border-black/20 bg-white p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
            {isInvoice ? "Outstanding invoice" : "Card on file"}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[16px] text-charcoal-950">
            <Lock className="h-4 w-4 text-charcoal-500" aria-hidden />
            {isInvoice ? "Awaiting bank confirmation" : "Visa •••• 4242 — declined"}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <OriginButton
            variant="main"
            size="big"
            className="w-full"
            onClick={() => void onPay()}
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Processing…
              </>
            ) : isInvoice ? (
              "Confirm payment"
            ) : (
              "Save card and retry payment"
            )}
          </OriginButton>
          <OriginButton variant="tertiary" size="big" className="w-full" onClick={onBack}>
            Back to Nook
          </OriginButton>
        </div>
      </div>
    </div>
  );
}
