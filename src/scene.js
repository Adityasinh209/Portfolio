import * as THREE from 'three';
import noise from './noise.glsl.js';

/*
  The WebGL "universe":
   • a particle swarm (GPU morph between 5 formations, one per chapter of the page)
   • an iridescent liquid "core" blob that breathes in the hero
   • everything reacts to pointer + scroll velocity
*/

const rand = (a, b) => a + Math.random() * (b - a);

function buildShapes(N) {
  const A = new Float32Array(N * 3); // sphere shell  (hero)
  const B = new Float32Array(N * 3); // torus knot    (about)
  const C = new Float32Array(N * 3); // spiral galaxy (work)
  const D = new Float32Array(N * 3); // wave terrain  (skills)
  const E = new Float32Array(N * 3); // vortex ring   (journey / contact)
  const R = new Float32Array(N);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    R[i] = Math.random();

    // A — fibonacci sphere with a soft halo
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const rad = 3.1 * (Math.random() < 0.85 ? 1 : rand(1.2, 2.2));
    A[i3] = Math.cos(th) * r * rad;
    A[i3 + 1] = y * rad;
    A[i3 + 2] = Math.sin(th) * r * rad;

    // B — (2,3) torus knot with a thick tube
    const t = (i / N) * Math.PI * 2;
    const p = 2, q = 3;
    const cr = 2.2 + 0.9 * Math.cos(q * t);
    const kx = cr * Math.cos(p * t);
    const ky = cr * Math.sin(p * t);
    const kz = 0.9 * Math.sin(q * t) * 1.6;
    const tube = 0.45 * Math.sqrt(Math.random());
    const ta = Math.random() * Math.PI * 2;
    B[i3] = kx + Math.cos(ta) * tube;
    B[i3 + 1] = ky + Math.sin(ta) * tube;
    B[i3 + 2] = kz + Math.sin(ta * 2) * tube;

    // C — 3-arm spiral galaxy
    const arms = 3;
    const arm = i % arms;
    const gr = Math.pow(Math.random(), 1.6) * 6.5 + 0.2;
    const spin = gr * 0.9;
    const ga = (arm / arms) * Math.PI * 2 + spin;
    const spread = 0.35 * (1 + gr * 0.12);
    C[i3] = Math.cos(ga) * gr + rand(-spread, spread);
    C[i3 + 1] = rand(-0.18, 0.18) * (1.5 - gr / 6.5);
    C[i3 + 2] = Math.sin(ga) * gr + rand(-spread, spread);

    // D — terrain plane (heights come from noise in the shader)
    const side = Math.ceil(Math.sqrt(N));
    const gx = (i % side) / side - 0.5;
    const gz = Math.floor(i / side) / side - 0.5;
    D[i3] = gx * 18;
    D[i3 + 1] = -1.8;
    D[i3 + 2] = gz * 14;

    // E — vortex / portal ring
    const ea = Math.random() * Math.PI * 2;
    const er = 3.2 + Math.pow(Math.random(), 3) * 2.4 * (Math.random() < 0.5 ? -1 : 1) * 0.6;
    E[i3] = Math.cos(ea) * er;
    E[i3 + 1] = Math.sin(ea) * er;
    E[i3 + 2] = rand(-0.35, 0.35) + Math.sin(ea * 6) * 0.25;
  }
  return { A, B, C, D, E, R };
}

export function createScene(canvas, { mobile = false, reduced = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return null; // caller falls back to CSS background
  }
  const maxPR = mobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPR));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, mobile ? 13 : 10);

  const world = new THREE.Group();
  scene.add(world);

  // ── particles ────────────────────────────────────────────
  const N = reduced ? 6000 : mobile ? 9000 : 24000;
  const s = buildShapes(N);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(s.A, 3));
  geo.setAttribute('pB', new THREE.BufferAttribute(s.B, 3));
  geo.setAttribute('pC', new THREE.BufferAttribute(s.C, 3));
  geo.setAttribute('pD', new THREE.BufferAttribute(s.D, 3));
  geo.setAttribute('pE', new THREE.BufferAttribute(s.E, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(s.R, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);

  const pUniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uPR: { value: renderer.getPixelRatio() },
    uSize: { value: mobile ? 26 : 22 },
    uMouse: { value: new THREE.Vector2(9, 9) },
    uHover: { value: 0 },
    uAspect: { value: window.innerWidth / window.innerHeight },
    uVel: { value: 0 },
    uColA: { value: new THREE.Color('#c8ff3d') },
    uColB: { value: new THREE.Color('#7b5cff') },
    uColC: { value: new THREE.Color('#ff5a36') },
    uAlpha: { value: 0 },
  };

  const pMat = new THREE.ShaderMaterial({
    uniforms: pUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      ${noise}
      attribute vec3 pB; attribute vec3 pC; attribute vec3 pD; attribute vec3 pE;
      attribute float aRand;
      uniform float uTime, uMorph, uPR, uSize, uHover, uAspect, uVel;
      uniform vec2 uMouse;
      varying float vRand; varying float vGlow; varying float vDepth;

      float stage(float m, float k){
        return smoothstep(0.0, 1.0, clamp((m - k) * 1.6 - aRand * 0.6, 0.0, 1.0));
      }
      void main(){
        vRand = aRand;
        float t = uTime * 0.25;
        vec3 d = pD;
        d.y += snoise(vec3(d.x * 0.18, d.z * 0.18, t * 0.8)) * 1.4 + sin(d.x * 0.6 + uTime) * 0.15;

        vec3 p = position;
        p = mix(p, pB, stage(uMorph, 0.0));
        p = mix(p, pC, stage(uMorph, 1.0));
        p = mix(p, d,  stage(uMorph, 2.0));
        p = mix(p, pE, stage(uMorph, 3.0));

        // living turbulence (+ extra kick from scroll velocity)
        float n = snoise(p * 0.35 + t);
        p += normalize(p + 0.0001) * n * (0.18 + uVel * 0.9);
        p.x += snoise(vec3(p.yz * 0.5, t + aRand)) * 0.06;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vec4 clip = projectionMatrix * mv;
        vec2 ndc = clip.xy / clip.w;
        vec2 dd = (ndc - uMouse) * vec2(uAspect, 1.0);
        float f = exp(-dot(dd, dd) * 14.0) * uHover;
        mv.xy += normalize(dd + 1e-5) * f * 0.9 * (-mv.z) * 0.12;
        vGlow = f;
        vDepth = -mv.z;

        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (0.35 + aRand * 0.9) * (1.0 + f * 1.5 + uVel * 0.6) / -mv.z;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColA, uColB, uColC; uniform float uAlpha, uMorph;
      varying float vRand; varying float vGlow; varying float vDepth;
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        a *= a;
        vec3 col = mix(uColB, uColA, smoothstep(0.35, 0.95, vRand));
        col = mix(col, uColC, step(0.965, vRand));
        col += vGlow * 0.8;
        float fade = smoothstep(26.0, 6.0, vDepth);
        gl_FragColor = vec4(col, a * uAlpha * (0.55 + vRand * 0.45) * fade);
      }
    `,
  });
  const points = new THREE.Points(geo, pMat);
  world.add(points);

  // ── liquid core ──────────────────────────────────────────
  const bUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.45 },
    uAlpha: { value: 0 },
    uVel: { value: 0 },
  };
  const blobGeo = new THREE.IcosahedronGeometry(1.55, reduced ? 12 : mobile ? 24 : 64);
  const blobMat = new THREE.ShaderMaterial({
    uniforms: bUniforms,
    transparent: true,
    vertexShader: /* glsl */ `
      ${noise}
      uniform float uTime, uAmp, uVel;
      varying vec3 vN; varying vec3 vView; varying float vNoise;
      float field(vec3 p){
        float t = uTime * 0.35;
        float n = snoise(p * 0.9 + vec3(t, t * 0.7, -t));
        n += 0.5 * snoise(p * 2.1 - t * 1.3);
        return n;
      }
      void main(){
        vec3 p = position;
        vec3 nrm = normalize(normal);
        float amp = uAmp + uVel * 0.6;
        float n = field(p);
        vec3 displaced = p + nrm * n * amp;
        // finite-difference normal
        vec3 tg = normalize(cross(nrm, vec3(0.0, 1.0, 0.001)));
        vec3 bt = normalize(cross(nrm, tg));
        float e = 0.02;
        vec3 pA = p + tg * e; vec3 pB = p + bt * e;
        vec3 dA = pA + normalize(pA) * field(pA) * amp;
        vec3 dB = pB + normalize(pB) * field(pB) * amp;
        vec3 newN = normalize(cross(dA - displaced, dB - displaced));
        if (dot(newN, nrm) < 0.0) newN = -newN;
        vNoise = n;
        vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
        vN = normalize(normalMatrix * newN);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime, uAlpha;
      varying vec3 vN; varying vec3 vView; varying float vNoise;
      vec3 pal(float t){
        // acid lime → ultraviolet → ember, cosine palette
        return 0.5 + 0.5 * cos(6.28318 * (vec3(0.95, 1.0, 1.0) * t + vec3(0.12, 0.45, 0.72)));
      }
      void main(){
        float fres = pow(1.0 - max(dot(vN, vView), 0.0), 2.2);
        vec3 L = normalize(vec3(0.6, 0.8, 0.6));
        float spec = pow(max(dot(reflect(-L, vN), vView), 0.0), 48.0);
        vec3 irid = pal(vNoise * 0.35 + fres * 0.8 + uTime * 0.04);
        vec3 base = vec3(0.025, 0.02, 0.05);
        vec3 col = mix(base, irid, fres * 0.95 + 0.06);
        col += spec * 0.9;
        col += vec3(0.78, 1.0, 0.24) * smoothstep(0.55, 0.9, vNoise) * 0.25;
        gl_FragColor = vec4(col, uAlpha);
      }
    `,
  });
  const blob = new THREE.Mesh(blobGeo, blobMat);
  scene.add(blob);

  // ── state driven from main.js (GSAP) ─────────────────────
  const state = {
    morph: 0,
    camZ: camera.position.z,
    camY: 0,
    camX: 0,
    rotY: 0,
    rotX: 0,
    blobScale: 1,
    blobX: 0,
    blobY: 0,
    blobAlpha: 0,
    particleAlpha: 0,
    velocity: 0,
  };

  const mouse = new THREE.Vector2(9, 9);
  const mouseLerp = new THREE.Vector2(0, 0);
  let hover = 0;
  if (!reduced && !mobile) {
    window.addEventListener('pointermove', (e) => {
      mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      hover = 1;
    }, { passive: true });
    document.addEventListener('pointerleave', () => (hover = 0));
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    pUniforms.uAspect.value = w / h;
    pUniforms.uPR.value = renderer.getPixelRatio();
  }
  window.addEventListener('resize', resize);

  let elapsed = 0;
  function render(dt = 1 / 60) {
    elapsed += reduced ? 0 : Math.min(dt, 0.05);
    pUniforms.uTime.value = elapsed;
    bUniforms.uTime.value = elapsed;
    pUniforms.uMorph.value = state.morph;
    pUniforms.uAlpha.value = state.particleAlpha;
    const v = Math.min(Math.abs(state.velocity) * 0.012, 1);
    pUniforms.uVel.value += (v - pUniforms.uVel.value) * 0.08;
    bUniforms.uVel.value = pUniforms.uVel.value;
    bUniforms.uAlpha.value = state.blobAlpha;

    mouseLerp.lerp(mouse, 0.08);
    pUniforms.uMouse.value.copy(mouse);
    pUniforms.uHover.value += (hover - pUniforms.uHover.value) * 0.06;

    world.rotation.y = state.rotY + elapsed * 0.04 + mouseLerp.x * 0.15;
    world.rotation.x = state.rotX + mouseLerp.y * -0.08;

    blob.visible = state.blobAlpha > 0.01;
    blob.scale.setScalar(state.blobScale);
    blob.position.set(state.blobX, state.blobY, 0);
    blob.rotation.y = elapsed * 0.15;
    blob.rotation.z = elapsed * 0.07;

    camera.position.set(state.camX + mouseLerp.x * 0.35, state.camY + mouseLerp.y * 0.25, state.camZ);
    camera.lookAt(0, state.camY * 0.6, 0);

    renderer.render(scene, camera);
  }

  // compile shaders up-front so the intro doesn't hitch
  renderer.compile(scene, camera);

  return { state, render, resize, renderer, count: N };
}
