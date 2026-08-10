CREATE OR REPLACE FUNCTION public.admin_set_plan(
  _user_id uuid,
  _plan app_plan,
  _billing_cycle billing_cycle DEFAULT NULL
)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL OR _plan IS NULL THEN
    RAISE EXCEPTION 'user id and plan are required';
  END IF;

  PERFORM set_config('app.bypass_billing_guard', 'on', true);

  UPDATE public.profiles p
     SET plan = _plan,
         billing_cycle = COALESCE(_billing_cycle, p.billing_cycle),
         trial_active     = CASE WHEN _plan = 'free' THEN false ELSE p.trial_active END,
         trial_started_at = CASE WHEN _plan = 'free' THEN NULL  ELSE p.trial_started_at END,
         trial_ends_at    = CASE WHEN _plan = 'free' THEN NULL  ELSE p.trial_ends_at END
   WHERE p.id = _user_id;

  PERFORM set_config('app.bypass_billing_guard', 'off', true);

  RETURN QUERY SELECT * FROM public.profiles WHERE id = _user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_plan(uuid, app_plan, billing_cycle) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_set_plan(uuid, app_plan, billing_cycle) FROM anon;
REVOKE ALL ON FUNCTION public.admin_set_plan(uuid, app_plan, billing_cycle) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_plan(uuid, app_plan, billing_cycle) TO service_role;