
CREATE TYPE public.contact_topic AS ENUM (
  'general',
  'support',
  'press',
  'partnership',
  'investor',
  'legal',
  'other'
);

CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  topic public.contact_topic NOT NULL,
  message text NOT NULL,
  routed_to text NOT NULL,
  user_agent text,
  ip_address text,
  time_to_fill_ms integer,
  email_sent boolean NOT NULL DEFAULT false,
  email_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Public form: anon + authenticated can INSERT only. No SELECT/UPDATE/DELETE for anyone but service_role.
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- INSERT is intentionally permissive at the policy layer; the server route enforces
-- validation, honeypot, and time-to-fill checks before writing. Reads are blocked
-- entirely (no SELECT policy + no SELECT grant) — only service_role can audit.
CREATE POLICY "contact_submissions_insert_public"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE INDEX idx_contact_submissions_email_created
  ON public.contact_submissions (email, created_at DESC);
CREATE INDEX idx_contact_submissions_created
  ON public.contact_submissions (created_at DESC);
