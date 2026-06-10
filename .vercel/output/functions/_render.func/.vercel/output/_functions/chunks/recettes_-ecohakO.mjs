import { g as getCollection } from './_astro_content_BJyRHHIi.mjs';

function collectionToRecette(entry) {
  return {
    id: entry.slug,
    titre: entry.data.titre,
    resume: entry.data.resume,
    image: entry.data.image,
    tempsMin: entry.data.tempsMin,
    portions: entry.data.portions,
    difficulte: entry.data.difficulte,
    rayon: entry.data.rayonPrincipal,
    lien: `/recettes/${entry.slug}`
  };
}
async function getAllRecettes() {
  try {
    const entries = await getCollection("recettes", (r) => r.data.actif);
    if (entries.length === 0) return RECETTES_HOME;
    return entries.sort(
      (a, b) => new Date(b.data.date_publication).getTime() - new Date(a.data.date_publication).getTime()
    ).map(collectionToRecette);
  } catch {
    return RECETTES_HOME;
  }
}
async function getRecettesVedettes(limit = 6) {
  try {
    const entries = await getCollection(
      "recettes",
      (r) => r.data.actif && r.data.mise_en_avant
    );
    if (entries.length === 0) return RECETTES_HOME.slice(0, limit);
    return entries.sort(
      (a, b) => new Date(b.data.date_publication).getTime() - new Date(a.data.date_publication).getTime()
    ).slice(0, limit).map(collectionToRecette);
  } catch {
    return RECETTES_HOME.slice(0, limit);
  }
}
async function getRecettesForRayon(rayon, limit = 3) {
  try {
    const entries = await getCollection(
      "recettes",
      (r) => r.data.actif && r.data.rayons.includes(rayon)
    );
    return entries.sort(
      (a, b) => new Date(b.data.date_publication).getTime() - new Date(a.data.date_publication).getTime()
    ).slice(0, limit).map(collectionToRecette);
  } catch {
    return RECETTES_HOME.filter((r) => r.rayon === rayon).slice(0, limit);
  }
}
const RECETTES_HOME = [
  {
    id: "mafe-senegalais",
    titre: "Mafé sénégalais à la pâte d'arachide",
    resume: "Le grand classique de l'Afrique de l'Ouest : mijoté de viande à la sauce arachide, servi sur du riz parfumé.",
    image: "/images/recettes/mafe-senegalais.jpg",
    tempsMin: 90,
    portions: 6,
    difficulte: "Facile",
    rayon: "saveurs-afrique"
  },
  {
    id: "bibimbap-coreen",
    titre: "Bibimbap coréen au kimchi",
    resume: "Bol de riz garni de légumes, viande marinée, kimchi maison et œuf au plat. Sauce gochujang piquante en finition.",
    image: "/images/recettes/bibimbap-coreen.jpg",
    tempsMin: 45,
    portions: 4,
    difficulte: "Moyen",
    rayon: "saveurs-asie"
  },
  {
    id: "tajine-agneau-pruneaux",
    titre: "Tajine d'agneau aux pruneaux",
    resume: "Un tajine sucré-salé emblématique du Maghreb : agneau confit, pruneaux moelleux, amandes grillées et ras el hanout.",
    image: "/images/recettes/tajine-agneau.jpg",
    tempsMin: 120,
    portions: 6,
    difficulte: "Moyen",
    rayon: "saveur-mediterranee"
  }
];

export { getAllRecettes as a, getRecettesVedettes as b, getRecettesForRayon as g };
