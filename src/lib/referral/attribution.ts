// Referral attribution (Phase 1 — client-side only).
// Persists the invite code in a 1st-party cookie (~30 days) + sessionStorage,
// so the code survives navigation between /r/:code → /signup → OAuth round-trips.

const COOKIE_NAME = "nook_ref";
const STORAGE_KEY = "nook.ref";
const MAX_AGE_DAYS = 30;

// RBxxxxxx — same shape the DB generates (profiles.referral_code default).
const CODE_RE = /^RB[A-Z0-9]{6}$/;

export function normalizeReferralCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim().toUpperCase();
  return CODE_RE.test(v) ? v : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86_400_000).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function setReferralAttribution(code: string) {
  const norm = normalizeReferralCode(code);
  if (!norm) return;
  setCookie(COOKIE_NAME, norm, MAX_AGE_DAYS);
  try {
    sessionStorage.setItem(STORAGE_KEY, norm);
    localStorage.setItem(STORAGE_KEY, norm);
  } catch {
    /* storage disabled */
  }
}

export function getReferralAttribution(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(STORAGE_KEY);
    if (s && normalizeReferralCode(s)) return s;
  } catch {
    /* ignore */
  }
  try {
    const l = localStorage.getItem(STORAGE_KEY);
    if (l && normalizeReferralCode(l)) return l;
  } catch {
    /* ignore */
  }
  return normalizeReferralCode(readCookie(COOKIE_NAME));
}

export function clearReferralAttribution() {
  clearCookie(COOKIE_NAME);
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
