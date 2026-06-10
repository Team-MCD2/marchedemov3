const FAQ_HOME = [
  {
    q: "Qu'est-ce que Marché de Mo' ?",
    r: "Le plus grand supermarché ethnique d'Occitanie. 20 000+ références, boucherie halal, fruits et légumes exotiques, épices du monde, saveurs d'Afrique, d'Asie, de Méditerranée et bien plus. Ouvert 7j/7 à Toulouse."
  },
  {
    q: "Où se trouve le magasin Marché de Mo' ?",
    r: "Notre magasin se trouve à Toulouse Sud Cépière (5 rue Joachim du Bellay, sortie 27)."
  },
  {
    q: "Le magasin est-il ouvert le dimanche ?",
    r: "Oui, notre magasin est ouvert 7 jours sur 7 dont le dimanche de 8h30 à 13h."
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    r: "Visa, Mastercard, Maestro, American Express, Apple Pay, Google Pay, PayPal et Tickets Restaurant."
  },
  {
    q: "Peut-on s'inscrire à un programme de fidélité ?",
    r: "Oui, Marché de Mo' propose un programme de fidélité avec des offres exclusives. Voir la page Programme de fidélité pour s'inscrire."
  }
];
const FAQ_BOUCHERIE = [
  {
    q: "La boucherie est-elle certifiée halal ?",
    r: "Oui. Toutes nos viandes sont halal certifiées, abattues sans électronarcose."
  },
  {
    q: "La viande est-elle fraîche quotidiennement ?",
    r: "Oui, arrivage quotidien. Nous travaillons directement les carcasses."
  },
  {
    q: "Où trouver de la viande halal à Toulouse ?",
    r: "Marché de Mo' propose la boucherie halal la plus complète de Toulouse, dans notre magasin de Toulouse Sud Cépière."
  },
  {
    q: "Vendez-vous de l'agneau halal sans électronarcose ?",
    r: "Oui, l'intégralité de nos viandes est certifiée halal et abattue selon les préceptes islamiques, sans électronarcose."
  }
];
const FAQ_RAYONS_GENERAL = [
  {
    q: "Combien de références propose Marché de Mo' ?",
    r: "Plus de 20 000 références sur 12 rayons thématiques."
  },
  {
    q: "Trouve-t-on des produits exotiques rares ?",
    r: "Oui, 120+ références exotiques en fruits et légumes et une épicerie ethnique complète pour les cuisines africaine, asiatique, créole et méditerranéenne."
  },
  {
    q: "Proposez-vous des produits pour les cuisines africaines et créoles ?",
    r: "Oui, notre rayon Saveurs d'Afrique & Créole propose plats cuisinés, conserves, condiments et boissons introuvables ailleurs à Toulouse."
  }
];
const FAQ_RECRUTEMENT = [
  {
    q: "Qui peut postuler chez Marché de Mo' ?",
    r: "Tout le monde. Nous recrutons avec ou sans diplôme, avec ou sans expérience. 90% de notre équipe actuelle n'avait pas d'emploi avant de rejoindre le Marché de Mo'."
  },
  {
    q: "Quel âge pour travailler chez vous ?",
    r: "Notre équipe actuelle a entre 19 et 56 ans. Nous croyons fondamentalement à la diversité intergénérationnelle."
  },
  {
    q: "Quel type de contrat proposez-vous ?",
    r: "CDI, CDD, apprentissage et alternance. Toutes nos offres ouvertes sont listées sur cette page /recrutement."
  }
];
function faqsForRayon(slug) {
  if (slug === "boucherie-halal") return FAQ_BOUCHERIE.concat(FAQ_RAYONS_GENERAL.slice(0, 1));
  return FAQ_RAYONS_GENERAL;
}

export { FAQ_HOME as F, FAQ_RAYONS_GENERAL as a, FAQ_RECRUTEMENT as b, faqsForRayon as f };
