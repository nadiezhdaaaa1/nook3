
-- newsletter_subscribers: admin/service-role only. Explicitly deny anon/authenticated.
CREATE POLICY "Deny client reads (service-role only)"
  ON public.newsletter_subscribers FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny client inserts (service-role only)"
  ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny client updates (service-role only)"
  ON public.newsletter_subscribers FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny client deletes (service-role only)"
  ON public.newsletter_subscribers FOR DELETE TO anon, authenticated USING (false);

-- referral_events: existing SELECT policy stays. Explicitly deny client writes.
CREATE POLICY "Deny client inserts (service-role only)"
  ON public.referral_events FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny client updates (service-role only)"
  ON public.referral_events FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny client deletes (service-role only)"
  ON public.referral_events FOR DELETE TO anon, authenticated USING (false);

-- referral_notifications: users can read their own; writes via backend only.
CREATE POLICY "Users can view own referral notifications"
  ON public.referral_notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Deny client inserts (service-role only)"
  ON public.referral_notifications FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny client updates (service-role only)"
  ON public.referral_notifications FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny client deletes (service-role only)"
  ON public.referral_notifications FOR DELETE TO anon, authenticated USING (false);
