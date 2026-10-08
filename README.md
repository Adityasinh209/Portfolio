# Adityasinh Rana — Portfolio

An immersive, scroll-driven portfolio built with **Three.js**, **GSAP (ScrollTrigger, SplitText, ScrambleText)** and **Lenis**, bundled with **Vite** into a static `dist/` folder.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve dist/ on http://localhost:4173
```

Requires Node 20.19+ (Vite 8).

## Editing content

All text and links live in **`src/data.js`** (sourced from the resume).
Open TODOs there before you deploy:

| Item | Status |
| --- | --- |
| LinkedIn URL | `TODO`: the resume PDF has the label but no embedded link |
| Linktree URL | `TODO`: same as above |

Links set to `null` are hidden automatically, so nothing breaks while they're missing.

### Projects (5)

| Card | Live demo | Repo (Code link) |
| --- | --- | --- |
| Ayusutra | https://ayusutra001.vercel.app/ | https://github.com/Adityasinh209/Ayusutra |
| Pixora | https://pixora29.vercel.app/ | https://github.com/Adityasinh209/Image-studio |
| HackGen | https://hackgen-cursor.vercel.app/ | https://github.com/Adityasinh209/HackGen |
| Paymora | https://paymora01.vercel.app/ | https://github.com/Adityasinh209/Paymora |
| Ayusandhi | https://ayusandhi.vercel.app/ | https://github.com/Adityasinh209/Ayusandhi |

Card copy and tech stacks come from each repo (README, `package.json`, source tree) and its live demo.

Project thumbnails are in `public/projects/*.webp` (captured from each live demo). Re-capture with `node scripts/capture-projects.mjs`.

## Deploy

The build uses relative asset paths (`base: './'`), so `dist/` works from any host or sub-path.

- **Vercel**: import the repo. Framework: *Vite*. Build: `npm run build`. Output: `dist`.
- **Netlify**: build command `npm run build`, publish directory `dist`. Or drag and drop `dist/` onto app.netlify.com/drop.
- **GitHub Pages**: run `npm run build` and push `dist/` to a `gh-pages` branch (e.g. `npx gh-pages -d dist`), or use the official "Deploy static content" Action with `path: dist`.

## Verify (optional)

```bash
npm run build && npm run preview &   # keep it running
CHROME_PATH=/path/to/chrome npm run test:visual
```

This takes screenshots at 1440×900 and 390×844 into `screenshots/`. It fails on console errors, page errors, failed requests or horizontal overflow, and also smoke-tests `prefers-reduced-motion`.

## Performance and accessibility

- Particle count scales by device: 24k on desktop, 9k on mobile or touch, 6k with reduced motion. Pixel ratio is capped at 2 on desktop and 1.5 on mobile.
- On small or touch screens the custom cursor, magnetic hover and pointer distortion are off. The project gallery stacks vertically instead of pinning.
- With `prefers-reduced-motion` there is no smooth scrolling and no scroll animation. A single static WebGL frame is drawn and all content shows right away.
- If WebGL isn't available, a CSS gradient background is used instead.
- Fonts (Syne, Inter, JetBrains Mono) are self-hosted through Fontsource, so there are no third-party font requests.

## Structure

```
index.html          shell: loader, canvas, cursor, nav
src/main.js         content rendering, intro, Lenis, ScrollTrigger choreography, cursor/magnetic
src/scene.js        Three.js world: morphing particle swarm + iridescent noise "core"
src/noise.glsl.js   simplex noise for the shaders
src/data.js         resume content and links
src/style.css       styles
scripts/            visual verification + thumbnail capture
```
