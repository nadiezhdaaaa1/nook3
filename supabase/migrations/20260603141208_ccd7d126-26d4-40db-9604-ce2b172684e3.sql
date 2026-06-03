
-- 1) contact_submissions: ensure no SELECT for anon/authenticated; only service_role can read
REVOKE SELECT ON public.contact_submissions FROM anon, authenticated, PUBLIC;
GRANT SELECT ON public.contact_submissions TO service_role;

-- 2) profiles: column-level REVOKE on billing fields for authenticated (defense in depth)
REVOKE UPDATE (plan, billing_cycle, trial_active, trial_started_at, trial_ends_at) ON public.profiles FROM authenticated, anon, PUBLIC;
GRANT UPDATE (plan, billing_cycle, trial_active, trial_started_at, trial_ends_at) ON public.profiles TO service_role;

-- 3) Hard guard via trigger: block any non-service_role role from changing billing fields
CREATE OR REPLACE FUNCTION public.prevent_billing_field_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role' THEN
    IF NEW.plan IS DISTINCT FROM OLD.plan
       OR NEW.billing_cycle IS DISTINCT FROM OLD.billing_cycle
       OR NEW.trial_active IS DISTINCT FROM OLD.trial_active
       OR NEW.trial_started_at IS DISTINCT FROM OLD.trial_started_at
       OR NEW.trial_ends_at IS DISTINCT FROM OLD.trial_ends_at
       OR NEW.is_affiliate IS DISTINCT FROM OLD.is_affiliate THEN
      RAISE EXCEPTION 'Billing/plan fields can only be updated by the backend service role'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_block_billing_self_update ON public.profiles;
CREATE TRIGGER profiles_block_billing_self_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_billing_field_self_update();
