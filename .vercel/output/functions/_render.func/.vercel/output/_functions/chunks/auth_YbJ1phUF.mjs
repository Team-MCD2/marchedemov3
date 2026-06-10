const COOKIE_NAME = "mo_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8;
function getSecret() {
  return "dev-only-unsafe-secret-please-set-ADMIN_COOKIE_SECRET";
}
function getPassword() {
  return "marchedemo2026";
}
async function sign(payload) {
  const data = new TextEncoder().encode(payload + "|" + getSecret());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function login(password, cookies) {
  if (password !== getPassword()) return false;
  const ts = Date.now().toString();
  const sig = await sign(ts);
  cookies.set(COOKIE_NAME, `${ts}.${sig}`, {
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: true
  });
  return true;
}
function logout(cookies) {
  cookies.delete(COOKIE_NAME, { path: "/" });
}
async function isAuthenticated(cookies) {
  const raw = cookies.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [ts, sig] = raw.split(".");
  if (!ts || !sig) return false;
  const expected = await sign(ts);
  if (expected !== sig) return false;
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age > COOKIE_MAX_AGE * 1e3) return false;
  return true;
}

export { logout as a, isAuthenticated as i, login as l };
