import { a as logout } from '../../chunks/auth_YbJ1phUF.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = ({ redirect, cookies }) => {
  logout(cookies);
  return redirect("/admin/login", 303);
};
const POST = ({ redirect, cookies }) => {
  logout(cookies);
  return redirect("/admin/login", 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
