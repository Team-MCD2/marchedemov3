import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Depuis notre ouverture, la lutte contre la précarité alimentaire est au cœur\nde nos priorités. C’est pourquoi nous formalisons aujourd’hui notre partenariat\navec la <strong>Banque Alimentaire de Haute-Garonne</strong>.</p>\n<h2 id=\"un-engagement-concret\">Un engagement concret</h2>\n<p>Chaque semaine, nos équipes sélectionnent et préparent des invendus encore\nparfaitement consommables — fruits, légumes, épicerie — pour la Banque\nAlimentaire.</p>\n<h2 id=\"pourquoi\">Pourquoi ?</h2>\n<p>Parce que le gaspillage alimentaire est une absurdité quand 1 Français sur 6\nrencontre régulièrement des difficultés pour se nourrir. Et parce que la\ndiversité des saveurs — africaines, asiatiques, méditerranéennes — doit être\naccessible à tous, sans condition de revenu.</p>";

				const frontmatter = {"titre":"Partenariat renforcé avec la Banque Alimentaire de Haute-Garonne","categorie":"engagements","resume":"Le Marché de Mo' formalise son engagement contre la précarité alimentaire avec des dons réguliers et une distribution mensuelle.","image":"/images/articles/banque-alimentaire.jpg","auteur":"L'équipe Marché de Mo'","date_publication":"2026-02-20T00:00:00.000Z","actif":true};
				const file = "C:/Users/Mommy Jayce/Desktop/Microdidact/MarchedemoV3/app/src/content/articles/partenariat-banque-alimentaire.md";
				const url = undefined;
				function rawContent() {
					return "\nDepuis notre ouverture, la lutte contre la précarité alimentaire est au cœur\nde nos priorités. C'est pourquoi nous formalisons aujourd'hui notre partenariat\navec la **Banque Alimentaire de Haute-Garonne**.\n\n## Un engagement concret\n\nChaque semaine, nos équipes sélectionnent et préparent des invendus encore\nparfaitement consommables — fruits, légumes, épicerie — pour la Banque\nAlimentaire.\n\n## Pourquoi ?\n\nParce que le gaspillage alimentaire est une absurdité quand 1 Français sur 6\nrencontre régulièrement des difficultés pour se nourrir. Et parce que la\ndiversité des saveurs — africaines, asiatiques, méditerranéennes — doit être\naccessible à tous, sans condition de revenu.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"un-engagement-concret","text":"Un engagement concret"},{"depth":2,"slug":"pourquoi","text":"Pourquoi ?"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
