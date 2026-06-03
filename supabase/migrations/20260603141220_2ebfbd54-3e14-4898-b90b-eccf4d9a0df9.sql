REVOKE EXECUTE ON FUNCTION public.prevent_billing_field_self_update() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prevent_billing_field_self_update() TO service_role;