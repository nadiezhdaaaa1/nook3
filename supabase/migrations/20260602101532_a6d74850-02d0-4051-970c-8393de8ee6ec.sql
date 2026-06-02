
-- ============ ENUMS ============
CREATE TYPE public.app_plan AS ENUM ('free','premium','max');
CREATE TYPE public.billing_cycle AS ENUM ('monthly','annual');
CREATE TYPE public.search_status AS ENUM ('active','paused','archived');
CREATE TYPE public.alert_channel AS ENUM ('email','text','both');
CREATE TYPE public.alert_freq AS ENUM ('minimal','balanced','maximum','weekly');
CREATE TYPE public.alert_status AS ENUM ('new','saved','contacted','dismissed');
CREATE TYPE public.app_role AS ENUM ('admin','user');

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  email_verified boolean NOT NULL DEFAULT false,
  phone text NOT NULL DEFAULT '',
  phone_verified boolean NOT NULL DEFAULT false,
  timezone text NOT NULL DEFAULT 'America/New_York',
  plan public.app_plan NOT NULL DEFAULT 'free',
  billing_cycle public.billing_cycle NOT NULL DEFAULT 'monthly',
  trial_active boolean NOT NULL DEFAULT false,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  move_out jsonb,
  referral_code text NOT NULL UNIQUE DEFAULT ('RB'||upper(substr(md5(random()::text),1,6))),
  is_affiliate boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ SEARCHES ============
CREATE TABLE public.searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  city_id text NOT NULL,
  status public.search_status NOT NULL DEFAULT 'active',
  archived_at timestamptz,
  budget_min int,
  budget_max int,
  move_in jsonb NOT NULL DEFAULT '{"mode":"flexible"}'::jsonb,
  bedrooms jsonb NOT NULL DEFAULT '[]'::jsonb,
  bathrooms text NOT NULL DEFAULT '1ba',
  rent_protection text NOT NULL DEFAULT 'all',
  include_broker_fee boolean NOT NULL DEFAULT true,
  neighborhoods jsonb NOT NULL DEFAULT '[]'::jsonb,
  amenities jsonb NOT NULL DEFAULT '{}'::jsonb,
  transit jsonb NOT NULL DEFAULT '{"hasPreference":false,"lines":{}}'::jsonb,
  commute jsonb NOT NULL DEFAULT '{"maxMinutes":null}'::jsonb,
  alert_channel public.alert_channel NOT NULL DEFAULT 'email',
  frequency public.alert_freq NOT NULL DEFAULT 'balanced',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT name_length CHECK (char_length(name) BETWEEN 1 AND 50)
);
CREATE UNIQUE INDEX searches_name_per_user_active ON public.searches (user_id, lower(name)) WHERE status <> 'archived';
CREATE INDEX searches_user_idx ON public.searches (user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.searches TO authenticated;
GRANT ALL ON public.searches TO service_role;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "searches_select_own" ON public.searches FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "searches_insert_own" ON public.searches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "searches_update_own" ON public.searches FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "searches_delete_own" ON public.searches FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER searches_updated_at BEFORE UPDATE ON public.searches FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Plan quota enforcement
CREATE OR REPLACE FUNCTION public.enforce_search_quota()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_plan public.app_plan;
  active_count int;
  max_allowed int;
BEGIN
  IF NEW.status = 'archived' THEN RETURN NEW; END IF;
  SELECT plan INTO user_plan FROM public.profiles WHERE id = NEW.user_id;
  IF user_plan IS NULL THEN user_plan := 'free'; END IF;
  max_allowed := CASE user_plan WHEN 'free' THEN 1 WHEN 'premium' THEN 3 ELSE 2147483647 END;
  SELECT count(*) INTO active_count FROM public.searches
    WHERE user_id = NEW.user_id AND status <> 'archived' AND id <> NEW.id;
  IF active_count + 1 > max_allowed THEN
    RAISE EXCEPTION 'Plan quota exceeded: % active searches allowed on % plan', max_allowed, user_plan
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER searches_quota_check
  BEFORE INSERT OR UPDATE OF status ON public.searches
  FOR EACH ROW EXECUTE FUNCTION public.enforce_search_quota();

-- ============ SAVED ALERTS ============
CREATE TABLE public.saved_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_id uuid NOT NULL REFERENCES public.searches(id) ON DELETE CASCADE,
  listing jsonb NOT NULL,
  status public.alert_status NOT NULL DEFAULT 'new',
  snoozed_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX saved_alerts_search_idx ON public.saved_alerts (search_id);
CREATE INDEX saved_alerts_user_status_idx ON public.saved_alerts (user_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_alerts TO authenticated;
GRANT ALL ON public.saved_alerts TO service_role;
ALTER TABLE public.saved_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_select_own" ON public.saved_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "alerts_insert_own" ON public.saved_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "alerts_update_own" ON public.saved_alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "alerts_delete_own" ON public.saved_alerts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ REFERRALS ============
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referred_user_id)
);
GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals_select_own" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

-- ============ AUTO-PROFILE on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, email_verified, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    (NEW.email_confirmed_at IS NOT NULL),
    COALESCE(NEW.phone, '')
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
