REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_email_verified() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_billing_field_self_update() FROM PUBLIC, anon, authenticated;