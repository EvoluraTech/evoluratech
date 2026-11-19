/* Evolura hero: an interactive 3D particle form that morphs between shapes.
   Move the pointer to push particles aside and tilt the form; click or tap to move to the next shape.
   Built on three.js (MIT). Bundle with: npx esbuild src/hero3d.source.js --bundle --minify --format=iife --outfile=assets/hero3d.js */
import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute, Points, ShaderMaterial,
  AdditiveBlending, Color, Vector3, Vector2, Raycaster, Plane
} from "three";

/* ---------- Shape generators: each returns n points as a Float32Array ---------- */
function sphere(n, r) {
  const a = new Float32Array(n * 3), g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, rad = Math.sqrt(1 - y * y), t = g * i, j = 1 + (Math.random() - 0.5) * 0.04;
    a.set([Math.cos(t) * rad * r * j, y * r * j, Math.sin(t) * rad * r * j], i * 3);
  }
  return a;
}
function knot(n) {                       // torus knot (2,3): systems wired together
  const a = new Float32Array(n * 3), p = 2, q = 3, R = 1.05, tube = 0.26;
  for (let i = 0; i < n; i++) {
    const u = (i / n) * Math.PI * 2 * 1, t = u, cq = Math.cos(q * t), sq = Math.sin(q * t);
    const cx = (R + 0.42 * cq) * Math.cos(p * t), cy = (R + 0.42 * cq) * Math.sin(p * t), cz = 0.42 * sq;
    const ang = Math.random() * Math.PI * 2, rr = tube * Math.sqrt(Math.random());
    a.set([cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * 0.9, cz + Math.sin(ang * 1.7) * rr], i * 3);
  }
  return a;
}
function helix(n) {                      // double helix with rungs: repeated, automated steps
  const a = new Float32Array(n * 3), turns = 3.2, h = 3.0, r = 0.75;
  for (let i = 0; i < n; i++) {
    const k = Math.random(), t = k * Math.PI * 2 * turns, y = (k - 0.5) * h, kind = i % 5;
    let x, z;
    if (kind < 2) { x = Math.cos(t) * r; z = Math.sin(t) * r; }
    else if (kind < 4) { x = Math.cos(t + Math.PI) * r; z = Math.sin(t + Math.PI) * r; }
    else { const s = Math.random() * 2 - 1; x = Math.cos(t) * r * s; z = Math.sin(t) * r * s; }
    const jit = 0.05;
    a.set([x + (Math.random() - 0.5) * jit, y + (Math.random() - 0.5) * jit, z + (Math.random() - 0.5) * jit], i * 3);
  }
  return a;
}
function lattice(n) {                    // cube of cubes: modular, scalable structure
  const a = new Float32Array(n * 3), s = 1.25, cells = 3;
  for (let i = 0; i < n; i++) {
    // points along the edges of a 3x3x3 grid of cubes
    const axis = i % 3, l1 = Math.floor(Math.random() * (cells + 1)), l2 = Math.floor(Math.random() * (cells + 1));
    const t = Math.random() * 2 - 1, c1 = (l1 / cells) * 2 - 1, c2 = (l2 / cells) * 2 - 1;
    const v = axis === 0 ? [t, c1, c2] : axis === 1 ? [c1, t, c2] : [c1, c2, t];
    a.set([v[0] * s, v[1] * s, v[2] * s], i * 3);
  }
  return a;
}
const SHAPES = { sphere: (n) => sphere(n, 1.35), knot, helix, lattice };

const VERT = `
attribute vec3 s0; attribute vec3 s1; attribute vec3 s2; attribute vec3 s3;
attribute float aRand;
uniform float uFrom, uTo, uMix, uTime, uSize, uPixel, uMouseOn;
uniform vec3 uMouse, uC1, uC2;
varying vec3 vCol; varying float vAlpha;
vec3 pick(float i) { if (i < 0.5) return s0; if (i < 1.5) return s1; if (i < 2.5) return s2; return s3; }
void main() {
  float m = smoothstep(0.0, 1.0, clamp(uMix * 1.5 - aRand * 0.5, 0.0, 1.0));
  vec3 p = mix(pick(uFrom), pick(uTo), m);
  float burst = sin(m * 3.14159) * 0.35;                       // particles swell outward mid-transition
  p += normalize(p + 0.0001) * burst * (0.4 + aRand);
  p += 0.025 * vec3(sin(uTime * 1.3 + aRand * 40.0), cos(uTime * 1.1 + aRand * 30.0), sin(uTime * 0.9 + aRand * 20.0));
  vec4 world = modelMatrix * vec4(p, 1.0);
  vec3 d = world.xyz - uMouse; float dist = length(d);
  world.xyz += normalize(d + 0.0001) * uMouseOn * 0.42 * exp(-dist * dist * 2.6);
  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixel * (0.55 + aRand * 0.9) / -mv.z;
  vCol = mix(uC1, uC2, clamp(p.y * 0.32 + 0.5 + (aRand - 0.5) * 0.25, 0.0, 1.0));
  vAlpha = (0.6 + 0.4 * aRand) * clamp(1.2 - (-mv.z - 4.2) * 0.35, 0.35, 1.0);
}`;
const FRAG = `
varying vec3 vCol; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vCol, pow(a, 1.6) * vAlpha);
}`;

export function init(host, opts) {
  const o = Object.assign({ colorA: "#5B7CFF", colorB: "#5EE3F5", scenes: [], reduced: false, onScene: null }, opts || {});
  const scenes = o.scenes.filter(s => SHAPES[s.shape]).slice(0, 4);
  if (!scenes.length) return null;
  let renderer;
  try { renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); } catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new Scene(), camera = new PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 0, 6);

  const N = innerWidth < 700 ? 6000 : 11000;
  const geo = new BufferGeometry();
  const rand = new Float32Array(N); for (let i = 0; i < N; i++) rand[i] = Math.random();
  geo.setAttribute("aRand", new BufferAttribute(rand, 1));
  for (let k = 0; k < 4; k++) {
    const sc = scenes[k % scenes.length];
    geo.setAttribute("s" + k, new BufferAttribute(SHAPES[sc.shape](N), 3));
  }
  geo.setAttribute("position", geo.getAttribute("s0"));
  geo.computeBoundingSphere(); geo.boundingSphere.radius = 4;

  const uni = {
    uFrom: { value: 0 }, uTo: { value: 0 }, uMix: { value: 1 }, uTime: { value: 0 },
    uSize: { value: 24 }, uPixel: { value: renderer.getPixelRatio() }, uMouseOn: { value: 0 },
    uMouse: { value: new Vector3(99, 99, 99) }, uC1: { value: new Color(o.colorA) }, uC2: { value: new Color(o.colorB) }
  };
  const pts = new Points(geo, new ShaderMaterial({ uniforms: uni, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending }));
  pts.frustumCulled = false;
  scene.add(pts);

  /* Scene cycling */
  let cur = 0, mixStart = -10, auto = 0;
  const count = scenes.length;
  function go(i) {
    if (count < 2) return;
    uni.uFrom.value = cur; cur = (i + count) % count; uni.uTo.value = cur;
    mixStart = clock; uni.uMix.value = 0; auto = 0;
    if (o.onScene) o.onScene(cur);
  }

  /* Pointer: tilt, repel, click to advance */
  const ray = new Raycaster(), ndc = new Vector2(), plane = new Plane(new Vector3(0, 0, 1), 0), hit = new Vector3();
  let tx = 0, ty = 0, inside = false;
  const el = renderer.domElement;
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    tx = ndc.x; ty = ndc.y; inside = true;
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) uni.uMouse.value.copy(hit);
  });
  el.addEventListener("pointerleave", () => { inside = false; tx = ty = 0; });
  el.addEventListener("click", () => go(cur + 1));

  function size() {
    const w = host.clientWidth, h = host.clientHeight || w;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = w / h < 0.9 ? 7.2 : 6; camera.updateProjectionMatrix();
  }
  size();
  if ("ResizeObserver" in window) new ResizeObserver(size).observe(host); else addEventListener("resize", size);

  let clock = 0, last = performance.now(), raf = 0, running = true;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
    uni.uTime.value = clock;
    if (uni.uMix.value < 1) uni.uMix.value = Math.min(1, (clock - mixStart) / 1.8);
    if (!o.reduced) {
      auto += dt; if (auto > 6) go(cur + 1);
      pts.rotation.y += dt * 0.12;
    }
    pts.rotation.x += ((ty * 0.35) - pts.rotation.x) * 0.05;
    pts.rotation.z += ((-tx * 0.12) - pts.rotation.z) * 0.05;
    uni.uMouseOn.value += ((inside ? 1 : 0) - uni.uMouseOn.value) * 0.08;
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }
  if (o.onScene) o.onScene(0);
  raf = requestAnimationFrame(frame);

  function setRunning(v) { if (v === running) return; running = v; if (v) { last = performance.now(); raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf); }
  if ("IntersectionObserver" in window) new IntersectionObserver(es => setRunning(es[0].isIntersecting)).observe(host);
  document.addEventListener("visibilitychange", () => setRunning(!document.hidden));
  return { go, setRunning };
}

window.EvoluraHero = { init };
