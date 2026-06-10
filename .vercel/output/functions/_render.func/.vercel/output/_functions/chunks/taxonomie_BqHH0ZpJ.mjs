const TAXONOMIE = {
  "boucherie-halal": {
    "Viandes": ["Agneau", "Bœuf", "Veau", "Mouton"],
    "Volailles": ["Poulet", "Dinde", "Canard"],
    "Charcuterie halal": ["Merguez", "Saucisses", "Pastrami"],
    "Préparations": ["Brochettes", "Hachis", "Marinades"]
  },
  "fruits-legumes": {
    "Fruits": ["Exotiques", "De saison", "Agrumes", "Rouges", "Bio"],
    "Légumes": ["Frais", "Feuilles", "Racines", "Bio"],
    "Tubercules": ["Manioc", "Igname", "Patates douces"],
    "Aromates & herbes": null,
    "Dattes & fruits secs": ["Dattes", "Figues", "Abricots secs"]
  },
  "epices-du-monde": {
    "Maghreb": ["Mélanges", "Simples"],
    "Inde": ["Currys", "Masalas", "Simples"],
    "Afrique de l'Ouest": null,
    "Asie": null,
    "Méditerranée": null,
    "Piments": null
  },
  "saveurs-afrique": {
    "Sauces & condiments": null,
    "Féculents & farines": ["Attiéké", "Mil", "Manioc", "Riz"],
    "Huiles": null,
    "Épicerie": ["Bouillons", "Poudres", "Boissons"]
  },
  "saveurs-asie": {
    "Riz & nouilles": ["Riz", "Nouilles", "Vermicelles"],
    "Sauces & condiments": ["Soja", "Piments", "Pâtes"],
    "Épicerie": ["Laits végétaux", "Thés", "Épicerie sèche"],
    "Frais": ["Tofu", "Kimchi", "Pickles"]
  },
  "saveur-mediterranee": {
    "Huiles & vinaigres": null,
    "Olives & tapenades": null,
    "Fromages": ["AOP", "Saumure", "Frais"],
    "Semoules & couscous": null,
    "Harissas & condiments": null
  },
  "saveur-sud-amer": {
    "Céréales & graines": ["Quinoa", "Maïs", "Amarante", "Blé"],
    "Légumineuses": ["Haricots", "Pois", "Lentilles"],
    "Farines": null,
    "Épicerie": null
  },
  "balkans-turques": {
    "Boissons": ["Ayran", "Thés"],
    "Fromages": ["Halloumi", "Feta", "Kashar"],
    "Fruits secs & noix": ["Pistaches", "Noisettes", "Noix"],
    "Pâtisseries": ["Baklava", "Loukoums", "Halva"],
    "Épicerie balkanique": null
  },
  "produits-courants": {
    "Épicerie salée": null,
    "Épicerie sucrée": null,
    "Boissons": null,
    "Hygiène & entretien": null
  },
  "surgeles": {
    "Apéritifs": ["Samoussas", "Nems", "Bouchées"],
    "Plats préparés halal": null,
    "Légumes": null,
    "Poissons": null,
    "Desserts": null
  },
  "boulangerie": {
    "Pains du monde": ["Pain traditionnel", "Pains plats", "Wraps"],
    "Viennoiseries": null,
    "Pâtisseries orientales": null
  },
  "produits-laitiers": {
    "Laits & yaourts": null,
    "Fromages du monde": ["AOP", "Frais", "À pâte dure"],
    "Beurres & crèmes": null,
    "Œufs": null
  }
};
function slugifyCat(label) {
  return label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[&']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function getCategories(rayon) {
  const tree = TAXONOMIE[rayon];
  if (!tree) return null;
  return Object.keys(tree).map((label) => ({
    label,
    slug: slugifyCat(label),
    hasChildren: Array.isArray(tree[label]) && tree[label].length > 0
  }));
}
function getSousCategories(rayon, categorieSlug) {
  const tree = TAXONOMIE[rayon];
  if (!tree) return null;
  const catLabel = Object.keys(tree).find((l) => slugifyCat(l) === categorieSlug);
  if (!catLabel) return null;
  const subs = tree[catLabel];
  if (!subs || subs.length === 0) return null;
  return subs.map((label) => ({ label, slug: slugifyCat(label) }));
}
function categorieLabelFromSlug(rayon, categorieSlug) {
  const tree = TAXONOMIE[rayon];
  if (!tree) return null;
  return Object.keys(tree).find((l) => slugifyCat(l) === categorieSlug) ?? null;
}
function sousCategorieLabelFromSlug(rayon, categorieSlug, sousCategorieSlug) {
  const subs = getSousCategories(rayon, categorieSlug);
  if (!subs) return null;
  return subs.find((s) => s.slug === sousCategorieSlug)?.label ?? null;
}
function getDrillDownPaths(rayon) {
  const tree = TAXONOMIE[rayon];
  if (!tree) return [];
  const paths = [];
  Object.entries(tree).forEach(([catLabel, subs]) => {
    const catSlug = slugifyCat(catLabel);
    paths.push({ cat: catSlug });
    if (subs && subs.length) {
      subs.forEach((subLabel) => {
        paths.push({ cat: catSlug, sub: slugifyCat(subLabel) });
      });
    }
  });
  return paths;
}

export { TAXONOMIE as T, slugifyCat as a, getSousCategories as b, categorieLabelFromSlug as c, getDrillDownPaths as d, getCategories as g, sousCategorieLabelFromSlug as s };
