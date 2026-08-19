import { createFileRoute, Link } from "@tanstack/react-router";
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
    <LegalPageLayout title="Refund Policy" lastUpdated="August 19, 2026">
      <h2>1. What this policy covers</h2>
      <p>
        This policy applies to subscription charges for Nook, operated by NORELIX LIMITED. It forms part of our <Link to="/terms">Terms of Service</Link> and should be read together with Section 5 of those Terms.
      </p>

      <h2>2. Charges for completed and current periods are not refundable</h2>
      <p>
        When we charge you, we deliver the service for that period: we monitor listings in your city, score them against your criteria, and send you alerts. You keep that access until the end of the period even if you cancel on its first day.
      </p>
      <p>For that reason, and except as set out in Sections 4 to 6 below, we do not refund:</p>
      <ul>
        <li>The current billing period once it has been charged</li>
        <li>Past billing periods</li>
        <li>Partial months</li>
        <li>The remaining months of an annual subscription if you cancel mid-term — your access continues to the end of the twelve months</li>
      </ul>
      <p>Cancelling is not the same as a refund. Cancelling stops the next charge; it does not reverse one already made.</p>
      <p>If you no longer want the subscription, cancel it in Account &gt; Subscription. You can do this yourself at any time, and if you cannot, we will cancel it for you on request.</p>

      <h2>3. Before your first charge you can always leave at no cost</h2>
      <p>Your first three days are free of charge. We email you at least 24 hours before the first charge, stating the amount and the date.</p>
      <p>If you cancel before the introductory period ends, no charge is made and there is nothing to refund. Cancelling during the introductory period takes one step in Account &gt; Subscription.</p>

      <h2>4. Exception A — you did not use the Service during the period charged</h2>
      <p>Where you were charged for a period and did not use the Service at all during it, we may refund that charge in part.</p>
      <p>We assess use by two records:</p>
      <ul>
        <li>Whether you signed in to your account during the period, and</li>
        <li>Whether you opened any listing from an alert we sent you during the period</li>
      </ul>
      <p>If neither occurred, you may request a partial refund of that charge. Refunds under this section are made at our discretion and are not automatic.</p>
      <p>This exception does not apply where:</p>
      <ul>
        <li>You signed in or opened a listing at any point during the period</li>
        <li>The period has already been refunded</li>
      </ul>
      <p>Request within 30 days of the charge. We check the two records above for the dates in question and tell you what they show.</p>

      <h2>5. Exception B — rights under applicable law</h2>
      <p>Nothing in this policy limits any refund or cancellation right you have under the law that applies to you. Where the law requires a refund, we will provide it, whatever else this policy says.</p>

      <h2>6. Duplicate and incorrect charges</h2>
      <p>If you were charged twice for the same period, charged after cancelling, or charged an amount that does not match the price shown to you, we refund the incorrect charge in full or, where only the amount was incorrect, refund the difference.</p>
      <p>This is not an exception to our policy. It is the correction of an error, and you do not need to give a reason.</p>

      <h2>7. Referral and promotional credit</h2>
      <p>Bonus days credited through referrals or promotions have no cash value. They are not refundable and cannot be exchanged for money.</p>
      <p>Where a reward was credited as a result of a payment that is later refunded or successfully disputed, we may reverse it, as described in Section 8 of our <Link to="/terms">Terms of Service</Link>.</p>

      <h2>8. How to request a refund</h2>
      <p>Email <a href="mailto:support@thenook.rent">support@thenook.rent</a> with the subject line “Refund request” and include:</p>
      <ul>
        <li>The email address on your account</li>
        <li>The date and the amount of the charge</li>
        <li>What happened, in your own words</li>
      </ul>
      <p>You do not need to use any particular form of words, and you do not need to argue that your situation fits one of the exceptions above. If it does not, tell us anyway — we would rather look at it than have you dispute the charge with your bank.</p>

      <h2>9. How we handle requests</h2>
      <p>We reply within one business day to confirm we have received your request.</p>
      <p>We decide within fourteen (14) days and tell you the reason either way.</p>
      <p>Where a refund is approved, we issue it within fourteen (14) days of that decision, to the original payment method. Your bank may take several further business days to post it.</p>
      <p>If we decline a refund, we will explain why, and we will tell you what our records show for the dates in question.</p>

      <h2>10. Chargebacks</h2>
      <p>If you believe a charge is wrong, please contact us first. We can usually resolve it faster than a bank dispute, and opening a dispute does not produce a faster outcome.</p>
      <p>If a chargeback is filed:</p>
      <ul>
        <li>Your subscription is cancelled and access ends when the dispute is registered</li>
        <li>Any bonus days credited to another account as a referral reward for that payment may be reversed</li>
      </ul>

      <h2>11. Changes to this policy</h2>
      <p>We may update this policy. We will post the updated version on this page and change the “Last updated” date.</p>
      <p>Changes apply to charges made after the effective date. They never apply retroactively to a charge already made.</p>

      <h2>12. Contact</h2>
      <p>
        <strong>Refund requests:</strong>{" "}
        <a href="mailto:support@thenook.rent">support@thenook.rent</a>
        <br />
        <strong>Legal notices:</strong>{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>Mail:</strong> NORELIX LIMITED, The Black Church, St. Mary’s Place,
        Dublin 7, D07 P4AX, Ireland
      </p>
    </LegalPageLayout>
  );
}
