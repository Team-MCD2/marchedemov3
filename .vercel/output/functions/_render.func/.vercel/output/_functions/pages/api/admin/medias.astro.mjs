import { i as isAuthenticated } from '../../../chunks/auth_YbJ1phUF.mjs';
import { s as supabaseAdmin } from '../../../chunks/supabase_DGRgIA0P.mjs';
import { l as logActivity } from '../../../chunks/admin-activity_7EJyrd7K.mjs';
import crypto from 'crypto';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const BUCKET = "medias";
const ALLOWED_FOLDERS = /* @__PURE__ */ new Set([
  "",
  "promos",
  "produits",
  "rayons",
  "recettes",
  "home",
  "magasins",
  "postes",
  "actus"
]);
const ALLOWED_MIME = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/quicktime",
  "video/webm"
]);
const MAX_BYTES = 30 * 1024 * 1024;
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
async function requireAdmin(cookies) {
  if (!await isAuthenticated(cookies)) return json({ error: "Unauthorized" }, 401);
  return json({ error: "Supabase service_role key missing" }, 500);
}
function slugifyFilename(name) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const cleanBase = base.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return (cleanBase || "file") + ext;
}
async function uploadToCloudinary(file, folder, renameTo) {
  const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || undefined                                            ;
  const apiKey = process.env.CLOUDINARY_API_KEY || undefined                                  ;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || undefined                                     ;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Configuration Cloudinary (CLOUDINARY_URL, etc.) manquante dans .env.local.");
  }
  const timestamp = Math.floor(Date.now() / 1e3);
  const dot = file.name.lastIndexOf(".");
  const originalBase = dot > 0 ? file.name.slice(0, dot) : file.name;
  let baseName = renameTo ? renameTo.replace(/\.[a-z0-9]{1,5}$/i, "") : originalBase;
  baseName = baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const publicId = `${baseName}-${timestamp}`;
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  const stringToSign = `${paramsToSign}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", apiKey);
  formData.append("signature", signature);
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const res = await fetch(url, {
    method: "POST",
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Erreur Cloudinary: ${res.statusText}`);
  }
  const data = await res.json();
  return {
    publicUrl: data.secure_url,
    path: data.public_id
  };
}
const GET = async ({ url, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const folder = (url.searchParams.get("folder") ?? "").replace(/^\/+|\/+$/g, "");
  if (!ALLOWED_FOLDERS.has(folder)) {
    return json({ error: `Dossier non autorisé : ${folder}` }, 400);
  }
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).list(folder || void 0, {
    limit: 500,
    sortBy: { column: "updated_at", order: "desc" }
  });
  if (error) return json({ error: error.message }, 500);
  const rows = (data ?? []).filter((f) => f.id).map((f) => {
    const path = folder ? `${folder}/${f.name}` : f.name;
    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return {
      name: f.name,
      path,
      size: f.metadata?.size ?? null,
      mime: f.metadata?.mimetype ?? null,
      updated_at: f.updated_at,
      created_at: f.created_at,
      publicUrl: pub.publicUrl
    };
  });
  return json({ folder, files: rows });
};
const POST = async ({ request, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const form = await request.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") ?? "");
  const upsert = form.get("upsert") === "1";
  const renameTo = form.get("renameTo");
  if (!(file instanceof File)) {
    return json({ error: "Champ 'file' manquant ou invalide" }, 400);
  }
  const folder = folderRaw.replace(/^\/+|\/+$/g, "");
  if (!ALLOWED_FOLDERS.has(folder)) {
    return json({ error: `Dossier non autorisé : ${folder}` }, 400);
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return json({ error: `Type non autorisé : ${file.type}` }, 400);
  }
  if (file.size > MAX_BYTES) {
    return json({ error: `Fichier trop gros (${(file.size / 1024 / 1024).toFixed(1)} Mo > 30 Mo)` }, 400);
  }
  if (folder === "home") {
    try {
      const cloudRes = await uploadToCloudinary(file, folder, typeof renameTo === "string" ? renameTo : void 0);
      logActivity({
        entity: "media",
        entity_id: cloudRes.path,
        entity_label: cloudRes.path.split("/").pop() ?? cloudRes.path,
        action: "upload",
        payload: { folder, size: file.size, mime: file.type, provider: "cloudinary" }
      });
      return json(
        {
          file: {
            name: cloudRes.path.split("/").pop() ?? cloudRes.path,
            path: cloudRes.path,
            size: file.size,
            mime: file.type,
            publicUrl: cloudRes.publicUrl
          }
        },
        201
      );
    } catch (err) {
      return json({ error: err.message || "Erreur lors de l'upload Cloudinary" }, 500);
    }
  }
  const uploadedExt = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  let safeName;
  if (typeof renameTo === "string" && renameTo.trim()) {
    const nameWithoutExt = renameTo.replace(/\.[a-z0-9]{1,5}$/i, "");
    const timestamp = Math.floor(Date.now() / 1e3);
    safeName = slugifyFilename(`${nameWithoutExt}-${timestamp}${uploadedExt}`);
  } else {
    safeName = slugifyFilename(file.name);
  }
  const path = folder ? `${folder}/${safeName}` : safeName;
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert,
    contentType: file.type
  });
  if (error) {
    const status = /duplicate|already exists/i.test(error.message) ? 409 : 500;
    return json({ error: error.message }, status);
  }
  const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(data.path);
  logActivity({
    entity_id: data.path,
    payload: { size: file.size, mime: file.type}
  });
  return json(
    {
      file: {
        name: safeName,
        path: data.path,
        size: file.size,
        mime: file.type,
        publicUrl: pub.publicUrl
      }
    },
    201
  );
};
const DELETE = async ({ url, cookies }) => {
  const deny = await requireAdmin(cookies);
  if (deny) return deny;
  const path = url.searchParams.get("path");
  if (!path) return json({ error: "Paramètre 'path' requis" }, 400);
  const folder = path.includes("/") ? path.split("/")[0] : "";
  if (!ALLOWED_FOLDERS.has(folder)) {
    return json({ error: `Chemin hors dossiers autorisés : ${path}` }, 400);
  }
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
  if (error) return json({ error: error.message }, 500);
  logActivity({
    entity_label: path.split("/").pop() ?? path});
  return new Response(null, { status: 204 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
