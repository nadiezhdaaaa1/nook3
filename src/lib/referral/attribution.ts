// Referral attribution (Phase 1 + 2).
// Persists the invite code AND a server-derived ip_hash in 1st-party cookies
// (~30 days) + sessionStorage / localStorage, so the attribution survives
// navigation: /r/:code → /signup → OAuth round-trips.

const COOKIE_NAME = "nook_ref";
const IP_COOKIE_NAME = "nook_ref_ip";
const STORAGE_KEY = "nook.ref";
const IP_STORAGE_KEY = "nook.ref_ip";
const MAX_AGE_DAYS = 30;

// RBxxxxxx — same shape the DB generates (profiles.referral_code default).
const CODE_RE = /^RB[A-Z0-9]{6}$/;
// ip_hash is sha256(ip).slice(0,32) → lowercase hex
const IP_HASH_RE = /^[a-f0-9]{16,64}$/;

export function normalizeReferralCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim().toUpperCase();
  return CODE_RE.test(v) ? v : null;
}

function normalizeIpHash(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  return IP_HASH_RE.test(v) ? v : null;
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

export function setReferralAttribution(code: string, ipHash?: string | null) {
  const norm = normalizeReferralCode(code);
  if (!norm) return;
  setCookie(COOKIE_NAME, norm, MAX_AGE_DAYS);
  try {
    sessionStorage.setItem(STORAGE_KEY, norm);
    localStorage.setItem(STORAGE_KEY, norm);
  } catch {
    /* storage disabled */
  }

  const normIp = normalizeIpHash(ipHash ?? null);
  if (normIp) {
    setCookie(IP_COOKIE_NAME, normIp, MAX_AGE_DAYS);
    try {
      sessionStorage.setItem(IP_STORAGE_KEY, normIp);
      localStorage.setItem(IP_STORAGE_KEY, normIp);
    } catch {
      /* ignore */
    }
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

export function getReferralIpHash(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(IP_STORAGE_KEY);
    if (s && normalizeIpHash(s)) return s;
  } catch {
    /* ignore */
  }
  try {
    const l = localStorage.getItem(IP_STORAGE_KEY);
    if (l && normalizeIpHash(l)) return l;
  } catch {
    /* ignore */
  }
  return normalizeIpHash(readCookie(IP_COOKIE_NAME));
}

export function clearReferralAttribution() {
  clearCookie(COOKIE_NAME);
  clearCookie(IP_COOKIE_NAME);
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(IP_STORAGE_KEY);
    localStorage.removeItem(IP_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
