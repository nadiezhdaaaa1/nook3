import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Nook" },
      { name: "description", content: "Nook's refund terms for subscriptions, trials, and renewals." },
      { property: "og:title", content: "Refund Policy — Nook" },
      { property: "og:description", content: "Nook's refund terms for subscriptions, trials, and renewals." },
      { property: "og:url", content: "https://thenook.rent/refunds" }
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/refunds" }],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="July 2, 2026">
      <h2>Overview</h2>
      <p>
        Nook, operated by Zentaro Systems Ltd, offers transparent, customer-friendly refund
        terms. This policy explains when refunds are available and how to request one.
      </p>
      <p>
        We aim to make this simple: if Nook isn't working for you, you shouldn't be stuck
        paying for it.
      </p>

      <h2>1. Free Trial</h2>
      <p>
        We offer a 3-day free trial for Premium and Max subscriptions.{" "}
        <strong>If you cancel before the trial ends, you will not be charged.</strong>
      </p>
      <p>
        You can cancel anytime during the trial from your account settings. Cancellation is
        immediate; you will not be charged.
      </p>

      <h2>2. Within 7 Days of an Initial Paid Charge</h2>
      <p>
        If you cancel within <strong>7 days</strong> of your first paid charge (whether on
        Premium or Max), we will issue a <strong>full refund</strong> to your original payment
        method.
      </p>
      <p>To request a refund within this window:</p>
      <ol>
        <li>Cancel your subscription in Account → Subscription</li>
        <li>
          Email <a href="mailto:support@thenook.rent">support@thenook.rent</a> within 7 days
          of the charge
        </li>
        <li>We will process the refund within 5-10 business days</li>
      </ol>
      <p>No questions asked.</p>

      <h2>3. After 7 Days</h2>
      <p>After the 7-day window, refunds are at our discretion. We may offer:</p>
      <ul>
        <li>
          <strong>Prorated refund</strong> for the unused portion of the current billing
          period (especially for annual subscriptions)
        </li>
        <li>
          <strong>Account credit</strong> that can be applied to future charges
        </li>
        <li>
          <strong>No refund</strong> if we believe the request is in bad faith (e.g., trying
          to refund after extensive use)
        </li>
      </ul>
      <p>Common situations where we typically offer a prorated refund:</p>
      <ul>
        <li>You found an apartment and no longer need alerts</li>
        <li>A medical emergency or unexpected circumstance</li>
        <li>Technical issues that prevented you from using the Service</li>
        <li>You move to a city we don't yet support</li>
      </ul>

      <h2>4. Annual Subscriptions</h2>
      <p>If you cancel an annual subscription mid-year:</p>
      <ul>
        <li>Within 7 days of charge: full refund</li>
        <li>
          After 7 days: prorated refund of unused months (less any annual discount benefit
          consumed)
        </li>
      </ul>
      <p>
        Example: You subscribe to Premium annual at $119 in January. You cancel in May. You
        used 4 months. We refund the equivalent of 8 unused months at the{" "}
        <strong>monthly</strong> rate ($14.99 × 8 = $119.92), minus the 4 months already used
        at monthly rate ($14.99 × 4 = $59.96), so refund equals $59.96. (Math may vary; we
        always favor the customer in close calls.)
      </p>

      <h2>5. Renewal Charges</h2>
      <p>For automatic renewals:</p>
      <ul>
        <li>We send a reminder email <strong>24 hours before</strong> any renewal charge</li>
        <li>If you cancel before the renewal date, you are not charged</li>
        <li>
          If you cancel within <strong>7 days after</strong> a renewal charge, we will refund
          it fully if you have not actively used the Service in that period
        </li>
        <li>
          If you have actively used the Service after renewal, we offer a prorated refund at
          our discretion
        </li>
      </ul>

      <h2>6. Non-Refundable Items</h2>
      <p>The following are non-refundable:</p>
      <ul>
        <li>Charges over 30 days old (except where required by law)</li>
        <li>Charges arising from your violation of our Terms of Service</li>
        <li>Move-out listing rewards (these are paid out, not collected)</li>
        <li>Referral rewards</li>
      </ul>

      <h2>7. How to Request a Refund</h2>
      <p><strong>Self-service (within 7-day window):</strong></p>
      <ul>
        <li>Cancel your subscription in Account → Subscription</li>
        <li>
          Email <a href="mailto:support@thenook.rent">support@thenook.rent</a> with subject
          "Refund Request"
        </li>
      </ul>
      <p><strong>Manual review (outside 7-day window):</strong></p>
      <ul>
        <li>Email <a href="mailto:support@thenook.rent">support@thenook.rent</a></li>
        <li>Include: subscription email, charge date, reason for refund</li>
        <li>We respond within 3 business days</li>
      </ul>

      <h2>8. Processing Time</h2>
      <p>
        Approved refunds are processed within 5-10 business days to your original payment
        method. Your bank or card issuer may take additional time to post the credit.
      </p>

      <h2>9. Disputes and Chargebacks</h2>
      <p>
        If you have a concern about a charge, please contact us first at{" "}
        <a href="mailto:support@thenook.rent">support@thenook.rent</a>. We aim to resolve
        issues fairly.
      </p>
      <p>
        Filing a chargeback with your bank without first contacting us may result in account
        termination as we cannot verify whether the dispute is legitimate. Resolved
        chargebacks also incur processing fees that benefit no one.
      </p>

      <h2>10. State-Specific Rights</h2>
      <p>
        This policy is in addition to, not in place of, any rights you have under your
        state's consumer protection laws.
      </p>
      <p>
        For California residents: Under the California Automatic Renewal Law (BPC §17602),
        you have specific rights regarding automatic-renewing subscriptions, including the
        right to cancel without penalty. Nothing in this policy waives those rights.
      </p>
      <p>
        For other state residents: Similar protections exist in many states. If state law
        gives you greater rights than this policy, those rights apply.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Refund Policy from time to time. We will post updates on this page
        and update the "Last Updated" date. Material changes will be communicated by email.
      </p>
      <p>Changes do not apply retroactively to charges made before the change took effect.</p>

      <h2>12. Contact</h2>
      <p>
        <strong>Refund requests:</strong>{" "}
        <a href="mailto:support@thenook.rent">support@thenook.rent</a>
        <br />
        <strong>General questions:</strong>{" "}
        <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
        <br />
        <strong>Mail:</strong> Zentaro Systems Ltd, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF, United Kingdom
      </p>
    </LegalPageLayout>
  );
}
