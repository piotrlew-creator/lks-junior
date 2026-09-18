/* ═══════════════════════════════════════════════════════════════
   ŁKS KM Szkoła Gortata — skrypty strony
   Uruchamiane przez document$ (Material, navigation.instant), więc
   działają też po przejściu między podstronami bez przeładowania.

   Zasada: skrypt jest wyłącznie dodatkiem. Nawigacja po drużynach
   opiera się na zwykłych odnośnikach w szablonie i działa również
   przy wyłączonym JavaScript.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var STORE_KEY = "lks-grupa";

  /* ── Pamięć wyboru drużyny ───────────────────────────────────
     Rodzic grającego dziecka wchodzi na stronę swojej drużyny;
     przy kolejnej wizycie jej kafel jest wyróżniony na stronie
     głównej.                                                      */
  function remember(key) {
    try { window.localStorage.setItem(STORE_KEY, key); } catch (e) { /* tryb prywatny */ }
  }
  function recall() {
    try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }

  /* ── Zapamiętanie drużyny przy wejściu na jej podstronę ──────
     Wzorzec dopasowuje slugi grup młodzieżowych (u11…u19) oraz
     zespołu seniorskiego, więc nie wymaga listy drużyn.           */
  function rememberFromPath() {
    var m = window.location.pathname.match(/strefa-rodzica\/(u1[1-9]|dwa-liga)\/?$/);
    if (m) remember(m[1]);
  }

  /* ── Wyróżnienie zapamiętanej drużyny na stronie głównej ───── */
  function initMyTeam() {
    var wrap = document.getElementById("lks-teams");
    if (!wrap) return;

    var saved = recall();
    if (!saved) return;

    var tile = wrap.querySelector('.lks-group[data-g="' + saved + '"]');
    if (!tile || tile.classList.contains("is-mine")) return;

    tile.classList.add("is-mine");

    var badge = document.createElement("span");
    badge.className = "lks-group__mine";
    badge.textContent = "Twoja drużyna";

    // Plakietka trafia pod nazwę drużyny, nad nazwisko trenera.
    var coach = tile.querySelector(".lks-group__coach");
    if (coach) tile.insertBefore(badge, coach);
    else tile.appendChild(badge);
  }

  /* ── Odsłanianie sekcji przy przewijaniu ──────────────────── */
  function initReveal() {
    var items = document.querySelectorAll(".lks-reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) { io.observe(el); });
  }

  /* ── Linki zewnętrzne otwierane w nowej karcie ────────────── */
  function initExternalLinks() {
    var host = window.location.hostname;
    document.querySelectorAll(".md-content a[href^='http']").forEach(function (a) {
      if (a.hostname && a.hostname !== host) {
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }

  function initAll() {
    rememberFromPath();
    initMyTeam();
    initReveal();
    initExternalLinks();
  }

  if (typeof window.document$ !== "undefined") {
    window.document$.subscribe(initAll);
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
