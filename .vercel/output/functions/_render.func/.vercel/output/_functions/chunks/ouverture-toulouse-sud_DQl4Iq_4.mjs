import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Après le succès du magasin de Portet-sur-Garonne ouvert en août 2024, le\n<strong>Groupe Marché de Mo’</strong> franchit une nouvelle étape : l’ouverture de son\nsecond magasin à <strong>Toulouse Sud — Cépière</strong>, dans les locaux de l’ancien\nsupermarché du centre commercial L’Hippodrome.</p>\n<h2 id=\"1-200-m-de-saveurs-du-monde\">1 200 m² de saveurs du monde</h2>\n<p>Situé à l’entrée de la sortie 27 du périphérique toulousain, ce nouveau\nmagasin reprend la formule qui a fait le succès de Portet :</p>\n<ul>\n<li>Boucherie halal sur carcasse</li>\n<li>120+ références de fruits et légumes exotiques</li>\n<li>Épicerie du monde complète</li>\n<li>Rayon surgelés ethniques</li>\n</ul>\n<h2 id=\"un-engagement-réaffirmé\">Un engagement réaffirmé</h2>\n<p>Comme à Portet, le Marché de Mo’ Cépière s’engage à recruter localement avec\nla même philosophie inclusive : 90% de nos salariés n’avaient pas d’emploi\navant de rejoindre l’enseigne.</p>";

				const frontmatter = {"titre":"Ouverture du Marché de Mo' Toulouse Sud — Cépière","categorie":"evenements","resume":"Le Groupe Marché de Mo' ouvre son second magasin dans l'ancien hypermarché du centre commercial L'Hippodrome, à la sortie 27 de la rocade.","image":"/images/articles/ouverture-cepiere.jpg","auteur":"L'équipe Marché de Mo'","date_publication":"2026-03-15T00:00:00.000Z","actif":true};
				const file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/content/articles/ouverture-toulouse-sud.md";
				const url = undefined;
				function rawContent() {
					return "\nAprès le succès du magasin de Portet-sur-Garonne ouvert en août 2024, le\n**Groupe Marché de Mo'** franchit une nouvelle étape : l'ouverture de son\nsecond magasin à **Toulouse Sud — Cépière**, dans les locaux de l'ancien\nsupermarché du centre commercial L'Hippodrome.\n\n## 1 200 m² de saveurs du monde\n\nSitué à l'entrée de la sortie 27 du périphérique toulousain, ce nouveau\nmagasin reprend la formule qui a fait le succès de Portet :\n\n- Boucherie halal sur carcasse\n- 120+ références de fruits et légumes exotiques\n- Épicerie du monde complète\n- Rayon surgelés ethniques\n\n## Un engagement réaffirmé\n\nComme à Portet, le Marché de Mo' Cépière s'engage à recruter localement avec\nla même philosophie inclusive : 90% de nos salariés n'avaient pas d'emploi\navant de rejoindre l'enseigne.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"1-200-m-de-saveurs-du-monde","text":"1 200 m² de saveurs du monde"},{"depth":2,"slug":"un-engagement-réaffirmé","text":"Un engagement réaffirmé"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
