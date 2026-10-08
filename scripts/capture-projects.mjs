// Captures thumbnails of each project's live demo into public/projects/*.png
// Usage: node scripts/capture-projects.mjs  (needs Chrome; set CHROME_PATH if not /usr/bin/google-chrome)
// The site loads ./projects/<image>.webp — convert afterwards, e.g. `cwebp -q 76 -resize 1200 750 x.png -o x.webp`.
import { chromium } from 'playwright-core';
import { projects } from '../src/data.js';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const p of projects) {
  if (!p.live || !p.image) continue;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    await page.goto(p.live, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `public/projects/${p.image}.png` });
    console.log('ok', p.name);
  } catch (e) { console.log('fail', p.name, e.message); }
  await page.close();
}
await browser.close();
