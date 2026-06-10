import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Rejoignez l’équipe boucherie du Marché de Mo’ — la plus grande boucherie halal de\nl’agglomération toulousaine. Vous travaillerez directement sur carcasse dans un\nenvironnement familial, aux côtés d’une équipe passionnée.</p>\n<h2 id=\"ce-que-nous-offrons\">Ce que nous offrons</h2>\n<ul>\n<li><strong>Rémunération attractive</strong> et avantages (repas, primes)</li>\n<li><strong>Formation continue</strong> aux techniques halal et découpe</li>\n<li><strong>Évolution rapide</strong> — possibilité de devenir chef boucher</li>\n<li><strong>Horaires aménagés</strong> — repos hebdomadaire + dimanche après-midi</li>\n<li><strong>Équipe engagée</strong> — 90% de nos salariés étaient sans emploi avant le Marché de Mo’</li>\n</ul>\n<h2 id=\"pour-postuler\">Pour postuler</h2>\n<p>Envoyez votre CV à <a href=\"mailto:contact@marchedemo.com\">contact@marchedemo.com</a>\nou via le formulaire sur la page emploi.</p>";

				const frontmatter = {"titre":"Boucher·ère halal","magasin":"toulouse-sud","type_contrat":"CDI","temps":"Temps plein","resume":"Travail direct sur carcasse — agneau, bœuf, volaille. Équipe passionnée, environnement familial.","missions":["Découpe et désossage direct sur carcasses (agneau, bœuf, volaille)","Préparation de la vitrine réfrigérée, mise en rayon traçabilité","Accueil et conseil client en magasin","Respect strict des normes halal et HACCP","Approvisionnement et gestion des stocks frais"],"profil":["CAP ou BP Boucherie — ou expérience équivalente","Maîtrise du travail sur carcasse","Rigueur sur la traçabilité et l'hygiène","Bon relationnel client"],"date_publication":"2026-04-15T00:00:00.000Z","actif":true};
				const file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/content/postes/boucher.md";
				const url = undefined;
				function rawContent() {
					return "\nRejoignez l'équipe boucherie du Marché de Mo' — la plus grande boucherie halal de\nl'agglomération toulousaine. Vous travaillerez directement sur carcasse dans un\nenvironnement familial, aux côtés d'une équipe passionnée.\n\n## Ce que nous offrons\n\n- **Rémunération attractive** et avantages (repas, primes)\n- **Formation continue** aux techniques halal et découpe\n- **Évolution rapide** — possibilité de devenir chef boucher\n- **Horaires aménagés** — repos hebdomadaire + dimanche après-midi\n- **Équipe engagée** — 90% de nos salariés étaient sans emploi avant le Marché de Mo'\n\n## Pour postuler\n\nEnvoyez votre CV à [contact@marchedemo.com](mailto:contact@marchedemo.com)\nou via le formulaire sur la page emploi.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"ce-que-nous-offrons","text":"Ce que nous offrons"},{"depth":2,"slug":"pour-postuler","text":"Pour postuler"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
