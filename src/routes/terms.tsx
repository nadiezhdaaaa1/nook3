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
    <LegalPageLayout title="Terms of Service" lastUpdated="July 2, 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        Welcome to Nook. These Terms of Service ("Terms") govern your access to and use of the
        Nook website at thenook.rent, our applications, and related services (collectively, the
        "Service") operated by Zentaro Systems Ltd, a company registered in England and Wales
        under company number 17178666, with registered office at 167-169 Great Portland Street, 5th Floor, London, W1W 5PF
        ("Nook," "we," "us," or "our"). Nook operates in the United States under the trade name
        "The Nook."
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
      <p>By using the Service, you represent and warrant that you meet these requirements.</p>

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
        Each individual may maintain only one account. Sharing accounts (other than as
        expressly permitted by your subscription tier, such as Max roommate mode) is
        prohibited.
      </p>

      <h2>4. The Service</h2>
      <h3>4.1 What Nook Does</h3>
      <p>
        Nook is a rental alerts service that aggregates publicly available US rental listing
        information and notifies subscribers when listings matching their criteria become
        available. The Service may include features such as saved searches, email alerts,
        listing verification badges, and an AI assistant ("Wren AI").
      </p>
      <h3>4.2 What Nook Is Not</h3>
      <p>
        <strong>
          Nook is not a real estate broker, agent, salesperson, or representative.
        </strong>{" "}
        We do not represent landlords, tenants, or any party to a rental transaction. We do
        not list properties for rent on behalf of landlords. We do not negotiate, prepare, or
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
        <li>That a property meets habitability standards or any other legal requirement</li>
      </ul>
      <p>
        <strong>
          You acknowledge that listings may be outdated, withdrawn, fraudulent, or
          misrepresented. You assume full responsibility for verifying listing information
          directly with the landlord or agent before taking any action.
        </strong>
      </p>
      <h3>4.4 "Verified" Badges</h3>
      <p>
        Where we display a "verified rent-stabilized," "verified rent-controlled," or similar
        badge, this means our system has matched a listing's address against a publicly
        available regulatory database as of a specific date.{" "}
        <strong>A badge is not a guarantee:</strong> the regulatory database may be incomplete
        or outdated, landlord representations may differ, and a unit's regulatory status may
        have changed. You should independently verify regulatory status before relying on it.
      </p>
      <h3>4.5 Wren AI</h3>
      <p>Where the Service includes Wren AI or similar features:</p>
      <ul>
        <li>
          Wren AI provides <strong>general information only</strong> and is not legal,
          financial, real estate, or professional advice
        </li>
        <li>Wren AI may produce inaccurate, incomplete, or outdated responses</li>
        <li>
          Wren AI conversations may be reviewed, stored, and used to improve the Service (see
          Privacy Policy)
        </li>
        <li>
          You should not rely on Wren AI for any consequential decision without independent
          verification
        </li>
        <li>Wren AI is not a substitute for consultation with licensed professionals</li>
      </ul>
      <h3>4.6 Service Availability</h3>
      <p>
        We strive to maintain Service availability but do not guarantee uninterrupted access.
        We may modify, suspend, or discontinue any portion of the Service at any time. Alert
        delivery timing is best-effort and not subject to any service level agreement.
      </p>

      <h2>5. Subscriptions and Payment</h2>
      <h3>5.1 Subscription Tiers</h3>
      <p>
        The Service is offered in tiers including Free, Premium, and Max. Features and pricing
        for each tier are described on our pricing page and may change with notice.
      </p>
      <h3>5.2 Free Trial</h3>
      <p>
        We may offer a free trial period for paid subscriptions. The trial duration and terms
        are disclosed at the point of signup.{" "}
        <strong>
          Unless you cancel before the trial ends, your subscription will automatically convert
          to a paid subscription at the then-current rate. We will charge the payment method
          you provided.
        </strong>
      </p>
      <h3>5.3 Automatic Renewal</h3>
      <p>
        <strong>
          By starting a paid subscription, you authorize us to charge your payment method on a
          recurring basis (monthly or annually as selected) until you cancel.
        </strong>{" "}
        Subscriptions automatically renew at the end of each billing period at the then-current
        rate unless you cancel before the renewal date.
      </p>
      <p>
        We will send a reminder email at least 24 hours before any auto-renewal charge and a
        confirmation email after each charge.
      </p>
      <h3>5.4 Cancellation</h3>
      <p>
        You may cancel your subscription at any time from your account settings. Cancellation
        takes effect at the end of the current billing period; you retain access to paid
        features until that date. We do not provide refunds for partial billing periods except
        as described in Section 5.6 or as required by law.
      </p>
      <h3>5.5 Price Changes</h3>
      <p>
        We may change subscription pricing with at least 30 days' notice. Continued use of the
        Service after a price change takes effect constitutes acceptance of the new price.
      </p>
      <h3>5.6 Refund Policy</h3>
      <ul>
        <li>Within 7 days of an initial paid charge: full refund upon cancellation</li>
        <li>After 7 days: prorated refund of the unused portion at our discretion</li>
        <li>Renewal charges: not refundable except as required by law</li>
        <li>Annual subscriptions: prorated refund if canceled mid-year</li>
        <li>
          See our <Link to="/refunds">Refund Policy</Link> for additional details
        </li>
      </ul>
      <h3>5.7 Payment Processing</h3>
      <p>
        Payments are processed by Stripe, Inc. By providing payment information, you agree to
        Stripe's terms. We do not store full payment card numbers on our servers.
      </p>
      <h3>5.8 Taxes</h3>
      <p>
        Listed prices do not include applicable sales taxes. You are responsible for any taxes
        that apply to your subscription.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Scrape, copy, or redistribute listings or other Service content</li>
        <li>Resell, sublicense, or commercially exploit the Service</li>
        <li>Create accounts by automated means</li>
        <li>Bypass rate limits, paywalls, or access controls</li>
        <li>Attempt to reverse engineer, decompile, or extract source code</li>
        <li>Use the Service to harass, defame, or harm any party</li>
        <li>Submit false move-out listings or fraudulent referrals</li>
        <li>
          Use the Service in violation of the Fair Housing Act or any anti-discrimination law
        </li>
        <li>Impersonate any person or entity</li>
        <li>Transmit viruses, malware, or harmful code</li>
        <li>Interfere with the Service's operation or security</li>
      </ul>
      <p>We may suspend or terminate accounts for violations.</p>

      <h2>7. Move-Out Listings and User Submissions</h2>
      <h3>7.1 Move-Out Listings</h3>
      <p>If you submit a listing for an apartment you are vacating ("Move-Out Listing"):</p>
      <ul>
        <li>You represent that you have the right to share the information submitted</li>
        <li>You represent that information is accurate to the best of your knowledge</li>
        <li>
          You grant Nook a worldwide, non-exclusive, royalty-free license to use, display, and
          distribute the listing through the Service
        </li>
        <li>
          You acknowledge that the $50 incentive (where offered) is paid only after a verified
          lease signing by another Nook user, subject to our Move-Out Listing Terms
        </li>
        <li>
          You agree not to submit listings for properties you do not occupy or have permission
          to share
        </li>
      </ul>
      <h3>7.2 General User Content</h3>
      <p>
        You retain ownership of content you submit to the Service. By submitting content, you
        grant Nook a worldwide, non-exclusive, royalty-free license to use, store, display, and
        distribute it for purposes of operating and improving the Service.
      </p>
      <p>
        You represent that you have all necessary rights to grant this license and that your
        content does not violate any law or third-party right.
      </p>

      <h2>8. Referrals and Rewards</h2>
      <h3>8.1 Referral Program</h3>
      <p>
        We may offer rewards for referring new users. Specific reward terms are disclosed in
        the Service.
      </p>
      <h3>8.2 No Cash Value</h3>
      <p>
        Rewards have no cash value and are not transferable. Rewards may expire or be revoked
        for fraud or abuse.
      </p>
      <h3>8.3 Fair Use</h3>
      <p>
        You may not engage in spam, deceptive practices, or self-referrals. We may invalidate
        referrals that violate these Terms.
      </p>

      <h2>9. Intellectual Property</h2>
      <h3>9.1 Our Rights</h3>
      <p>
        The Service, including all software, design, content, and trademarks, is owned by Nook
        or our licensors and protected by US and international intellectual property laws. We
        grant you a limited, non-exclusive, non-transferable, revocable license to use the
        Service for personal, non-commercial purposes.
      </p>
      <h3>9.2 Feedback</h3>
      <p>If you submit feedback or suggestions, we may use them without obligation to you.</p>
      <h3>9.3 Trademarks</h3>
      <p>
        "Nook," "The Nook," "Wren AI," and our logos are trademarks of Zentaro Systems Ltd.
        You may not use them without our prior written consent.
      </p>

      <h2>10. DMCA / Copyright Infringement</h2>
      <p>
        If you believe content on the Service infringes your copyright, please send a notice
        to:
      </p>
      <p>
        Email: <a href="mailto:dmca@thenook.rent">dmca@thenook.rent</a>
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
        The Service may link to or integrate with third-party services (e.g., listing sources,
        payment processors, mapping services). We are not responsible for the content,
        policies, or practices of those third parties. Your use of third-party services is
        governed by their own terms.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Your use of the Service is also governed by our{" "}
        <Link to="/privacy">Privacy Policy</Link>, incorporated here by reference.
      </p>

      <h2>13. Disclaimers</h2>
      <p>
        <strong>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
          WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THAT THE SERVICE WILL BE UNINTERRUPTED,
          SECURE, OR ERROR-FREE.
        </strong>
      </p>
      <p>
        <strong>
          WE DO NOT WARRANT THE ACCURACY OF ANY LISTING, "VERIFIED" BADGE, AI-GENERATED
          RESPONSE, OR OTHER CONTENT.
        </strong>
      </p>
      <p>
        Some jurisdictions do not allow exclusion of certain warranties; in those
        jurisdictions, our disclaimers apply to the maximum extent permitted by law.
      </p>

      <h2>14. Limitation of Liability</h2>
      <p>
        <strong>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOOK AND ITS AFFILIATES, OFFICERS,
          EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, USE, OR
          GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
        </strong>
      </p>
      <p>
        <strong>
          OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM OR RELATING TO THESE TERMS OR THE
          SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE 12
          MONTHS BEFORE THE CLAIM, OR (B) $100.
        </strong>
      </p>
      <p>
        Some jurisdictions do not allow exclusion or limitation of certain damages; in those
        jurisdictions, our limits apply to the maximum extent permitted by law.
      </p>

      <h2>15. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Nook and its affiliates, officers, employees,
        and agents from any claim, demand, damage, or expense (including reasonable attorneys'
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
        arbitration administered by the American Arbitration Association ("AAA") under its
        Consumer Arbitration Rules, except as set forth below.
      </p>
      <h3>16.2 Class Action Waiver</h3>
      <p>
        You agree to resolve disputes only on an individual basis and not as part of any
        class, collective, or representative action.
      </p>
      <h3>16.3 Opt-Out</h3>
      <p>
        You may opt out of this arbitration agreement within 30 days of accepting these Terms
        by sending written notice to{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>. The notice must include
        your name, account email address, and a clear statement that you wish to opt out of
        arbitration.
      </p>
      <h3>16.4 Exceptions</h3>
      <p>
        This arbitration agreement does not apply to: (a) small claims court actions; (b)
        actions to enforce intellectual property rights; (c) any claim that cannot be
        arbitrated under applicable law (including certain consumer protection and civil
        rights claims under the EFAA).
      </p>
      <h3>16.5 Jury Trial Waiver</h3>
      <p>
        <strong>You and Nook waive any right to a jury trial.</strong>
      </p>

      <h2>17. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, without regard to its
        conflict of laws principles. For any matter not subject to arbitration, you and Nook
        submit to the exclusive jurisdiction of the state and federal courts located in
        Delaware.
      </p>

      <h2>18. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. We will post the updated version on this
        page and update the "Last Updated" date. For material changes, we will provide
        additional notice (such as by email). Your continued use after changes take effect
        constitutes acceptance.
      </p>

      <h2>19. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time, with or without
        cause and with or without notice, including for violation of these Terms. Upon
        termination, your right to use the Service ceases immediately. Sections that by their
        nature should survive termination (e.g., intellectual property, disclaimers,
        limitation of liability, arbitration) will survive.
      </p>
      <p>
        You may terminate your account at any time by following the deletion process in your
        account settings.
      </p>

      <h2>20. General Provisions</h2>
      <h3>20.1 Entire Agreement</h3>
      <p>
        These Terms, together with our Privacy Policy and any other policies referenced here,
        constitute the entire agreement between you and Nook regarding the Service.
      </p>
      <h3>20.2 Severability</h3>
      <p>
        If any provision is held unenforceable, the remaining provisions remain in full
        effect.
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
        We may give you notice by email, in-product notification, or posting on the Service.
        You may give us notice at <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>.
      </p>

      <h2>21. Contact</h2>
      <p>Questions about these Terms? Contact us at:</p>
      <p>
        <strong>Email:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
        <br />
        <strong>Legal notices:</strong>{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>Mail:</strong>
        <br />
        Zentaro Systems Ltd
        <br />
        167-169 Great Portland Street, 5th Floor, London, W1W 5PF
        <br />
        United Kingdom
      </p>

      <p style={{ marginTop: "2.5em" }}>
        <strong>Acceptance:</strong> By creating an account or using the Service, you
        acknowledge that you have read, understood, and agree to these Terms.
      </p>
    </LegalPageLayout>
  );
}
