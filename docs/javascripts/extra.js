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

  /* ── Posty z Facebooka ───────────────────────────────────────
     Wtyczka Meta ładuje się dopiero po kliknięciu — dopóki tego nie
     ma, strona nie wysyła do Facebooka żadnego zapytania. Zgodę
     zapamiętujemy, więc przy kolejnych wizytach posty pokazują się
     od razu.                                                       */
  var FB_OK_KEY = "lks-fb-ok";

  function fbAllowed() {
    try { return window.localStorage.getItem(FB_OK_KEY) === "1"; } catch (e) { return false; }
  }
  function fbAllow() {
    try { window.localStorage.setItem(FB_OK_KEY, "1"); } catch (e) { /* tryb prywatny */ }
  }

  function fbRender(box) {
    var slot = box.querySelector(".lks-fb__slot");
    if (!slot) return;

    var href = box.getAttribute("data-href");
    if (!href) return;

    // Wtyczka ustala szerokość w chwili wczytania i później jej nie
    // zmienia, więc mierzymy kontener sami. Meta przyjmuje 180–500 px.
    var w = Math.max(180, Math.min(500, Math.floor(slot.clientWidth || box.clientWidth || 500)));
    var h = parseInt(box.getAttribute("data-height"), 10) || 700;

    var src =
      "https://www.facebook.com/plugins/page.php?href=" + encodeURIComponent(href) +
      "&tabs=timeline&width=" + w + "&height=" + h +
      "&small_header=false&adapt_container_width=true&hide_cover=false" +
      "&show_facepile=false&locale=pl_PL";

    var frame = document.createElement("iframe");
    frame.className = "lks-fb__frame";
    frame.src = src;
    frame.width = String(w);
    frame.height = String(h);
    frame.title = "Najnowsze posty z profilu klubu na Facebooku";
    frame.style.width = w + "px";
    frame.style.height = h + "px";
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("allowfullscreen", "true");
    frame.setAttribute("loading", "lazy");
    frame.setAttribute("allow", "encrypted-media; clipboard-write; picture-in-picture; web-share");

    slot.replaceWith(frame);
  }

  function initFacebook() {
    var box = document.querySelector(".lks-fb");
    if (!box || box.dataset.lksReady === "1") return;
    box.dataset.lksReady = "1";

    if (fbAllowed()) { fbRender(box); return; }

    var btn = box.querySelector(".lks-fb__btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      fbAllow();
      fbRender(box);
    });
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
    initFacebook();
    initReveal();
    initExternalLinks();
  }

  if (typeof window.document$ !== "undefined") {
    window.document$.subscribe(initAll);
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
