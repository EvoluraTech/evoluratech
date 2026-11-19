/* Evolura hero: an interactive 3D globe showing where we deliver.
   Drag to turn it, hover a marker to see the place. Built on three.js (MIT). */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial,
  SphereGeometry, Mesh, MeshBasicMaterial, Vector3, QuadraticBezierCurve3, Line, LineBasicMaterial, RingGeometry,
  Raycaster, Vector2, Color, DoubleSide, EllipseCurve, LineLoop
} from "three";

function latLng(lat, lng, r) {
  const phi = (90 - lat) * Math.PI / 180, th = (lng + 180) * Math.PI / 180;
  return new Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

export function init(host, opts) {
  const o = Object.assign({ ink: "#0E1726", accent: "#2F4FD8", bg: "#FFFFFF", places: [], hub: 0, reduced: false }, opts || {});
  let renderer;
  try { renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); } catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 4.7);
  const globe = new Group();
  const HOME_X = 0.45, HOME_Y = -1.6;   // frames the UK, US, Gulf and Pakistan on load
  globe.rotation.set(HOME_X, HOME_Y, 0);
  scene.add(globe);

  const ink = new Color(o.ink), accent = new Color(o.accent);

  // Occluder so dots on the far side fade behind the globe
  globe.add(new Mesh(new SphereGeometry(0.985, 64, 64), new MeshBasicMaterial({ color: new Color(o.bg) })));

  // Dotted surface (Fibonacci sphere)
  const N = 2600, pos = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = Math.PI * (3 - Math.sqrt(5)) * i;
    pos.push(Math.cos(t) * r, y, Math.sin(t) * r);
  }
  const dotGeo = new BufferGeometry(); dotGeo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  globe.add(new Points(dotGeo, new PointsMaterial({ color: ink, size: 0.011, transparent: true, opacity: 0.38, sizeAttenuation: true })));

  // Equator and a tilted orbit ring
  const ringMat = new LineBasicMaterial({ color: accent, transparent: true, opacity: 0.22 });
  const circle = (rad) => new BufferGeometry().setFromPoints(new EllipseCurve(0, 0, rad, rad, 0, Math.PI * 2).getPoints(160).map(p => new Vector3(p.x, 0, p.y)));
  globe.add(new LineLoop(circle(1.001), ringMat));
  const orbit = new LineLoop(circle(1.2), new LineBasicMaterial({ color: accent, transparent: true, opacity: 0.35 }));
  orbit.rotation.set(1.15, 0.2, 0.35); scene.add(orbit);
  const satellite = new Mesh(new SphereGeometry(0.022, 16, 16), new MeshBasicMaterial({ color: accent }));
  scene.add(satellite);

  // Places, pulse rings and arcs from the hub
  const markers = [], pulses = [], arcs = [];
  o.places.forEach((p, i) => {
    const v = latLng(p.lat, p.lng, 1.0);
    const m = new Mesh(new SphereGeometry(i === o.hub ? 0.03 : 0.024, 20, 20), new MeshBasicMaterial({ color: accent }));
    m.position.copy(v); m.userData = { label: p.label, sub: p.sub || "" }; globe.add(m); markers.push(m);
    const ring = new Mesh(new RingGeometry(0.035, 0.045, 40), new MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.6, side: DoubleSide }));
    ring.position.copy(v.clone().multiplyScalar(1.002)); ring.lookAt(v.clone().multiplyScalar(2)); globe.add(ring); pulses.push({ ring, phase: i * 0.7 });
  });
  const hubV = markers[o.hub] ? markers[o.hub].position : null;
  markers.forEach((m, i) => {
    if (!hubV || i === o.hub) return;
    const mid = hubV.clone().add(m.position).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(1 + hubV.distanceTo(m.position) * 0.42);
    const curve = new QuadraticBezierCurve3(hubV, mid, m.position);
    const pts = curve.getPoints(90);
    const g = new BufferGeometry().setFromPoints(pts);
    const line = new Line(g, new LineBasicMaterial({ color: accent, transparent: true, opacity: 0.75 }));
    globe.add(line);
    const packet = new Mesh(new SphereGeometry(0.016, 12, 12), new MeshBasicMaterial({ color: accent }));
    globe.add(packet);
    arcs.push({ g, curve, packet, n: pts.length, offset: i * 0.9 });
  });

  // Interaction: drag with inertia, hover labels
  const tip = document.createElement("div"); tip.className = "globe-tip"; tip.hidden = true; host.appendChild(tip);
  const ray = new Raycaster(), mouse = new Vector2();
  let dragging = false, lx = 0, ly = 0, vx = 0, vy = 0, idle = 0, hovered = null;
  const el = renderer.domElement;
  el.style.touchAction = "pan-y";
  el.addEventListener("pointerdown", e => { dragging = true; lx = e.clientX; ly = e.clientY; vx = vy = 0; el.setPointerCapture(e.pointerId); host.classList.add("grabbing"); });
  el.addEventListener("pointerup", e => { dragging = false; idle = 0; host.classList.remove("grabbing"); try { el.releasePointerCapture(e.pointerId); } catch (_) {} });
  el.addEventListener("pointerleave", () => { tip.hidden = true; hovered = null; });
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (dragging) {
      vy = (e.clientX - lx) * 0.006; vx = (e.clientY - ly) * 0.004; lx = e.clientX; ly = e.clientY;
      globe.rotation.y += vy; globe.rotation.x = Math.max(-0.9, Math.min(0.9, globe.rotation.x + vx));
    }
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObjects(markers, false)[0];
    hovered = hit ? hit.object : null;
    if (hovered) {
      tip.innerHTML = "<b></b><span></span>";
      tip.firstChild.textContent = hovered.userData.label; tip.lastChild.textContent = hovered.userData.sub;
      tip.style.left = (e.clientX - r.left) + "px"; tip.style.top = (e.clientY - r.top) + "px"; tip.hidden = false;
    } else tip.hidden = true;
    el.style.cursor = hovered ? "pointer" : (dragging ? "grabbing" : "grab");
  });

  function size() {
    const w = host.clientWidth, h = host.clientHeight || w;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size();
  const ro = "ResizeObserver" in window ? new ResizeObserver(size) : null; if (ro) ro.observe(host); else window.addEventListener("resize", size);

  let running = true, t0 = performance.now(), raf = 0;
  const tmp = new Vector3();
  function frame(now) {
    const t = (now - t0) / 1000;
    if (!dragging) {
      idle += 1;
      globe.rotation.y += vy; vy *= 0.94; vx *= 0.9;
      // after a pause, drift gently back to the home view and sway around it
      if (!o.reduced && idle > 150) {
        const ty = HOME_Y + Math.sin(t * 0.12) * 0.45;
        globe.rotation.y += (ty - globe.rotation.y) * 0.01;
        globe.rotation.x += (HOME_X - globe.rotation.x) * 0.01;
      }
    }
    pulses.forEach(p => { const k = ((t * 0.6 + p.phase) % 1); p.ring.scale.setScalar(1 + k * 2.2); p.ring.material.opacity = 0.6 * (1 - k); });
    arcs.forEach(a => {
      const k = o.reduced ? 1 : Math.min(1, ((t * 0.35 + a.offset) % 2.2));
      a.g.setDrawRange(0, Math.max(2, Math.floor(a.n * k)));
      const q = o.reduced ? 1 : ((t * 0.35 + a.offset) % 1);
      a.curve.getPoint(q, tmp); a.packet.position.copy(tmp); a.packet.visible = !o.reduced;
    });
    const s = t * 0.5;
    satellite.position.set(Math.cos(s) * 1.2, 0, Math.sin(s) * 1.2).applyEuler(orbit.rotation);
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  function setRunning(v) { if (v === running) return; running = v; if (v) { t0 = performance.now() - 0; raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf); }
  if ("IntersectionObserver" in window) new IntersectionObserver(es => setRunning(es[0].isIntersecting)).observe(host);
  document.addEventListener("visibilitychange", () => setRunning(!document.hidden));
  return { setRunning };
}

window.EvoluraGlobe = { init };
