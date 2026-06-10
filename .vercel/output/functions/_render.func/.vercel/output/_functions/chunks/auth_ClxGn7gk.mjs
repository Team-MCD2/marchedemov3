import crypto from 'node:crypto';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://marchedemov2.vercel.app", "SSR": true};
function readEnv(name) {
  try {
    const v = Object.assign(__vite_import_meta_env__, {})?.[name];
    if (v !== void 0 && v !== null && v !== "") return String(v);
  } catch {
  }
  try {
    const p = process.env?.[name];
    if (p !== void 0 && p !== null) return String(p);
  } catch {
  }
  return "";
}
const ACCESS_CODE = String(readEnv("APP_ACCESS_CODE") || "110706").trim();
const ADMIN_CODE = String(readEnv("APP_ADMIN_CODE") || "302006").trim();
const TTL_HOURS = Number(readEnv("APP_SESSION_TTL_HOURS") || "24");
const SESSION_TTL_MS = TTL_HOURS * 60 * 60 * 1e3;
const COOKIE_NAME = "mdm_auth";
function getSecret() {
  const secret = Object.assign(__vite_import_meta_env__, {}).SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return secret || "marchedemo-default-secret-change-me";
}
function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}
function makeSessionToken(role = "user", now = Date.now()) {
  const issuedAt = String(now);
  const payload = `${issuedAt}.${role}`;
  return `${payload}.${sign(payload)}`;
}
function verifySessionToken(token, now = Date.now()) {
  if (!token || typeof token !== "string") return { ok: false };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false };
  const [issuedAtStr, role, sig] = parts;
  if (!/^\d+$/.test(issuedAtStr)) return { ok: false };
  if (!/^[a-f0-9]+$/i.test(sig)) return { ok: false };
  const payload = `${issuedAtStr}.${role}`;
  const expected = sign(payload);
  let a, b;
  try {
    a = Buffer.from(sig, "hex");
    b = Buffer.from(expected, "hex");
  } catch {
    return { ok: false };
  }
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false };
  const issuedAt = Number(issuedAtStr);
  const expiresAt = issuedAt + SESSION_TTL_MS;
  if (now > expiresAt) return { ok: false, expired: true };
  return { ok: true, issuedAt, expiresAt, role };
}
function getRoleForCode(input) {
  if (typeof input !== "string") return null;
  const a = Buffer.from(input);
  const bUser = Buffer.from(ACCESS_CODE);
  const bAdmin = Buffer.from(ADMIN_CODE);
  if (a.length === bAdmin.length && crypto.timingSafeEqual(a, bAdmin)) return "admin";
  if (a.length === bUser.length && crypto.timingSafeEqual(a, bUser)) return "user";
  return null;
}
function safeNextPath(next) {
  const defaultPath = "/admin/inventaire/inventaire";
  if (!next || typeof next !== "string") return defaultPath;
  if (!next.startsWith("/")) return defaultPath;
  if (next.startsWith("//")) return defaultPath;
  const cleanNext = next.length > 1 && next.endsWith("/") ? next.slice(0, -1) : next;
  if (cleanNext === "/admin/inventaire/code" || cleanNext.startsWith("/admin/inventaire/code?")) return defaultPath;
  return next;
}

export { COOKIE_NAME as C, SESSION_TTL_MS as S, getRoleForCode as g, makeSessionToken as m, safeNextPath as s, verifySessionToken as v };
