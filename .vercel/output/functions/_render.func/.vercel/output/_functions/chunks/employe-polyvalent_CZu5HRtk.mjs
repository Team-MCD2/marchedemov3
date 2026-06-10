import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Pas de diplôme ? Pas d’expérience ? Ce n’est pas un problème. 90% de notre équipe\nn’avait pas d’emploi avant d’intégrer le Marché de Mo’ — et ils sont aujourd’hui\nnos meilleurs atouts.</p>\n<h2 id=\"notre-promesse\">Notre promesse</h2>\n<ul>\n<li><strong>Formation sur le terrain</strong> par nos chefs de rayon</li>\n<li><strong>Égalité des chances</strong> — nous recrutons entre 19 et 56 ans</li>\n<li><strong>Évolution possible</strong> vers chef de rayon, responsable caisse, alternant B2B</li>\n<li><strong>Accompagnement</strong> en cas de difficultés personnelles</li>\n</ul>\n<h2 id=\"pour-postuler\">Pour postuler</h2>\n<p>Envoyez votre CV ou appelez-nous directement au <strong>05 82 95 82 52</strong>. Nous\nRejoignez-nous tous les mercredis après-midi à Toulouse Sud Cépière sans rendez-vous.</p>";

				const frontmatter = {"titre":"Employé·e polyvalent·e","magasin":"toulouse-sud","type_contrat":"CDI","temps":"Temps plein","resume":"Mise en rayon, accueil client, caisse. Avec ou sans expérience — formation assurée.","missions":["Mise en rayon, réception marchandises, rotation des stocks","Accueil et conseil client","Passage en caisse","Propreté et merchandising du magasin","Participation à la vie collective du magasin"],"profil":["Aucun diplôme ni expérience requis — formation assurée","Motivation, ponctualité, esprit d'équipe","Sens du service client","Capacité à travailler en station debout"],"date_publication":"2026-04-15T00:00:00.000Z","actif":true};
				const file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/content/postes/employe-polyvalent.md";
				const url = undefined;
				function rawContent() {
					return "\nPas de diplôme ? Pas d'expérience ? Ce n'est pas un problème. 90% de notre équipe\nn'avait pas d'emploi avant d'intégrer le Marché de Mo' — et ils sont aujourd'hui\nnos meilleurs atouts.\n\n## Notre promesse\n\n- **Formation sur le terrain** par nos chefs de rayon\n- **Égalité des chances** — nous recrutons entre 19 et 56 ans\n- **Évolution possible** vers chef de rayon, responsable caisse, alternant B2B\n- **Accompagnement** en cas de difficultés personnelles\n\n## Pour postuler\n\nEnvoyez votre CV ou appelez-nous directement au **05 82 95 82 52**. Nous\nRejoignez-nous tous les mercredis après-midi à Toulouse Sud Cépière sans rendez-vous.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"notre-promesse","text":"Notre promesse"},{"depth":2,"slug":"pour-postuler","text":"Pour postuler"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
