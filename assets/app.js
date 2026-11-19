/* Evolura v2 engine. Renders everything from site.config.js. */
(function () {
  "use strict";
  var C = window.SITE;
  if (!C) { document.body.insertAdjacentHTML("afterbegin", "<p style='padding:20px'>site.config.js failed to load. Check it for a missing comma or quote.</p>"); return; }
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var li = function (a) { return (a || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var T = C.theme || {}, B = C.brand, K = C.contact;

  /* Theme */
  var root = document.documentElement.style;
  [["ink", "--ink"], ["body", "--body"], ["muted", "--muted"], ["bg", "--bg"], ["soft", "--soft"], ["line", "--line"], ["accent", "--accent"], ["accentSoft", "--accent-soft"], ["glowA", "--glow-a"], ["glowB", "--glow-b"]]
    .forEach(function (p) { if (T[p[0]]) root.setProperty(p[1], T[p[0]]); });

  /* Logo: a flat E inside an orbit */
  /* Strokes use currentColor and --mark-ac, so the logo changes colour smoothly with its container */
  function mark(literal) {
    var ink = literal ? (T.ink || "#0B1220") : "currentColor", ac = literal ? (T.accent || "#2F4FD8") : "var(--mark-ac)";
    return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="none" style="stroke:' + ink + '" stroke-width="2"/>' +
      '<ellipse cx="20" cy="20" rx="19" ry="7" transform="rotate(-24 20 20)" fill="none" style="stroke:' + ac + '" stroke-width="1.6"/>' +
      '<path d="M24.5 13.5h-9v13h9M15.5 20h7" fill="none" style="stroke:' + ink + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="36.2" cy="13.3" r="1.9" style="fill:' + ac + '"/></svg>';
  }
  var wm = function (light) { return mark(light) + '<span class="wm"><b>' + esc(B.name) + "</b><small>" + esc(B.suffix) + "</small></span>"; };
  var top = $("top");
  $("brand").innerHTML = wm(false);
  try {
    var fav = document.createElement("link"); fav.rel = "icon";
    fav.href = "data:image/svg+xml," + encodeURIComponent(mark(true).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
    document.head.appendChild(fav);
  } catch (e) {}

  /* Navigation: header is light-on-dark over the hero, then switches */
  $("nav").innerHTML = C.nav.map(function (n) { return '<a href="' + esc(n.href) + '">' + esc(n.label) + "</a>"; }).join("");
  /* Mobile menu: animated open and close, closes on Escape, outside tap or link choice */
  var navEl = $("nav"), burger = $("burger");
  function setMenu(open) {
    navEl.classList.toggle("open", open); top.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setMenu(!navEl.classList.contains("open")); });
  navEl.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", function (e) { if (navEl.classList.contains("open") && !e.target.closest("#top")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && navEl.classList.contains("open")) { setMenu(false); burger.focus(); } });

  /* Header state, throttled to one update per frame */
  var hero = document.querySelector(".hero"), ticking = false;
  function onScroll() {
    ticking = false;
    var dark = hero && hero.getBoundingClientRect().bottom > 74;
    top.classList.toggle("on-dark", !!dark);
    top.classList.toggle("scrolled", !dark);
    top.classList.toggle("lifted", scrollY > 8);
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();

  /* Scroll spy: the menu underlines the section you are reading */
  if ("IntersectionObserver" in window) {
    var links = [].slice.call(navEl.querySelectorAll("a"));
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t) spy.observe(t); });
  }

  /* Smooth scrolling (Lenis, MIT). Wheel and anchor scrolling glide; touch keeps native momentum. */
  var lenis = null;
  if (window.Lenis && !reduced) {
    try {
      document.documentElement.style.scrollBehavior = "auto";
      lenis = new window.Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true, wheelMultiplier: 0.95 });
      (function loop(t) { lenis.raf(t); requestAnimationFrame(loop); })(performance.now());
    } catch (e) { lenis = null; document.documentElement.style.scrollBehavior = ""; }
  }
  function glideTo(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });   // honours scroll-padding-top for the header
    else if (target === 0) scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute("href"); if (id.length < 2) return;
    var t = document.querySelector(id); if (!t) return;
    e.preventDefault(); glideTo(t);
    try { history.replaceState(null, "", id); } catch (_) {}
  });

  /* Hero */
  var H = C.hero;
  $("heroEyebrow").textContent = H.eyebrow; $("heroTitle").textContent = H.title; $("heroText").textContent = H.text;
  $("heroPrimary").textContent = H.primary; $("heroSecondary").textContent = H.secondary;

  /* Interactive 3D hero (three.js). Without WebGL, a static illustration stays. */
  (function () {
    var stage = $("stage");
    if (!window.EvoluraHero) return;
    var scenes = H.scenes || [];
    var dots = $("sceneDots");
    dots.innerHTML = scenes.map(function (s, i) { return '<button type="button" role="tab" data-i="' + i + '" aria-label="' + esc(s.word) + '"></button>'; }).join("");
    var api = window.EvoluraHero.init(stage, {
      colorA: T.glowA, colorB: T.glowB, scenes: scenes, reduced: reduced,
      onScene: function (i) {
        $("sceneWord").textContent = scenes[i] ? scenes[i].word : "";
        [].forEach.call(dots.children, function (d, k) { d.setAttribute("aria-selected", k === i); });
      }
    });
    if (!api) return;
    var fb = stage.querySelector(".stage-fallback"); if (fb) fb.remove();
    $("sceneUi").hidden = false;
    dots.addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (b) api.go(+b.getAttribute("data-i")); });
  })();

  /* ---------- Services: 3D ring carousel, one group at a time ---------- */
  var groupOf = {}; C.serviceGroups.forEach(function (g) { groupOf[g.id] = g.label; });
  var groups = C.serviceGroups.filter(function (g) { return g.id !== "all"; });
  var ICON = {
    apps: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
    digital: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    ai: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/><circle cx="12" cy="12" r="3"/>'
  };
  var icon = function (g) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[g] || ICON.apps) + "</svg>"; };
  var two = function (n) { return (n < 9 ? "0" : "") + (n + 1); };
  var ring = $("ring"), stage = $("ringStage"), curG = groups[0].id, list = [], active = 0, angle = 0, R = 300, spin = 0, autoT = null, touched = false;
  var dragX = null, dragMoved = false;

  /* Cards sit on an arc: the active card faces the viewer, neighbours turn away on either side. */
  var lastD = [];
  function idxOf() { var n = list.length; return ((active % n) + n) % n; }
  function offset(i) { var n = list.length, d = i - idxOf(); if (d > n / 2) d -= n; if (d < -n / 2) d += n; return d; }
  function setRing(animate) {
    [].forEach.call(ring.children, function (el, i) {
      var d = offset(i), ad = Math.abs(d);
      var jump = lastD[i] != null && Math.abs(lastD[i] - d) > 1;          // wrapped round the back: move without animating
      el.style.transition = animate === false || jump || reduced ? "none" : "";
      el.style.transform = "rotateY(" + (d * angle + spin) + "deg) translateZ(" + R + "px)";
      el.style.opacity = ad > 2 ? 0 : (ad === 2 ? 0.35 : 1);
      el.style.pointerEvents = ad > 1 ? "none" : "";
      el.style.zIndex = 10 - ad;
      lastD[i] = d;
    });
  }
  function layoutRing() {
    var cw = ring.firstChild ? ring.firstChild.offsetWidth : 220;
    angle = 34; R = Math.round(cw * 1.9);
    ring.style.transform = "translateZ(-" + R + "px)";
    lastD = []; turn(false);
  }
  function turn(animate) {
    setRing(animate);
    var n = list.length, idx = idxOf();
    [].forEach.call(ring.children, function (el, i) { el.classList.toggle("front", i === idx); el.setAttribute("aria-pressed", i === idx); });
    var s = list[idx];
    $("ringCount").textContent = two(idx) + " / " + two(n - 1);
    $("svcDetail").innerHTML = '<p class="eyebrow">' + esc(groupOf[s.group]) + "</p><h3>" + esc(s.title) + '</h3><p class="d-lead">' + esc(s.short) + '</p><ul class="d-points">' + li(s.points) +
      '</ul><a class="btn" href="#contact" data-pick="' + esc(s.title) + '">Discuss this service <span aria-hidden="true">&#8594;</span></a>';
    var det = $("svcDetail"); det.classList.remove("swap"); void det.offsetWidth; det.classList.add("swap");
    restartProg();
  }
  function restartProg() {
    var p = $("ringProg"); if (!p) return;
    p.classList.toggle("off", touched || reduced);
    p.classList.remove("run"); void p.offsetWidth; if (!touched && !reduced) p.classList.add("run");
  }
  function renderRing() {
    list = C.services.filter(function (s) { return s.group === curG; });
    $("serviceTabs").innerHTML = groups.map(function (g) {
      var n = C.services.filter(function (s) { return s.group === g.id; }).length;
      return '<button class="seg-b" role="tab" type="button" aria-selected="' + (g.id === curG) + '" data-g="' + esc(g.id) + '">' + icon(g.id) + "<span>" + esc(g.label) + "</span><em>" + n + "</em></button>";
    }).join("");
    $("serviceTabs").insertAdjacentHTML("afterbegin", '<span class="seg-ind" aria-hidden="true"></span>');
    ring.innerHTML = list.map(function (s, i) {
      return '<button class="r-card" type="button" data-i="' + i + '"><span class="r-ico">' + icon(s.group) + '</span><span class="r-num">' + two(i) + "</span><b>" + esc(s.title) + "</b></button>";
    }).join("");
    active = 0; spin = 0;
    layoutRing(); moveInd();
  }
  function moveInd() {
    var sel = $("serviceTabs").querySelector('[aria-selected="true"]'), ind = $("serviceTabs").querySelector(".seg-ind");
    if (!sel || !ind) return;
    ind.style.cssText = "left:" + sel.offsetLeft + "px;top:" + sel.offsetTop + "px;width:" + sel.offsetWidth + "px;height:" + sel.offsetHeight + "px";
  }
  /* Keep the detail panel at the height of its longest service, so the page never jumps while the ring turns */
  function lockDetail() {
    var det = $("svcDetail"), w = det.getBoundingClientRect().width; if (!w) return;
    var probe = det.cloneNode(false); probe.removeAttribute("id"); probe.classList.remove("swap");
    probe.style.cssText = "position:absolute;visibility:hidden;left:-9999px;top:0;min-height:0;width:" + w + "px";
    document.body.appendChild(probe);
    var max = 0;
    C.services.forEach(function (s) {
      probe.innerHTML = '<p class="eyebrow">' + esc(groupOf[s.group]) + "</p><h3>" + esc(s.title) + '</h3><p class="d-lead">' + esc(s.short) + '</p><ul class="d-points">' + li(s.points) + '</ul><a class="btn" href="#contact">Discuss this service <span>&#8594;</span></a>';
      max = Math.max(max, probe.getBoundingClientRect().height);
    });
    probe.remove();
    det.style.minHeight = Math.ceil(max) + "px";
  }
  lockDetail();
  addEventListener("resize", function () { $("svcDetail").style.minHeight = ""; lockDetail(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockDetail);
  function go(i) { active = i; spin = 0; turn(); }
  function stopAuto() { touched = true; clearInterval(autoT); restartProg(); }
  function startAuto() { clearInterval(autoT); if (!reduced && !touched) autoT = setInterval(function () { go(active + 1); }, 4500); }
  renderRing(); startAuto();
  addEventListener("resize", function () { layoutRing(); moveInd(); });
  $("serviceTabs").addEventListener("click", function (e) { var b = e.target.closest("[data-g]"); if (b) { curG = b.getAttribute("data-g"); stopAuto(); renderRing(); } });
  $("ringPrev").addEventListener("click", function () { stopAuto(); go(active - 1); });
  $("ringNext").addEventListener("click", function () { stopAuto(); go(active + 1); });
  ring.addEventListener("click", function (e) {
    var c = e.target.closest("[data-i]"); if (!c || dragMoved) return;
    var n = list.length, d = +c.getAttribute("data-i") - idxOf();
    if (d > n / 2) d -= n; if (d < -n / 2) d += n;
    stopAuto(); go(active + d);
  });
  /* Drag to spin, then snap to the nearest card */
  stage.addEventListener("pointerdown", function (e) { dragX = e.clientX; dragMoved = false; });
  addEventListener("pointermove", function (e) {
    if (dragX == null) return;
    var dx = e.clientX - dragX; if (Math.abs(dx) > 5) dragMoved = true;
    spin = dx * 0.12; setRing(false);
  });
  addEventListener("pointerup", function () {
    if (dragX == null) return;
    dragX = null;
    if (dragMoved) { stopAuto(); active -= Math.round(spin / angle); spin = 0; turn(); setTimeout(function () { dragMoved = false; }, 0); }
    else { spin = 0; setRing(); }
  });
  stage.addEventListener("mouseenter", function () { clearInterval(autoT); $("ringProg").classList.add("off"); });
  stage.addEventListener("mouseleave", function () { startAuto(); restartProg(); });
  /* Soft tilt of the whole ring with the pointer */
  if (fine && !reduced) {
    stage.addEventListener("pointermove", function (e) {
      if (dragX != null) return;
      var r = stage.getBoundingClientRect(), y = (e.clientY - r.top) / r.height - 0.5, x = (e.clientX - r.left) / r.width - 0.5;
      ring.style.transform = "translateZ(-" + R + "px) rotateX(" + (-y * 7).toFixed(2) + "deg) rotateZ(" + (x * 1.5).toFixed(2) + "deg)";
    });
    stage.addEventListener("pointerleave", function () { ring.style.transform = "translateZ(-" + R + "px)"; });
  }
  stage.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { stopAuto(); go(active + 1); } if (e.key === "ArrowLeft") { stopAuto(); go(active - 1); } });

  /* Pick a service into the contact form */
  document.addEventListener("click", function (e) { var p = e.target.closest("[data-pick]"); if (p) $("f-service").value = p.getAttribute("data-pick"); });

  /* Principles (dark band) */
  var P = C.principles;
  $("prinHeading").textContent = P.heading; $("prinText").textContent = P.text;
  $("principleList").innerHTML = P.items.map(function (p) { return '<div class="principle"><h3>' + esc(p.t) + "</h3><p>" + esc(p.d) + "</p></div>"; }).join("");

  /* ---------- Industries: 3D coverflow ---------- */
  var I = C.industries, fcur = 0, fN = I.items.length;
  $("indHeading").textContent = I.heading; $("indText").textContent = I.text;
  $("flowTrack").innerHTML = I.items.map(function (x, i) {
    return '<article class="f-card" data-i="' + i + '"><span class="f-num">' + two(i) + " / " + two(fN - 1) + "</span><h3>" + esc(x.name) + "</h3><ul>" + li(x.lines) + "</ul></article>";
  }).join("");
  $("flowDots").innerHTML = I.items.map(function (x, i) { return '<button type="button" role="tab" data-i="' + i + '" aria-label="' + esc(x.name) + '"></button>'; }).join("");
  function flow() {
    var narrow = innerWidth < 700;
    [].forEach.call($("flowTrack").children, function (el, i) {
      var d = i - fcur, ad = Math.abs(d);
      el.style.transform = "translateX(calc(-50% + " + (d * (narrow ? 82 : 70)) + "%)) translateZ(" + (-ad * 200) + "px) rotateY(" + (-Math.sign(d) * Math.min(ad, 2) * 34) + "deg)";
      el.style.zIndex = 10 - ad; el.style.opacity = ad > 2 ? 0 : (ad === 2 ? 0.3 : (ad === 1 ? 0.75 : 1));
      el.classList.toggle("on", d === 0); el.style.pointerEvents = ad > 2 ? "none" : "";
      el.setAttribute("aria-hidden", d !== 0);
    });
    [].forEach.call($("flowDots").children, function (b, i) { b.setAttribute("aria-selected", i === fcur); });
    $("flowPrev").disabled = fcur === 0; $("flowNext").disabled = fcur === fN - 1;
  }
  function fgo(i) { fcur = Math.max(0, Math.min(fN - 1, i)); flow(); }
  flow(); addEventListener("resize", flow);
  $("flowPrev").addEventListener("click", function () { fgo(fcur - 1); });
  $("flowNext").addEventListener("click", function () { fgo(fcur + 1); });
  $("flowDots").addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (b) fgo(+b.getAttribute("data-i")); });
  $("flowTrack").addEventListener("click", function (e) { var c = e.target.closest("[data-i]"); if (c) fgo(+c.getAttribute("data-i")); });
  var fx = null;
  $("flow").addEventListener("pointerdown", function (e) { fx = e.clientX; });
  addEventListener("pointerup", function (e) { if (fx == null) return; var dx = e.clientX - fx; fx = null; if (Math.abs(dx) > 40) fgo(fcur + (dx < 0 ? 1 : -1)); });

  /* Feature blocks */
  var visuals = {
    team: function () {
      var roles = ["Solution lead", "Engineer", "Consultant", "QA"];
      var rows = C.approach.steps.slice(0, 5).map(function (s) {
        return '<div class="v-row"><b>' + esc(s.t) + '</b><span class="v-team">' + roles.map(function (r) { return "<i title=\"" + r + "\">" + r.split(" ").map(function (w) { return w[0]; }).join("") + "</i>"; }).join("") + "<em>Same team</em></span></div>";
      }).join("");
      return '<div class="v-card">' + rows + "</div>";
    },
    code: function () {
      return '<div class="v-card v-code"><div class="bar"><i></i><i></i><i></i>SalesTable_Extension.xpp</div><pre><code><s>// Extend, never overlayer.</s>\n[<em>ExtensionOf</em>(tableStr(SalesTable))]\n<em>final class</em> SalesTable_Extension\n{\n    <em>public void</em> insert()\n    {\n        <em>next</em> insert();\n        <s>// raise a business event</s>\n    }\n}</code></pre></div>';
    }
  };
  $("features").innerHTML = C.features.map(function (f) {
    return '<div class="feature"><div><p class="eyebrow">' + esc(f.kicker) + "</p><h3>" + esc(f.title) + "</h3><p>" + esc(f.text) + '</p></div><div class="f-visual">' + (visuals[f.visual] ? visuals[f.visual]() : "") + "</div></div>";
  }).join("");

  /* Approach and technology */
  $("approachHeading").textContent = C.approach.heading; $("approachText").textContent = C.approach.text;
  $("steps").innerHTML = C.approach.steps.map(function (s) { return "<li><h3>" + esc(s.t) + "</h3><p>" + esc(s.d) + "</p></li>"; }).join("");
  $("platformHeading").textContent = C.platforms.heading;
  $("techGroups").innerHTML = C.platforms.groups.map(function (g) { return '<div class="tech-g"><h3>' + esc(g.name) + '</h3><ul class="chips">' + li(g.items) + "</ul></div>"; }).join("");
  $("platformNote").textContent = C.platforms.note;

  /* About */
  var A = C.about;
  $("aboutHeading").textContent = A.heading;
  $("aboutText").innerHTML = A.text.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  var facts = (A.facts || []).filter(function (f) { return f.v; });
  $("aboutAside").innerHTML =
    (facts.length ? '<dl class="facts">' + facts.map(function (f) { return "<div><dt>" + esc(f.k) + "</dt><dd>" + esc(f.v) + "</dd></div>"; }).join("") + "</dl>" : "") +
    '<h3>Ways to work with us</h3><ul class="models">' + (A.models || []).map(function (m) { return "<li><b>" + esc(m.t) + "</b><span>" + esc(m.d) + "</span></li>"; }).join("") + "</ul>";

  /* Contact form */
  $("contactHeading").textContent = C.contactSection.heading;
  $("contactText").textContent = C.contactSection.text + (K.replyPromise ? " " + K.replyPromise : "");
  $("f-service").innerHTML = '<option value="">Choose a service (optional)</option>' + C.services.map(function (s) { return "<option>" + esc(s.title) + "</option>"; }).join("") + "<option>Something else</option>";
  var msgEl = $("f-msg");
  msgEl.addEventListener("input", function () { $("count").textContent = msgEl.value.length + " / " + msgEl.maxLength; });
  var emailOK = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, out = $("formMsg");
    if ($("f-bot").checked) return;
    var d = { Name: f.name.value.trim(), Email: f.email.value.trim(), Company: f.company.value.trim(), Country: f.country.value.trim(), Service: f.service.value, Project: f.message.value.trim() };
    if (!d.Name || !emailOK(d.Email) || !d.Project) { out.textContent = "Please add your name, a valid email and a few words about the project."; return; }
    if (!$("f-consent").checked) { out.textContent = "Please tick the consent box so we can reply."; return; }
    var body = Object.keys(d).map(function (k) { return k + ": " + d[k]; }).join("\n");
    var mailto = "mailto:" + K.email + "?subject=" + encodeURIComponent("Website enquiry from " + d.Name) + "&body=" + encodeURIComponent(body);
    if (!K.web3formsKey) { out.innerHTML = 'To send, <a href="' + esc(mailto) + '">open your email app</a> or write to <b>' + esc(K.email) + "</b>."; return; }
    out.textContent = "Sending...";
    var payload = { access_key: K.web3formsKey, subject: "Website enquiry from " + d.Name, from_name: B.legalName + " website" };
    Object.keys(d).forEach(function (k) { payload[k] = d[k]; });
    fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j.success) { out.textContent = "Thank you. Your enquiry has been sent."; f.reset(); $("count").textContent = "0 / 1500"; } else throw 0; })
      .catch(function () { out.innerHTML = 'Sending failed. Please <a href="' + esc(mailto) + '">email us directly</a>.'; });
  });

  /* Footer */
  var office = C.offices && C.offices.length
    ? C.offices.map(function (o) { return "<li><b style='color:#fff'>" + esc(o.city) + ", " + esc(o.country) + "</b><br>" + esc(o.address || "") + (o.phone ? "<br>" + esc(o.phone) : "") + "</li>"; }).join("")
    : "<li>" + esc(C.deliveryNote) + "</li>";
  var contactLines = '<li><a href="mailto:' + esc(K.email) + '">' + esc(K.email) + "</a></li>" + (K.phone ? "<li>" + esc(K.phone) + "</li>" : "") +
    (K.whatsapp ? '<li><a href="https://wa.me/' + esc(K.whatsapp) + '" target="_blank" rel="noopener">WhatsApp</a></li>' : "") +
    (K.linkedin ? '<li><a href="' + esc(K.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a></li>' : "");
  var svcCol = function (g) { return C.services.filter(function (s) { return s.group === g; }).map(function (s) { return '<li><a href="#services">' + esc(s.title) + "</a></li>"; }).join(""); };
  $("footGrid").innerHTML =
    '<div><a class="brand" href="#main">' + wm(false) + "</a><p>" + esc(B.tagline) + "</p></div>" +
    "<div><h4>Business applications</h4><ul>" + svcCol("apps") + "</ul></div>" +
    "<div><h4>Web, mobile and AI</h4><ul>" + svcCol("digital") + svcCol("ai") + "</ul></div>" +
    "<div><h4>Company</h4><ul>" + C.nav.map(function (n) { return '<li><a href="' + esc(n.href) + '">' + esc(n.label) + "</a></li>"; }).join("") + '<li><a href="privacy.html">Privacy policy</a></li></ul><h4 style="margin-top:28px">Contact</h4><ul>' + contactLines + office + "</ul></div>";
  $("footBase").innerHTML = "<span>&copy; " + new Date().getFullYear() + " " + esc(B.legalName) + ". All rights reserved.</span><span>" + esc(C.platforms.note) + "</span>";

  /* ---------- 3D back-to-top button with scroll progress ring ---------- */
  (function () {
    var btn = $("toTop"), bar = $("ttBar"), face = $("ttFace");
    if (!btn) return;
    var C2 = 2 * Math.PI * 26;
    bar.style.strokeDasharray = C2.toFixed(1);
    function update() {
      var max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, scrollY / max) : 0;
      bar.style.strokeDashoffset = (C2 * (1 - p)).toFixed(1);
      var show = scrollY > innerHeight * 0.8;
      btn.classList.toggle("show", show);
      btn.tabIndex = show ? 0 : -1;
    }
    var tt = false;
    addEventListener("scroll", function () { if (!tt) { tt = true; requestAnimationFrame(function () { tt = false; update(); }); } }, { passive: true }); addEventListener("resize", update); update();
    if (fine && !reduced) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        face.style.setProperty("--rx", (-y * 28).toFixed(1) + "deg"); face.style.setProperty("--ry", (x * 28).toFixed(1) + "deg");
      });
      btn.addEventListener("pointerleave", function () { face.style.setProperty("--rx", "0deg"); face.style.setProperty("--ry", "0deg"); });
    }
    btn.addEventListener("click", function () {
      btn.classList.remove("launch"); void btn.offsetWidth; btn.classList.add("launch");
      glideTo(0);
      var brand = $("brand"); if (brand) setTimeout(function () { brand.focus({ preventScroll: true }); }, reduced ? 0 : 700);
    });
  })();

  /* Gentle reveal */
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { threshold: 0.12 });
    document.querySelectorAll(".sec-head, .svc3d, .principles, .flow, .feature, .steps, .tech, .about, .form").forEach(function (el) {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("rv"); io.observe(el); }
    });
  }
})();
