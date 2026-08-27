/* ═══════════════════════════════════════════════════════════════
   ŁKS KM JUNIOR — funkcje ułatwiające życie rodzicom:
   1) szybki filtr drużyny/rocznika (dropdown nad zakładkami)
   2) „Dodaj do kalendarza” — pobranie .ics oraz link do Google Calendar
   3) drobne usprawnienia UX (linki zewnętrzne w nowej karcie)

   Uwaga dla przyszłego edytora treści:
   - Sezon (do generowania cyklicznych treningów w kalendarzu) ustaw
     w stałych SEASON_START / SEASON_END poniżej na początku każdego
     roku szkolnego.
   - Skrypt NIE wymaga edycji przy zmianie treści harmonogramu/turniejów
     — dane są czytane bezpośrednio z tabel w Markdown.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // Pierwszy i ostatni dzień sezonu, dla którego generujemy cykliczne
  // wydarzenia treningowe w kalendarzu (format RRRR-MM-DD).
  var SEASON_START = "2026-09-01";
  var SEASON_END = "2027-06-30";

  var DAY_TO_ICS = {
    "Poniedziałek": "MO",
    "Wtorek": "TU",
    "Środa": "WE",
    "Czwartek": "TH",
    "Piątek": "FR",
    "Sobota": "SA",
    "Niedziela": "SU"
  };
  var DAY_ORDER = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

  function pad(n) { return String(n).padStart(2, "0"); }

  function slugify(str) {
    return str
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function escapeICS(str) {
    return String(str || "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  }

  function icsStamp(date) {
    return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate()) +
      "T" + pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds()) + "Z";
  }

  function downloadICS(filename, vevents) {
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ŁKS KM Junior//Harmonogram//PL",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ].concat(vevents).concat(["END:VCALENDAR"]);
    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  // Zwraca datę (lokalną, bez strefy) pierwszego wystąpienia danego
  // dnia tygodnia (ICS: MO/TU/...) na lub po dacie startowej.
  function firstOccurrence(startISO, icsDay) {
    var target = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"].indexOf(icsDay);
    var d = new Date(startISO + "T00:00:00");
    while (d.getDay() !== target) d.setDate(d.getDate() + 1);
    return d;
  }

  function buildTrainingVEvent(opts) {
    // opts: team, day, startTime, endTime, location, coach, contact, index
    var icsDay = DAY_TO_ICS[opts.day];
    if (!icsDay) return null;
    var first = firstOccurrence(SEASON_START, icsDay);
    var y = first.getFullYear(), m = pad(first.getMonth() + 1), d = pad(first.getDate());
    var untilDate = SEASON_END.replace(/-/g, "");
    var uid = slugify(opts.team) + "-" + icsDay.toLowerCase() + "-" + opts.startTime.replace(":", "") +
      "-" + opts.index + "@lks-km-junior";
    var desc = "Trener: " + (opts.coach || "—") +
      (opts.contact ? "\\nKontakt: " + escapeICS(opts.contact) : "") +
      "\\nWygenerowano ze strony ŁKS KM Junior.";
    return [
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + icsStamp(new Date()),
      "DTSTART:" + y + m + d + "T" + opts.startTime.replace(":", "") + "00",
      "DTEND:" + y + m + d + "T" + opts.endTime.replace(":", "") + "00",
      "RRULE:FREQ=WEEKLY;BYDAY=" + icsDay + ";UNTIL=" + untilDate + "T235959",
      "SUMMARY:" + escapeICS("Trening ŁKS KM Junior – " + opts.team),
      "LOCATION:" + escapeICS(opts.location),
      "DESCRIPTION:" + desc,
      "END:VEVENT"
    ].join("\r\n");
  }

  function buildTournamentVEvent(opts) {
    // opts: team, dateISO (YYYY-MM-DD), city, name, link, index
    var d = opts.dateISO.replace(/-/g, "");
    var next = new Date(opts.dateISO + "T00:00:00");
    next.setDate(next.getDate() + 1);
    var d2 = next.getFullYear() + pad(next.getMonth() + 1) + pad(next.getDate());
    var uid = slugify(opts.team) + "-turniej-" + d + "-" + opts.index + "@lks-km-junior";
    var desc = "Miejscowość: " + escapeICS(opts.city) +
      (opts.link ? "\\nSzczegóły: " + escapeICS(opts.link) : "") +
      "\\nGodzina do potwierdzenia u trenera. Wygenerowano ze strony ŁKS KM Junior.";
    return [
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + icsStamp(new Date()),
      "DTSTART;VALUE=DATE:" + d,
      "DTEND;VALUE=DATE:" + d2,
      "SUMMARY:" + escapeICS(opts.name + " (" + opts.team + ")"),
      "LOCATION:" + escapeICS(opts.city),
      "DESCRIPTION:" + desc,
      "END:VEVENT"
    ].join("\r\n");
  }

  function gcalTrainingLink(opts) {
    var icsDay = DAY_TO_ICS[opts.day];
    var first = firstOccurrence(SEASON_START, icsDay);
    var y = first.getFullYear(), m = pad(first.getMonth() + 1), d = pad(first.getDate());
    var untilDate = SEASON_END.replace(/-/g, "");
    var dates = y + m + d + "T" + opts.startTime.replace(":", "") + "00/" +
      y + m + d + "T" + opts.endTime.replace(":", "") + "00";
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Trening ŁKS KM Junior – " + opts.team,
      dates: dates,
      details: "Trener: " + (opts.coach || "—") + (opts.contact ? " (" + opts.contact + ")" : ""),
      location: opts.location || "",
      recur: "RRULE:FREQ=WEEKLY;BYDAY=" + icsDay + ";UNTIL=" + untilDate + "T235959",
      ctz: "Europe/Warsaw"
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function gcalTournamentLink(opts) {
    var d = opts.dateISO.replace(/-/g, "");
    var next = new Date(opts.dateISO + "T00:00:00");
    next.setDate(next.getDate() + 1);
    var d2 = next.getFullYear() + pad(next.getMonth() + 1) + pad(next.getDate());
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: opts.name + " (" + opts.team + ")",
      dates: d + "/" + d2,
      details: (opts.link || "") + " — godzina do potwierdzenia u trenera.",
      location: opts.city || ""
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function parseTimeRange(text) {
    var parts = text.split(/[–‒-]/).map(function (s) { return s.trim(); });
    if (parts.length !== 2) return null;
    return { start: parts[0], end: parts[1] };
  }

  function tableRows(block) {
    var table = block.querySelector("table");
    if (!table) return [];
    return Array.prototype.slice.call(table.querySelectorAll("tbody tr"));
  }

  function blockMeta(block) {
    var text = block.textContent;
    var coach = (text.match(/Trener:\s*([^\n]+?)(?:\s*Kontakt:|$)/) || [])[1];
    var contact = (text.match(/Kontakt:\s*([^\s]+@[^\s]+)/) || [])[1];
    return { coach: coach ? coach.trim() : "", contact: contact ? contact.trim() : "" };
  }

  function teamNameFromBlock(block, fallback) {
    var h = block.querySelector("h1, h2, h3");
    if (!h) return fallback.trim();
    var clone = h.cloneNode(true);
    // usuń permalink dodawany przez toc (np. „#” po tytule)
    clone.querySelectorAll(".headerlink").forEach(function (el) { el.remove(); });
    return clone.textContent.replace(/—.*$/, "").trim();
  }

  function makeButton(label, href, opts) {
    opts = opts || {};
    var el = document.createElement(opts.button ? "button" : "a");
    el.className = "lks-cal-btn" + (opts.ghost ? " lks-cal-btn--ghost" : "");
    el.textContent = label;
    if (opts.button) {
      el.type = "button";
      el.addEventListener("click", opts.onClick);
    } else {
      el.href = href;
      el.target = "_blank";
      el.rel = "noopener";
    }
    return el;
  }

  function makeIconLink(href, label) {
    var a = document.createElement("a");
    a.className = "lks-cal-icon-btn";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = label;
    a.setAttribute("aria-label", label);
    a.textContent = "📅";
    return a;
  }

  function initHarmonogramCalendars() {
    var root = document.getElementById("harmonogram-widget");
    if (!root) return;
    var blocks = root.querySelectorAll(".tabbed-block");
    var labels = root.querySelectorAll(":scope .tabbed-labels > label");
    blocks.forEach(function (block, bi) {
      var fallbackName = labels[bi] ? labels[bi].textContent.trim() : "Drużyna";
      var team = teamNameFromBlock(block, fallbackName);
      var meta = blockMeta(block);
      var rows = tableRows(block);
      if (!rows.length) return;

      var events = [];
      var actions = document.createElement("div");
      actions.className = "lks-cal-actions";

      rows.forEach(function (row, ri) {
        var cells = row.querySelectorAll("td");
        if (cells.length < 3) return;
        var day = cells[0].textContent.trim();
        var time = parseTimeRange(cells[1].textContent.trim());
        var location = cells[2].textContent.trim();
        if (!time || !DAY_TO_ICS[day]) return;
        var opts = {
          team: team, day: day, startTime: time.start, endTime: time.end,
          location: location, coach: meta.coach, contact: meta.contact, index: ri
        };
        var vevent = buildTrainingVEvent(opts);
        if (vevent) events.push(vevent);
        var icon = makeIconLink(gcalTrainingLink(opts), "Dodaj „" + day + " " + time.start + "–" + time.end + "” do Google Calendar");
        var cell = row.querySelector("td:last-child") || cells[cells.length - 1];
        cell.appendChild(document.createTextNode(" "));
        cell.appendChild(icon);
      });

      if (events.length) {
        var dl = makeButton("⬇️ Pobierz cały plan „" + team + "” (.ics)", null, {
          button: true,
          onClick: function () {
            downloadICS("lks-km-junior-trening-" + slugify(team) + ".ics", events);
          }
        });
        actions.appendChild(dl);
        var table = block.querySelector("table");
        table.parentNode.insertBefore(actions, table.nextSibling);
      }
    });
  }

  function initTurniejeCalendars() {
    var root = document.getElementById("turnieje-widget");
    if (!root) return;
    var blocks = root.querySelectorAll(".tabbed-block");
    var labels = root.querySelectorAll(":scope .tabbed-labels > label");
    blocks.forEach(function (block, bi) {
      var fallbackName = labels[bi] ? labels[bi].textContent.trim() : "Drużyna";
      var team = teamNameFromBlock(block, fallbackName).replace(/\s*[—-]\s*nadchodz.*/i, "").trim();
      var rows = tableRows(block);
      if (!rows.length) return;

      var events = [];
      var actions = document.createElement("div");
      actions.className = "lks-cal-actions";

      rows.forEach(function (row, ri) {
        var cells = row.querySelectorAll("td");
        if (cells.length < 3) return;
        var dateText = cells[0].textContent.trim();
        var dm = dateText.match(/(\d{2})\.(\d{2})\.(\d{4})/);
        if (!dm) return;
        var dateISO = dm[3] + "-" + dm[2] + "-" + dm[1];
        var city = cells[1].textContent.trim();
        var name = cells[2].textContent.trim();
        var link = "";
        var a = row.querySelector("td:last-child a, td a[href]");
        if (a) link = a.href;
        var opts = { team: team, dateISO: dateISO, city: city, name: name, link: link, index: ri };
        var vevent = buildTournamentVEvent(opts);
        if (vevent) events.push(vevent);
        var icon = makeIconLink(gcalTournamentLink(opts), "Dodaj „" + name + "” do Google Calendar");
        var lastCell = cells[cells.length - 1];
        lastCell.appendChild(document.createTextNode(" "));
        lastCell.appendChild(icon);
      });

      if (events.length) {
        var dl = makeButton("⬇️ Pobierz kalendarz turniejów „" + team + "” (.ics)", null, {
          button: true,
          onClick: function () {
            downloadICS("lks-km-junior-turnieje-" + slugify(team) + ".ics", events);
          }
        });
        actions.appendChild(dl);
        var table = block.querySelector("table");
        table.parentNode.insertBefore(actions, table.nextSibling);
      }
    });
  }

  // -- Szybki filtr drużyny/rocznika nad zakładkami ------------------
  function initTeamFilters() {
    document.querySelectorAll(".md-typeset .tabbed-set").forEach(function (setEl) {
      if (setEl.classList.contains("lks-has-filter")) return;
      var labels = setEl.querySelectorAll(":scope > .tabbed-labels > label");
      var inputs = setEl.querySelectorAll(":scope > input[type=radio]");
      if (labels.length < 3 || labels.length !== inputs.length) return;

      var bar = document.createElement("div");
      bar.className = "lks-filter-bar";

      var selectId = "lks-team-filter-" + Math.random().toString(36).slice(2, 8);
      var label = document.createElement("label");
      label.setAttribute("for", selectId);
      label.textContent = "🔎 Wybierz drużynę / rocznik:";

      var select = document.createElement("select");
      select.id = selectId;
      labels.forEach(function (lab, i) {
        var opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = lab.textContent.trim();
        select.appendChild(opt);
      });

      var storageKey = "lks-filter:" + location.pathname + ":" +
        Array.prototype.indexOf.call(setEl.parentNode.children, setEl);

      var initialIndex = 0;
      inputs.forEach(function (inp, i) { if (inp.checked) initialIndex = i; });
      try {
        var saved = localStorage.getItem(storageKey);
        if (saved !== null && inputs[Number(saved)]) initialIndex = Number(saved);
      } catch (e) { /* localStorage niedostępny — pomijamy zapamiętywanie */ }
      select.value = String(initialIndex);
      if (inputs[initialIndex]) inputs[initialIndex].checked = true;

      select.addEventListener("change", function () {
        var idx = Number(select.value);
        if (inputs[idx]) {
          inputs[idx].checked = true;
          try { localStorage.setItem(storageKey, String(idx)); } catch (e) {}
        }
      });
      inputs.forEach(function (inp, i) {
        inp.addEventListener("change", function () {
          if (inp.checked && select.value !== String(i)) select.value = String(i);
        });
      });

      var hint = document.createElement("span");
      hint.className = "lks-filter-hint";
      hint.textContent = "Możesz też przewijać zakładki poniżej palcem.";

      bar.appendChild(label);
      bar.appendChild(select);
      bar.appendChild(hint);
      setEl.classList.add("lks-has-filter");
      setEl.parentNode.insertBefore(bar, setEl);
    });
  }

  // -- Linki zewnętrzne (np. do stron organizatorów turniejów) w nowej karcie
  function initExternalLinks() {
    var host = location.hostname;
    document.querySelectorAll(".md-typeset a[href^='http']").forEach(function (a) {
      try {
        var url = new URL(a.href);
        if (url.hostname && url.hostname !== host && !a.target) {
          a.target = "_blank";
          a.rel = "noopener";
        }
      } catch (e) {}
    });
  }

  function initAll() {
    try { initTeamFilters(); } catch (e) { console.error("[lks] filtr drużyn:", e); }
    try { initHarmonogramCalendars(); } catch (e) { console.error("[lks] kalendarz treningów:", e); }
    try { initTurniejeCalendars(); } catch (e) { console.error("[lks] kalendarz turniejów:", e); }
    try { initExternalLinks(); } catch (e) { console.error("[lks] linki zewnętrzne:", e); }
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    // Material for MkDocs — instant navigation (SPA-like), trzeba
    // podpiąć się pod strumień zmian strony zamiast DOMContentLoaded.
    window.document$.subscribe(initAll);
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
