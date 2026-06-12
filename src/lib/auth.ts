/* Simple password-protected admin — verified server-side.
   The password lives in a Vercel env variable: ADMIN_PASSWORD.
   A signed cookie keeps the user logged in after the first submit.
   This is intentionally lightweight — sufficient for a small team.

   FAIL-CLOSED in production : if ADMIN_PASSWORD or ADMIN_COOKIE_SECRET
   is missing from the env, logins are rejected and cookies are not
   trusted. Dev keeps friendly defaults so `npm run dev` works without
   a .env. */

import type { AstroCookies } from "astro";

const COOKIE_NAME = "mo_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8h

const DEV_SECRET = "dev-only-unsafe-secret-please-set-ADMIN_COOKIE_SECRET";
const DEV_PASSWORD = "marchedemo2026";

function getSecret(): string | null {
  const s = import.meta.env.ADMIN_COOKIE_SECRET;
  if (s) return s as string;
  if (import.meta.env.PROD) {
    console.error("[auth] ADMIN_COOKIE_SECRET missing in production — admin sessions disabled.");
    return null;
  }
  return DEV_SECRET;
}

function getPassword(): string | null {
  const p = import.meta.env.ADMIN_PASSWORD;
  if (p) return p as string;
  if (import.meta.env.PROD) {
    console.error("[auth] ADMIN_PASSWORD missing in production — admin login disabled.");
    return null;
  }
  return DEV_PASSWORD;
}

/* Real HMAC-SHA256 via Web Crypto (edge-compatible). Returns hex digest. */
async function sign(payload: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function login(password: string, cookies: AstroCookies) {
  const expected = getPassword();
  if (!expected || password !== expected) return false;
  const ts = Date.now().toString();
  const sig = await sign(ts);
  if (!sig) return false;
  cookies.set(COOKIE_NAME, `${ts}.${sig}`, {
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: import.meta.env.PROD,
  });
  return true;
}

export function logout(cookies: AstroCookies) {
  cookies.delete(COOKIE_NAME, { path: "/" });
}

export async function isAuthenticated(cookies: AstroCookies): Promise<boolean> {
  const raw = cookies.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [ts, sig] = raw.split(".");
  if (!ts || !sig) return false;
  const expected = await sign(ts);
  if (!expected) return false;
  /* Constant-time-ish comparison : both strings are fixed-length hex
     digests, compare every char unconditionally. */
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  if (diff !== 0) return false;
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age < 0 || age > COOKIE_MAX_AGE * 1000) return false;
  return true;
}
