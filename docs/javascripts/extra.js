/* ═══════════════════════════════════════════════════════════════
   ŁKS KM Szkoła Gortata — skrypty strony
   Uruchamiane przez document$ (Material, navigation.instant), więc
   działają też po przejściu między podstronami bez przeładowania.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var STORE_KEY = "lks-grupa";

  var NOTE_OPEN =
    "Do tej grupy prowadzimy otwarty nabór i doświadczenie nie jest potrzebne. " +
    "Zadzwoń lub napisz do biura — umówimy pierwsze zajęcia i spotkanie z trenerem.";

  var NOTE_IND =
    "Do tej grupy również przyjmujemy nowych zawodników. Zaczynamy od spotkania " +
    "z trenerem prowadzącym, żeby sprawdzić poziom zawodnika i wspólnie ocenić, " +
    "czy drużyna będzie dla niego dobrym miejscem. Spotkanie umówisz przez biuro.";

  /* ── Pamięć wyboru grupy ─────────────────────────────────────
     Rodzic grającego dziecka wybiera drużynę raz; przy kolejnych
     wizytach strona otwiera się od razu na jego grupie.           */
  function remember(key) {
    try { window.localStorage.setItem(STORE_KEY, key); } catch (e) { /* tryb prywatny */ }
  }
  function recall() {
    try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }

  /* ── Skład grup ────────────────────────────────────────────── */
  var ROSTER = [
    ["u11", "U11", "Adam Krzysztoń", true],
    ["u12", "U12", "Radosław Darnikowski", true],
    ["u13", "U13", "Maciej Kochaniak", false],
    ["u14", "U14", "Maciej Rudziński", false],
    ["u15", "U15", "Maciej Puczyński", false],
    ["u17", "U17", "Patryk Dembowski", false],
    ["u19", "U19", "Piotr Trepka", false]
  ];

  /* ── Adres główny witryny ────────────────────────────────────
     Odczytujemy go z odnośnika w logo, który generuje sam MkDocs —
     dzięki temu jest poprawny również wtedy, gdy witryna stoi
     w podkatalogu (GitHub Pages). Nie zgadujemy go z adresu okna,
     bo to właśnie na tym wcześniej się przewróciło.               */
  function siteRoot() {
    var logo = document.querySelector(".md-header__button.md-logo, .md-header a.md-header__button[href]");
    if (logo && logo.href) return logo.href.replace(/\/?$/, "/");

    var canonical = document.querySelector("link[rel=canonical]");
    if (canonical && canonical.href) {
      // strona główna = katalog kanoniczny
      return canonical.href.replace(/index\.html$/, "").replace(/\/?$/, "/");
    }
    return window.location.href.replace(/[^/]*$/, "");
  }

  /* ── Dane grup ───────────────────────────────────────────────
     Najpierw sprawdzamy blok danych wstrzyknięty przez szablon
     (adresy gotowe od Jinja). Jeśli go nie ma — składamy adresy
     względem korzenia witryny odczytanego wyżej.                  */
  function readGroups() {
    var el = document.getElementById("lks-groups-data");
    if (el) {
      try {
        var parsed = JSON.parse(el.textContent);
        if (parsed && parsed.u11) return parsed;
      } catch (e) { /* spadamy do wariantu zapasowego */ }
    }

    var root = siteRoot();
    var out = {};
    ROSTER.forEach(function (r) {
      out[r[0]] = {
        name: r[1],
        coach: r[2],
        open: r[3],
        img: root + "assets/" + r[0] + ".jpg",
        href: root + "strefa-rodzica/" + r[0] + "/"
      };
    });
    return out;
  }

  /* ── Wyszukiwarka grupy na stronie głównej ─────────────────── */
  function initFinder() {
    var wrap = document.getElementById("lks-finder");
    if (!wrap) return;

    // Przy nawigacji bez przeładowania document$ potrafi zadziałać
    // ponownie na tym samym elemencie — nie podpinamy zdarzeń dwa razy.
    if (wrap.dataset.lksReady === "1") return;
    wrap.dataset.lksReady = "1";

    var GROUPS = readGroups();

    var ages = document.getElementById("lks-ages");
    var res = document.getElementById("lks-res");
    var note = document.getElementById("lks-res-note");
    var img = document.getElementById("lks-res-img");
    var name = document.getElementById("lks-res-name");
    var tag = document.getElementById("lks-res-tag");
    var det = document.getElementById("lks-res-det");
    var go = document.getElementById("lks-res-go");
    if (!ages || !res) return;

    var buttons = ages.querySelectorAll(".lks-age");

    function show(key, btn) {
      var g = GROUPS[key];
      if (!g) return;

      buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      if (btn) btn.setAttribute("aria-pressed", "true");

      img.src = g.img;
      img.alt = "Drużyna " + g.name;
      name.textContent = g.name;
      tag.innerHTML = g.open
        ? '<span class="lks-tag lks-tag--open">Nabór otwarty</span>'
        : '<span class="lks-tag lks-tag--ind">Nabór indywidualny</span>';
      det.innerHTML =
        "Trener prowadzący: <strong>" + g.coach + "</strong><br>" +
        "Harmonogram i hala — zobacz stronę drużyny";
      go.href = g.href;
      note.textContent = g.open ? NOTE_OPEN : NOTE_IND;

      res.classList.add("is-on");
      note.classList.add("is-on");
      remember(key);
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        show(b.getAttribute("data-g"), b);
      });
    });

    // Powrót do zapamiętanej grupy
    var saved = recall();
    if (saved && GROUPS[saved]) {
      var match = null;
      buttons.forEach(function (b) {
        if (!match && b.getAttribute("data-g") === saved) match = b;
      });
      show(saved, match);
    }
  }

  /* ── Zapamiętanie grupy przy wejściu na jej podstronę ────────
     Wzorzec dopasowuje wyłącznie slugi grup młodzieżowych (u11…u19),
     więc nie wymaga listy drużyn.                                  */
  function rememberFromPath() {
    var m = window.location.pathname.match(/strefa-rodzica\/(u1[1-9])\/?$/);
    if (m) remember(m[1]);
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
    initFinder();
    rememberFromPath();
    initReveal();
    initExternalLinks();
  }

  if (typeof window.document$ !== "undefined") {
    window.document$.subscribe(initAll);
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
