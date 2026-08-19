import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Nook" },
      { name: "description", content: "The Terms of Service that govern your use of Nook." },
      { property: "og:title", content: "Terms of Service — Nook" },
      { property: "og:description", content: "The Terms of Service that govern your use of Nook." },
      { property: "og:url", content: "https://thenook.rent/terms" }
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="August 19, 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        Welcome to Nook. These Terms of Service (“Terms”) govern your access to and use of the
        Nook website at thenook.rent, our applications, and related services (collectively, the
        “Service”) operated by NORELIX LIMITED, a private company limited by shares incorporated
        in Ireland under company number 817569, with its registered office at The Black Church,
        St. Mary’s Place, Dublin 7, D07 P4AX, Ireland (“Nook,” “we,” “us,” or “our”). Nook
        operates in the United States under the trade name “The Nook.”
      </p>
      <p>
        By creating an account, accessing, or using the Service, you agree to be bound by these
        Terms and our <Link to="/privacy">Privacy Policy</Link>. If you do not agree, you may
        not use the Service.
      </p>

      <h2>2. Eligibility</h2>
      <p>To use the Service, you must:</p>
      <ul>
        <li>Be at least 18 years of age, or the age of majority in your jurisdiction</li>
        <li>Be a resident of the United States</li>
        <li>Have the legal capacity to enter into a binding contract</li>
        <li>Not be barred from using the Service under applicable law</li>
      </ul>
      <p>
        By using the Service, you represent and warrant that you meet these requirements.
      </p>

      <h2>3. Your Account</h2>
      <h3>3.1 Account Creation</h3>
      <p>
        You must provide accurate, current, and complete information when creating an account.
        You are responsible for maintaining the confidentiality of your credentials and for all
        activity that occurs under your account.
      </p>
      <h3>3.2 Account Security</h3>
      <p>
        You agree to notify us immediately at{" "}
        <a href="mailto:hello@thenook.rent">hello@thenook.rent</a> of any unauthorized use of
        your account. We are not liable for any loss or damage arising from your failure to
        safeguard your credentials.
      </p>
      <h3>3.3 One Account Per Person</h3>
      <p>
        Each individual may maintain only one account. Sharing account credentials with others
        is prohibited.
      </p>
      <p>
        Creating additional accounts in order to obtain more than one introductory period (see
        Section 5.12) is a violation of these Terms and of our{" "}
        <Link to="/acceptable-use">Acceptable Use Policy</Link>.
      </p>

      <h2>4. The Service</h2>
      <h3>4.1 What Nook Does</h3>
      <p>
        Nook is a rental alerts service that aggregates rental listing information from licensed
        third-party sources and notifies subscribers by email when listings matching their
        criteria become available. The Service includes saved searches, email alerts, and a
        dashboard where the same matches can be viewed and acted on.
      </p>
      <p>
        Additional features may be added over time, and some features described in these Terms
        apply only where and when we make them available.
      </p>
      <h3>4.2 What Nook Is Not</h3>
      <p>
        <strong>
          Nook is not a real estate broker, agent, salesperson, or representative.
        </strong>{" "}
        We do not represent landlords, tenants, or any party to a rental transaction. We do not
        list properties for rent on behalf of landlords. We do not negotiate, prepare, or
        execute lease agreements. We do not verify tenant qualifications or process rental
        applications.
      </p>
      <p>
        Nook does not own, operate, manage, or control any rental property. We are an
        information aggregator only.
      </p>
      <h3>4.3 Listings Disclaimer</h3>
      <p>
        Listings shown through the Service are gathered from third-party sources. We do not
        guarantee:
      </p>
      <ul>
        <li>The accuracy, completeness, or timeliness of any listing</li>
        <li>That a listed property is actually available for rent</li>
        <li>That advertised rent, terms, or descriptions are accurate</li>
        <li>That the landlord or agent is legitimate or authorized</li>
        <li>
          That a property meets habitability standards or any other legal requirement
        </li>
      </ul>
      <p>
        You acknowledge that listings may be outdated, withdrawn, fraudulent, or misrepresented.
        You assume full responsibility for verifying listing information directly with the
        landlord or agent before taking any action.
      </p>
      <h3>4.4 Regulatory Status Badges</h3>
      <p>
        Where the Service displays a “rent-stabilized,” “rent-controlled,” or similar badge on a
        listing, this means our system has matched the listing’s address against a publicly
        available regulatory database as of a specific date, which we show alongside the badge.
      </p>
      <p>
        A badge is not a guarantee. The regulatory database may be incomplete or outdated,
        landlord representations may differ, and a unit’s regulatory status may have changed.
        Where we are unable to match an address with confidence, we display no badge at all —
        the absence of a badge does not mean a unit is unregulated. You should independently
        verify regulatory status before relying on it.
      </p>
      <h3>4.5 AI Assistant</h3>
      <p>Where the Service includes an AI assistant (“Wren”):</p>
      <ul>
        <li>
          Wren provides general information only and is not legal, financial, real estate, or
          professional advice
        </li>
        <li>Wren may produce inaccurate, incomplete, or outdated responses</li>
        <li>
          Wren conversations may be reviewed, stored, and used to improve the Service (see{" "}
          <Link to="/privacy">Privacy Policy</Link>)
        </li>
        <li>
          You should not rely on Wren for any consequential decision without independent
          verification
        </li>
        <li>Wren is not a substitute for consultation with licensed professionals</li>
      </ul>
      <h3>4.6 Service Availability</h3>
      <p>
        We strive to maintain Service availability but do not guarantee uninterrupted access. We
        may modify, suspend, or discontinue any portion of the Service at any time. Alert
        delivery timing is best-effort and not subject to any service level agreement.
      </p>
      <p>
        Where an extended service failure occurs during your introductory period, Section 4 of
        our <Link to="/refunds">Refund Policy</Link> may apply.
      </p>

      <h2>5. Subscriptions, Billing, and Cancellation</h2>
      <h3>5.1 One Paid Subscription</h3>
      <p>
        Nook is offered as a single paid subscription. There is no free version of the Service.
        You may choose monthly or annual billing.
      </p>
      <p>
        Current prices are shown on our pricing page, in your account, and again at checkout
        before you provide payment information. The price that applies to you is the price
        displayed to you at checkout.
      </p>
      <h3>5.2 Your 3-Day Introductory Period</h3>
      <p>
        To subscribe, you must provide a valid payment method. Your first three (3) days are
        free of charge.
      </p>
      <p>During the introductory period:</p>
      <ul>
        <li>
          Alerts are delivered at the same speed as on the paid subscription — we do not delay
          them
        </li>
        <li>Each digest shows your 3 best matches; any additional matches we find are held</li>
        <li>You may run one (1) search</li>
      </ul>
      <p>
        Your introductory period begins when your payment method is accepted and ends
        seventy-two (72) hours later. The exact end date and time are shown in your account
        under Account &gt; Subscription and in the email we send when the period begins.
      </p>
      <h3>5.3 Automatic Conversion and Renewal — Your Express Consent</h3>
      <p>
        <strong>THIS IS A SUBSCRIPTION THAT RENEWS AUTOMATICALLY UNTIL YOU CANCEL.</strong>
      </p>
      <p>By providing your payment method, you expressly authorize us to charge it:</p>
      <ul>
        <li>
          the subscription price shown to you at checkout, at the end of your 3-day introductory
          period, unless you cancel before that period ends; and
        </li>
        <li>
          the same amount on each renewal date — monthly or annually, according to the billing
          period you chose — until you cancel.
        </li>
      </ul>
      <p>
        The amount and the date of your first charge are displayed to you before you enter your
        payment details, and are shown again in your account under Account &gt; Subscription.
      </p>
      <p>
        We disclose the amount and the date of your first charge before you enter payment
        information, and you must affirmatively agree to these billing terms on the payment
        screen. We retain verification of your affirmative consent for at least three (3) years,
        or for one (1) year after your subscription terminates, whichever period is longer.
      </p>
      <p>
        If you cancel before the end of your introductory period, you will not be charged.
      </p>
      <h3>5.4 Annual Subscription</h3>
      <p>
        If you choose the annual subscription, the annual price will be charged at the end of
        your 3-day introductory period, unless you cancel before the introductory period ends.
        Thereafter, the same annual subscription price will be charged every twelve (12) months
        until you cancel.
      </p>
      <p>
        We never move you from monthly to annual billing automatically. You may switch to annual
        billing yourself at any time in Account &gt; Subscription.
      </p>
      <h3>5.5 Reminders, Receipts, and Notices</h3>
      <ul>
        <li>
          <strong>Subscription confirmation:</strong> immediately after you subscribe, we send
          you a confirmation that you can retain, setting out your selected plan, subscription
          price, billing frequency, the end date and time of your 3-day introductory period, the
          date of your first charge, the automatic renewal terms, our cancellation policy, and
          instructions for how to cancel.
        </li>
        <li>
          <strong>Before your first charge:</strong> we email you at least 24 hours before your
          introductory period ends, stating the amount and the date of the charge.
        </li>
        <li>
          <strong>After every charge:</strong> we email you a receipt.
        </li>
        <li>
          <strong>Annual renewals:</strong> we email you between 15 and 45 days before each
          annual renewal.
        </li>
        <li>
          <strong>Price changes:</strong> between 7 and 30 days’ notice, as described in Section
          5.7.
        </li>
      </ul>
      <p>
        These are transactional messages about your account and your billing. You cannot
        unsubscribe from them while your subscription is active. Unsubscribing from rental alerts
        does not cancel your subscription and does not stop these messages.
      </p>
      <h3>5.6 How to Cancel</h3>
      <p>
        You can cancel at any time in Account &gt; Subscription — the same place where you manage
        your subscription, in the same medium in which you signed up.
      </p>
      <ul>
        <li>
          <strong>During your introductory period:</strong> cancellation takes one step. You are
          not charged. Your access continues until the end of the third day.
        </li>
        <li>
          <strong>On a paid subscription:</strong> cancellation takes two steps. You keep full
          access until the end of the billing period you have already paid for, and no further
          charges are made.
        </li>
      </ul>
      <p>
        Cancelling does not require a phone call, a chat session, or an email. We do not require
        you to accept an offer, answer questions, or speak with anyone. If we ask why you are
        leaving, the question is optional and does not delay or condition your cancellation.
      </p>
      <p>
        If for any reason you cannot cancel in your account, email{" "}
        <a href="mailto:hello@thenook.rent">hello@thenook.rent</a> from the address on your
        account and we will cancel it for you.
      </p>
      <h3>5.7 Price Changes</h3>
      <p>
        We may change subscription prices. We will notify you by email no less than seven (7)
        days and no more than thirty (30) days before the new price takes effect. If you do not
        want to continue at the new price, you may cancel before it takes effect. Continuing to
        use the Service after the effective date means you accept the new price.
      </p>
      <h3>5.8 Refunds</h3>
      <p>
        Charges for completed and current billing periods are not refundable, except as described
        in our <Link to="/refunds">Refund Policy</Link> or as required by applicable law.
      </p>
      <p>
        Cancelling stops future charges. It does not refund a charge already made — instead, you
        keep access for the period you have paid for.
      </p>
      <p>
        Our <Link to="/refunds">Refund Policy</Link> describes the limited circumstances in
        which we may refund, including where you did not use the Service during the period
        charged, and the correction of duplicate or incorrect charges.
      </p>
      <h3>5.9 Failed Payments</h3>
      <p>
        If a charge fails, we will retry it over a period of up to seven (7) days and email you
        about it. Your access continues during that period. If the final retry fails, your
        alerts stop and your subscription ends.
      </p>
      <p>
        Your searches, criteria, and alert history remain stored, so you can restart your
        subscription without setting anything up again.
      </p>
      <h3>5.10 Payment Processing</h3>
      <p>
        Payments are processed by Stripe, Inc. By providing payment information, you also agree
        to Stripe’s terms. We do not store full payment card numbers on our servers.
      </p>
      <h3>5.11 Taxes</h3>
      <p>
        Listed prices do not include applicable sales taxes. You are responsible for any taxes
        that apply to your subscription.
      </p>
      <h3>5.12 One Introductory Period per Person</h3>
      <p>
        The free introductory period is available once. Once any account or payment method
        associated with you has been charged for Nook, you are not eligible for another
        introductory period.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Scrape, copy, or redistribute listings or other Service content</li>
        <li>Resell, sublicense, or commercially exploit the Service</li>
        <li>Create accounts by automated means</li>
        <li>Create additional accounts to obtain more than one introductory period</li>
        <li>Bypass rate limits, paywalls, or access controls</li>
        <li>Attempt to reverse engineer, decompile, or extract source code</li>
        <li>Use the Service to harass, defame, or harm any party</li>
        <li>Submit fraudulent referrals or manipulate any rewards programme</li>
        <li>
          Use the Service in violation of the Fair Housing Act or any anti-discrimination law
        </li>
        <li>Impersonate any person or entity</li>
        <li>Transmit viruses, malware, or harmful code</li>
        <li>Interfere with the Service’s operation or security</li>
      </ul>
      <p>
        We may suspend or terminate accounts for violations. Our full{" "}
        <Link to="/acceptable-use">Acceptable Use Policy</Link> sets out prohibited conduct and
        our enforcement process in more detail.
      </p>

      <h2>7. Your Content</h2>
      <p>
        You retain ownership of any content you submit to the Service, such as messages you send
        to support.
      </p>
      <p>
        By submitting content, you grant Nook a worldwide, non-exclusive, royalty-free license to
        use, store, and process it for the purposes of operating and improving the Service and of
        responding to you.
      </p>
      <p>
        You represent that you have all necessary rights to grant this license and that your
        content does not violate any law or third-party right.
      </p>

      <h2>8. Referrals and Rewards</h2>
      <h3>8.1 Referral Programme</h3>
      <p>
        Where we offer rewards for referring new users, the specific reward terms are disclosed
        in the Service at the time of the offer.
      </p>
      <h3>8.2 No Cash Value</h3>
      <p>
        Rewards have no cash value and are not transferable or refundable. Rewards may expire, or
        be revoked or reversed in the case of fraud or abuse.
      </p>
      <h3>8.3 Reversal</h3>
      <p>
        Where a reward was credited as a result of a payment that is later refunded or
        successfully disputed with the payer’s bank, we may reverse that reward. Where the reward
        has already been used, we may instead suspend further reward accrual on the account
        concerned.
      </p>
      <h3>8.4 Fair Use</h3>
      <p>
        You may not engage in spam, deceptive practices, or self-referrals. We may invalidate
        referrals that violate these Terms.
      </p>

      <h2>9. Intellectual Property</h2>
      <h3>9.1 Our Rights</h3>
      <p>
        The Service, including all software, design, content, and trademarks, is owned by Nook or
        our licensors and protected by US and international intellectual property laws. We grant
        you a limited, non-exclusive, non-transferable, revocable license to use the Service for
        personal, non-commercial purposes.
      </p>
      <h3>9.2 Feedback</h3>
      <p>
        If you submit feedback or suggestions, we may use them without obligation to you.
      </p>
      <h3>9.3 Trademarks</h3>
      <p>
        “Nook,” “The Nook,” “Wren,” and our logos are trademarks of NORELIX LIMITED. You may not
        use them without our prior written consent.
      </p>

      <h2>10. DMCA / Copyright Infringement</h2>
      <p>
        If you believe content on the Service infringes your copyright, please send a notice to:
      </p>
      <p>
        <strong>Email:</strong> <a href="mailto:dmca@thenook.rent">dmca@thenook.rent</a>
      </p>
      <p>
        Your notice should include the information required by 17 U.S.C. § 512(c)(3).
      </p>
      <p>
        We may terminate accounts of repeat infringers. See our{" "}
        <Link to="/dmca">DMCA Copyright Policy</Link> for the full procedure.
      </p>

      <h2>11. Third-Party Services</h2>
      <p>
        The Service may link to or integrate with third-party services (for example, listing
        sources, payment processors, and mapping services). We are not responsible for the
        content, policies, or practices of those third parties. Your use of third-party services
        is governed by their own terms.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Your use of the Service is also governed by our{" "}
        <Link to="/privacy">Privacy Policy</Link>, incorporated here by reference.
      </p>

      <h2>13. Disclaimers</h2>
      <p>
        <strong>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND,
          WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THAT THE SERVICE WILL BE UNINTERRUPTED,
          SECURE, OR ERROR-FREE.
        </strong>
      </p>
      <p>
        <strong>
          WE DO NOT WARRANT THE ACCURACY OF ANY LISTING, REGULATORY STATUS BADGE, AI-GENERATED
          RESPONSE, OR OTHER CONTENT.
        </strong>
      </p>
      <p>
        Some jurisdictions do not allow exclusion of certain warranties; in those jurisdictions,
        our disclaimers apply to the maximum extent permitted by law.
      </p>

      <h2>14. Limitation of Liability</h2>
      <p>
        <strong>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOOK AND ITS AFFILIATES, OFFICERS, EMPLOYEES,
          AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, USE, OR GOODWILL, ARISING FROM
          YOUR USE OF THE SERVICE.
        </strong>
      </p>
      <p>
        <strong>
          OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM OR RELATING TO THESE TERMS OR THE
          SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE 12 MONTHS
          BEFORE THE CLAIM, OR (B) $100.
        </strong>
      </p>
      <p>
        Some jurisdictions do not allow exclusion or limitation of certain damages; in those
        jurisdictions, our limits apply to the maximum extent permitted by law.
      </p>

      <h2>15. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Nook and its affiliates, officers, employees,
        and agents from any claim, demand, damage, or expense (including reasonable attorneys’
        fees) arising from:
      </p>
      <ul>
        <li>Your use of the Service</li>
        <li>Your violation of these Terms</li>
        <li>Your violation of any law or third-party right</li>
        <li>Content you submit to the Service</li>
      </ul>

      <h2>16. Dispute Resolution; Arbitration</h2>
      <h3>16.1 Agreement to Arbitrate</h3>
      <p>
        Any dispute arising from these Terms or the Service will be resolved by binding
        arbitration administered by the American Arbitration Association (“AAA”) under its
        Consumer Arbitration Rules, except as set forth below.
      </p>
      <h3>16.2 Class Action Waiver</h3>
      <p>
        You agree to resolve disputes only on an individual basis and not as part of any class,
        collective, or representative action.
      </p>
      <h3>16.3 Opt-Out</h3>
      <p>
        You may opt out of this arbitration agreement within 30 days of accepting these Terms by
        sending written notice to <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>. The
        notice must include your name, account email address, and a clear statement that you wish
        to opt out of arbitration.
      </p>
      <h3>16.4 Exceptions</h3>
      <p>
        This arbitration agreement does not apply to: (a) small claims court actions; (b) actions
        to enforce intellectual property rights; (c) any claim that cannot be arbitrated under
        applicable law (including certain consumer protection and civil rights claims under the
        EFAA).
      </p>
      <h3>16.5 Jury Trial Waiver</h3>
      <p>You and Nook waive any right to a jury trial.</p>

      <h2>17. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, without regard to its
        conflict of laws principles. For any matter not subject to arbitration, you and Nook
        submit to the exclusive jurisdiction of the state and federal courts located in Delaware.
      </p>

      <h2>18. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. We will post the updated version on this
        page and update the “Last Updated” date. For material changes, we will provide additional
        notice (such as by email). Your continued use after changes take effect constitutes
        acceptance.
      </p>
      <p>
        Where a change affects the price you pay or the way you are billed, we will give notice
        as described in Section 5.7 and will not apply the change to a period you have already
        paid for.
      </p>

      <h2>19. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time, with or without cause
        and with or without notice, including for violation of these Terms. Upon termination,
        your right to use the Service ceases immediately. Sections that by their nature should
        survive termination (for example, intellectual property, disclaimers, limitation of
        liability, and arbitration) will survive.
      </p>
      <p>
        You may terminate your account at any time by following the deletion process in your
        account settings.
      </p>
      <p>
        Terminating your account is not the same as cancelling your subscription. If you want to
        stop being billed, cancel your subscription as described in Section 5.6; the account
        deletion screen also offers to cancel it for you.
      </p>

      <h2>20. General Provisions</h2>
      <h3>20.1 Entire Agreement</h3>
      <p>
        These Terms, together with our <Link to="/privacy">Privacy Policy</Link>,{" "}
        <Link to="/refunds">Refund Policy</Link>, and any other policies referenced here,
        constitute the entire agreement between you and Nook regarding the Service.
      </p>
      <h3>20.2 Severability</h3>
      <p>
        If any provision is held unenforceable, the remaining provisions remain in full effect.
      </p>
      <h3>20.3 No Waiver</h3>
      <p>
        Our failure to enforce any provision is not a waiver of our right to do so later.
      </p>
      <h3>20.4 Assignment</h3>
      <p>
        You may not assign these Terms without our prior written consent. We may assign these
        Terms freely.
      </p>
      <h3>20.5 Force Majeure</h3>
      <p>
        We are not liable for delays or failures due to events beyond our reasonable control.
      </p>
      <h3>20.6 Notices</h3>
      <p>
        We may give you notice by email, in-product notification, or posting on the Service. You
        may give us notice at <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>.
      </p>

      <h2>21. Contact</h2>
      <p>Questions about these Terms? Contact us at:</p>
      <p>
        <strong>Email:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
        <br />
        <strong>Legal notices:</strong>{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>Mail:</strong> NORELIX LIMITED, The Black Church, St. Mary’s Place, Dublin 7,
        D07 P4AX, Ireland
      </p>
      <p>
        <strong>Acceptance:</strong> By creating an account or using the Service, you acknowledge
        that you have read, understood, and agree to these Terms.
      </p>
    </LegalPageLayout>
  );
}
