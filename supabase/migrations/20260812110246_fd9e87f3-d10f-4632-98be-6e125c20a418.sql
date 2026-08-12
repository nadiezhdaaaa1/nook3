-- Restore Data API grants (RLS policies still enforce row-level access)

-- user-owned tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.searches TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wren_conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wren_messages TO authenticated;
GRANT SELECT, INSERT ON public.listing_reports TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.referrals TO authenticated;
GRANT SELECT ON public.referral_events TO authenticated;
GRANT SELECT ON public.referral_notifications TO authenticated;
GRANT SELECT ON public.blocked_email_domains TO authenticated;

-- public reads / public writes
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT INSERT ON public.waitlist TO anon, authenticated;

-- backend
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.searches TO service_role;
GRANT ALL ON public.saved_alerts TO service_role;
GRANT ALL ON public.wren_conversations TO service_role;
GRANT ALL ON public.wren_messages TO service_role;
GRANT ALL ON public.listing_reports TO service_role;
GRANT ALL ON public.user_roles TO service_role;
GRANT ALL ON public.referrals TO service_role;
GRANT ALL ON public.referral_events TO service_role;
GRANT ALL ON public.referral_notifications TO service_role;
GRANT ALL ON public.blocked_email_domains TO service_role;
GRANT ALL ON public.listings TO service_role;
GRANT ALL ON public.contact_submissions TO service_role;
GRANT ALL ON public.waitlist TO service_role;
GRANT ALL ON public.newsletter_subscribers TO service_role;