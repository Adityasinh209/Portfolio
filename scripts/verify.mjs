// Headless verification: serves nothing itself — expects `npm run preview` on :4173 (or BASE_URL).
// Captures screenshots + fails on console errors, page errors and failed requests.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:4173/';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

const shots = {
  desktop: [
    ['01-hero', null],
    ['02-about', '#about', 0.08],
    ['03-work', '#work', 0.0],
    ['04-work-scrolled', '#work', 'pin'],
    ['05-skills', '#skills', 0.15],
    ['06-journey', '#journey', 0.0],
    ['07-certs', '#certs', 0.0],
    ['08-contact', '#contact', 0.0],
  ],
  mobile: [
    ['01-hero', null],
    ['02-about', '#about', 0.0],
    ['03-work', '#work', 0.35],
    ['04-skills', '#skills', 0.08],
    ['05-journey', '#journey', 0.2],
    ['06-contact', '#contact', 0.0],
  ],
};

const configs = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

let failures = 0;
for (const cfg of configs) {
  const ctx = await browser.newContext({ viewport: cfg.viewport, deviceScaleFactor: cfg.deviceScaleFactor, isMobile: cfg.isMobile, hasTouch: cfg.hasTouch });
  const page = await ctx.newPage();
  const errors = [];
  const warnings = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
    if (m.type() === 'warning') warnings.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url() + ' ' + (r.failure()?.errorText || '')));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`); });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !document.body.classList.contains('is-loading'), null, { timeout: 20000 });
  await page.waitForTimeout(2500);
  const webgl = await page.evaluate(() => !document.documentElement.classList.contains('no-webgl'));

  for (const [name, sel, frac] of shots[cfg.name]) {
    if (sel) {
      await page.evaluate(([sel, frac]) => {
        const el = document.querySelector(sel);
        let y = el.getBoundingClientRect().top + window.scrollY;
        if (frac === 'pin') {
          // scroll ~45% into the pinned horizontal gallery
          const pinSpacer = el.querySelector('.pin-spacer') || el.querySelector('.work__pin').parentElement;
          y = pinSpacer.getBoundingClientRect().top + window.scrollY + (pinSpacer.offsetHeight - window.innerHeight) * 0.5;
        } else {
          y += el.offsetHeight * frac;
        }
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      }, [sel, frac]);
      await page.waitForTimeout(2600); // let scrubbed timelines + reveals settle
    }
    await page.screenshot({ path: `${OUT}/${cfg.name}-${name}.png` });
  }
  const hOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`\n[${cfg.name}] webgl=${webgl} horizontalOverflow=${hOverflow}px errors=${errors.length} warnings=${warnings.length}`);
  errors.forEach((e) => console.log('  ERROR', e));
  warnings.slice(0, 10).forEach((w) => console.log('  warn', w.slice(0, 200)));
  if (errors.length || hOverflow > 1) failures++;
  await ctx.close();
}

// reduced-motion smoke test
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !document.body.classList.contains('is-loading'), null, { timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/reduced-motion-hero.png` });
  const counters = await page.evaluate(() => [...document.querySelectorAll('[data-counter]')].map((e) => e.textContent).join(','));
  console.log('  reduced-motion counters:', counters);
  if (counters.includes(',0') || counters.startsWith('0')) failures++;
  console.log(`\n[reduced-motion] errors=${errors.length}`);
  errors.forEach((e) => console.log('  ERROR', e));
  if (errors.length) failures++;
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n✗ ${failures} config(s) had problems` : '\n✓ all checks passed');
process.exit(failures ? 1 : 0);
