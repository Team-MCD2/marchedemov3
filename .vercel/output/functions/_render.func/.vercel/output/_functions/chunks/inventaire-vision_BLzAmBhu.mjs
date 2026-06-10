import { c as RAYONS, b as RAYON_SLUGS, g as guessRayonFromText } from './inventaire-rayons_NoGWBJZi.mjs';

// Marché de Mo' — Prompt + JSON schema partagés pour l'analyse d'image.
// Utilisé par TOUS les providers LLM vision (Gemini, Groq Llama Vision,
// Mistral Pixtral) pour qu'ils renvoient la MÊME structure et soient
// interchangeables dans la chaîne de fallback.
//
// Aligné sur le MCD article grocery (cf. supabase/schema.sql §1).


// Liste des slugs autorisés en sortie LLM — partagée avec le schéma JSON.
// On donne aussi le libellé humain au LLM pour qu'il choisisse en
// connaissance de cause.
const RAYONS_FOR_PROMPT = RAYONS.map((r) => `${r.slug} (${r.label})`).join(', ');

/**
 * Prompt code-barres (fallback de dernière chance après Open Food Facts &
 * consorts). Wording strict : le LLM ne devine PAS s'il n'est pas certain —
 * mieux vaut renvoyer des champs vides qu'un produit halluciné.
 *
 * @param {string} code
 * @returns {string}
 */
function buildBarcodePrompt(code) {
  return `Tu es un expert produit pour un supermarché épicerie du monde,
avec une connaissance des codes EAN/UPC/GTIN alimentaires et non-alimentaires.
On a scanné le code-barres : "${code}".

RÈGLES CRITIQUES :
- Si tu ne reconnais pas ce code-barres avec une CERTITUDE forte, renvoie des
  CHAÎNES VIDES et 0 pour les nombres.
- Ne devine JAMAIS un produit qui te semble "plausible" — la précision compte
  plus que la complétude.
- Conserve TOUJOURS code_barres = "${code}" tel quel.

Si tu reconnais avec certitude, renvoie un JSON conforme :
- rayon : choisir parmi ces slugs uniquement (${RAYON_SLUGS.join(', ')})
- nom_produit : nom commercial court (ex: "Banane plantain mûre", "Lait UHT demi-écrémé")
- marque : marque commerciale ou "" si générique / sans marque
- format : format/poids/contenance (ex: "500g", "1L", "12 unités", "200ml")
- description : description courte en français (1 phrase factuelle)
- prix_vente : prix de vente public estimé EUR (0 si inconnu)

Réponds uniquement en JSON conforme au schéma, sans commentaire ni markdown.`;
}

/**
 * Prompt image (analyse photo / vidéo) — appelé quand un employé filme un
 * article ou importe une photo depuis sa galerie. On demande au LLM d'extraire
 * un maximum d'infos lisibles sur l'emballage.
 */
const IMAGE_PROMPT = `Tu es un expert en inventaire pour un supermarché épicerie du monde (Marché de Mo').
Ton rôle est de classer les produits avec une précision de gestionnaire de stock.

CONSIGNES DE CLASSIFICATION (ORDRE DE PRIORITÉ) :
1. boucherie-halal : Viandes, volailles, charcuterie portant mention Halal.
2. fruits-legumes : Produits frais non transformés (vrac ou sachet).
3. surgeles : Tout ce qui est au rayon grand froid.
4. saveurs-afrique : Produits typiques d'Afrique subsaharienne (Manioc, Igname, Gombo, Fufu, huile de palme, attiéké, condiments africains).
5. saveurs-asie : Produits typiques d'Asie (Sauce soja, Riz parfumé, Nouilles instantanées, spécialités japonaises/chinoises/thaï).
6. saveur-mediterranee : Produits de Méditerranée et du Moyen-Orient (couscous, olives, feuilles de brick, harissa, tahin).
7. saveur-sud-amer : Produits d'Amérique Latine (arepa, dulce de leche, maté, piments habanero).
8. balkans-turques : Produits de Turquie et des Balkans (ayran, soudjouk, börek, baklava, lokoum).
9. boulangerie : Pains, baguettes, croissants, brioches, galettes et viennoiseries fraîches.
10. produits-laitiers : Laits, fromages, beurres, yaourts, crèmes et laitages frais.
11. produits-courants : Épicerie industrielle classique (pâtes standards, farine, huile standard, sel, gâteaux standards, boissons standards comme Coca-Cola) et non-alimentaire (entretien, hygiène).

RÈGLES D'EXTRACTION :
- nom_produit : Court et descriptif (ex: "Jus de Pomme 100% pur fruit", "Riz Basmati 5kg").
- marque : La marque principale visible (ex: "Solevita", "Maggi", "Aroy-D").
- format : Volume ou poids exact (ex: "1L", "500g").
- description : Factuelle. Ne pas inventer d'origine africaine si la marque est européenne.

LISTE DES RAYONS (SLUGS) :
${RAYONS_FOR_PROMPT}

Réponds STRICTEMENT en JSON conforme au schéma, sans commentaire ni markdown.`;

// Résultat vide avec tous les champs, utilisé comme valeur par défaut quand un
// LLM omet des champs.
function emptyArticleResult() {
  return {
    rayon: '',
    nom_produit: '',
    marque: '',
    format: '',
    code_barres: '',
    description: '',
    prix_vente: 0,
  };
}

/**
 * Normalise une réponse LLM : s'assure que chaque champ requis existe, que
 * les prix sont des nombres et que le rayon est dans la liste autorisée
 * (sinon on le vide pour éviter de polluer la DB avec des slugs inventés).
 *
 * @param {any} raw
 */
function normalizeArticleResult(raw) {
  const def = emptyArticleResult();
  const r = raw && typeof raw === 'object' ? raw : {};
  const rayon = String(r.rayon ?? def.rayon).trim();
  return {
    rayon:        RAYON_SLUGS.includes(rayon) ? rayon : '',
    nom_produit:  String(r.nom_produit  ?? def.nom_produit),
    marque:       String(r.marque       ?? def.marque),
    format:       String(r.format       ?? def.format),
    code_barres:  String(r.code_barres  ?? def.code_barres),
    description:  String(r.description  ?? def.description),
    prix_vente:   Number(r.prix_vente)  || 0,
  };
}

const __vite_import_meta_env__$3 = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://marchedemov2.vercel.app", "SSR": true};
const DEFAULT_MODEL$2 = "gemini-2.5-flash";
const MAX_INDEXED_KEYS$2 = 20;
const COOLDOWN_QUOTA_MS$2 = 60 * 1e3;
const COOLDOWN_INVALID_MS$2 = 60 * 60 * 1e3;
let keyCursor$2 = 0;
const keyCooldowns$2 = /* @__PURE__ */ new Map();
function readEnv$3(name) {
  try {
    const v = Object.assign(__vite_import_meta_env__$3, { OS: process.env.OS, PROMPT: process.env.PROMPT })?.[name];
    if (v !== void 0 && v !== null && v !== "") return String(v);
  } catch {
  }
  const p = process.env?.[name];
  return p !== void 0 && p !== null ? String(p) : "";
}
function readApiKeys$2() {
  const keys = [];
  const main = readEnv$3("GEMINI_API_KEY").trim();
  if (main) keys.push(main);
  for (let i = 1; i <= MAX_INDEXED_KEYS$2; i++) {
    const k = readEnv$3(`GEMINI_API_KEY_${i}`).trim();
    if (k) keys.push(k);
  }
  return [...new Set(keys)];
}
function getKeyCount() {
  return readApiKeys$2().length;
}
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    rayon: { type: "STRING" },
    nom_produit: { type: "STRING" },
    marque: { type: "STRING" },
    format: { type: "STRING" },
    code_barres: { type: "STRING" },
    description: { type: "STRING" },
    prix_vente: { type: "NUMBER" }
  }
};
function hasServerKey() {
  return readApiKeys$2().length > 0;
}
function resolveKeys(overrideKey) {
  const k = (overrideKey || "").trim();
  if (k) return [k];
  const keys = readApiKeys$2();
  if (!keys.length) {
    throw new Error("Aucune clé Gemini configurée. Ajoutez GEMINI_API_KEY ou GEMINI_API_KEY_1..20 dans .env.local");
  }
  return keys;
}
function resolveModel(overrideModel) {
  return (overrideModel || readEnv$3("GEMINI_MODEL") || DEFAULT_MODEL$2).trim();
}
function friendlyGeminiError(status, body) {
  const msg = body?.error?.message || "";
  if (/leaked|reported as leaked/i.test(msg)) {
    return "Clé Gemini révoquée par Google (signalée comme exposée). Créez-en une nouvelle sur aistudio.google.com/app/apikey.";
  }
  if (status === 403 || /API_KEY_INVALID|API key not valid/i.test(msg)) {
    return "Clé Gemini invalide ou non autorisée. Vérifiez la clé dans .env.local.";
  }
  if (status === 429 || /quota|RESOURCE_EXHAUSTED/i.test(msg)) {
    return "Quota Gemini dépassé sur toutes les clés. Attendez quelques minutes ou ajoutez d'autres clés.";
  }
  if (status === 400 && /SAFETY|blocked/i.test(msg)) {
    return "Image bloquée par les filtres de sécurité Gemini.";
  }
  return msg ? `Gemini: ${msg.slice(0, 200)}` : `Gemini erreur ${status}`;
}
function isQuotaError$2(status, msg = "") {
  return status === 429 || /quota|RESOURCE_EXHAUSTED|rate.?limit/i.test(msg);
}
function isInvalidKeyError$2(status, msg = "") {
  return (status === 403 || status === 400) && /API_KEY_INVALID|API key not valid|leaked|disabled|permission/i.test(msg);
}
function maskKey$2(k) {
  if (!k) return "(empty)";
  if (k.length <= 10) return "****";
  return `${k.slice(0, 4)}…${k.slice(-4)}`;
}
async function callGeminiOnce({ parts, apiKey, model }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.2
    }
  };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(2e4)
    // Abort individual request after 20s
  });
  if (!res.ok) {
    let parsed = null;
    try {
      parsed = await res.json();
    } catch {
    }
    const err = new Error(friendlyGeminiError(res.status, parsed));
    err.status = res.status;
    err.geminiMessage = parsed?.error?.message || "";
    throw err;
  }
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Réponse Gemini vide ou bloquée.");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Réponse Gemini non-JSON : " + text.slice(0, 200));
  }
}
async function callGemini({ parts, apiKeys, model }) {
  const total = apiKeys.length;
  if (total === 0) throw new Error("Aucune clé Gemini disponible.");
  const now = Date.now();
  const order = [];
  for (let i = 0; i < total; i++) {
    order.push(apiKeys[(keyCursor$2 + i) % total]);
  }
  let lastError = null;
  let attempted = 0;
  for (const key of order) {
    const cd = keyCooldowns$2.get(key);
    if (cd && cd > now) continue;
    attempted++;
    try {
      const result = await callGeminiOnce({ parts, apiKey: key, model });
      keyCursor$2 = apiKeys.indexOf(key);
      keyCooldowns$2.delete(key);
      return result;
    } catch (e) {
      lastError = e;
      const status = e.status;
      const msg = e.geminiMessage || e.message || "";
      if (isQuotaError$2(status, msg)) {
        keyCooldowns$2.set(key, Date.now() + COOLDOWN_QUOTA_MS$2);
        keyCursor$2 = (apiKeys.indexOf(key) + 1) % total;
        if (total > 1) console.warn(`[gemini] key ${maskKey$2(key)} rate-limited, falling back to next key`);
        continue;
      }
      if (isInvalidKeyError$2(status, msg)) {
        keyCooldowns$2.set(key, Date.now() + COOLDOWN_INVALID_MS$2);
        keyCursor$2 = (apiKeys.indexOf(key) + 1) % total;
        console.warn(`[gemini] key ${maskKey$2(key)} invalid/disabled, falling back (skipping for 1h)`);
        continue;
      }
      throw e;
    }
  }
  if (attempted === 0) {
    const sorted = [...apiKeys].sort(
      (a, b) => (keyCooldowns$2.get(a) || 0) - (keyCooldowns$2.get(b) || 0)
    );
    for (const key of sorted) {
      try {
        const result = await callGeminiOnce({ parts, apiKey: key, model });
        keyCursor$2 = apiKeys.indexOf(key);
        keyCooldowns$2.delete(key);
        return result;
      } catch (e) {
        lastError = e;
      }
    }
  }
  throw lastError || new Error("Toutes les clés Gemini sont indisponibles. Réessayez plus tard.");
}
async function analyzeImage({ base64DataUrl, apiKey, model }) {
  const match = /^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/.exec(base64DataUrl || "");
  if (!match) throw new Error("Image invalide (attendu data:image/...;base64,...)");
  const mimeType = match[1];
  const data = match[2];
  const raw = await callGemini({
    parts: [
      { text: IMAGE_PROMPT },
      { inline_data: { mime_type: mimeType, data } }
    ],
    apiKeys: resolveKeys(apiKey),
    model: resolveModel(model)
  });
  return normalizeArticleResult(raw);
}
async function analyzeBarcode({ barcode, apiKey, model }) {
  const code = String(barcode || "").trim();
  if (!code) throw new Error("Code-barres manquant");
  const raw = await callGemini({
    parts: [{ text: buildBarcodePrompt(code) }],
    apiKeys: resolveKeys(apiKey),
    model: resolveModel(model)
  });
  const normalized = normalizeArticleResult(raw);
  normalized.code_barres = code;
  return normalized;
}

const __vite_import_meta_env__$2 = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://marchedemov2.vercel.app", "SSR": true};
const DEFAULT_MODEL$1 = "llama-3.2-90b-vision-preview";
const DEFAULT_TEXT_MODEL$1 = "llama-3.3-70b-versatile";
const MAX_INDEXED_KEYS$1 = 10;
const COOLDOWN_QUOTA_MS$1 = 60 * 1e3;
const COOLDOWN_INVALID_MS$1 = 60 * 60 * 1e3;
const ENDPOINT$1 = "https://api.groq.com/openai/v1/chat/completions";
let keyCursor$1 = 0;
const keyCooldowns$1 = /* @__PURE__ */ new Map();
function readEnv$2(name) {
  try {
    const v = Object.assign(__vite_import_meta_env__$2, { OS: process.env.OS, PROMPT: process.env.PROMPT })?.[name];
    if (v !== void 0 && v !== null && v !== "") return String(v);
  } catch {
  }
  const p = process.env?.[name];
  return p !== void 0 && p !== null ? String(p) : "";
}
function readApiKeys$1() {
  const keys = [];
  const main = readEnv$2("GROQ_API_KEY").trim();
  if (main) keys.push(main);
  for (let i = 1; i <= MAX_INDEXED_KEYS$1; i++) {
    const k = readEnv$2(`GROQ_API_KEY_${i}`).trim();
    if (k) keys.push(k);
  }
  return [...new Set(keys)];
}
function hasGroqKey() {
  return readApiKeys$1().length > 0;
}
function getGroqKeyCount() {
  return readApiKeys$1().length;
}
function resolveGroqModel(overrideModel) {
  return (overrideModel || readEnv$2("GROQ_MODEL") || DEFAULT_MODEL$1).trim();
}
function resolveGroqTextModel(overrideModel) {
  return (overrideModel || readEnv$2("GROQ_TEXT_MODEL") || DEFAULT_TEXT_MODEL$1).trim();
}
function maskKey$1(k) {
  if (!k) return "(empty)";
  if (k.length <= 10) return "****";
  return `${k.slice(0, 4)}…${k.slice(-4)}`;
}
function isQuotaError$1(status, msg = "") {
  return status === 429 || /quota|rate.?limit|too many/i.test(msg);
}
function isInvalidKeyError$1(status, msg = "") {
  return (status === 401 || status === 403) && /invalid|unauthorized|disabled|api.?key/i.test(msg);
}
async function callGroqOnce({ messages, apiKey, model }) {
  const body = {
    model,
    messages,
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 1024
  };
  const res = await fetch(ENDPOINT$1, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15e3)
    // Abort individual request after 15s
  });
  if (!res.ok) {
    let parsed = null;
    try {
      parsed = await res.json();
    } catch {
    }
    const msg = parsed?.error?.message || `Groq erreur ${res.status}`;
    const err = new Error(`Groq: ${msg.slice(0, 200)}`);
    err.status = res.status;
    err.providerMessage = msg;
    throw err;
  }
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Réponse Groq vide.");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Réponse Groq non-JSON : " + text.slice(0, 200));
  }
}
async function callGroq({ messages, model }) {
  const keys = readApiKeys$1();
  if (keys.length === 0) throw new Error("Aucune clé Groq configurée.");
  const total = keys.length;
  const now = Date.now();
  const order = [];
  for (let i = 0; i < total; i++) order.push(keys[(keyCursor$1 + i) % total]);
  let lastError = null;
  let attempted = 0;
  for (const key of order) {
    const cd = keyCooldowns$1.get(key);
    if (cd && cd > now) continue;
    attempted++;
    try {
      const result = await callGroqOnce({ messages, apiKey: key, model });
      keyCursor$1 = keys.indexOf(key);
      keyCooldowns$1.delete(key);
      return result;
    } catch (e) {
      lastError = e;
      const status = e.status;
      const msg = e.providerMessage || e.message || "";
      if (isQuotaError$1(status, msg)) {
        keyCooldowns$1.set(key, Date.now() + COOLDOWN_QUOTA_MS$1);
        keyCursor$1 = (keys.indexOf(key) + 1) % total;
        if (total > 1) console.warn(`[groq] key ${maskKey$1(key)} rate-limited, falling back`);
        continue;
      }
      if (isInvalidKeyError$1(status, msg)) {
        keyCooldowns$1.set(key, Date.now() + COOLDOWN_INVALID_MS$1);
        keyCursor$1 = (keys.indexOf(key) + 1) % total;
        console.warn(`[groq] key ${maskKey$1(key)} invalid, skipping for 1h`);
        continue;
      }
      throw e;
    }
  }
  if (attempted === 0) {
    const sorted = [...keys].sort((a, b) => (keyCooldowns$1.get(a) || 0) - (keyCooldowns$1.get(b) || 0));
    for (const key of sorted) {
      try {
        const result = await callGroqOnce({ messages, apiKey: key, model });
        keyCursor$1 = keys.indexOf(key);
        keyCooldowns$1.delete(key);
        return result;
      } catch (e) {
        lastError = e;
      }
    }
  }
  throw lastError || new Error("Toutes les clés Groq sont indisponibles.");
}
async function analyzeImageGroq({ base64DataUrl, model } = {}) {
  if (!/^data:image\/[a-zA-Z+.-]+;base64,.+$/.test(base64DataUrl || "")) {
    throw new Error("Image invalide (attendu data:image/...;base64,...)");
  }
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: IMAGE_PROMPT },
        { type: "image_url", image_url: { url: base64DataUrl } }
      ]
    }
  ];
  const raw = await callGroq({ messages, model: resolveGroqModel(model) });
  return normalizeArticleResult(raw);
}
async function analyzeBarcodeGroq({ barcode, model } = {}) {
  const code = String(barcode || "").trim();
  if (!code) throw new Error("Code-barres manquant");
  const messages = [
    { role: "user", content: buildBarcodePrompt(code) }
  ];
  const raw = await callGroq({ messages, model: resolveGroqTextModel(model) });
  const normalized = normalizeArticleResult(raw);
  normalized.code_barres = code;
  return normalized;
}

const __vite_import_meta_env__$1 = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://marchedemov2.vercel.app", "SSR": true};
const DEFAULT_MODEL = "pixtral-12b-latest";
const DEFAULT_TEXT_MODEL = "mistral-small-latest";
const MAX_INDEXED_KEYS = 10;
const COOLDOWN_QUOTA_MS = 60 * 1e3;
const COOLDOWN_INVALID_MS = 60 * 60 * 1e3;
const ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
let keyCursor = 0;
const keyCooldowns = /* @__PURE__ */ new Map();
function readEnv$1(name) {
  try {
    const v = Object.assign(__vite_import_meta_env__$1, { OS: process.env.OS, PROMPT: process.env.PROMPT })?.[name];
    if (v !== void 0 && v !== null && v !== "") return String(v);
  } catch {
  }
  const p = process.env?.[name];
  return p !== void 0 && p !== null ? String(p) : "";
}
function readApiKeys() {
  const keys = [];
  const main = readEnv$1("MISTRAL_API_KEY").trim();
  if (main) keys.push(main);
  for (let i = 1; i <= MAX_INDEXED_KEYS; i++) {
    const k = readEnv$1(`MISTRAL_API_KEY_${i}`).trim();
    if (k) keys.push(k);
  }
  return [...new Set(keys)];
}
function hasMistralKey() {
  return readApiKeys().length > 0;
}
function getMistralKeyCount() {
  return readApiKeys().length;
}
function resolveMistralModel(overrideModel) {
  return (overrideModel || readEnv$1("MISTRAL_MODEL") || DEFAULT_MODEL).trim();
}
function resolveMistralTextModel(overrideModel) {
  return (overrideModel || readEnv$1("MISTRAL_TEXT_MODEL") || DEFAULT_TEXT_MODEL).trim();
}
function maskKey(k) {
  if (!k) return "(empty)";
  if (k.length <= 10) return "****";
  return `${k.slice(0, 4)}…${k.slice(-4)}`;
}
function isQuotaError(status, msg = "") {
  return status === 429 || /quota|rate.?limit|too many/i.test(msg);
}
function isInvalidKeyError(status, msg = "") {
  return (status === 401 || status === 403) && /invalid|unauthorized|disabled|api.?key/i.test(msg);
}
async function callMistralOnce({ messages, apiKey, model }) {
  const body = {
    model,
    messages,
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 1024
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(2e4)
    // Abort individual request after 20s
  });
  if (!res.ok) {
    let parsed = null;
    try {
      parsed = await res.json();
    } catch {
    }
    const msg = parsed?.message || parsed?.error?.message || `Mistral erreur ${res.status}`;
    const err = new Error(`Mistral: ${String(msg).slice(0, 200)}`);
    err.status = res.status;
    err.providerMessage = String(msg);
    throw err;
  }
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Réponse Mistral vide.");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Réponse Mistral non-JSON : " + text.slice(0, 200));
  }
}
async function callMistral({ messages, model }) {
  const keys = readApiKeys();
  if (keys.length === 0) throw new Error("Aucune clé Mistral configurée.");
  const total = keys.length;
  const now = Date.now();
  const order = [];
  for (let i = 0; i < total; i++) order.push(keys[(keyCursor + i) % total]);
  let lastError = null;
  let attempted = 0;
  for (const key of order) {
    const cd = keyCooldowns.get(key);
    if (cd && cd > now) continue;
    attempted++;
    try {
      const result = await callMistralOnce({ messages, apiKey: key, model });
      keyCursor = keys.indexOf(key);
      keyCooldowns.delete(key);
      return result;
    } catch (e) {
      lastError = e;
      const status = e.status;
      const msg = e.providerMessage || e.message || "";
      if (isQuotaError(status, msg)) {
        keyCooldowns.set(key, Date.now() + COOLDOWN_QUOTA_MS);
        keyCursor = (keys.indexOf(key) + 1) % total;
        if (total > 1) console.warn(`[mistral] key ${maskKey(key)} rate-limited, falling back`);
        continue;
      }
      if (isInvalidKeyError(status, msg)) {
        keyCooldowns.set(key, Date.now() + COOLDOWN_INVALID_MS);
        keyCursor = (keys.indexOf(key) + 1) % total;
        console.warn(`[mistral] key ${maskKey(key)} invalid, skipping for 1h`);
        continue;
      }
      throw e;
    }
  }
  if (attempted === 0) {
    const sorted = [...keys].sort((a, b) => (keyCooldowns.get(a) || 0) - (keyCooldowns.get(b) || 0));
    for (const key of sorted) {
      try {
        const result = await callMistralOnce({ messages, apiKey: key, model });
        keyCursor = keys.indexOf(key);
        keyCooldowns.delete(key);
        return result;
      } catch (e) {
        lastError = e;
      }
    }
  }
  throw lastError || new Error("Toutes les clés Mistral sont indisponibles.");
}
async function analyzeImageMistral({ base64DataUrl, model } = {}) {
  if (!/^data:image\/[a-zA-Z+.-]+;base64,.+$/.test(base64DataUrl || "")) {
    throw new Error("Image invalide (attendu data:image/...;base64,...)");
  }
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: IMAGE_PROMPT },
        { type: "image_url", image_url: base64DataUrl }
      ]
    }
  ];
  const raw = await callMistral({ messages, model: resolveMistralModel(model) });
  return normalizeArticleResult(raw);
}
async function analyzeBarcodeMistral({ barcode, model } = {}) {
  const code = String(barcode || "").trim();
  if (!code) throw new Error("Code-barres manquant");
  const messages = [
    { role: "user", content: buildBarcodePrompt(code) }
  ];
  const raw = await callMistral({ messages, model: resolveMistralTextModel(model) });
  const normalized = normalizeArticleResult(raw);
  normalized.code_barres = code;
  return normalized;
}

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://marchedemov2.vercel.app", "SSR": true};
function readEnv(name) {
  try {
    const v = Object.assign(__vite_import_meta_env__, { OS: process.env.OS })?.[name];
    if (v !== void 0 && v !== null && v !== "") return String(v);
  } catch {
  }
  const p = process.env?.[name];
  return p !== void 0 && p !== null ? String(p) : "";
}
function hasVisionKey() {
  return !!readEnv("GOOGLE_VISION_API_KEY").trim();
}
function resolveVisionKey(overrideKey) {
  const k = (overrideKey || "").trim();
  if (k) return k;
  const env = readEnv("GOOGLE_VISION_API_KEY").trim();
  if (env) return env;
  throw new Error("Aucune clé Google Cloud Vision configurée.");
}
function friendlyVisionError(status, body) {
  const msg = body?.error?.message || "";
  if (/billing/i.test(msg)) {
    return "Cloud Vision : facturation non activée sur le projet GCP. Activez-la sur console.cloud.google.com/billing (gratuit jusqu'à 1000 req/mois).";
  }
  if (status === 403 && /API has not been used|Vision API.*disabled/i.test(msg)) {
    return "Cloud Vision API désactivée sur ce projet. Activez-la dans GCP Console > APIs & Services > Library.";
  }
  if (status === 403 || /API_KEY_INVALID|API key not valid/i.test(msg)) {
    return "Clé Cloud Vision invalide ou non autorisée. Vérifiez la clé et ses restrictions.";
  }
  if (status === 429 || /quota|RESOURCE_EXHAUSTED/i.test(msg)) {
    return "Quota Cloud Vision dépassé.";
  }
  return msg ? `Vision: ${msg.slice(0, 200)}` : `Vision erreur ${status}`;
}
async function visionAnnotate(base64DataUrl, { apiKey } = {}) {
  const key = resolveVisionKey(apiKey);
  const match = /^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/.exec(base64DataUrl || "");
  if (!match) throw new Error("Image invalide pour Vision (attendu data:image/...;base64,...)");
  const content = match[2];
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(key)}`;
  const body = {
    requests: [{
      image: { content },
      features: [
        { type: "LOGO_DETECTION", maxResults: 3 },
        { type: "LABEL_DETECTION", maxResults: 8 },
        { type: "OBJECT_LOCALIZATION", maxResults: 5 },
        { type: "TEXT_DETECTION" },
        { type: "IMAGE_PROPERTIES" }
      ],
      imageContext: { languageHints: ["fr", "en"] }
    }]
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15e3)
    // Abort after 15s
  });
  if (!res.ok) {
    let parsed = null;
    try {
      parsed = await res.json();
    } catch {
    }
    throw new Error(friendlyVisionError(res.status, parsed));
  }
  const json = await res.json();
  const r = json.responses?.[0] || {};
  if (r.error) throw new Error(friendlyVisionError(r.error.code || 500, { error: r.error }));
  return {
    logos: (r.logoAnnotations || []).map((l) => ({ name: l.description, score: l.score || 0 })),
    labels: (r.labelAnnotations || []).map((l) => ({ name: l.description, score: l.score || 0 })),
    objects: (r.localizedObjectAnnotations || []).map((o) => ({ name: o.name, score: o.score || 0 })),
    text: r.fullTextAnnotation?.text || r.textAnnotations?.[0]?.description || "",
    colors: (r.imagePropertiesAnnotation?.dominantColors?.colors || []).slice(0, 3).map((c) => ({
      r: Math.round(c.color?.red || 0),
      g: Math.round(c.color?.green || 0),
      b: Math.round(c.color?.blue || 0),
      score: c.score || 0,
      pixelFraction: c.pixelFraction || 0
    }))
  };
}
const EAN_REGEX = /\b(\d{8}|\d{12,14})\b/;
const FORMAT_REGEX_LIST = [
  /\b\d{1,4}(?:[.,]\d+)?\s*(?:x|×)\s*\d{1,4}(?:[.,]\d+)?\s*(?:g|kg|ml|cl|l|L)\b/i,
  // "6 x 33cl"
  /\b\d{1,4}(?:[.,]\d+)?\s*(?:kg|g|mg)\b(?!\w)/i,
  // "500g" / "1,5 kg"
  /\b\d{1,4}(?:[.,]\d+)?\s*(?:L|ml|cl|dl)\b(?!\w)/i,
  // "1L" / "200 ml"
  /\b\d{1,4}\s*(?:unit[ée]s?|pi[èe]ces?|pcs|pack|bouteilles?|sachets?)\b/i
  // "12 unités"
];
const PRICE_REGEX = /(\d+(?:[.,]\d{1,2}))\s*(?:€|EUR\b)|(?:€|EUR)\s*(\d+(?:[.,]\d{1,2}))/i;
const DLC_PHRASE_REGEX = /(?:à\s*consommer\s*(?:avant|jusqu['’]au)\s*(?:le)?|DLC|DDM|date\s*limite|best\s*before|exp\.?|expire)\s*[: ]*\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i;
const DATE_FALLBACK_REGEX = /\b(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\b/;
function parseFrenchDate(raw) {
  const m = String(raw || "").match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  if (!m) return "";
  let [, d, mo, y] = m;
  y = String(y);
  if (y.length === 2) y = (Number(y) >= 70 ? "19" : "20") + y;
  const day = Number(d), month = Number(mo), year = Number(y);
  if (!day || !month || !year || month < 1 || month > 12 || day < 1 || day > 31) return "";
  const dateObj = new Date(year, month - 1, day);
  const now = /* @__PURE__ */ new Date();
  const minDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const maxDate = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
  if (dateObj < minDate || dateObj > maxDate) return "";
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
function extractFromVision(v) {
  const out = {
    marque: "",
    code_barres: "",
    format: "",
    dlc: "",
    detectedPrice: 0,
    fallbackRayon: "",
    logoConfidence: 0
  };
  if (!v) return out;
  if (v.logos?.length) {
    out.marque = v.logos[0].name || "";
    out.logoConfidence = v.logos[0].score || 0;
  }
  const text = v.text || "";
  const eanMatch = text.match(EAN_REGEX);
  if (eanMatch) out.code_barres = eanMatch[1];
  for (const re of FORMAT_REGEX_LIST) {
    const m = text.match(re);
    if (m) {
      out.format = m[0].replace(/\s+/g, " ").trim();
      break;
    }
  }
  const priceMatch = text.match(PRICE_REGEX);
  if (priceMatch) {
    const raw = (priceMatch[1] || priceMatch[2] || "").replace(",", ".");
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0 && n < 1e5) out.detectedPrice = n;
  }
  const phraseMatch = text.match(DLC_PHRASE_REGEX);
  if (phraseMatch) out.dlc = parseFrenchDate(phraseMatch[1]);
  if (!out.dlc) {
    const fallbackMatch = text.match(DATE_FALLBACK_REGEX);
    if (fallbackMatch) out.dlc = parseFrenchDate(fallbackMatch[1]);
  }
  const corpus = [
    text,
    out.marque,
    ...(v.labels || []).map((l) => l.name),
    ...(v.objects || []).map((o) => o.name)
  ].filter(Boolean).join(" ");
  out.fallbackRayon = guessRayonFromText(corpus);
  return out;
}

export { hasGroqKey as a, hasMistralKey as b, hasVisionKey as c, analyzeImage as d, extractFromVision as e, analyzeImageGroq as f, analyzeImageMistral as g, hasServerKey as h, analyzeBarcode as i, analyzeBarcodeGroq as j, analyzeBarcodeMistral as k, resolveMistralModel as l, getMistralKeyCount as m, resolveGroqModel as n, getGroqKeyCount as o, getKeyCount as p, resolveModel as r, visionAnnotate as v };
