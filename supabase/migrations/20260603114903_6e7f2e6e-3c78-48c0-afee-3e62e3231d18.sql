
-- Prevent authenticated users from self-upgrading their billing/plan fields.
-- RLS allows row-level access (own row), but we restrict which COLUMNS can be updated.
-- Billing fields can now only be modified by the service_role (via verified payment webhooks).
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (phone, phone_verified, timezone, move_out, completed_at, consents, updated_at)
  ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Waitlist: ensure emails are NEVER readable by anon/authenticated. Only service_role.
REVOKE SELECT ON public.waitlist FROM anon, authenticated;
GRANT INSERT ON public.waitlist TO anon, authenticated;
GRANT ALL ON public.waitlist TO service_role;
