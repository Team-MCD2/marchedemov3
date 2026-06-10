import { l as login } from '../../chunks/auth_YbJ1phUF.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function safeNext(raw) {
  if (!raw) return "/admin";
  if (!raw.startsWith("/admin")) return "/admin";
  if (raw.startsWith("//") || raw.includes("\\")) return "/admin";
  return raw;
}
const POST = async ({ request, redirect, cookies }) => {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? ""));
  const ok = await login(password, cookies);
  if (!ok) {
    const qs = new URLSearchParams({ error: "1" });
    if (next !== "/admin") qs.set("next", next);
    return redirect(`/admin/login?${qs.toString()}`, 303);
  }
  return redirect(next, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
