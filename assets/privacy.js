/* Renders privacy.html from site.config.js */
(function () {
  var C = window.SITE; if (!C) return;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var T = C.theme || {}, r = document.documentElement.style;
  [["ink", "--ink"], ["body", "--body"], ["muted", "--muted"], ["bg", "--bg"], ["soft", "--soft"], ["line", "--line"], ["accent", "--accent"], ["accentSoft", "--accent-soft"]]
    .forEach(function (p) { if (T[p[0]]) r.setProperty(p[1], T[p[0]]); });
  document.getElementById("brand").innerHTML = '<span class="wm"><b>' + esc(C.brand.name) + "</b><small>" + esc(C.brand.suffix) + "</small></span>";
  document.getElementById("updated").textContent = "Last updated " + C.privacy.lastUpdated + ". This policy covers this website. Questions: " + C.contact.email;
  document.getElementById("policy").innerHTML = C.privacy.sections.map(function (s) {
    return '<h2 style="font-size:1.4rem;margin:36px 0 10px">' + esc(s.h) + "</h2><p>" + esc(s.p) + "</p>";
  }).join("");
})();
