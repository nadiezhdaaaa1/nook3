import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA Copyright Policy — Nook" },
      { name: "description", content: "How to report copyright infringement to Nook under the DMCA." },
      { property: "og:title", content: "DMCA Copyright Policy — Nook" },
      { property: "og:description", content: "How to report copyright infringement to Nook under the DMCA." },
    ],
  }),
  component: DmcaPage,
});

function DmcaPage() {
  return (
    <LegalPageLayout title="DMCA Copyright Policy" lastUpdated="[DATE]">
      <h2>1. Our Policy</h2>
      <p>
        Nook, operated by Zentaro Systems Ltd, respects intellectual property rights and
        expects users to do the same. We respond to claims of copyright infringement in
        accordance with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512.
      </p>
      <p>
        This policy describes how to report alleged infringement, how we respond, how to file
        a counter-notice, and our policy for repeat infringers.
      </p>

      <h2>2. Designated Agent</h2>
      <p>
        If you believe content on the Service infringes your copyright, send a notice to our
        designated agent:
      </p>
      <p>
        <strong>[DMCA_AGENT_NAME]</strong>
        <br />
        [DMCA_AGENT_ADDRESS]
        <br />
        Email: <a href="mailto:dmca@thenook.rent">dmca@thenook.rent</a>
        <br />
        Phone: [DMCA_AGENT_PHONE]
      </p>
      <p>
        Registered with U.S. Copyright Office: Registration No. [REGISTRATION_NUMBER]
      </p>

      <h2>3. Filing a Notice of Infringement</h2>
      <p>
        To be effective, your notice must include all of the following (per 17 U.S.C. §
        512(c)(3)):
      </p>
      <ol>
        <li>
          <strong>Identification of the copyrighted work</strong> you claim has been infringed
          (or, if multiple works, a representative list)
        </li>
        <li>
          <strong>Identification of the material</strong> you claim is infringing, with enough
          detail for us to locate it (URL or screenshot)
        </li>
        <li>
          <strong>Your contact information</strong> — name, address, phone number, and email
        </li>
        <li>
          <strong>A statement, in good faith,</strong> that the use of the material is not
          authorized by the copyright owner, its agent, or the law
        </li>
        <li>
          <strong>A statement, under penalty of perjury,</strong> that the information in your
          notice is accurate and that you are authorized to act on behalf of the copyright
          owner
        </li>
        <li><strong>Your physical or electronic signature</strong></li>
      </ol>
      <p>Send the notice to our designated agent at the address above.</p>
      <p>
        ⚠️ <strong>Important:</strong> Under 17 U.S.C. § 512(f), you may be liable for damages
        — including costs and attorneys' fees — if you knowingly make material
        misrepresentations in a DMCA notice.
      </p>

      <h2>4. How We Respond</h2>
      <p>Upon receiving a valid notice, we will:</p>
      <ol>
        <li>Acknowledge receipt within 5 business days</li>
        <li>Investigate the claim</li>
        <li>Remove or disable access to the allegedly infringing material if appropriate</li>
        <li>Notify the user who submitted the material (if known)</li>
        <li>Provide the user with a copy of the notice and information on filing a counter-notice</li>
      </ol>
      <p>
        We may also terminate the accounts of users who repeatedly upload infringing material.
      </p>

      <h2>5. Filing a Counter-Notice</h2>
      <p>
        If you believe material was removed in error, you may file a counter-notice. To be
        effective, it must include all of the following (per 17 U.S.C. § 512(g)(3)):
      </p>
      <ol>
        <li>
          <strong>Identification of the material</strong> that was removed and the location
          where it appeared
        </li>
        <li>
          <strong>A statement, under penalty of perjury,</strong> that you have a good faith
          belief the material was removed by mistake or misidentification
        </li>
        <li>
          <strong>Your contact information</strong> — name, address, phone number, and email
        </li>
        <li>
          <strong>A statement that you consent</strong> to the jurisdiction of the federal
          court in the district where you live (or, if outside the US, any judicial district
          where Nook may be found)
        </li>
        <li>
          <strong>A statement that you will accept service of process</strong> from the person
          who submitted the original notice or their agent
        </li>
        <li><strong>Your physical or electronic signature</strong></li>
      </ol>
      <p>Send counter-notices to our designated agent at the address above.</p>
      <p>
        ⚠️ <strong>Important:</strong> Under 17 U.S.C. § 512(f), you may be liable for damages
        if you knowingly make material misrepresentations in a counter-notice.
      </p>

      <h2>6. How We Handle Counter-Notices</h2>
      <p>Upon receiving a valid counter-notice, we will:</p>
      <ol>
        <li>Promptly forward it to the original notice-sender</li>
        <li>Inform them that we may restore the material in 10-14 business days</li>
      </ol>
      <p>
        If the original sender does not file a court action seeking a restraining order
        within that period, we may restore the material.
      </p>

      <h2>7. Repeat Infringer Policy</h2>
      <p>
        We will terminate accounts of users who, in our discretion, are repeat infringers. We
        may also take action against users who appear to repeatedly or blatantly infringe,
        even before formal notice.
      </p>
      <p>Termination may include:</p>
      <ul>
        <li>Account closure</li>
        <li>Forfeiture of any subscription rights</li>
        <li>IP-level blocking where appropriate</li>
      </ul>

      <h2>8. Misuse of the DMCA Process</h2>
      <p>
        Knowingly submitting false DMCA notices or counter-notices is illegal and can result
        in civil and criminal liability. If we determine you are misusing the DMCA process,
        we may:
      </p>
      <ul>
        <li>Reject future notices from you</li>
        <li>Restore disputed content</li>
        <li>Cooperate with law enforcement</li>
      </ul>

      <h2>9. Trademark and Other IP Claims</h2>
      <p>
        This policy addresses copyright claims under the DMCA. For trademark, patent, or other
        intellectual property claims, contact us at{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a> with a similar level of
        detail.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this DMCA Policy from time to time. We will post updates on this page
        and update the "Last Updated" date.
      </p>

      <h2>11. Contact</h2>
      <p>
        <strong>DMCA notices:</strong>{" "}
        <a href="mailto:dmca@thenook.rent">dmca@thenook.rent</a> and [DMCA_AGENT_NAME] at
        [DMCA_AGENT_ADDRESS]
        <br />
        <strong>Other IP matters:</strong>{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>General:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
      </p>
    </LegalPageLayout>
  );
}
