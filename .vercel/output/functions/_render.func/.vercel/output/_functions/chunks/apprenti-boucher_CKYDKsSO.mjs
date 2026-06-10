import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Nous accueillons des apprentis en boucherie halal toute l’année, en partenariat\navec les CFA de l’agglomération toulousaine. Formation complète — du désossage\nà la vente directe — dans un environnement familial et engagé.</p>";

				const frontmatter = {"titre":"Apprenti·e boucher·ère","magasin":"toulouse-sud","type_contrat":"Apprentissage","temps":"Temps plein","resume":"Formation en boucherie halal au sein de notre équipe toulousaine. Alternance CFA.","missions":["Apprentissage progressif de la découpe et du travail sur carcasse","Accueil et conseil client","Respect des normes d'hygiène et de traçabilité halal","Participation active au rangement et à la propreté du rayon"],"profil":["Inscrit·e en CAP ou BP Boucherie","Motivé·e et engagé·e","Bon relationnel","Permis B apprécié"],"date_publication":"2026-04-15T00:00:00.000Z","actif":true};
				const file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/content/postes/apprenti-boucher.md";
				const url = undefined;
				function rawContent() {
					return "\nNous accueillons des apprentis en boucherie halal toute l'année, en partenariat\navec les CFA de l'agglomération toulousaine. Formation complète — du désossage\nà la vente directe — dans un environnement familial et engagé.\n";
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
