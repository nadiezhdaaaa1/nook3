CREATE OR REPLACE FUNCTION public.commit_onboarding(
  _user_id uuid,
  _search jsonb DEFAULT NULL,
  _phone text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _search_id uuid;
  _completed timestamptz;
  _existing int;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'user id is required';
  END IF;

  SELECT count(*) INTO _existing FROM public.searches WHERE user_id = _user_id;

  IF _existing = 0
     AND _search IS NOT NULL
     AND COALESCE(_search->>'city_id', '') <> ''
     AND COALESCE(_search->>'name', '') <> '' THEN
    INSERT INTO public.searches (
      user_id, name, city_id, status,
      budget_min, budget_max, move_in, bedrooms, bathrooms,
      rent_protection, include_broker_fee, neighborhoods,
      amenities, transit, commute, alert_channel, frequency
    ) VALUES (
      _user_id,
      _search->>'name',
      _search->>'city_id',
      COALESCE(NULLIF(_search->>'status', ''), 'active')::public.search_status,
      NULLIF(_search->>'budget_min', '')::int,
      NULLIF(_search->>'budget_max', '')::int,
      COALESCE(_search->'move_in', '{"mode":"flexible"}'::jsonb),
      COALESCE(_search->'bedrooms', '[]'::jsonb),
      COALESCE(NULLIF(_search->>'bathrooms', ''), '1ba'),
      COALESCE(NULLIF(_search->>'rent_protection', ''), 'all'),
      COALESCE((_search->>'include_broker_fee')::boolean, true),
      COALESCE(_search->'neighborhoods', '[]'::jsonb),
      COALESCE(_search->'amenities', '{}'::jsonb),
      COALESCE(_search->'transit', '{"hasPreference":false,"lines":{}}'::jsonb),
      COALESCE(_search->'commute', '{"maxMinutes":null}'::jsonb),
      COALESCE(NULLIF(_search->>'alert_channel', ''), 'email')::public.alert_channel,
      COALESCE(NULLIF(_search->>'frequency', ''), 'balanced')::public.alert_freq
    )
    RETURNING id INTO _search_id;
  ELSE
    SELECT id INTO _search_id
    FROM public.searches
    WHERE user_id = _user_id
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;

  PERFORM set_config('app.bypass_billing_guard', 'on', true);

  UPDATE public.profiles
     SET phone = COALESCE(NULLIF(_phone, ''), phone),
         completed_at = COALESCE(completed_at, now())
   WHERE id = _user_id
  RETURNING completed_at INTO _completed;

  PERFORM set_config('app.bypass_billing_guard', 'off', true);

  RETURN jsonb_build_object('searchId', _search_id, 'completedAt', _completed);
END;
$function$;

REVOKE ALL ON FUNCTION public.commit_onboarding(uuid, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.commit_onboarding(uuid, jsonb, text) FROM anon;
REVOKE ALL ON FUNCTION public.commit_onboarding(uuid, jsonb, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.commit_onboarding(uuid, jsonb, text) TO service_role;