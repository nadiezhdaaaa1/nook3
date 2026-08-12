ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_canceled_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamp with time zone;