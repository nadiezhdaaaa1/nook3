-- Attach defense-in-depth trigger to prevent users from self-updating billing/plan fields.
-- The function public.prevent_billing_field_self_update() already exists but was never wired up.
DROP TRIGGER IF EXISTS prevent_billing_self_update ON public.profiles;
CREATE TRIGGER prevent_billing_self_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_billing_field_self_update();