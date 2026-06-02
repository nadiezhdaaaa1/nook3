-- Revoke broad UPDATE on profiles from authenticated, then re-grant
-- column-level UPDATE only for safe, user-editable fields.
-- Billing columns (plan, billing_cycle, trial_active, trial_started_at,
-- trial_ends_at) are NOT granted, so even if an RLS policy permits the row
-- the column write will be rejected by Postgres.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (phone, phone_verified, timezone, move_out, completed_at, updated_at)
  ON public.profiles TO authenticated;