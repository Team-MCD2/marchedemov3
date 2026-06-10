import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_D6bhTD9n.mjs';
import { $ as $$AdminTopbar } from '../../chunks/AdminTopbar_C-Ia9XuP.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useMemo, useEffect } from 'react';
import { a as adminFetch } from '../../chunks/adminFetch_BJhji8N3.mjs';
import { p as publishAdminEvent, A as ADMIN_EVENT } from '../../chunks/admin-bus_D3U38ckw.mjs';
import { a as RAYONS_LIST, S as SITE } from '../../chunks/site_dG8pplQb.mjs';
import { i as isAuthenticated } from '../../chunks/auth_YbJ1phUF.mjs';
import '../../chunks/supabase_DGRgIA0P.mjs';
export { renderers } from '../../renderers.mjs';

const ALLOWED_RAYONS = [
  "boucherie-halal",
  "fruits-legumes",
  "epices-du-monde",
  "saveurs-afrique",
  "saveurs-asie",
  "saveur-mediterranee",
  "saveur-sud-amer",
  "balkans-turques",
  "produits-courants",
  "surgeles",
  "boulangerie",
  "produits-laitiers"
];
function slugifyLocal(raw) {
  if (!raw) return "";
  return String(raw).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
function norm(v) {
  if (v === void 0 || v === null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  if (typeof v === "number" && isNaN(v)) return null;
  return v;
}
function CSVImporter({ rayonsOptions }) {
  const [existingProduits, setExistingProduits] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [papa, setPapa] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [analysis, setAnalysis] = useState({
    inserts: [],
    updates: [],
    unchanged: [],
    invalid: []
  });
  const [activeTab, setActiveTab] = useState("inserts");
  const [toast, setToast] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, errors: [] });
  const [importFinished, setImportFinished] = useState(false);
  const fileInputRef = useRef(null);
  const RAYON_LABELS = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rayonsOptions.forEach((r) => m.set(r.slug, r.nom));
    return (slug) => m.get(slug) ?? slug;
  }, [rayonsOptions]);
  useEffect(() => {
    async function fetchDb() {
      try {
        const res = await adminFetch("/api/admin/produits");
        if (!res.ok) {
          throw new Error(`Erreur lors du chargement du catalogue : ${res.statusText}`);
        }
        const data = await res.json();
        setExistingProduits(data.produits ?? []);
      } catch (err) {
        setDbError(err.message);
      } finally {
        setLoadingDb(false);
      }
    }
    fetchDb();
    import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm').then((m) => setPapa(m.default)).catch((err) => console.error("Échec du chargement de Papa Parse", err));
  }, []);
  function notify(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4e3);
  }
  function mapHeaders(headers) {
    const mapping = {
      nom: ["nom", "name", "title", "titre", "designation", "produit"],
      slug: ["slug", "id", "identifiant"],
      description: ["description", "desc", "details", "detail"],
      image_url: ["image_url", "image", "imageurl", "photo", "url_image", "url"],
      prix_indicatif: ["prix_indicatif", "prixindicatif", "prix", "prix_vente", "tarif"],
      unite: ["unite", "unit", "conditionnement", "mesure"],
      rayon: ["rayon", "rayon_slug", "rayon-slug", "department", "rayonslug"],
      categorie: ["categorie", "category", "catégorie"],
      sous_categorie: ["sous_categorie", "souscategorie", "subcategory", "sous_category", "sous-categorie"],
      origine: ["origine", "origin", "pays"],
      badge: ["badge", "label", "tag", "etoile"],
      actif: ["actif", "active", "publie", "publié"],
      ordre: ["ordre", "order", "tri", "position"]
    };
    const headerMap = {};
    headers.forEach((h, index) => {
      const normalized = h.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").trim();
      let found = false;
      for (const [field, aliases] of Object.entries(mapping)) {
        if (normalized === field || aliases.includes(normalized) || aliases.includes(h.toLowerCase().trim())) {
          headerMap[field] = index;
          found = true;
          break;
        }
      }
      if (!found) {
        headerMap[normalized] = index;
      }
    });
    return headerMap;
  }
  function parseCSV(file) {
    if (!papa) {
      notify("err", "L'outil de lecture CSV n'est pas encore prêt. Veuillez patienter.");
      return;
    }
    setFileName(file.name);
    papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      // Support both comma (EN) and semicolon (FR) delimiters
      delimiter: "",
      // Strip UTF-8 BOM if present
      skipLinesWithEmptyValues: false,
      complete: (results) => {
        if (results.data.length < 2) {
          notify("err", "Le fichier CSV doit contenir une ligne d'en-têtes et au moins une ligne de données.");
          return;
        }
        const headers = results.data[0];
        if (headers[0] && typeof headers[0] === "string" && headers[0].startsWith("\uFEFF")) {
          headers[0] = headers[0].replace(/^\uFEFF/, "");
        }
        const headerMap = mapHeaders(headers);
        if (headerMap.nom === void 0) {
          notify("err", "Impossible de trouver une colonne pour le Nom du produit (ex: 'nom', 'titre', 'designation').");
          return;
        }
        const rows = results.data.slice(1).map((rowArr, rowIndex) => {
          const rawItem = {};
          Object.keys(headerMap).forEach((field) => {
            const index = headerMap[field];
            rawItem[field] = rowArr[index] !== void 0 ? String(rowArr[index]).trim() : "";
          });
          return { raw: rawItem, lineIndex: rowIndex + 2 };
        });
        setParsedRows(rows);
        analyzeDiff(rows);
      },
      error: (error) => {
        notify("err", `Erreur lors de la lecture du fichier : ${error.message}`);
      }
    });
  }
  function analyzeDiff(rows) {
    const dbMap = new Map(existingProduits.map((p) => [p.slug, p]));
    const inserts = [];
    const updates = [];
    const unchanged = [];
    const invalid = [];
    rows.forEach(({ raw, lineIndex }) => {
      const errors = [];
      const nom = raw.nom || "";
      let rayon = raw.rayon || "";
      if (!nom) {
        errors.push("Le nom du produit est obligatoire.");
      }
      if (!rayon) {
        errors.push("Le rayon est obligatoire.");
      } else {
        const mappedRayon = slugifyLocal(rayon);
        if (ALLOWED_RAYONS.includes(mappedRayon)) {
          rayon = mappedRayon;
        } else if (!ALLOWED_RAYONS.includes(rayon)) {
          errors.push(`Rayon inconnu : "${rayon}". Doit être l'un des rayons configurés.`);
        }
      }
      let prix_indicatif = null;
      if (raw.prix_indicatif !== void 0 && raw.prix_indicatif !== "") {
        const cleanPrice = String(raw.prix_indicatif).replace(",", ".").replace(/[^0-9.]/g, "");
        const parsedPrice = parseFloat(cleanPrice);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          errors.push(`Prix indicatif invalide : "${raw.prix_indicatif}".`);
        } else {
          prix_indicatif = parsedPrice;
        }
      }
      let slug = raw.slug ? slugifyLocal(raw.slug) : slugifyLocal(nom);
      if (!slug && nom) {
        slug = slugifyLocal(nom);
      }
      if (!slug) {
        errors.push("Impossible de dériver un slug valide pour ce produit.");
      }
      const active = raw.actif !== void 0 && raw.actif !== "" ? !(raw.actif.toLowerCase() === "false" || raw.actif === "0" || raw.actif.toLowerCase() === "non") : true;
      const orderVal = parseInt(raw.ordre, 10);
      const ordre = isNaN(orderVal) ? 0 : orderVal;
      const normalizedItem = {
        slug,
        nom,
        description: raw.description || "",
        image_url: raw.image_url || null,
        prix_indicatif,
        unite: raw.unite || null,
        rayon,
        categorie: raw.categorie || null,
        sous_categorie: raw.sous_categorie || null,
        origine: raw.origine || null,
        badge: raw.badge || null,
        actif: active,
        ordre
      };
      if (errors.length > 0) {
        invalid.push({ item: normalizedItem, line: lineIndex, errors });
        return;
      }
      const existing = dbMap.get(slug);
      if (!existing) {
        inserts.push({ item: normalizedItem, line: lineIndex });
      } else {
        const diffs = {};
        const compareFields = [
          "nom",
          "description",
          "image_url",
          "prix_indicatif",
          "unite",
          "rayon",
          "categorie",
          "sous_categorie",
          "origine",
          "badge",
          "actif",
          "ordre"
        ];
        compareFields.forEach((f) => {
          const next = norm(normalizedItem[f]);
          const prev = norm(existing[f]);
          if (f === "prix_indicatif") {
            const nextNum = next !== null ? Number(next).toFixed(2) : null;
            const prevNum = prev !== null ? Number(prev).toFixed(2) : null;
            if (nextNum !== prevNum) {
              diffs[f] = { prev, next };
            }
          } else {
            if (next !== prev) {
              diffs[f] = { prev, next };
            }
          }
        });
        if (Object.keys(diffs).length > 0) {
          updates.push({ item: normalizedItem, line: lineIndex, diffs, id: existing.id });
        } else {
          unchanged.push({ item: normalizedItem, line: lineIndex });
        }
      }
    });
    setAnalysis({ inserts, updates, unchanged, invalid });
    if (inserts.length > 0) setActiveTab("inserts");
    else if (updates.length > 0) setActiveTab("updates");
    else if (invalid.length > 0) setActiveTab("invalid");
    else setActiveTab("unchanged");
  }
  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        parseCSV(file);
      } else {
        notify("err", "Format invalide. Veuillez téléverser un fichier .csv uniquement.");
      }
    }
  }
  function handleFileSelect(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".csv")) {
        parseCSV(file);
      } else {
        notify("err", "Format invalide. Veuillez sélectionner un fichier .csv.");
      }
    }
  }
  async function triggerImport() {
    const toImport = [
      ...analysis.inserts.map((i) => i.item),
      ...analysis.updates.map((u) => u.item)
    ];
    if (toImport.length === 0) {
      notify("err", "Aucun produit à importer (0 insertions, 0 modifications).");
      return;
    }
    setImporting(true);
    setImportProgress({ current: 0, total: toImport.length, errors: [] });
    setImportFinished(false);
    const CHUNK_SIZE = 50;
    const errors = [];
    let successfulCount = 0;
    for (let i = 0; i < toImport.length; i += CHUNK_SIZE) {
      const chunk = toImport.slice(i, i + CHUNK_SIZE);
      try {
        const res = await adminFetch("/api/admin/produits", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produits: chunk })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Erreur serveur (HTTP ${res.status})`);
        }
        successfulCount += chunk.length;
      } catch (err) {
        errors.push(`Lot ${Math.floor(i / CHUNK_SIZE) + 1} (${chunk[0]?.nom || "sans nom"}...) : ${err.message}`);
      }
      setImportProgress((cur) => ({
        ...cur,
        current: Math.min(i + CHUNK_SIZE, toImport.length),
        errors: [...errors]
      }));
    }
    setImporting(false);
    setImportFinished(true);
    if (errors.length === 0) {
      notify("ok", `Importation terminée ! ${successfulCount} produits synchronisés.`);
    } else {
      notify("err", `Importation terminée avec des erreurs (${errors.length} lots échoués).`);
    }
    try {
      const res = await adminFetch("/api/admin/produits");
      if (res.ok) {
        const data = await res.json();
        setExistingProduits(data.produits ?? []);
      }
    } catch {
    }
    if (successfulCount > 0) {
      publishAdminEvent(ADMIN_EVENT.PRODUITS_UPDATED, {
        entity: "produit:csv-import"
      });
    }
  }
  function handleReset() {
    setFileName("");
    setParsedRows([]);
    setAnalysis({ inserts: [], updates: [], unchanged: [], invalid: [] });
    setImportFinished(false);
  }
  if (loadingDb) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full border-4 border-neutral-100 border-t-vert animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-[13px] text-neutral-500 font-bold", children: "Chargement du catalogue actuel..." })
    ] });
  }
  if (dbError) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-rouge/5 border border-rouge/30 text-rouge rounded-3xl p-6 md:p-8 space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold text-[15px]", children: "⚠ Impossible d'accéder à Supabase" }),
      /* @__PURE__ */ jsx("p", { className: "text-[14px] leading-relaxed", children: dbError })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    toast && /* @__PURE__ */ jsx(
      "div",
      {
        className: [
          "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl transition-all border",
          toast.type === "ok" ? "bg-vert/10 border-vert/30 text-vert-dark" : "bg-rouge/10 border-rouge/30 text-rouge"
        ].join(" "),
        role: "alert",
        children: /* @__PURE__ */ jsx("span", { className: "text-[14px] font-bold", children: toast.msg })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-neutral-100 pb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/admin/produits",
            className: "p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-noir transition",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M19 12H5M12 19l-7-7 7-7" }) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[]-neutral-600", children: "Importateur" }),
          /* @__PURE__ */ jsx("h2", { className: "text-[18px] font-bold text-noir", children: "Mise à jour en masse du catalogue" })
        ] })
      ] }),
      fileName && !importing && !importFinished && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleReset,
          className: "px-4 py-2 border border-black/10 hover:border-noir text-[12px] font-bold rounded-full transition",
          children: "Réinitialiser / Changer de fichier"
        }
      )
    ] }),
    !fileName ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-neutral-50 border border-neutral-100 p-6 rounded-3xl text-[13px] text-neutral-600 max-w-3xl leading-relaxed space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-noir text-[14px]", children: "💡 Instructions et format attendu :" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Téléversez un fichier ",
          /* @__PURE__ */ jsx("strong", { children: "CSV" }),
          " contenant votre catalogue. Le script de synchronisation effectuera une analyse différentielle avant toute écriture pour n'injecter que les lignes ajoutées ou modifiées."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-medium text-noir", children: "Noms de colonnes supportés (insensibles à la casse et accents) :" }),
        /* @__PURE__ */ jsxs("ul", { className: "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1.5 font-mono text-[]-neutral-600", children: [
          /* @__PURE__ */ jsx("li", { children: "• nom (obligatoire)" }),
          /* @__PURE__ */ jsx("li", { children: "• rayon (obligatoire)" }),
          /* @__PURE__ */ jsx("li", { children: "• slug (optionnel)" }),
          /* @__PURE__ */ jsx("li", { children: "• description" }),
          /* @__PURE__ */ jsx("li", { children: "• image_url / photo" }),
          /* @__PURE__ */ jsx("li", { children: "• prix_indicatif" }),
          /* @__PURE__ */ jsx("li", { children: "• unite / unit" }),
          /* @__PURE__ */ jsx("li", { children: "• categorie" }),
          /* @__PURE__ */ jsx("li", { children: "• sous_categorie" }),
          /* @__PURE__ */ jsx("li", { children: "• origine / pays" }),
          /* @__PURE__ */ jsx("li", { children: "• badge" }),
          /* @__PURE__ */ jsx("li", { children: "• actif (true/false)" }),
          /* @__PURE__ */ jsx("li", { children: "• ordre (numérique)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          onDragEnter: handleDrag,
          onDragLeave: handleDrag,
          onDragOver: handleDrag,
          onDrop: handleDrop,
          className: [
            "border-2 border-dashed rounded-3xl p-12 text-center transition flex flex-col items-center justify-center gap-4 cursor-pointer",
            dragActive ? "border-vert bg-vert/5" : "border-neutral-200 bg-white hover:border-neutral-300"
          ].join(" "),
          onClick: () => fileInputRef.current?.click(),
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: ".csv",
                onChange: handleFileSelect,
                className: "hidden"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-neutral-50 border border-black/5 flex items-center justify-center text-[28px]", children: "📥" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] text-noir", children: "Déposez votre fichier CSV ici" }),
              /* @__PURE__ */ jsx("p", { className: "text-[]-neutral-600 mt-1", children: "ou cliquez pour parcourir vos fichiers (.csv)" })
            ] })
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[16px]", children: "📄" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono text-[13px] font-bold text-noir", children: fileName })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] text-neutral-500", children: [
            parsedRows.length,
            " lignes de données analysées."
          ] })
        ] }),
        !importing && !importFinished && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-right hidden sm:block", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[13px] font-bold text-noir", children: [
              analysis.inserts.length + analysis.updates.length,
              " changements à appliquer"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[11.5px] text-neutral-500", children: [
              "(",
              analysis.inserts.length,
              " insertions, ",
              analysis.updates.length,
              " modifications)"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: triggerImport,
              disabled: analysis.inserts.length + analysis.updates.length === 0,
              className: "px-6 py-3 rounded-full bg-vert text-white text-[13px] font-bold hover:bg-vert-dark transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx("span", { children: "Lancer l'importation" }),
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) })
              ]
            }
          )
        ] })
      ] }),
      (importing || importFinished) && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-100 rounded-3xl p-6 shadow-card space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-[14px] text-noir", children: importing ? "Importation en cours..." : "Importation terminée" }),
            /* @__PURE__ */ jsx("p", { className: "text-[]-neutral-600 mt-0.5", children: "Traitement des produits par lots de 50 pour éviter les timeouts Supabase." })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[13px] font-bold text-noir tabular-nums", children: [
            importProgress.current,
            " / ",
            importProgress.total,
            " produits (",
            Math.round(importProgress.current / importProgress.total * 100),
            "%)"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-2 w-full bg-neutral-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-vert transition-all duration-300",
            style: { width: `${importProgress.current / importProgress.total * 100}%` }
          }
        ) }),
        importProgress.errors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-rouge/5 border border-rouge/20 text-rouge rounded-2xl p-4 text-[12.5px] space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold", children: "⚠ Échecs d'importation :" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-1 font-mono text-[11px]", children: importProgress.errors.map((err, idx) => /* @__PURE__ */ jsx("li", { children: err }, idx)) })
        ] }),
        importFinished && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/admin/produits",
              className: "px-5 py-2.5 rounded-full bg-noir text-white text-[13px] font-bold hover:bg-neutral-800 transition",
              children: "Retour au catalogue"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleReset,
              className: "px-5 py-2.5 rounded-full border border-black/10 hover:border-noir text-[13px] font-bold text-neutral-600 hover:text-noir transition",
              children: "Importer un autre fichier"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b border-neutral-100", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("inserts"),
              className: [
                "px-5 py-3 text-[13px] font-bold border-b-2 transition -mb-px flex items-center gap-2",
                activeTab === "inserts" ? "border-vert text-vert" : "border-transparent text-neutral-500 hover:text-neutral-600"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsx("span", { children: "Nouveaux produits" }),
                /* @__PURE__ */ jsx("span", { className: [
                  "text-[]-neutral-600"
                ].join(" "), children: analysis.inserts.length })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("updates"),
              className: [
                "px-5 py-3 text-[13px] font-bold border-b-2 transition -mb-px flex items-center gap-2",
                activeTab === "updates" ? "border-orange-500 text-orange-600" : "border-transparent text-neutral-500 hover:text-neutral-600"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsx("span", { children: "Produits à modifier" }),
                /* @__PURE__ */ jsx("span", { className: [
                  "text-[]-neutral-600"
                ].join(" "), children: analysis.updates.length })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("invalid"),
              className: [
                "px-5 py-3 text-[13px] font-bold border-b-2 transition -mb-px flex items-center gap-2",
                activeTab === "invalid" ? "border-rouge text-rouge" : "border-transparent text-neutral-500 hover:text-neutral-600"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsx("span", { children: "Lignes invalides" }),
                /* @__PURE__ */ jsx("span", { className: [
                  "text-[]-neutral-600"
                ].join(" "), children: analysis.invalid.length })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("unchanged"),
              className: [
                "px-5 py-3 text-[13px] font-bold border-b-2 transition -mb-px flex items-center gap-2",
                activeTab === "unchanged" ? "border-neutral-500 text-noir" : "border-transparent text-neutral-500 hover:text-neutral-600"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsx("span", { children: "Identiques" }),
                /* @__PURE__ */ jsx("span", { className: "text-[]-neutral-600 font-bold", children: analysis.unchanged.length })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm", children: [
          activeTab === "inserts" && /* @__PURE__ */ jsx("div", { children: analysis.inserts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-neutral-500 text-[13px]", children: "Aucun nouveau produit dans ce fichier." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-[13px]", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold", children: [
              /* @__PURE__ */ jsx("th", { className: "p-4 w-12", children: "Ligne" }),
              /* @__PURE__ */ jsx("th", { className: "p-4", children: "Nom" }),
              /* @__PURE__ */ jsx("th", { className: "p-4", children: "Rayon" }),
              /* @__PURE__ */ jsx("th", { className: "p-4", children: "Catégorie" }),
              /* @__PURE__ */ jsx("th", { className: "p-4 text-right", children: "Prix indicatif" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-neutral-100", children: analysis.inserts.map(({ item, line }) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-neutral-50/50 transition", children: [
              /* @__PURE__ */ jsx("td", { className: "p-4 text-neutral-500 font-mono text-[11px]", children: line }),
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-noir", children: item.nom }),
                /* @__PURE__ */ jsx("div", { className: "text-[]-neutral-600 font-mono", children: item.slug })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 rounded-full bg-vert-light/35 text-vert-dark font-medium text-[11px]", children: RAYON_LABELS(item.rayon) }) }),
              /* @__PURE__ */ jsxs("td", { className: "p-4 text-neutral-600 font-medium", children: [
                item.categorie || /* @__PURE__ */ jsx("span", { className: "text-neutral-300", children: "—" }),
                item.sous_categorie && /* @__PURE__ */ jsxs("span", { className: "text-neutral-500 text-[11px] ml-1", children: [
                  "(",
                  item.sous_categorie,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "p-4 text-right font-bold text-noir tabular-nums", children: [
                item.prix_indicatif !== null ? `${item.prix_indicatif.toFixed(2)} €` : "—",
                item.unite && /* @__PURE__ */ jsxs("span", { className: "text-[]-neutral-600 font-normal ml-0.5", children: [
                  "/ ",
                  item.unite
                ] })
              ] })
            ] }, item.slug)) })
          ] }) }) }),
          activeTab === "updates" && /* @__PURE__ */ jsx("div", { children: analysis.updates.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-neutral-500 text-[13px]", children: "Aucune modification détectée dans ce fichier." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-[13px]", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-bold", children: [
              /* @__PURE__ */ jsx("th", { className: "p-4 w-12", children: "Ligne" }),
              /* @__PURE__ */ jsx("th", { className: "p-4", children: "Produit" }),
              /* @__PURE__ */ jsx("th", { className: "p-4", children: "Changements détectés" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-neutral-100", children: analysis.updates.map(({ item, line, diffs }) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-neutral-50/50 transition", children: [
              /* @__PURE__ */ jsx("td", { className: "p-4 text-neutral-500 font-mono text-[11px]", children: line }),
              /* @__PURE__ */ jsxs("td", { className: "p-4 max-w-xs", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-noir", children: item.nom }),
                /* @__PURE__ */ jsx("div", { className: "text-[]-neutral-600 font-mono", children: item.slug })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: Object.entries(diffs).map(([field, { prev, next }]) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "inline-flex items-center gap-1 bg-orange-50 border border-orange-200/50 rounded-xl px-3 py-1 text-[11.5px]",
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-800 uppercase tracking-wider text-[9.5px]", children: [
                      field === "prix_indicatif" ? "Prix" : field,
                      " :"
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-neutral-500 line-through", children: prev === null || prev === "" ? "vide" : String(prev) }),
                    /* @__PURE__ */ jsx("span", { className: "text-orange-900 font-bold", children: "→" }),
                    /* @__PURE__ */ jsx("span", { className: "text-orange-950 font-bold bg-orange-100 px-1 py-0.5 rounded", children: next === null || next === "" ? "vide" : String(next) })
                  ]
                },
                field
              )) }) })
            ] }, item.slug)) })
          ] }) }) }),
          activeTab === "invalid" && /* @__PURE__ */ jsx("div", { children: analysis.invalid.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-neutral-500 text-[13px]", children: "Aucune ligne invalide détectée. Félicitations !" }) : /* @__PURE__ */ jsxs("div", { className: "divide-y divide-neutral-100", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-rouge/5 px-4 py-3 text-[12px] text-rouge font-bold border-b border-rouge/10", children: "⚠ Les lignes ci-dessous comportent des erreurs de validation et seront ignorées lors de l'importation." }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse text-[13px]", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-neutral-50/70 text-neutral-500 font-bold", children: [
                /* @__PURE__ */ jsx("th", { className: "p-4 w-12", children: "Ligne" }),
                /* @__PURE__ */ jsx("th", { className: "p-4", children: "Produit saisi" }),
                /* @__PURE__ */ jsx("th", { className: "p-4 text-rouge", children: "Erreurs de validation" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-neutral-100", children: analysis.invalid.map(({ item, line, errors }) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-neutral-50/50 transition", children: [
                /* @__PURE__ */ jsx("td", { className: "p-4 text-neutral-500 font-mono text-[11px]", children: line }),
                /* @__PURE__ */ jsxs("td", { className: "p-4 max-w-xs", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-noir", children: item.nom || /* @__PURE__ */ jsx("span", { className: "text-neutral-300 italic", children: "sans nom" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[]-neutral-600 font-mono", children: [
                    "Rayon : ",
                    item.rayon || "—"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("ul", { className: "list-disc pl-4 space-y-1 font-medium text-rouge text-[12px]", children: errors.map((e, idx) => /* @__PURE__ */ jsx("li", { children: e }, idx)) }) })
              ] }, line)) })
            ] }) })
          ] }) }),
          activeTab === "unchanged" && /* @__PURE__ */ jsx("div", { children: analysis.unchanged.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-neutral-500 text-[13px]", children: "Aucun produit identique dans ce fichier." }) : /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-[13px] text-neutral-500 leading-relaxed max-w-md mx-auto space-y-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-bold text-noir text-[14px]", children: [
              "🔄 ",
              analysis.unchanged.length,
              " produits identiques"
            ] }),
            /* @__PURE__ */ jsx("p", { children: "Ces produits existent déjà dans la base de données de Marché de Mo' et possèdent exactement les mêmes valeurs pour toutes les colonnes. Ils ne seront pas modifiés." })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$ImportProduits = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ImportProduits;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  let errorMsg = null;
  {
    errorMsg = "SUPABASE_SERVICE_ROLE_KEY non configur\xE9e. Ajoutez-la dans .env.local (dev) ou dans Vercel Environment Variables (prod) puis red\xE9marrez le serveur.";
  }
  const rayonsOptions = RAYONS_LIST.map((r) => ({
    slug: r.slug,
    nom: r.nomCourt ?? r.nom
  }));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Mise \xE0 jour en masse \xB7 ${SITE.name} \u2014 Admin`, "description": "Importateur de catalogue de produits via CSV avec synchronisation diff\xE9rentielle.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "produits", "subtitle": "Importateur de catalogue" })} <main class="container-mo py-8 md:py-12"> <section class="mb-8"> <span class="eyebrow">Produits</span> <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3"> <h1 class="display-sm leading-tight">
Importation & synchronisation
</h1> <p class="text-[13px] text-neutral-500 max-w-md md:text-right">
Mettez à jour le catalogue de produits à partir d'un fichier CSV. L'analyse différentielle permet d'identifier les ajouts, modifications et produits identiques avant d'appliquer les changements.
</p> </div> </section> ${errorMsg ? renderTemplate`<div class="bg-rouge/5 border border-rouge/30 text-rouge rounded-3xl p-6 md:p-8 space-y-4"> <p class="font-bold text-[15px]">⚠ Supabase indisponible</p> <p class="text-[14px] leading-relaxed whitespace-pre-line">${errorMsg}</p> </div>` : renderTemplate`${renderComponent($$result2, "CSVImporter", CSVImporter, { "client:load": true, "rayonsOptions": rayonsOptions, "client:component-hydration": "load", "client:component-path": "@components/islands/admin/CSVImporter.jsx", "client:component-export": "default" })}`} </main> </div> ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/import-produits.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/import-produits.astro";
const $$url = "/admin/import-produits";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImportProduits,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
