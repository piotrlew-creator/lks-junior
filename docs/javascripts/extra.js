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
    frame.title = box.getAttribute("data-title") || "Najnowsze posty z Facebooka";
    frame.style.width = w + "px";
    frame.style.height = h + "px";
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("allowfullscreen", "true");
    frame.setAttribute("loading", "lazy");
    frame.setAttribute("allow", "encrypted-media; clipboard-write; picture-in-picture; web-share");

    slot.replaceWith(frame);
  }

  // Na stronie może być kilka profili (Klub i 1. liga). Zgoda jest
  // jedna — po kliknięciu wczytujemy wszystkie.
  function initFacebook() {
    var boxes = document.querySelectorAll(".lks-fb");
    if (!boxes.length) return;
    var todo = [];
    boxes.forEach(function (box) {
      if (box.dataset.lksReady === "1") return;
      box.dataset.lksReady = "1";
      todo.push(box);
    });
    if (!todo.length) return;

    if (fbAllowed()) { todo.forEach(fbRender); return; }

    todo.forEach(function (box) {
      var btn = box.querySelector(".lks-fb__btn");
      if (!btn) return;
      btn.addEventListener("click", function () {
        fbAllow();
        document.querySelectorAll(".lks-fb").forEach(fbRender);
      });
    });
  }

  /* ── Odsłanianie sekcji przy przewijaniu ────────────────────
     Sekcje są w CSS domyślnie widoczne — dopiero tu dokładamy klasę
     .lks-reveal--js, która włącza chowanie i animację. Dzięki temu
     ktoś bez JavaScriptu (albo z zablokowanym skryptem) zawsze widzi
     całą stronę, zamiast połowy pustych sekcji.                     */
  function initReveal() {
    var items = document.querySelectorAll(".lks-reveal");
    if (!items.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

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

    items.forEach(function (el) {
      el.classList.add("lks-reveal--js");
      io.observe(el);
    });
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

  /* ── Menu na telefonie: szukanie i tryb jasny/ciemny ──────────
     W wąskim pasku zostają tylko herb, ikona menu i nazwa klubu, więc
     lupa i przełącznik motywu są u dołu otwartego menu. Przyciski
     tylko wywołują oryginalne kontrolki Materiala (po zmianie
     motywu zapamiętuje go sam motyw), a bez JavaScriptu wciąż
     działa wyszukiwarka z paska na szerszych ekranach.            */
  function initDrawerTools() {
    var panel = document.querySelector(".md-sidebar--primary");
    if (!panel || panel.querySelector(".lks-drawer-tools")) return;

    var bar = document.createElement("div");
    bar.className = "lks-drawer-tools";

    var theme = document.createElement("button");
    theme.type = "button";
    theme.className = "lks-drawer-tools__btn lks-drawer-tools__theme";

    function dark() {
      return document.body.getAttribute("data-md-color-scheme") === "slate";
    }
    function label() {
      theme.textContent = dark() ? "Tryb jasny" : "Tryb ciemny";
    }
    theme.addEventListener("click", function () {
      var opts = document.querySelectorAll(".md-header__option label");
      for (var i = 0; i < opts.length; i++) {
        if (!opts[i].hidden) { opts[i].click(); break; }
      }
      window.setTimeout(label, 60);
    });
    label();

    bar.appendChild(theme);
    panel.appendChild(bar);
  }

  /* ── Etykiety dla czytników ekranu (okno wyszukiwania, pasek ładowania) ── */
  function initAria() {
    var s = document.querySelector(".md-search");
    if (s && !s.getAttribute("aria-label")) s.setAttribute("aria-label", "Wyszukiwarka");
    var pr = document.querySelector(".md-progress");
    if (pr && !pr.getAttribute("aria-label")) pr.setAttribute("aria-label", "Ładowanie strony");
    /* Pasek postępu Materiala to dekoracja ładowania — czytniki ekranu go pomijają. */
    if (pr) pr.setAttribute("aria-hidden", "true");
    /* Zagnieżdżone menu (np. „Nasze drużyny”) dostaje własną nazwę, żeby każda
       nawigacja na stronie była rozróżnialna dla czytników ekranu. */
    document.querySelectorAll("nav.md-nav[aria-labelledby]").forEach(function (nav) {
      var lbl = document.getElementById(nav.getAttribute("aria-labelledby"));
      if (lbl && lbl.textContent.trim()) return;
      var item = nav.parentElement;
      var link = item && item.querySelector(":scope > .md-nav__link, :scope > label.md-nav__link, :scope > div > .md-nav__link");
      var name = link ? link.textContent.trim() : "";
      nav.removeAttribute("aria-labelledby");
      nav.setAttribute("aria-label", name ? "Podmenu: " + name : "Podmenu");
    });
    document.querySelectorAll("nav.md-post__action").forEach(function (nav, i) {
      var post = nav.closest("article");
      var h = post && post.querySelector("h2, h1");
      nav.setAttribute("aria-label", "Czytaj dalej: " + (h ? h.textContent.trim() : "wpis " + (i + 1)));
    });
  }

  function initAll() {
    initAria();
    initFacebook();
    initReveal();
    initExternalLinks();
    initDrawerTools();
  }

  if (typeof window.document$ !== "undefined") {
    window.document$.subscribe(initAll);
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
