import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/do-not-sell")({
  head: () => ({
    meta: [
      { title: "Your Privacy Choices — Nook" },
      {
        name: "description",
        content:
          "Exercise your CCPA / state privacy rights, including 'Do Not Sell or Share My Personal Information'.",
      },
      { property: "og:title", content: "Your Privacy Choices — Nook" },
      {
        property: "og:description",
        content: "Exercise your CCPA / state privacy rights with Nook.",
      },
      { property: "og:url", content: "https://thenook.rent/do-not-sell" }
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/do-not-sell" }],
  }),
  component: DoNotSellPage,
});

const STATES = [
  "California",
  "Virginia",
  "Colorado",
  "Connecticut",
  "Utah",
  "Texas",
  "Oregon",
  "Montana",
  "Tennessee",
  "Iowa",
  "Indiana",
  "Delaware",
  "Maryland",
  "Minnesota",
  "New Hampshire",
  "New Jersey",
  "Other",
];

const RIGHTS = [
  { id: "opt_out", label: "Opt out of sale or sharing of my personal information" },
  { id: "know", label: "Right to know what information you have about me" },
  { id: "delete", label: "Right to delete my personal information" },
  { id: "correct", label: "Right to correct my personal information" },
  { id: "portability", label: "Right to data portability (send me a copy of my data)" },
] as const;

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().email("Invalid email").max(255),
  requester: z.enum(["self", "agent"]),
  state: z.string().min(1, "Required").max(50),
  rights: z.array(z.string()).min(1, "Select at least one right"),
  details: z.string().max(2000).optional(),
});

function DoNotSellPage() {
  const [requester, setRequester] = useState<"self" | "agent">("self");
  const [state, setState] = useState("");
  const [rights, setRights] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function toggleRight(id: string, checked: boolean) {
    setRights((prev) =>
      checked ? [...prev, id] : prev.filter((r) => r !== id),
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      requester,
      state,
      rights,
      details: (form.elements.namedItem("details") as HTMLTextAreaElement).value,
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});

    const body = [
      `Name: ${parsed.data.name || "(not provided)"}`,
      `Email: ${parsed.data.email}`,
      `Requester: ${parsed.data.requester === "self" ? "For myself" : "Authorised agent"}`,
      `State: ${parsed.data.state}`,
      `Rights requested:`,
      ...parsed.data.rights.map(
        (id) => `  - ${RIGHTS.find((r) => r.id === id)?.label ?? id}`,
      ),
      "",
      `Additional details:`,
      parsed.data.details || "(none)",
    ].join("\n");

    const mailto = `mailto:privacy@thenook.rent?subject=${encodeURIComponent(
      "Privacy Request",
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  }

  return (
    <LegalPageLayout title="Your Privacy Choices" lastUpdated="August 19, 2026">
      <p>
        You have choices about how Nook uses your personal information. This page explains those
        choices and lets you exercise them.
      </p>

      <h2>Your Rights</h2>
      <p>
        If you are a resident of California or another US state with a comprehensive privacy law
        — Virginia, Colorado, Connecticut, Utah, Texas, Oregon, Montana, Tennessee, Iowa,
        Indiana, Delaware, Maryland, Minnesota, New Hampshire, or New Jersey — you may have
        these rights:
      </p>
      <ul>
        <li>Opt out of sale or sharing of personal information for cross-context behavioural advertising</li>
        <li>Access information we have about you</li>
        <li>Delete your personal information</li>
        <li>Correct inaccurate information about you</li>
        <li>Port your information in a machine-readable format</li>
      </ul>
      <p>
        You can exercise these rights without penalty. We will not deny you service, charge
        different prices, or provide a different quality of service because you exercise privacy
        rights.
      </p>

      <h2>We Honour Global Privacy Control</h2>
      <p>
        If your browser sends a Global Privacy Control (GPC) signal, we automatically treat that
        as an opt-out of sale or sharing. You do not need to fill out a form.
      </p>
      <p>
        <a href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer">
          Learn about Global Privacy Control →
        </a>
      </p>

      <h2>Submit a Request</h2>
      <p>
        Use the form below to submit a privacy request. We will respond within the timeframe
        required by your state’s law, generally within 45 days, with one additional 45-day
        extension where permitted by applicable law and with notice to you. Requests to opt out
        of sale or sharing are processed within the shorter period required by applicable law.
      </p>

      <form
        onSubmit={onSubmit}
        className="not-prose mt-6 mb-10 rounded-2xl border border-charcoal-200/60 bg-white p-6 space-y-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="dnss-name">Your name (optional)</Label>
          <Input id="dnss-name" name="name" maxLength={100} placeholder="Alex Johnson" />
          <p className="text-xs text-charcoal-500">
            We do not hold a name on your account, so this is only used to address our reply.
          </p>
          {errors.name && <p className="text-xs text-brand-terracotta">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dnss-email">
            Email address <span aria-hidden className="text-brand-terracotta">*</span>
          </Label>
          <Input id="dnss-email" name="email" type="email" maxLength={255} required placeholder="you@email.com" />
          <p className="text-xs text-charcoal-500">
            We use this to verify your identity and to respond. It must be the address on your
            Nook account.
          </p>
          {errors.email && <p className="text-xs text-brand-terracotta">{errors.email}</p>}
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-charcoal-900">
            Are you submitting this request for yourself or someone else?
          </legend>
          <RadioGroup
            value={requester}
            onValueChange={(v) => setRequester(v as "self" | "agent")}
            className="gap-3"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="req-self" value="self" />
              <Label htmlFor="req-self" className="font-normal">For myself</Label>
            </div>
            <div className="flex items-start gap-2">
              <RadioGroupItem id="req-agent" value="agent" className="mt-1" />
              <Label htmlFor="req-agent" className="font-normal leading-snug">
                As an authorised agent for someone else (additional verification is required)
              </Label>
            </div>
          </RadioGroup>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="dnss-state">State of residence</Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger id="dnss-state">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <p className="text-xs text-brand-terracotta">{errors.state}</p>}
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-charcoal-900">
            Which rights would you like to exercise?{" "}
            <span className="text-charcoal-500 font-normal">(select all that apply)</span>
          </legend>
          <div className="space-y-2">
            {RIGHTS.map((r) => (
              <div key={r.id} className="flex items-start gap-2">
                <Checkbox
                  id={`right-${r.id}`}
                  checked={rights.includes(r.id)}
                  onCheckedChange={(c) => toggleRight(r.id, c === true)}
                  className="mt-0.5"
                />
                <Label htmlFor={`right-${r.id}`} className="font-normal leading-snug">
                  {r.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.rights && <p className="text-xs text-brand-terracotta">{errors.rights}</p>}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="dnss-details">Additional details (optional)</Label>
          <Textarea id="dnss-details" name="details" rows={4} maxLength={2000} />
        </div>

        <div className="rounded-lg bg-charcoal-50 border border-charcoal-200/60 p-4 text-xs text-charcoal-700">
          <strong className="block mb-1 text-charcoal-900">Verification</strong>
          Some requests require additional identity verification. We may contact you to confirm
          details before processing. This helps protect against fraudulent requests submitted
          in your name.
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button type="submit" size="lg">Submit request</Button>
          {submitted && (
            <p className="text-sm text-charcoal-600">
              Your email client should open with the request prefilled. If not, email{" "}
              <a href="mailto:privacy@thenook.rent" className="underline">
                privacy@thenook.rent
              </a>.
            </p>
          )}
        </div>
      </form>

      <h2>What Happens Next</h2>
      <ul>
        <li><strong>Within 10 business days:</strong> we acknowledge your request by email</li>
        <li>
          <strong>Within 45 days:</strong> we generally respond to requests to know, access,
          delete, correct, or obtain a copy of your data, subject to any extension permitted by
          applicable law
        </li>
        <li>
          <strong>If we need more time:</strong> where permitted by applicable law, we may extend
          that period once by an additional 45 days with notice
        </li>
        <li>
          <strong>Opt-out requests:</strong> requests to opt out of sale or sharing are processed
          within the shorter timeframe required by applicable law.
        </li>
      </ul>
      <p>For complex requests, identity verification may take longer.</p>
      <p>
        Requests for a copy of your data are prepared by our team and sent to the address on your
        account. There is no self-service download in the product.
      </p>

      <h2>Appeals</h2>
      <p>
        If we deny your request and you believe the denial was incorrect, you can appeal by
        emailing <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> with the subject
        “Privacy Appeal.”
      </p>
      <p>
        We will review your appeal and respond within the timeframe required by the privacy law
        applicable to your request. If your appeal is denied, we will provide:
      </p>
      <ul>
        <li>The reason for the denial</li>
        <li>Contact information for your state attorney general</li>
      </ul>

      <h2>Authorised Agents</h2>
      <p>
        If you are an authorised agent submitting on someone else’s behalf, please be prepared to
        provide:
      </p>
      <ul>
        <li>Written authorisation from the person, such as a power of attorney</li>
        <li>Your contact information</li>
        <li>Verification that you are who you claim to be</li>
      </ul>
      <p>We may also confirm directly with the person on whose behalf you are acting.</p>

      <h2>Other Ways to Manage Your Information</h2>
      <p>Some choices can be exercised directly in your account:</p>
      <table>
        <thead>
          <tr>
            <th>What you want to do</th>
            <th>Where</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Change what you are looking for</td>
            <td>Open a search, then Budget, Apartment details, or Location</td>
          </tr>
          <tr>
            <td>Change how often alerts arrive, or set quiet hours</td>
            <td>Open a search, then Notifications. These are set for each search separately</td>
          </tr>
          <tr>
            <td>Stop alerts from one search without cancelling</td>
            <td>Open a search, then Notifications, and turn alerts off</td>
          </tr>
          <tr>
            <td>Change your timezone or password</td>
            <td>Account</td>
          </tr>
          <tr>
            <td>Manage product news and newsletter</td>
            <td>Account</td>
          </tr>
          <tr>
            <td>Cancel your subscription</td>
            <td>Account &gt; Subscription</td>
          </tr>
          <tr>
            <td>Delete your account</td>
            <td>Account, in the section at the bottom of the page</td>
          </tr>
          <tr>
            <td>Manage cookies</td>
            <td>“Cookie Preferences” in the footer</td>
          </tr>
        </tbody>
      </table>
      <p>
        Unsubscribing from alerts is not the same as cancelling. Turning alerts off stops the
        emails; your subscription continues and you continue to be billed. To stop being billed,
        cancel your subscription.
      </p>
      <p>
        You can also stop alerts from any alert email without signing in, using the link at the
        bottom of that email.
      </p>

      <h2>Questions</h2>
      <p>
        <strong>Email:</strong> <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
        <br />
        <strong>Mail:</strong> Privacy Officer, NORELIX LIMITED, The Black Church, St. Mary’s
        Place, Dublin 7, D07 P4AX, Ireland
      </p>
      <p>
        If you believe we have not properly handled your request, you may contact your state
        attorney general or other privacy regulator.
      </p>

      <h2>Legal Detail</h2>
      <p>
        For full details on how we collect, use, and share personal information, see our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <p>
        For information on the vendors who process data on our behalf, see Section 4.1 of our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPageLayout>
  );
}
