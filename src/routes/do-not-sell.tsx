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
      { property: "og:url", content: "https://nook3.lovable.app/do-not-sell" }
    ],
    links: [{ rel: "canonical", href: "https://nook3.lovable.app/do-not-sell" }],
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
  { id: "opt_out", label: "Opt out of sale/sharing of my personal information" },
  { id: "know", label: "Right to know what information you have about me" },
  { id: "delete", label: "Right to delete my personal information" },
  { id: "correct", label: "Right to correct my personal information" },
  { id: "portability", label: "Right to data portability (export my data)" },
] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
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
      `Name: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      `Requester: ${parsed.data.requester === "self" ? "For myself" : "Authorized agent"}`,
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
    <LegalPageLayout title="Your Privacy Choices" lastUpdated="July 2, 2026">
      <h2>Your Privacy Choices</h2>
      <p>
        You have choices about how Nook uses your personal information. This page explains
        those choices and lets you exercise them.
      </p>

      <h2>Your Rights</h2>
      <p>
        If you are a resident of California or another US state with comprehensive privacy law
        (Virginia, Colorado, Connecticut, Utah, Texas, Oregon, Montana, Tennessee, Iowa,
        Indiana, Delaware, Maryland, Minnesota, New Hampshire, New Jersey), you may have these
        rights:
      </p>
      <ul>
        <li><strong>Opt out</strong> of sale or sharing of personal information for cross-context behavioral advertising</li>
        <li><strong>Limit</strong> use and disclosure of sensitive personal information</li>
        <li><strong>Access</strong> information we have about you</li>
        <li><strong>Delete</strong> your personal information</li>
        <li><strong>Correct</strong> inaccurate information about you</li>
        <li><strong>Port</strong> your information in a machine-readable format</li>
      </ul>
      <p>
        You can exercise rights without penalty. We will not deny you service, charge different
        prices, or provide different quality of service because you exercise privacy rights.
      </p>

      <h2>We Honor Global Privacy Control</h2>
      <p>
        If your browser sends a Global Privacy Control (GPC) signal, we automatically treat
        that as an opt-out of sale/sharing. You do not need to fill out a form.
      </p>
      <p>
        <a href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer">
          Learn about Global Privacy Control →
        </a>
      </p>

      <h2>Submit a Request</h2>
      <p>
        Use the form below to submit a privacy request. We will respond within the timeframe
        required by your state's law (generally 45 days, extendable to 90 with notice).
      </p>

      <form
        onSubmit={onSubmit}
        className="not-prose mt-6 mb-10 rounded-2xl border border-charcoal-200/60 bg-white p-6 space-y-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="dnss-name">
            Your name <span aria-hidden className="text-brand-terracotta">*</span>
          </Label>
          <Input id="dnss-name" name="name" maxLength={100} required placeholder="Alex Johnson" />
          {errors.name && <p className="text-xs text-brand-terracotta">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dnss-email">
            Email address <span aria-hidden className="text-brand-terracotta">*</span>
          </Label>
          <Input id="dnss-email" name="email" type="email" maxLength={255} required placeholder="you@email.com" />
          <p className="text-xs text-charcoal-500">
            We use this to verify your identity and respond.
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
                As an authorized agent for someone else
                <span className="block text-xs text-charcoal-500 mt-0.5">
                  (If selected, additional verification is required.)
                </span>
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
      <ol>
        <li><strong>Within 10 days:</strong> We acknowledge your request by email</li>
        <li><strong>Within 45 days:</strong> We process your request and respond</li>
        <li><strong>If we need more time:</strong> We may extend by 45 additional days with notice</li>
      </ol>
      <p>For complex requests, identity verification may take longer.</p>

      <h2>Appeals</h2>
      <p>
        If we deny your request and you believe the denial was incorrect, you can appeal by
        emailing <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> with subject
        "Privacy Appeal."
      </p>
      <p>We will review your appeal and respond within 60 days. If your appeal is denied, we will provide:</p>
      <ul>
        <li>The reason for denial</li>
        <li>Contact information for your state attorney general</li>
      </ul>

      <h2>Authorized Agents</h2>
      <p>If you are an authorized agent submitting on someone else's behalf, please be prepared to provide:</p>
      <ul>
        <li>Written authorization from the person (e.g., power of attorney)</li>
        <li>Your contact information</li>
        <li>Verification that you are who you claim to be</li>
      </ul>
      <p>We may also confirm directly with the person on whose behalf you are acting.</p>

      <h2>Other Ways to Manage Your Information</h2>
      <p>Some privacy choices can be exercised directly in your account:</p>
      <ul>
        <li><strong>Update profile:</strong> Account → Profile</li>
        <li><strong>Change email preferences:</strong> Account → Communications</li>
        <li><strong>Download data:</strong> Account → Data & Privacy → Download my data</li>
        <li><strong>Delete account:</strong> Account → Data & Privacy → Delete account</li>
        <li><strong>Manage cookies:</strong> Footer → Cookie Preferences</li>
      </ul>

      <h2>Questions</h2>
      <p>
        <strong>Email:</strong> <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
        <br />
        <strong>Mail:</strong>
        <br />
        Privacy Officer
        <br />
        Zentaro Systems Ltd
        <br />
        167-169 Great Portland Street, 5th Floor, London, W1W 5PF
        <br />
        United Kingdom
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
        For information on our subprocessors, see our{" "}
        <Link to="/subprocessors">Subprocessor List</Link>.
      </p>
    </LegalPageLayout>
  );
}
