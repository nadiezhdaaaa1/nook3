import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ReferralStatus = "invited" | "signed_up" | "rewarded";

export type ReferralRow = {
  id: string;
  email: string; // masked
  status: ReferralStatus;
  createdAt: string;
};

export type ReferralStats = {
  code: string;
  invited: number;
  signedUp: number;
  rewarded: number;
  recent: ReferralRow[];
};

function maskEmail(email: string | null | undefined): string {
  if (!email) return "anonymous";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(name.length - 1, 3))}@${domain}`;
}

function mapStatus(reward: string | null | undefined): ReferralStatus {
  if (reward === "rewarded" || reward === "granted") return "rewarded";
  if (reward === "pending") return "signed_up";
  return "invited";
}

export const getReferralStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ReferralStats> => {
    const { supabase, userId } = context;

    // Profile -> code (already user-scoped via RLS)
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", userId)
      .maybeSingle();
    if (profileErr) throw new Error(profileErr.message);

    // Referrals where user is the referrer (RLS allows: referrer = auth.uid())
    const { data: rows, error } = await supabase
      .from("referrals")
      .select("id, referred_user_id, reward_status, created_at")
      .eq("referrer_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) throw new Error(error.message);

    const referrals = rows ?? [];

    // Fetch referred emails via admin client (cross-user lookup needed; we
    // only expose masked addresses).
    const ids = Array.from(
      new Set(referrals.map((r) => r.referred_user_id as string).filter(Boolean)),
    );
    let emailById: Record<string, string> = {};
    if (ids.length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: profs } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .in("id", ids);
      for (const p of profs ?? []) {
        emailById[p.id as string] = (p.email as string) ?? "";
      }
    }

    let invited = 0;
    let signedUp = 0;
    let rewarded = 0;
    const recent: ReferralRow[] = referrals.map((r) => {
      const status = mapStatus(r.reward_status as string | null);
      if (status === "rewarded") rewarded++;
      else if (status === "signed_up") signedUp++;
      else invited++;
      return {
        id: r.id as string,
        email: maskEmail(emailById[r.referred_user_id as string]),
        status,
        createdAt: r.created_at as string,
      };
    });

    return {
      code: (profile?.referral_code as string) ?? "",
      invited: invited + signedUp + rewarded,
      signedUp: signedUp + rewarded,
      rewarded,
      recent: recent.slice(0, 10),
    };
  });
