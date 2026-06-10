import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Rejoignez le développement du pôle B2B du Marché de Mo’ — une aventure\nentrepreneuriale en pleine croissance au cœur de l’agglomération toulousaine.</p>";

				const frontmatter = {"titre":"Alternant·e commercial·e B2B","magasin":"toulouse-sud","type_contrat":"Alternance","temps":"Temps plein","resume":"Développement du portefeuille restaurateurs & épiceries. Alternance BAC+2 à BAC+5.","missions":["Prospection et fidélisation de clients professionnels (restaurateurs, épiceries)","Préparation et suivi des commandes B2B","Participation aux négociations fournisseurs","Animation des rayons dédiés professionnels","Reporting et suivi des KPIs commerciaux"],"profil":["Étudiant·e BAC+2 à BAC+5 en commerce, vente ou marketing","Aisance relationnelle et goût du terrain","Sens de l'initiative, autonomie","Maîtrise des outils bureautiques (Excel, CRM)"],"date_publication":"2026-04-15T00:00:00.000Z","actif":true};
				const file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/content/postes/alternant-b2b.md";
				const url = undefined;
				function rawContent() {
					return "\nRejoignez le développement du pôle B2B du Marché de Mo' — une aventure\nentrepreneuriale en pleine croissance au cœur de l'agglomération toulousaine.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
