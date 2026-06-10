import { d as createAstro, c as createComponent, e as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BrmqTQSx.mjs';
import { $ as $$AdminTopbar } from '../../chunks/AdminTopbar_C-Ia9XuP.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { s as subscribeAdminEvents, A as ADMIN_EVENT } from '../../chunks/admin-bus_D3U38ckw.mjs';
import { S as SITE } from '../../chunks/site_dG8pplQb.mjs';
import { i as isAuthenticated } from '../../chunks/auth_YbJ1phUF.mjs';
import '../../chunks/supabase_DGRgIA0P.mjs';
/* empty css                                                 */
export { renderers } from '../../renderers.mjs';

const RAYONS_NAMES = {
  "boucherie-halal": "Boucherie Halal",
  "fruits-legumes": "Fruits & Légumes",
  "epices-du-monde": "Épices du Monde",
  "saveurs-afrique": "Saveurs d'Afrique",
  "saveurs-asie": "Saveurs d'Asie",
  "saveur-mediterranee": "Saveur Méditerranée",
  "saveur-sud-amer": "Saveur Sud Amér.",
  "balkans-turques": "Balkans & Turques",
  "produits-courants": "Produits Courants",
  "surgeles": "Surgelés",
  "boulangerie": "Boulangerie",
  "produits-laitiers": "Produits Laitiers"
};
const STORAGE_KEY = "marchedemo_affiche_draft_v1";
const POSTER_PX_WIDTH = 297 * 96 / 25.4;
const THEMES = {
  default: {
    id: "default",
    name: "Standard",
    category: "default",
    colors: {
      primary: "#1C6B35",
      secondary: "#0f4c21",
      accent: "#8B1919",
      gold: "#FACC15"
    },
    icon: null
  },
  spring: {
    id: "spring",
    name: "Printemps",
    category: "seasonal",
    colors: {
      primary: "#7CB342",
      secondary: "#558B2F",
      accent: "#FF7043",
      gold: "#FFD54F"
    },
    icon: "🌸"
  },
  summer: {
    id: "summer",
    name: "Été",
    category: "seasonal",
    colors: {
      primary: "#FF9800",
      secondary: "#F57C00",
      accent: "#E91E63",
      gold: "#FFEB3B"
    },
    icon: "☀️"
  },
  autumn: {
    id: "autumn",
    name: "Automne",
    category: "seasonal",
    colors: {
      primary: "#D84315",
      secondary: "#BF360C",
      accent: "#FF6F00",
      gold: "#FFCA28"
    },
    icon: "🍂"
  },
  winter: {
    id: "winter",
    name: "Hiver",
    category: "seasonal",
    colors: {
      primary: "#1976D2",
      secondary: "#0D47A1",
      accent: "#E53935",
      gold: "#90CAF9"
    },
    icon: "❄️"
  },
  ramadan: {
    id: "ramadan",
    name: "Ramadan",
    category: "cultural",
    colors: {
      primary: "#1C6B35",
      secondary: "#0f4c21",
      accent: "#C6A700",
      gold: "#FFD700"
    },
    icon: "🌙"
  },
  christmas: {
    id: "christmas",
    name: "Noël",
    category: "cultural",
    colors: {
      primary: "#C62828",
      secondary: "#8E0000",
      accent: "#2E7D32",
      gold: "#FFD700"
    },
    icon: "🎄"
  },
  easter: {
    id: "easter",
    name: "Pâques",
    category: "cultural",
    colors: {
      primary: "#9C27B0",
      secondary: "#7B1FA2",
      accent: "#FFEB3B",
      gold: "#E1BEE7"
    },
    icon: "🐰"
  }
};
function AfficheGenerator({ initialProduits = [], initialPromos = [], initialArticles = [] }) {
  const [liveProduits, setLiveProduits] = useState(initialProduits);
  const [livePromos, setLivePromos] = useState(initialPromos);
  const [liveArticles, setLiveArticles] = useState(initialArticles);
  const [name, setName] = useState("Nom du Produit");
  const [eyebrow, setEyebrow] = useState("Nouveauté");
  const [pitch, setPitch] = useState("Sélectionné avec soin pour sa qualité supérieure.");
  const [rayon, setRayon] = useState("fruits-legumes");
  const [format, setFormat] = useState("Le kg");
  const [origine, setOrigine] = useState("France");
  const [marque, setMarque] = useState("");
  const [price, setPrice] = useState("3.99");
  const [oldPrice, setOldPrice] = useState("5.99");
  const [promo, setPromo] = useState(false);
  const [expo, setExpo] = useState(false);
  const [productUrl, setProductUrl] = useState("https://www.marchedemo.com");
  const [qrUrlGenerated, setQrUrlGenerated] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedChip, setSelectedChip] = useState(null);
  const [scale, setScale] = useState(0.5);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const previewWrapRef = useRef(null);
  useEffect(() => {
    return subscribeAdminEvents(
      [
        ADMIN_EVENT.PRODUITS_UPDATED,
        ADMIN_EVENT.PROMOS_UPDATED,
        ADMIN_EVENT.ACTUS_UPDATED
      ],
      async (event) => {
        if (event.type === ADMIN_EVENT.PRODUITS_UPDATED) {
          try {
            const res = await fetch("/api/admin/produits");
            if (res.ok) {
              const data = await res.json();
              setLiveProduits(data.produits || []);
            }
          } catch (err) {
            console.warn("[affiche-gen-sync] failed to refresh products", err);
          }
        } else if (event.type === ADMIN_EVENT.PROMOS_UPDATED) {
          try {
            const res = await fetch("/api/admin/promos");
            if (res.ok) {
              const data = await res.json();
              setLivePromos(data.promos || []);
            }
          } catch (err) {
            console.warn("[affiche-gen-sync] failed to refresh promos", err);
          }
        } else if (event.type === ADMIN_EVENT.ACTUS_UPDATED) {
          try {
            const res = await fetch("/api/admin/actus");
            if (res.ok) {
              const data = await res.json();
              setLiveArticles(data.actus || data.articles || []);
            }
          } catch (err) {
            console.warn("[affiche-gen-sync] failed to refresh actus", err);
          }
        }
      }
    );
  }, []);
  const allSearchableItems = React.useMemo(() => {
    const list = [];
    livePromos.forEach((p) => {
      list.push({
        id: `promo-${p.slug}`,
        slug: p.slug,
        title: p.titre,
        type: "promo",
        price: p.prix_promo,
        oldPrice: p.prix_original,
        description: p.description || "",
        rayon: p.rayon,
        sourceLabel: "Promotion active V2",
        image: p.image_url
      });
    });
    liveProduits.forEach((p) => {
      list.push({
        id: `prod-${p.slug}`,
        slug: p.slug,
        title: p.nom,
        type: "product",
        price: p.prix_indicatif || "",
        oldPrice: "",
        description: p.description || "",
        rayon: p.rayon,
        origine: p.origine || "",
        badge: p.badge || "",
        sourceLabel: "Catalogue vitrine V2",
        image: p.image_url
      });
    });
    liveArticles.forEach((a) => {
      list.push({
        id: `art-${a.slug}`,
        slug: a.slug,
        title: a.nom,
        type: "inventory",
        price: a.prix_vente || "",
        oldPrice: "",
        description: a.description || "",
        rayon: a.rayon,
        origine: a.origine || "",
        badge: a.badge || "",
        // badge represents marque/brand in bridge
        format: a.format || "",
        sourceLabel: "Inventaire ponté",
        image: a.image
      });
    });
    return list;
  }, [liveProduits, livePromos, liveArticles]);
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    const filtered = allSearchableItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q) || item.rayon && item.rayon.toLowerCase().includes(q)
    ).slice(0, 8);
    setSearchResults(filtered);
  }, [searchQuery, allSearchableItems]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.name) setName(d.name);
        if (d.eyebrow) setEyebrow(d.eyebrow);
        if (d.pitch) setPitch(d.pitch);
        if (d.rayon) setRayon(d.rayon);
        if (d.format) setFormat(d.format);
        if (d.origine) setOrigine(d.origine);
        if (d.marque) setMarque(d.marque);
        if (d.price) setPrice(d.price);
        if (d.oldPrice) setOldPrice(d.oldPrice);
        if (d.promo !== void 0) setPromo(d.promo);
        if (d.expo !== void 0) setExpo(d.expo);
        if (d.productUrl) setProductUrl(d.productUrl);
        if (d.qrUrlGenerated) setQrUrlGenerated(d.qrUrlGenerated);
        if (d.selectedChip) setSelectedChip(d.selectedChip);
        if (d.showImage !== void 0) setShowImage(d.showImage);
        if (d.imageUrl !== void 0) setImageUrl(d.imageUrl);
        if (d.selectedTheme) setSelectedTheme(d.selectedTheme);
      }
    } catch (_) {
    }
  }, []);
  useEffect(() => {
    const state = {
      name,
      eyebrow,
      pitch,
      rayon,
      format,
      origine,
      marque,
      price,
      oldPrice,
      promo,
      expo,
      productUrl,
      qrUrlGenerated,
      selectedChip,
      showImage,
      imageUrl,
      selectedTheme
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
    }
  }, [name, eyebrow, pitch, rayon, format, origine, marque, price, oldPrice, promo, expo, productUrl, qrUrlGenerated, selectedChip, showImage, imageUrl, selectedTheme]);
  useEffect(() => {
    const updateScale = () => {
      if (!previewWrapRef.current) return;
      const wrapW = previewWrapRef.current.clientWidth;
      if (wrapW) {
        setScale(wrapW / POSTER_PX_WIDTH);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    let observer;
    if ("ResizeObserver" in window && previewWrapRef.current) {
      observer = new ResizeObserver(updateScale);
      observer.observe(previewWrapRef.current);
    }
    return () => {
      window.removeEventListener("resize", updateScale);
      if (observer) observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!qrUrlGenerated || !/^https?:\/\//i.test(qrUrlGenerated)) {
      setQrCodeDataUrl("");
      return;
    }
    QRCode.toDataURL(qrUrlGenerated, {
      width: 600,
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: "#0F0F0F", light: "#ffffff" }
      // Strict black on white QR Code
    }).then((url) => setQrCodeDataUrl(url)).catch((err) => console.warn("[qr] echec", err));
  }, [qrUrlGenerated]);
  const handleSelectItem = (item) => {
    setSelectedChip(item);
    setName(item.title);
    setRayon(item.rayon || "fruits-legumes");
    setPitch(item.description ? item.description.substring(0, 100) : "Produit de qualité supérieure.");
    const formatPriceStr = (val) => {
      if (val === null || val === void 0 || val === "") return "";
      const num = Number(val);
      return isNaN(num) ? "" : num.toString();
    };
    setPrice(formatPriceStr(item.price));
    setOldPrice(formatPriceStr(item.oldPrice));
    if (item.type === "promo") {
      setPromo(true);
      setEyebrow("PROMOTION");
      setProductUrl(`https://www.marchedemo.com/promos`);
      setQrUrlGenerated(`https://www.marchedemo.com/promos`);
    } else {
      setPromo(false);
      setEyebrow(item.type === "inventory" ? "EN STOCK" : "COUP DE COEUR");
      setProductUrl(`https://www.marchedemo.com/produits/${item.slug}`);
      setQrUrlGenerated(`https://www.marchedemo.com/produits/${item.slug}`);
    }
    if (item.origine) setOrigine(item.origine);
    if (item.format) setFormat(item.format);
    if (item.badge) {
      setMarque(item.badge);
    } else {
      setMarque("");
    }
    if (item.image) {
      setImageUrl(item.image);
      setShowImage(true);
    } else {
      setImageUrl("");
      setShowImage(false);
    }
    setSearchQuery("");
    setSearchResults([]);
  };
  const handleReset = () => {
    setName("Nom du Produit");
    setEyebrow("Nouveauté");
    setPitch("Sélectionné avec soin pour sa qualité supérieure.");
    setRayon("fruits-legumes");
    setFormat("Le kg");
    setOrigine("France");
    setMarque("");
    setPrice("3.99");
    setOldPrice("5.99");
    setPromo(false);
    setExpo(false);
    setProductUrl("https://www.marchedemo.com");
    setQrUrlGenerated("");
    setQrCodeDataUrl("");
    setSelectedChip(null);
    setSearchQuery("");
    setImageUrl("");
    setShowImage(false);
    setSelectedTheme("default");
  };
  const handlePrint = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Le nom du produit est obligatoire.");
      return;
    }
    if (!price || isNaN(Number(price))) {
      alert("Le prix est obligatoire et doit être un nombre.");
      return;
    }
    if (productUrl && productUrl !== qrUrlGenerated) {
      setQrUrlGenerated(productUrl);
    }
    setTimeout(() => {
      window.print();
    }, 250);
  };
  const getPriceParts = (val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return { integer: "0", decimal: "" };
    const formatted = num.toFixed(2);
    const [intPart, decPart] = formatted.split(".");
    return {
      integer: intPart,
      decimal: decPart && decPart !== "00" ? `,${decPart}` : ""
    };
  };
  const getDiscountPercent = () => {
    const p = Number(price);
    const op = Number(oldPrice);
    if (!promo || isNaN(p) || isNaN(op) || op <= p) return 0;
    return Math.round((op - p) / op * 100);
  };
  const priceParts = getPriceParts(price);
  const oldPriceParts = getPriceParts(oldPrice);
  const discountPct = getDiscountPercent();
  const priceDigits = priceParts.integer.length + (priceParts.decimal ? 2 : 0);
  let nameLengthClass = "normal";
  if (name.length > 32) {
    nameLengthClass = "xlarge";
  } else if (name.length > 18) {
    nameLengthClass = "long";
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-5 gap-8 items-start", children: [
    /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2 flex flex-col gap-6 no-print", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-[17px] font-bold text-neutral-900 mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5 text-mo-green", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
            /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
            /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
          ] }),
          "Recherche de produit & autofill"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-neutral-500 mb-4 leading-relaxed", children: [
          "Recherchez dans le ",
          /* @__PURE__ */ jsx("strong", { children: "catalogue vitrine" }),
          ", les ",
          /* @__PURE__ */ jsx("strong", { children: "promos actives" }),
          " ou l'",
          /* @__PURE__ */ jsx("strong", { children: "inventaire" }),
          " pour préremplir l'affiche instantanément."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-4 py-3 pl-11 text-[14px] text-neutral-800 focus:outline-none focus:border-mo-green focus:bg-white transition-all",
              placeholder: "Saisissez un nom, un rayon...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-3.5", children: /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 text-neutral-500", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
            /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
            /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
          ] }) }),
          searchQuery && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSearchQuery(""),
              className: "absolute right-4 top-3.5 text-neutral-500 hover:text-neutral-600",
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12" }) })
            }
          )
        ] }),
        searchResults.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-3 border border-neutral-100 rounded-2xl bg-white shadow-xl max-h-72 overflow-y-auto divide-y divide-neutral-50 z-50 relative", children: searchResults.map((item) => /* @__PURE__ */ jsxs(
          "li",
          {
            onClick: () => handleSelectItem(item),
            className: "flex items-center gap-3 p-3.5 cursor-pointer hover:bg-neutral-50 transition-all text-left",
            children: [
              item.image ? /* @__PURE__ */ jsx("img", { src: item.image, className: "w-10 h-10 rounded-lg object-cover bg-neutral-100 flex-shrink-0", alt: "" }) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center flex-shrink-0 font-bold text-[12px]", children: "MO" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsx("strong", { className: "text-[13.5px] font-bold text-neutral-800 truncate block", children: item.title }),
                  /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${item.type === "promo" ? "bg-rouge/10 text-rouge" : item.type === "inventory" ? "bg-mo-green/10 text-mo-green" : "bg-neutral-100 text-neutral-600"}`, children: item.type === "promo" ? "Promo" : item.type === "inventory" ? "Inv" : "Vitrine" })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[11.5px] text-neutral-500 truncate", children: [
                  RAYONS_NAMES[item.rayon] || item.rayon,
                  " ",
                  item.price ? `· ${item.price} €` : "",
                  " ",
                  item.format ? `· ${item.format}` : "",
                  " ",
                  item.origine ? `· ${item.origine}` : ""
                ] })
              ] })
            ]
          },
          item.id
        )) }),
        searchQuery && searchResults.length === 0 && searchQuery.length >= 2 && /* @__PURE__ */ jsx("p", { className: "mt-3 text-[]-neutral-600 text-center italic py-2", children: "Aucun produit trouvé dans les bases locales." }),
        selectedChip && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3 p-3 bg-mo-green/5 border border-mo-green/20 rounded-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-mo-green animate-pulse flex-shrink-0" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[12.5px] text-mo-green-dark font-bold truncate", children: [
              "Lié à : ",
              selectedChip.title,
              " (",
              selectedChip.sourceLabel,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedChip(null),
              className: "text-neutral-500 hover:text-neutral-600 text-[11px] font-bold underline",
              children: "Détacher"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handlePrint, className: "bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-[17px] font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-50 pb-3", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-mo-green", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" }) }),
          "Configuration de l'affiche"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[13px] font-bold text-neutral-700", children: "Thème de l'affiche" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.entries(THEMES).map(([id, theme]) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelectedTheme(id),
              className: `flex items-center gap-2 p-3 border-2 rounded-xl transition-all ${selectedTheme === id ? "border-mo-green bg-mo-green/5 text-mo-green-dark" : "border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-neutral-200"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl", children: theme.icon }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-[13px]", children: theme.name })
              ]
            },
            id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[13px] font-bold text-neutral-700", children: "Chapeau éditorial" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                maxLength: 40,
                className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-neutral-800 focus:outline-none focus:border-mo-green focus:bg-white",
                value: eyebrow,
                onChange: (e) => setEyebrow(e.target.value),
                placeholder: "Ex. Nouveauté, Bio..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[13px] font-bold text-neutral-700", children: "Rayon (icône & en-tête)" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-[13.5px] text-neutral-800 focus:outline-none focus:border-mo-green focus:bg-white",
                value: rayon,
                onChange: (e) => setRayon(e.target.value),
                children: Object.entries(RAYONS_NAMES).map(([slug, name2]) => /* @__PURE__ */ jsx("option", { value: slug, children: name2 }, slug))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-[13px] font-bold text-neutral-700", children: [
            "Nom du produit ",
            /* @__PURE__ */ jsx("span", { className: "text-rouge", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              maxLength: 70,
              className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-neutral-800 focus:outline-none focus:border-mo-green focus:bg-white font-bold",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Ex. Huile de Tournesol 1L"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[12px] font-bold text-neutral-700", children: "Origine" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-[13px] text-neutral-800 focus:outline-none focus:border-mo-green focus:bg-white",
                value: origine,
                onChange: (e) => setOrigine(e.target.value),
                placeholder: "Ex. Maroc"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[12px] font-bold text-neutral-700", children: "Format" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-[13px] text-neutral-800 focus:outline-none focus:border-mo-green focus:bg-white",
                value: format,
                onChange: (e) => setFormat(e.target.value),
                placeholder: "Ex. Le kg, 500g"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[12px] font-bold text-neutral-700", children: "Marque" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-[13px] text-neutral-800 focus:outline-none focus:border-mo-green focus:bg-white",
                value: marque,
                onChange: (e) => setMarque(e.target.value),
                placeholder: "Ex. Yari"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[13px] font-bold text-neutral-700", children: "Mode tarifaire" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setPromo(false),
                className: `flex flex-col items-start p-3 border-2 rounded-2xl transition-all ${!promo ? "border-mo-green bg-mo-green/5 text-mo-green-dark" : "border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-200"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-[13.5px]", children: "Plein tarif" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] opacity-80 mt-1", children: "Fond vert, prix standard" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setPromo(true),
                className: `flex flex-col items-start p-3 border-2 rounded-2xl transition-all ${promo ? "border-rouge bg-rouge/5 text-rouge" : "border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-200"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-[13.5px]", children: "Promotion" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] opacity-80 mt-1", children: "Fond rouge, ruban & prix barré" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[13px] font-bold text-neutral-700", children: [
              promo ? "Prix promotionnel" : "Prix de vente",
              " (€) ",
              /* @__PURE__ */ jsx("span", { className: "text-rouge", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                step: "0.01",
                required: true,
                className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-[14px] text-neutral-800 font-bold focus:outline-none focus:border-mo-green focus:bg-white",
                value: price,
                onChange: (e) => setPrice(e.target.value),
                placeholder: "Ex. 3.99"
              }
            )
          ] }),
          promo && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[13px] font-bold text-neutral-700", children: [
              "Prix d'origine (€) ",
              /* @__PURE__ */ jsx("span", { className: "text-rouge", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                step: "0.01",
                required: promo,
                className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-[14px] text-neutral-800 font-bold focus:outline-none focus:border-mo-green focus:bg-white",
                value: oldPrice,
                onChange: (e) => setOldPrice(e.target.value),
                placeholder: "Ex. 5.99"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[13px] font-bold text-neutral-700", children: "Accroche / Descriptif court" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: 2,
              maxLength: 120,
              className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-neutral-800 focus:outline-none focus:border-mo-green focus:bg-white resize-none",
              value: pitch,
              onChange: (e) => setPitch(e.target.value),
              placeholder: "Ex. Arrivage direct, idéal pour préparer vos recettes d'été."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-neutral-50/50 border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: "f-show-image", className: "text-[13px] font-bold text-neutral-700 cursor-pointer flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "f-show-image",
                  type: "checkbox",
                  className: "w-4 h-4 accent-mo-green rounded",
                  checked: showImage,
                  onChange: (e) => setShowImage(e.target.checked)
                }
              ),
              "Afficher l'image du produit"
            ] }),
            imageUrl && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setImageUrl(""),
                className: "text-neutral-500 hover:text-rouge text-[11px] font-bold",
                children: "Effacer"
              }
            )
          ] }),
          showImage && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 mt-1", children: [
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-[12.5px] text-neutral-800 focus:outline-none focus:border-mo-green",
                value: imageUrl,
                onChange: (e) => setImageUrl(e.target.value),
                placeholder: "URL de l'image (Supabase, external...)"
              }
            ) }),
            /* @__PURE__ */ jsx("span", { className: "text-[]-neutral-600 leading-normal", children: "💡 *Privilégiez les formats transparents (PNG détouré) ou sur fond blanc pur pour économiser l'encre.*" }),
            imageUrl && /* @__PURE__ */ jsx("div", { className: "mt-2 w-16 h-16 rounded-xl border border-neutral-200 bg-white p-1 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: imageUrl, className: "max-w-full max-h-full object-contain rounded", alt: "Preview" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border border-neutral-200 rounded-xl p-3 bg-neutral-50", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "f-expo",
                type: "checkbox",
                className: "w-4 h-4 accent-mo-green",
                checked: expo,
                onChange: (e) => setExpo(e.target.checked)
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "f-expo", className: "text-[12.5px] text-neutral-700 cursor-pointer font-bold", children: "Modèle d'exposition" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-[12px] text-neutral-800 focus:outline-none focus:border-mo-green",
                value: productUrl,
                onChange: (e) => setProductUrl(e.target.value),
                placeholder: "Ex. https://marchedemo.com/..."
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[9.5px] text-neutral-500 pl-1 leading-none", children: "URL cible du QR Code" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-3 mt-2 border-t border-neutral-50 pt-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleReset,
              className: "flex-1 border-2 border-neutral-100 hover:border-neutral-200 text-neutral-600 rounded-2xl py-3 text-[14px] font-bold transition-all",
              children: "Réinitialiser"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setQrUrlGenerated(productUrl),
              className: "flex-1 bg-mo-green/10 text-mo-green hover:bg-mo-green/20 rounded-2xl py-3 text-[14px] font-bold transition-all flex items-center justify-center gap-1.5",
              children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                  /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
                  /* @__PURE__ */ jsx("rect", { x: "7", y: "7", width: "3", height: "3" }),
                  /* @__PURE__ */ jsx("rect", { x: "14", y: "7", width: "3", height: "3" }),
                  /* @__PURE__ */ jsx("rect", { x: "7", y: "14", width: "3", height: "3" }),
                  /* @__PURE__ */ jsx("path", { d: "M14 14h3v3h-3z" })
                ] }),
                "Générer QR"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              className: `flex-1 text-white rounded-2xl py-3 text-[14px] font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${promo ? "bg-rouge hover:bg-rouge/95 shadow-rouge/10" : "bg-mo-green hover:bg-mo-green/95 shadow-mo-green/10"}`,
              children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                  /* @__PURE__ */ jsx("path", { d: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }),
                  /* @__PURE__ */ jsx("path", { d: "M6 14h12v8H6z" })
                ] }),
                "Imprimer"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "xl:col-span-3 flex flex-col gap-4 sticky top-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between no-print px-1", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-[17px] font-bold text-neutral-900 flex items-center gap-2", children: [
          "Aperçu A4 Paysage",
          /* @__PURE__ */ jsxs("span", { className: "text-[]-neutral-600", children: [
            "(",
            Math.round(scale * 100),
            "%)"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowHelp(!showHelp),
            className: "text-[13px] font-bold text-mo-green hover:text-mo-green-dark flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("path", { d: "M12 16v-4M12 8h.01" })
              ] }),
              "Guide d'impression"
            ]
          }
        )
      ] }),
      showHelp && /* @__PURE__ */ jsxs("div", { className: "bg-mo-green/5 border border-mo-green/20 rounded-2xl p-4 text-[12.5px] text-mo-green-dark leading-relaxed no-print", children: [
        /* @__PURE__ */ jsx("strong", { className: "block mb-1 text-[13.5px]", children: "💡 Astuces pour une impression parfaite :" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            "Cliquez sur ",
            /* @__PURE__ */ jsx("strong", { children: '"Générer QR"' }),
            " si vous souhaitez faire apparaître le QR Code de redirection."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            "Dans la boîte de dialogue d'impression, réglez la mise en page sur ",
            /* @__PURE__ */ jsx("strong", { children: "Paysage (Landscape)" }),
            "."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            "Définissez les marges sur ",
            /* @__PURE__ */ jsx("strong", { children: '"Aucune" (None)' }),
            " pour laisser l'affiche occuper tout l'espace A4."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            "Cochez la case ",
            /* @__PURE__ */ jsx("strong", { children: `"Graphiques d'arrière-plan" (Background graphics)` }),
            " pour imprimer les fonds vert et rouge."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: previewWrapRef, className: "mo-preview-wrap", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "mo-poster",
          "data-promo": promo ? "true" : "false",
          "data-has-image": showImage && !!imageUrl ? "true" : "false",
          "data-theme": selectedTheme,
          style: {
            transform: `scale(${scale})`,
            "--theme-primary": THEMES[selectedTheme].colors.primary,
            "--theme-secondary": THEMES[selectedTheme].colors.secondary,
            "--theme-accent": THEMES[selectedTheme].colors.accent,
            "--theme-gold": THEMES[selectedTheme].colors.gold
          },
          children: [
            /* @__PURE__ */ jsxs("header", { className: "mo-poster__top", children: [
              /* @__PURE__ */ jsxs("div", { className: "mo-poster__brand", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/logos/logo-marchedemo-rec-contourwh.png",
                    className: "mo-poster__brand-logo",
                    alt: "Logo Marché de Mo'"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "mo-poster__brand-text", children: [
                  /* @__PURE__ */ jsx("span", { className: "mo-poster__brand-name", children: "MARCHÉ DE MO'" }),
                  /* @__PURE__ */ jsx("span", { className: "mo-poster__brand-city", children: "Toulouse · Vos supermarchés du monde" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "mo-poster__top-badge", children: RAYONS_NAMES[rayon] || "Épicerie" })
            ] }),
            /* @__PURE__ */ jsxs("main", { className: "mo-poster__main", children: [
              /* @__PURE__ */ jsxs("div", { className: "mo-poster__content", "data-has-image": showImage && !!imageUrl ? "true" : "false", children: [
                showImage && imageUrl ? /* @__PURE__ */ jsxs("div", { className: "mo-poster__content-body-grid", children: [
                  /* @__PURE__ */ jsx("div", { className: "mo-poster__content-text-side", children: /* @__PURE__ */ jsxs("div", { className: "mo-poster__content-top", children: [
                    eyebrow && /* @__PURE__ */ jsx("span", { className: "mo-poster__eyebrow", children: eyebrow }),
                    /* @__PURE__ */ jsx("h1", { className: "mo-poster__name", "data-length": nameLengthClass, children: name || "Nom du Produit" }),
                    /* @__PURE__ */ jsxs("div", { className: "mo-poster__meta", children: [
                      marque && /* @__PURE__ */ jsxs("span", { className: "mo-poster__meta-item", children: [
                        "Marque : ",
                        /* @__PURE__ */ jsx("strong", { children: marque })
                      ] }),
                      origine && /* @__PURE__ */ jsxs("span", { className: "mo-poster__meta-item", children: [
                        "Origine : ",
                        /* @__PURE__ */ jsx("strong", { children: origine })
                      ] }),
                      format && /* @__PURE__ */ jsxs("span", { className: "mo-poster__meta-item", children: [
                        "Format : ",
                        /* @__PURE__ */ jsx("strong", { children: format })
                      ] })
                    ] }),
                    pitch && /* @__PURE__ */ jsx("p", { className: "mo-poster__pitch", children: pitch })
                  ] }) }),
                  /* @__PURE__ */ jsx("div", { className: "mo-poster__content-image-side", children: /* @__PURE__ */ jsx("div", { className: "mo-poster__image-frame", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imageUrl,
                      className: "mo-poster__product-image",
                      crossOrigin: "anonymous",
                      alt: name
                    }
                  ) }) })
                ] }) : /* @__PURE__ */ jsxs("div", { className: "mo-poster__content-top", children: [
                  eyebrow && /* @__PURE__ */ jsx("span", { className: "mo-poster__eyebrow", children: eyebrow }),
                  /* @__PURE__ */ jsx("h1", { className: "mo-poster__name", "data-length": nameLengthClass, children: name || "Nom du Produit" }),
                  /* @__PURE__ */ jsxs("div", { className: "mo-poster__meta", children: [
                    marque && /* @__PURE__ */ jsxs("span", { className: "mo-poster__meta-item", children: [
                      "Marque : ",
                      /* @__PURE__ */ jsx("strong", { children: marque })
                    ] }),
                    origine && /* @__PURE__ */ jsxs("span", { className: "mo-poster__meta-item", children: [
                      "Origine : ",
                      /* @__PURE__ */ jsx("strong", { children: origine })
                    ] }),
                    format && /* @__PURE__ */ jsxs("span", { className: "mo-poster__meta-item", children: [
                      "Format : ",
                      /* @__PURE__ */ jsx("strong", { children: format })
                    ] })
                  ] }),
                  pitch && /* @__PURE__ */ jsx("p", { className: "mo-poster__pitch", children: pitch })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mo-poster__qr", children: [
                  /* @__PURE__ */ jsx("div", { className: "mo-poster__qr-code", children: qrCodeDataUrl && /* @__PURE__ */ jsx("img", { src: qrCodeDataUrl, alt: "QR Code produit" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mo-poster__qr-label", children: [
                    /* @__PURE__ */ jsx("strong", { children: "Scanner pour plus d'infos" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Recettes, allergènes et avis sur ",
                      /* @__PURE__ */ jsx("strong", { children: "marchedemo.com" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mo-poster__price-block", "data-digits": priceDigits, children: [
                /* @__PURE__ */ jsxs("div", { className: "mo-poster__old", children: [
                  /* @__PURE__ */ jsx("span", { children: oldPriceParts.integer }),
                  oldPriceParts.decimal && /* @__PURE__ */ jsx("span", { className: "mo-poster__old-currency", children: oldPriceParts.decimal }),
                  /* @__PURE__ */ jsx("span", { className: "mo-poster__old-currency", children: "€" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mo-poster__price", "data-digits": priceDigits, children: [
                  /* @__PURE__ */ jsx("span", { className: "mo-poster__price-integer", children: priceParts.integer }),
                  priceParts.decimal && /* @__PURE__ */ jsx("span", { className: "mo-poster__price-decimal", children: priceParts.decimal }),
                  /* @__PURE__ */ jsx("span", { className: "mo-poster__price-currency", children: "€" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mo-poster__price-label", children: format ? format : "La Pièce" }),
                /* @__PURE__ */ jsx("div", { className: "mo-poster__promo-ribbon", children: "PROMO" }),
                discountPct > 0 && /* @__PURE__ */ jsxs("div", { className: "mo-poster__discount", children: [
                  "-",
                  discountPct,
                  "%"
                ] }),
                expo && /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 bg-white text-mo-green-dark border-2 border-mo-gold rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase z-20 shadow-md", children: "EXPO" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("footer", { className: "mo-poster__bottom", children: [
              /* @__PURE__ */ jsxs("div", { className: "mo-poster__bottom-left", children: [
                "Votre magasin : ",
                /* @__PURE__ */ jsx("strong", { children: "Toulouse Cépière (Hippodrome)" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mo-poster__bottom-right", children: "Le plein de saveurs du monde" })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-neutral-500 italic text-center no-print leading-relaxed", children: "L'aperçu reflète fidèlement l'impression physique en A4 Paysage (297 × 210 mm)." })
    ] })
  ] });
}

const $$Astro = createAstro("https://marchedemov2.vercel.app");
const prerender = false;
const $$GenerateurAffiche = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GenerateurAffiche;
  if (!await isAuthenticated(Astro2.cookies)) {
    return Astro2.redirect("/admin/login");
  }
  let initialProduits = [];
  let initialPromos = [];
  let initialArticles = [];
  let errorMsg = null;
  {
    errorMsg = "SUPABASE_SERVICE_ROLE_KEY non configur\xE9e dans V2.";
  }
  {
    console.info("Pont d'inventaire non disponible ou non configur\xE9 pour le g\xE9n\xE9rateur d'affiches.");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `G\xE9n\xE9rateur d'affiches \xB7 ${SITE.name} \u2014 Admin`, "description": "G\xE9n\xE9rateur d'affiches A4 paysage et \xE9tiquettes pour les produits et promotions du March\xE9 de Mo'.", "noIndex": true, "hideChrome": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white"> ${renderComponent($$result2, "AdminTopbar", $$AdminTopbar, { "current": "affiches" })} <main class="container-mo py-8 md:py-12">  <section class="mb-8 no-print"> <span class="eyebrow">Marketing</span> <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3"> <div> <h1 class="display-sm leading-tight font-black text-neutral-900">
Générateur d'affiches A4
</h1> <p class="text-[14px] text-neutral-500 mt-1.5">
Concevez et imprimez de magnifiques étiquettes de rayon et affiches promotionnelles A4 aux couleurs du Marché de Mo'.
</p> </div> <div class="text-[13px] text-neutral-500 max-w-sm md:text-right">
Impression physique directe via le raccourci navigateur <kbd class="bg-neutral-50 border border-neutral-100 rounded px-1 text-[11px] font-bold text-neutral-600">Ctrl + P</kbd>.
</div> </div> </section> ${errorMsg && renderTemplate`<div class="bg-rouge/5 border border-rouge/30 text-rouge rounded-3xl p-6 mb-6 no-print"> <p class="font-bold text-[15px]">⚠ Supabase indisponible</p> <p class="text-[14px] mt-2 whitespace-pre-line">${errorMsg}</p> </div>`}  ${renderComponent($$result2, "AfficheGenerator", AfficheGenerator, { "client:load": true, "initialProduits": initialProduits, "initialPromos": initialPromos, "initialArticles": initialArticles, "client:component-hydration": "load", "client:component-path": "@components/islands/admin/AfficheGenerator.jsx", "client:component-export": "default" })} </main> </div> ` })}`;
}, "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/generateur-affiche.astro", void 0);

const $$file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/pages/admin/generateur-affiche.astro";
const $$url = "/admin/generateur-affiche";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$GenerateurAffiche,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
