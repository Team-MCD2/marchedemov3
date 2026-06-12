/**
 * capture-culture-sections.mjs — one-off QA capture of the 5 cultural
 * sections on the V3 homepage. Usage:
 *   node ./scripts/capture-culture-sections.mjs [baseUrl]
 * Writes screenshots/culture-<slug>.png for each [data-culture] section.
 */
import { chromium } from "playwright";

const base = process.argv[2] || "http://localhost:4323";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(240000);

await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 240000 });
await page.waitForTimeout(2500);

const sections = await page.locator("section[data-culture]").all();
console.log(`found ${sections.length} cultural sections`);
for (const section of sections) {
  const slug = await section.getAttribute("data-culture");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900); // reveal animations
  await section.screenshot({ path: `screenshots/culture-${slug}.png` });
  console.log(`captured culture-${slug}.png`);
}

await browser.close();
