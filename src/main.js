import '@fontsource/syne/latin-600.css';
import '@fontsource/syne/latin-700.css';
import '@fontsource/syne/latin-800.css';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import 'lenis/dist/lenis.css';
import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Lenis from 'lenis';

import { profile, projects, skills, marqueeA, marqueeB, journey, certifications } from './data.js';
import { createScene } from './scene.js';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = window.matchMedia('(max-width: 820px)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const mobile = small || coarse;

/* ═══════════════ 1. render content ═══════════════ */
const roll = (t) => `<span data-hover-roll><span>${t}</span><span aria-hidden="true">${t}</span></span>`;
const ext = (href, label, cls = 'btn btn--sm') =>
  href ? `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer" data-magnetic>${label} <span class="arr">↗</span></a>` : '';

function cardHTML(p, i) {
  const media = p.image
    ? `<img src="./projects/${p.image}.webp" alt="Screenshot of the ${esc(p.name)} live demo" loading="lazy" decoding="async" width="1200" height="750" />`
    : `<div class="card__gen"><span>${esc(p.name.split(' ')[0])}</span></div>`;
  return `
  <article class="card" style="--hue:${p.hue}" ${p.live ? 'data-cursor="Open"' : ''} data-href="${p.live ? esc(p.live) : ''}">
    <div class="card__media">${media}</div>
    <div class="card__body">
      <div class="card__top mono"><span><b>${pad(i + 1)}</b> / ${pad(projects.length)}</span><span>Project</span></div>
      <h3 class="card__title">${esc(p.name)}</h3>
      <p class="card__tag">${esc(p.tagline)}</p>
      <ul class="card__points">${p.points.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <ul class="chips" aria-label="Tech stack">${p.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="card__links">
        ${ext(p.live, 'Live demo', 'btn btn--sm btn--solid')}
        ${ext(p.code, 'Code')}
      </div>
    </div>
  </article>`;
}

const marquee = (items, outline) => `
  <div class="marquee ${outline ? 'marquee--outline' : ''}" aria-hidden="true">
    ${[0, 1].map(() => `<div class="marquee__inner">${items.map((t) => `<span class="marquee__item">${esc(t)}</span>`).join('')}</div>`).join('')}
  </div>`;

const highlight = (text) =>
  esc(text).replace(/(React\/Next\.js|Node\.js|AWS(?! Academy)|Cloud Foundations|Cloud Security|internship \/ entry-level role)/g, '<span class="hl">$1</span>');

$('#main').innerHTML = `
<section class="hero" id="top" data-scene="hero">
  <div class="hero__kicker mono"><span>Portfolio — ©${new Date().getFullYear()}</span><span>Full-stack · Cloud · UI</span></div>
  <h1 class="hero__title" aria-label="${esc(profile.name)}">
    <span class="line line--1" aria-hidden="true">${profile.first}</span>
    <span class="line line--2" aria-hidden="true">${profile.last}</span>
  </h1>
  <div class="hero__bottom">
    <p class="hero__role mono"><b>●</b> <span data-scramble>${esc(profile.role)}</span><br/><span style="color:var(--ink-dim)">React / Next.js · Node.js · AWS</span></p>
    <p class="hero__loc">${esc(profile.location)}<br/><span data-clock>--:--</span> <span>IST</span></p>
    <div class="hero__ctas">
      <a class="btn btn--solid" href="#work" data-magnetic>See the work <span class="arr">↘</span></a>
      <a class="btn" href="mailto:${profile.email}" data-magnetic>Say hello</a>
    </div>
  </div>
  <div class="hero__scroll mono" aria-hidden="true"><span>Scroll</span><i></i></div>
</section>

<section class="about" id="about" data-scene="about">
  <div class="section-tag mono">(01) — Profile</div>
  <p class="about__text" data-words>${highlight(profile.summary)}</p>
  <div class="stats">
    <div class="stat"><div class="stat__num"><span data-counter="${projects.length}">0</span></div><div class="stat__label mono">Projects shipped</div></div>
    <div class="stat"><div class="stat__num"><span data-counter="${certifications.length}">0</span></div><div class="stat__label mono">Certifications</div></div>
    <div class="stat"><div class="stat__num"><span data-counter="7.36" data-decimals="2">0</span></div><div class="stat__label mono">SGPA · Semester 5</div></div>
    <div class="stat"><div class="stat__num"><span data-counter="2">0</span></div><div class="stat__label mono">GDG On Campus leadership roles</div></div>
  </div>
</section>

<section class="work" id="work" data-scene="work">
  <div class="work__head">
    <div>
      <div class="section-tag mono">(02) — Selected work</div>
      <h2 class="big-title" data-split>Things I've<br/>shipped <em>(${pad(projects.length)})</em></h2>
    </div>
    <p class="work__hint mono">${mobile ? 'Scroll' : 'Keep scrolling'} — healthcare, dev tooling &amp; UI-focused builds.</p>
  </div>
  <div class="work__pin">
    <div class="work__track">
      ${projects.map(cardHTML).join('')}
      <div class="card card--end">
        <div>
          <h3 class="big-title">More on<br/><em>GitHub</em></h3>
          <p>Practicals, experiments and everything in between.</p>
          ${ext(profile.links.github, 'github.com/Adityasinh209', 'btn btn--solid')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="skills" id="skills" data-scene="skills">
  <div class="skills__head">
    <div class="section-tag mono">(03) — Toolkit</div>
    <h2 class="big-title" data-split>The stack<br/><em>I build with</em></h2>
  </div>
  <div class="marquees">${marquee(marqueeA, false)}${marquee(marqueeB, true)}</div>
  <div class="skills__grid">
    ${skills.map((g, i) => `
      <div class="skill" data-reveal>
        <div class="skill__head"><h3 class="skill__name">${esc(g.group)}</h3><span class="skill__idx mono">${pad(i + 1)}</span></div>
        <ul class="chips">${g.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>`).join('')}
  </div>
</section>

<section class="journey" id="journey" data-scene="journey">
  <div class="journey__wrap">
    <div class="journey__sticky">
      <div class="section-tag mono">(04) — Journey</div>
      <h2 class="big-title" data-split>Lead.<br/>Learn.<br/><em>Build.</em></h2>
      <p>Computer Science at Karnavati University (UIT) — and organizing the GDG On Campus community along the way.</p>
    </div>
    <div class="timeline">
      <div class="timeline__line"><span></span></div>
      ${journey.map((j) => `
        <div class="tl" data-reveal>
          <div class="tl__meta mono"><b>${esc(j.kind)}</b><span>${esc(j.when)}</span></div>
          <h3 class="tl__title">${esc(j.title)}</h3>
          <div class="tl__org">${esc(j.org)}</div>
          ${j.text ? `<p class="tl__text">${esc(j.text)}</p>` : ''}
        </div>`).join('')}
    </div>
  </div>
</section>

<section class="certs" id="certs" data-scene="certs">
  <div class="section-tag mono">(05) — Certifications</div>
  <h2 class="big-title" data-split>Certified<br/><em>&amp; verified</em></h2>
  <div class="certs__list" style="margin-top:clamp(2.5rem,5vw,4rem)">
    ${certifications.map((c, i) => `
      <a class="cert" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer" data-reveal data-cursor="View">
        <span class="cert__idx mono">${pad(i + 1)}</span>
        <span class="cert__name">${esc(c.name)}</span>
        <span class="cert__issuer mono">${esc(c.issuer)}</span>
        <span class="cert__go">View certificate ↗</span>
      </a>`).join('')}
  </div>
</section>

<section class="contact" id="contact" data-scene="contact">
  <div class="section-tag mono">(06) — Contact</div>
  <h2 class="contact__title" aria-label="Let's build something wild">
    <span class="row row--1" aria-hidden="true">Let's build</span>
    <span class="row row--2" aria-hidden="true">something <em>wild</em></span>
  </h2>
  <div class="contact__cta">
    <a class="btn btn--solid contact__email" href="mailto:${profile.email}" data-magnetic data-strength="0.5">${profile.email} <span class="arr">↗</span></a>
    <div class="contact__links">
      ${ext(profile.links.github, 'GitHub', 'btn')}
      ${ext(profile.links.linkedin, 'LinkedIn', 'btn')}
      ${ext(profile.links.linktree, 'Linktree', 'btn')}
      <!-- TODO: LinkedIn + Linktree URLs were not embedded in the resume PDF; set them in src/data.js -->
    </div>
  </div>
  <p class="mono" style="color:var(--ink-dim);margin-top:1.6rem">Open to full-stack / software developer internships &amp; entry-level roles · ${esc(profile.location)}</p>
  <footer class="footer mono">
    <span>© ${new Date().getFullYear()} ${esc(profile.name)}</span>
    <span>Built with Three.js + GSAP</span>
    <a href="#top">Back to top ↑</a>
  </footer>
</section>`;

// nav links get the rolling-hover duplicate
$$('.nav__links [data-hover-roll]').forEach((el) => (el.outerHTML = roll(el.textContent)));

/* ═══════════════ 2. WebGL ═══════════════ */
let three = null;
try {
  three = createScene($('.webgl'), { mobile, reduced });
} catch (e) {
  three = null;
}
if (!three) document.documentElement.classList.add('no-webgl');

const S = three ? three.state : {};
// per-chapter targets for the 3D world (camera, morph, core)
const scenes = {
  hero:    { morph: 0, camZ: mobile ? 13 : 10, camY: 0,   camX: 0,              rotX: 0,    rotY: 0,    blobAlpha: 1, blobScale: mobile ? 0.85 : 1, blobX: 0, blobY: mobile ? 0.6 : 0, particleAlpha: 1 },
  about:   { morph: 1, camZ: mobile ? 14 : 11, camY: 0,   camX: mobile ? 0 : -2.5, rotX: 0.35, rotY: 1.2,  blobAlpha: 0, blobScale: 0.3, blobX: 0, blobY: 0, particleAlpha: 0.75 },
  work:    { morph: 2, camZ: mobile ? 12 : 9,  camY: 3.2, camX: 0,              rotX: 0.4,  rotY: 2.4,  blobAlpha: 0, blobScale: 0.3, blobX: 0, blobY: 0, particleAlpha: 0.7 },
  skills:  { morph: 3, camZ: mobile ? 12 : 10, camY: 2.4, camX: 0,              rotX: 0.1,  rotY: 3.1,  blobAlpha: 0, blobScale: 0.3, blobX: 0, blobY: 0, particleAlpha: 0.85 },
  journey: { morph: 4, camZ: mobile ? 15 : 12, camY: 0,   camX: mobile ? 0 : 3, rotX: 0,    rotY: 6.0,  blobAlpha: 0, blobScale: 0.3, blobX: 0, blobY: 0, particleAlpha: 0.8 },
  certs:   { morph: 4, camZ: mobile ? 13 : 10, camY: 0,   camX: mobile ? 0 : -2, rotX: 0.25, rotY: 6.6,  blobAlpha: 0, blobScale: 0.3, blobX: 0, blobY: 0, particleAlpha: 0.7 },
  contact: { morph: 4, camZ: mobile ? 9 : 6.2, camY: 0,   camX: 0,              rotX: 0,    rotY: 6.28, blobAlpha: 1, blobScale: 0.7, blobX: 0, blobY: 0, particleAlpha: 1 },
};
if (three) Object.assign(S, scenes.hero, { blobAlpha: 0, particleAlpha: 0, blobScale: 0.2 });

/* ═══════════════ 3. smooth scroll ═══════════════ */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  lenis.stop();
  window.__lenis = lenis;
}
gsap.ticker.lagSmoothing(0);
gsap.ticker.add((time, dt) => {
  if (lenis) lenis.raf(time * 1000);
  if (three) {
    S.velocity = lenis ? lenis.velocity : 0;
    if (!reduced || !three.__drawn) {
      three.render(dt / 1000);
      three.__drawn = true;
    }
  }
});

// in-page anchors → smooth scroll
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  const target = id === '#top' ? 0 : $(id);
  if (target === null) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else (target === 0 ? window : target).scrollTo ? (target === 0 ? window.scrollTo(0, 0) : target.scrollIntoView()) : null;
});

// cards are clickable as a whole (except their own buttons)
$$('.card[data-href]').forEach((card) => {
  const href = card.dataset.href;
  if (!href) return;
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    window.open(href, '_blank', 'noopener');
  });
});

/* ═══════════════ 4. live clock ═══════════════ */
const clock = $('[data-clock]');
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
const tick = () => (clock.textContent = fmt.format(new Date()));
tick();
setInterval(tick, 1000);

/* ═══════════════ 5. hero title fitting ═══════════════ */
function fitHero() {
  const title = $('.hero__title');
  const l1 = $('.line--1', title);
  const l2 = $('.line--2', title);
  const avail = title.clientWidth;
  l1.style.fontSize = '100px';
  l1.style.width = 'max-content'; // measure the text, not the block
  const w = l1.getBoundingClientRect().width;
  l1.style.width = '';
  const size = Math.max(32, (avail / w) * 100 * 0.995);
  l1.style.fontSize = l2.style.fontSize = `${size}px`;
}

/* ═══════════════ 6. cursor + magnetic ═══════════════ */
function initCursor() {
  if (!finePointer || reduced) return;
  document.documentElement.classList.add('has-cursor');
  const cur = $('.cursor');
  const dot = $('.cursor__dot');
  const ring = $('.cursor__ring');
  const label = $('.cursor__label');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    cur.classList.remove('is-hidden');
  }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
  document.addEventListener('pointerover', (e) => {
    const lab = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button, [data-magnetic]');
    if (lab && !link) {
      label.textContent = lab.dataset.cursor;
      cur.classList.add('is-label'); cur.classList.remove('is-hover');
    } else if (link) {
      cur.classList.add('is-hover'); cur.classList.remove('is-label');
    } else {
      cur.classList.remove('is-hover', 'is-label');
    }
  });
}

function initMagnetic() {
  if (!finePointer || reduced) return;
  $$('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.strength || 0.35);
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

function initCardTilt() {
  if (!finePointer || reduced) return;
  $$('.card:not(.card--end)').forEach((card) => {
    const rX = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3' });
    const rY = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3' });
    gsap.set(card, { transformPerspective: 1200 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      rY((px - 0.5) * 7);
      rX((0.5 - py) * 6);
    });
    card.addEventListener('pointerleave', () => { rX(0); rY(0); });
  });
}

/* ═══════════════ 7. intro sequence ═══════════════ */
let heroChars = [];
function splitHero() {
  heroChars = $$('.hero__title .line').map((line) => SplitText.create(line, { type: 'chars', charsClass: 'char' }).chars);
}

async function intro() {
  const count = $('[data-count]');
  const bar = $('.loader__bar span');
  const loaderName = SplitText.create('.loader__name', { type: 'chars', charsClass: 'char' });
  const prog = { v: 0 };

  const ready = Promise.all([
    document.fonts
      ? Promise.all([document.fonts.load('800 100px Syne'), document.fonts.load('600 40px Syne'), document.fonts.load('400 14px "JetBrains Mono"')]).then(() => document.fonts.ready).catch(() => {})
      : Promise.resolve(),
    new Promise((r) => setTimeout(r, reduced ? 0 : 1300)), // let the count breathe
  ]);

  gsap.from(loaderName.chars, { yPercent: 110, opacity: 0, stagger: 0.035, duration: 0.8, ease: 'expo.out' });
  const counting = gsap.to(prog, {
    v: 92, duration: reduced ? 0.2 : 1.3, ease: 'power2.out',
    onUpdate: () => { count.textContent = String(Math.round(prog.v)).padStart(3, '0'); bar.style.transform = `scaleX(${prog.v / 100})`; },
  });
  await ready;
  fitHero();
  splitHero();
  await counting;
  await gsap.to(prog, {
    v: 100, duration: 0.35, ease: 'power1.in',
    onUpdate: () => { count.textContent = String(Math.round(prog.v)).padStart(3, '0'); bar.style.transform = `scaleX(${prog.v / 100})`; },
  });

  const tl = gsap.timeline({
    defaults: { ease: 'expo.out' },
    onComplete: () => {
      document.body.classList.remove('is-loading');
      $('.loader').style.display = 'none';
      if (lenis) lenis.start();
      ScrollTrigger.refresh();
    },
  });

  if (reduced) {
    tl.to('.loader', { autoAlpha: 0, duration: 0.3 });
    if (three) { Object.assign(S, scenes.hero); three.__drawn = false; } // draw one static frame
    return tl;
  }

  tl.to(loaderName.chars, { yPercent: -110, opacity: 0, stagger: 0.02, duration: 0.6, ease: 'expo.in' })
    .to('.loader__row, .loader__bar', { opacity: 0, duration: 0.3 }, '<')
    .to('.loader__panel', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
    .from(heroChars[0], { yPercent: 120, rotationX: -80, opacity: 0, transformOrigin: '50% 100% -40px', stagger: 0.045, duration: 1.4 }, '-=0.55')
    .from(heroChars[1], { yPercent: 120, rotationX: -80, opacity: 0, transformOrigin: '50% 100% -40px', stagger: 0.06, duration: 1.4 }, '<0.2')
    .from('.nav', { yPercent: -100, opacity: 0, duration: 1 }, '<0.2')
    .from('.hero__kicker, .hero__bottom > *, .hero__scroll', { y: 30, opacity: 0, stagger: 0.08, duration: 1 }, '<0.2')
    .to('[data-scramble]', { duration: 1.4, scrambleText: { text: profile.role, chars: '01<>/{}#$_', revealDelay: 0.2, speed: 0.6 } }, '<');
  if (three) {
    tl.to(S, { particleAlpha: 1, duration: 2.2, ease: 'power2.out' }, 0.6)
      .to(S, { blobAlpha: 1, blobScale: scenes.hero.blobScale, duration: 2.4, ease: 'elastic.out(1, 0.6)' }, 0.9)
      .fromTo(S, { camZ: scenes.hero.camZ + 8 }, { camZ: scenes.hero.camZ, duration: 2.6, ease: 'expo.out' }, 0.6);
  }
  return tl;
}

/* ═══════════════ 8. scroll choreography ═══════════════ */
function initScroll() {
  // progress bar
  gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  const mm = gsap.matchMedia();

  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 821px)' }, (ctx) => {
    const { motion, desktop } = ctx.conditions;
    if (!motion) return;

    // hero title explodes on scroll-out
    const allChars = heroChars.flat();
    gsap.to(allChars, {
      yPercent: () => gsap.utils.random(-160, 60),
      xPercent: () => gsap.utils.random(-40, 40),
      rotation: () => gsap.utils.random(-35, 35),
      opacity: 0,
      stagger: { each: 0.015, from: 'center' },
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    });
    gsap.to('.hero__bottom, .hero__kicker', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: '80% top', scrub: true } });

    // about — words light up as you read
    const words = SplitText.create('[data-words]', { type: 'words', wordsClass: 'word' });
    gsap.fromTo(words.words, { opacity: 0.12, y: 12 }, {
      opacity: 1, y: 0, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: '.about__text', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    });

    // counters
    $$('[data-counter]').forEach((el) => {
      const end = parseFloat(el.dataset.counter);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const o = { v: 0 };
      gsap.to(o, {
        v: end, duration: 2, ease: 'power3.out',
        scrollTrigger: { trigger: '.stats', start: 'top 95%', once: true },
        onUpdate: () => (el.textContent = o.v.toFixed(dec)),
      });
    });
    gsap.from('.stat', { y: 60, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 85%', once: true } });

    // big titles — masked line + char reveals
    $$('[data-split]').forEach((el) => {
      const st = SplitText.create(el, { type: 'lines,words,chars', linesClass: 'split-line', wordsClass: 'sw', charsClass: 'char', mask: 'lines' });
      gsap.from(st.chars, {
        yPercent: 110, rotation: 6, duration: 1.2, ease: 'expo.out', stagger: 0.025,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // generic reveals
    $$('[data-reveal]').forEach((el) => {
      gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // WORK — horizontal pinned gallery on desktop, stacked reveals on mobile
    const track = $('.work__track');
    const cards = $$('.card', track);
    if (desktop) {
      const dist = () => track.scrollWidth - window.innerWidth;
      const horiz = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.work__pin', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      cards.forEach((card) => {
        const img = $('.card__media img', card);
        if (img) gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: horiz, start: 'left right', end: 'right left', scrub: true } });
        gsap.from(card, { rotationY: -18, z: -200, opacity: 0.3, transformPerspective: 1400, ease: 'power2.out', scrollTrigger: { trigger: card, containerAnimation: horiz, start: 'left 105%', end: 'left 55%', scrub: true } });
      });
    } else {
      cards.forEach((card) => gsap.from(card, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } }));
    }

    // skills marquees — direction & speed react to scroll velocity
    const loops = $$('.marquee').map((m, i) => {
      const inners = $$('.marquee__inner', m);
      return gsap.fromTo(inners, { xPercent: i % 2 ? -100 : 0 }, { xPercent: i % 2 ? 0 : -100, duration: 28, ease: 'none', repeat: -1 });
    });
    const onVel = () => {
      const v = lenis ? lenis.velocity : 0;
      const dir = lenis ? (lenis.direction || 1) : 1;
      const speed = gsap.utils.clamp(1, 6, 1 + Math.abs(v) * 0.12);
      loops.forEach((l) => gsap.to(l, { timeScale: speed * dir, duration: 0.4, overwrite: true }));
    };
    gsap.ticker.add(onVel);
    gsap.fromTo('.marquees', { rotation: -6 }, { rotation: 2, ease: 'none', scrollTrigger: { trigger: '.marquees', start: 'top bottom', end: 'bottom top', scrub: true } });

    // journey line draws itself
    gsap.to('.timeline__line span', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });

    // contact title — 3D flip in
    const contactSplit = $$('.contact__title .row').map((r) => SplitText.create(r, { type: 'words,chars', wordsClass: 'sw', charsClass: 'char' }).chars);
    gsap.from(contactSplit.flat(), {
      yPercent: 100, rotationX: -90, opacity: 0, transformOrigin: '50% 100%', stagger: 0.03, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact__title', start: 'top 80%', once: true },
    });
    gsap.from('.contact__cta > *, .contact > .mono', { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.contact__cta', start: 'top 92%', once: true } });

    return () => gsap.ticker.remove(onVel);
  });

  // reduced motion: no animation, just show final values
  mm.add('(prefers-reduced-motion: reduce)', () => {
    $$('[data-counter]').forEach((el) => (el.textContent = parseFloat(el.dataset.counter).toFixed(parseInt(el.dataset.decimals || '0', 10))));
  });

  // 3D camera choreography — created last so it accounts for the pin spacing
  if (three) {
    const order = ['hero', 'about', 'work', 'skills', 'journey', 'certs', 'contact'];
    for (let i = 1; i < order.length; i++) {
      const sec = $(`[data-scene="${order[i]}"]`);
      const from = scenes[order[i - 1]];
      const to = scenes[order[i]];
      if (reduced) continue;
      gsap.fromTo(S, { ...from }, {
        ...to, ease: 'power1.inOut', immediateRender: false,
        scrollTrigger: { trigger: sec, start: 'top bottom', end: i === order.length - 1 ? 'bottom bottom' : 'top 20%', scrub: 1.2 },
      });
    }
  }
}

/* ═══════════════ boot ═══════════════ */
initCursor();
initMagnetic();
initCardTilt();

intro().then(() => {
  initScroll();
  ScrollTrigger.refresh();
});

if (three) window.addEventListener('resize', () => (three.__drawn = false)); // reduced-motion: redraw static frame
let rw = window.innerWidth;
window.addEventListener('resize', () => {
  if (Math.abs(window.innerWidth - rw) < 2) return; // ignore mobile URL-bar height changes
  rw = window.innerWidth;
  fitHero();
  if (three) three.__drawn = false;
  ScrollTrigger.refresh();
});
