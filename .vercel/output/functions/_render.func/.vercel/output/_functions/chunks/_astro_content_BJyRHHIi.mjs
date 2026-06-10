import { Traverse } from 'neotraverse/modern';
import pLimit from 'p-limit';
import { r as removeBase, i as isCoreRemotePath, V as VALID_INPUT_FORMATS, p as prependForwardSlash } from './astro/assets-service_D4HoFAN7.mjs';
import { A as AstroError, k as UnknownContentCollectionError, c as createComponent, l as renderUniqueStylesheet, n as renderScriptElement, o as createHeadAndContent, e as renderComponent, r as renderTemplate, u as unescapeHTML } from './astro/server_BQgcolZ2.mjs';
import 'kleur/colors';
import * as devalue from 'devalue';

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isCoreRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1);
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class DataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_BcEe_9wP.mjs');
      if (data.default instanceof Map) {
        return DataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return DataStore.fromMap(map);
    } catch {
    }
    return new DataStore();
  }
  static async fromMap(data) {
    const store = new DataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = DataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://marchedemov2.vercel.app", "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./_astro_asset-imports_D9aVaOQr.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        const entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, {})?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/articles/arrivage-dattes-ramadan-2026.md": () => import('./arrivage-dattes-ramadan-2026_BIclqBak.mjs'),"/src/content/articles/food-show-toulouse-2026.md": () => import('./food-show-toulouse-2026_CAB3a0Ui.mjs'),"/src/content/articles/ouverture-toulouse-sud.md": () => import('./ouverture-toulouse-sud_h_YFdTJh.mjs'),"/src/content/articles/partenariat-banque-alimentaire.md": () => import('./partenariat-banque-alimentaire_BqV6EGk2.mjs'),"/src/content/articles/recrutement-2026-15-postes.md": () => import('./recrutement-2026-15-postes_CxoViL9k.mjs'),"/src/content/postes/alternant-b2b.md": () => import('./alternant-b2b_2ClRPT7V.mjs'),"/src/content/postes/apprenti-boucher.md": () => import('./apprenti-boucher_CKhu2JyO.mjs'),"/src/content/postes/boucher.md": () => import('./boucher_BiizJapg.mjs'),"/src/content/postes/employe-polyvalent.md": () => import('./employe-polyvalent_Cqc039Jy.mjs'),"/src/content/recettes/baklava-turc.md": () => import('./baklava-turc_BgsZNUQe.mjs'),"/src/content/recettes/bibimbap-coreen.md": () => import('./bibimbap-coreen_CG1SiBPD.mjs'),"/src/content/recettes/couscous-royal.md": () => import('./couscous-royal_DHG4FdDc.mjs'),"/src/content/recettes/feijoada-bresilienne.md": () => import('./feijoada-bresilienne_BEd_TMgN.mjs'),"/src/content/recettes/mafe-senegalais.md": () => import('./mafe-senegalais_DQXoTawL.mjs'),"/src/content/recettes/pad-thai-authentique.md": () => import('./pad-thai-authentique_WLjLS0GN.mjs'),"/src/content/recettes/pho-bo-vietnamien.md": () => import('./pho-bo-vietnamien_Bg9XM1uQ.mjs'),"/src/content/recettes/tajine-agneau-pruneaux.md": () => import('./tajine-agneau-pruneaux_P9YS8jIw.mjs'),"/src/content/recettes/yassa-poulet.md": () => import('./yassa-poulet_D5NBjsJ4.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/promos/promo-001.json": () => import('./promo-001_XBCjwIYA.mjs'),"/src/content/promos/promo-002.json": () => import('./promo-002_CMlke-QK.mjs'),"/src/content/promos/promo-003.json": () => import('./promo-003_B2JU3VbI.mjs'),"/src/content/promos/promo-004.json": () => import('./promo-004_DC5IPCUv.mjs'),"/src/content/promos/promo-005.json": () => import('./promo-005_DGKDZzfV.mjs'),"/src/content/promos/promo-006.json": () => import('./promo-006_fj7gvSlQ.mjs'),"/src/content/promos/promo-007.json": () => import('./promo-007_Wly4WPAD.mjs'),"/src/content/videos/video-001.json": () => import('./video-001_D7NjB3LU.mjs'),"/src/content/videos/video-002.json": () => import('./video-002_BjLWljJx.mjs'),"/src/content/videos/video-003.json": () => import('./video-003_D-BV_r9U.mjs'),"/src/content/videos/video-004.json": () => import('./video-004_Iz6ZHwO4.mjs'),"/src/content/videos/video-005.json": () => import('./video-005_DQv047uj.mjs'),"/src/content/videos/video-006.json": () => import('./video-006_DAcnbmK6.mjs'),"/src/content/videos/video-007.json": () => import('./video-007_DfyoYts1.mjs')});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"promos":{"type":"data","entries":{"promo-001":"/src/content/promos/promo-001.json","promo-002":"/src/content/promos/promo-002.json","promo-003":"/src/content/promos/promo-003.json","promo-004":"/src/content/promos/promo-004.json","promo-005":"/src/content/promos/promo-005.json","promo-006":"/src/content/promos/promo-006.json","promo-007":"/src/content/promos/promo-007.json"}},"articles":{"type":"content","entries":{"arrivage-dattes-ramadan-2026":"/src/content/articles/arrivage-dattes-ramadan-2026.md","food-show-toulouse-2026":"/src/content/articles/food-show-toulouse-2026.md","ouverture-toulouse-sud":"/src/content/articles/ouverture-toulouse-sud.md","partenariat-banque-alimentaire":"/src/content/articles/partenariat-banque-alimentaire.md","recrutement-2026-15-postes":"/src/content/articles/recrutement-2026-15-postes.md"}},"postes":{"type":"content","entries":{"alternant-b2b":"/src/content/postes/alternant-b2b.md","boucher":"/src/content/postes/boucher.md","apprenti-boucher":"/src/content/postes/apprenti-boucher.md","employe-polyvalent":"/src/content/postes/employe-polyvalent.md"}},"videos":{"type":"data","entries":{"video-001":"/src/content/videos/video-001.json","video-002":"/src/content/videos/video-002.json","video-003":"/src/content/videos/video-003.json","video-004":"/src/content/videos/video-004.json","video-005":"/src/content/videos/video-005.json","video-006":"/src/content/videos/video-006.json","video-007":"/src/content/videos/video-007.json"}},"recettes":{"type":"content","entries":{"baklava-turc":"/src/content/recettes/baklava-turc.md","couscous-royal":"/src/content/recettes/couscous-royal.md","feijoada-bresilienne":"/src/content/recettes/feijoada-bresilienne.md","mafe-senegalais":"/src/content/recettes/mafe-senegalais.md","pad-thai-authentique":"/src/content/recettes/pad-thai-authentique.md","tajine-agneau-pruneaux":"/src/content/recettes/tajine-agneau-pruneaux.md","pho-bo-vietnamien":"/src/content/recettes/pho-bo-vietnamien.md","yassa-poulet":"/src/content/recettes/yassa-poulet.md","bibimbap-coreen":"/src/content/recettes/bibimbap-coreen.md"}}};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/articles/arrivage-dattes-ramadan-2026.md": () => import('./arrivage-dattes-ramadan-2026_vLZCt3sb.mjs'),"/src/content/articles/food-show-toulouse-2026.md": () => import('./food-show-toulouse-2026_BFU2ArpE.mjs'),"/src/content/articles/ouverture-toulouse-sud.md": () => import('./ouverture-toulouse-sud_B41ssGg8.mjs'),"/src/content/articles/partenariat-banque-alimentaire.md": () => import('./partenariat-banque-alimentaire_Bjz0dwv2.mjs'),"/src/content/articles/recrutement-2026-15-postes.md": () => import('./recrutement-2026-15-postes_CXPYRkDs.mjs'),"/src/content/postes/alternant-b2b.md": () => import('./alternant-b2b_9TA_ZNCi.mjs'),"/src/content/postes/apprenti-boucher.md": () => import('./apprenti-boucher_BCBcuJ0r.mjs'),"/src/content/postes/boucher.md": () => import('./boucher_DR0iOZLW.mjs'),"/src/content/postes/employe-polyvalent.md": () => import('./employe-polyvalent_D5cMirDa.mjs'),"/src/content/recettes/baklava-turc.md": () => import('./baklava-turc_Cmy1IdNI.mjs'),"/src/content/recettes/bibimbap-coreen.md": () => import('./bibimbap-coreen_Dg8AFS30.mjs'),"/src/content/recettes/couscous-royal.md": () => import('./couscous-royal_DpaqMeWn.mjs'),"/src/content/recettes/feijoada-bresilienne.md": () => import('./feijoada-bresilienne_BDFf1NtW.mjs'),"/src/content/recettes/mafe-senegalais.md": () => import('./mafe-senegalais_CFQb_kEJ.mjs'),"/src/content/recettes/pad-thai-authentique.md": () => import('./pad-thai-authentique_BQv4eUN7.mjs'),"/src/content/recettes/pho-bo-vietnamien.md": () => import('./pho-bo-vietnamien_DwryMQej.mjs'),"/src/content/recettes/tajine-agneau-pruneaux.md": () => import('./tajine-agneau-pruneaux_D12dB6gO.mjs'),"/src/content/recettes/yassa-poulet.md": () => import('./yassa-poulet_ttHdWZ7f.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

export { getCollection as g };
