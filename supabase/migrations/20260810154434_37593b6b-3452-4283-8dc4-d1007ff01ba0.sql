CREATE TYPE public.listing_report_reason AS ENUM ('spam','fraud','duplicate','wrong_price','unavailable','offensive','other');

CREATE TABLE public.listing_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_id uuid REFERENCES public.searches(id) ON DELETE SET NULL,
  alert_id uuid REFERENCES public.saved_alerts(id) ON DELETE SET NULL,
  listing_ref text NOT NULL,
  listing jsonb NOT NULL DEFAULT '{}'::jsonb,
  reason public.listing_report_reason NOT NULL,
  details text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX listing_reports_user_idx ON public.listing_reports (user_id, created_at DESC);

GRANT SELECT, INSERT ON public.listing_reports TO authenticated;
GRANT ALL ON public.listing_reports TO service_role;

ALTER TABLE public.listing_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY listing_reports_select_own ON public.listing_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY listing_reports_insert_own ON public.listing_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);