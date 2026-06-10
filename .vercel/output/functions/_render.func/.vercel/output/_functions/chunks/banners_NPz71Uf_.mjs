const BANNERS = [
  /* ------------------------- Cultures ------------------------- */
  {
    slug: "creole",
    label: "Créole",
    kind: "culture",
    image: "/images/banners/creole.jpg",
    tagline: "Antilles & Caraïbes — le soleil dans l'assiette",
    rayonScope: ["saveurs-afrique"],
    palette: {
      from: "#E8C390",
      to: "#7FBED4",
      accent: "#1C6B35",
      text: "light"
    }
  },
  {
    slug: "asie",
    label: "Asie",
    kind: "culture",
    image: "/images/banners/asie.jpg",
    tagline: "Tokyo · Séoul · Bangkok — l'Asie au complet",
    rayonScope: ["saveurs-asie"],
    palette: {
      from: "#F2EDD8",
      to: "#A3B85C",
      accent: "#4F6E1C",
      text: "dark"
    }
  },
  {
    slug: "inde",
    label: "Inde",
    kind: "culture",
    image: "/images/banners/inde.jpg",
    tagline: "Mumbai à Madras — épices royales et currys",
    rayonScope: ["saveurs-asie"],
    crossRefRayons: ["epices-du-monde"],
    palette: {
      from: "#5C1A1F",
      to: "#C09060",
      accent: "#A86B1E",
      text: "light"
    }
  },
  {
    slug: "maghreb",
    label: "Maghreb",
    kind: "culture",
    image: "/images/banners/maghreb.jpg",
    tagline: "Du Sahel à la Méditerranée — l'art des épices",
    rayonScope: ["saveur-mediterranee"],
    crossRefRayons: ["epices-du-monde"],
    palette: {
      from: "#F4A37A",
      to: "#E2735C",
      accent: "#8B2500",
      text: "light"
    }
  },
  {
    slug: "italie",
    label: "Italie",
    kind: "culture",
    image: "/images/banners/italie.jpg",
    tagline: "La Dolce Vita — pâtes, huiles, antipasti",
    rayonScope: ["saveur-mediterranee"],
    palette: {
      from: "#009246",
      to: "#CE2B37",
      accent: "#009246",
      text: "light"
    }
  },
  /* ------------------------- Categories ------------------------- */
  {
    slug: "hygiene",
    label: "Hygiène",
    kind: "category",
    image: "/images/banners/hygiene.jpg",
    tagline: "Soins, savon, entretien — prix discount",
    rayonScope: ["produits-courants"],
    palette: {
      from: "#F5C7C9",
      to: "#FFE8EA",
      accent: "#B85257",
      text: "dark"
    }
  },
  {
    slug: "sauces-soupes",
    label: "Sauces & Soupes",
    kind: "category",
    image: "/images/banners/sauces-soupes.jpg",
    tagline: "Le réconfort du monde — bocaux et briques",
    /* Transversal — surfaced on /rayons index (no rayonScope). */
    rayonScope: [],
    palette: {
      from: "#F4C7B5",
      to: "#FFE8DC",
      accent: "#A85710",
      text: "dark"
    }
  },
  {
    slug: "huiles-condiments",
    label: "Huiles & Condiments",
    kind: "category",
    image: "/images/banners/huiles-condiments.jpg",
    tagline: "Olives, vinaigres, harissas, sauces piquantes",
    /* Transversal — surfaced on /rayons index. */
    rayonScope: [],
    palette: {
      from: "#A8D85F",
      to: "#7BC141",
      accent: "#2E8B4A",
      text: "light"
    }
  }
];
function bannersForRayon(rayon) {
  return BANNERS.filter((b) => b.rayonScope.includes(rayon));
}
function crossRefBannersForRayon(rayon) {
  return BANNERS.filter((b) => b.crossRefRayons?.includes(rayon) ?? false);
}

export { BANNERS as B, bannersForRayon as b, crossRefBannersForRayon as c };
