---
hide:
  - navigation
  - toc
---

<style>
/* ── HERO ───────────────────────────────────────────────── */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 24px 48px;
  background: linear-gradient(160deg, #c62828 0%, #8b0000 100%);
  border-radius: 16px;
  margin-bottom: 48px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "🏀";
  font-size: 320px;
  position: absolute;
  opacity: 0.04;
  right: -40px;
  top: -40px;
  line-height: 1;
  pointer-events: none;
}

.hero img {
  max-width: 220px;
  width: 60%;
  margin-bottom: 28px;
  filter: drop-shadow(0 4px 24px rgba(0,0,0,0.35));
}

.hero-slogan {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
  line-height: 1.2;
}

.hero-slogan span {
  color: #ffcdd2;
}

.hero-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.75);
  margin-bottom: 32px;
}

.hero-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-buttons a {
  padding: 12px 28px;
  border-radius: 32px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none !important;
  transition: transform 0.15s, box-shadow 0.15s;
}

.hero-buttons a:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.btn-primary {
  background: #ffffff;
  color: #c62828 !important;
}

.btn-secondary {
  background: transparent;
  color: #ffffff !important;
  border: 2px solid rgba(255,255,255,0.6);
}

/* ── STATYSTYKI ─────────────────────────────────────────── */
.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 52px;
}

.stat-box {
  background: #fff;
  border-radius: 12px;
  padding: 20px 32px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  min-width: 130px;
  flex: 1;
  max-width: 180px;
  border-top: 4px solid #c62828;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #c62828;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.78rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── NAGŁÓWEK SEKCJI ────────────────────────────────────── */
.section-title {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  position: relative;
}

.section-title::after {
  content: "";
  display: block;
  width: 48px;
  height: 4px;
  background: #c62828;
  border-radius: 2px;
  margin: 10px auto 0;
}

/* ── KAFELKI ────────────────────────────────────────────── */
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 52px;
}

.tile {
  background: #ffffff;
  border-radius: 14px;
  padding: 28px 22px;
  text-decoration: none !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  border: 1px solid #f0f0f0;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(198,40,40,0.15);
  border-color: #c62828;
}

.tile-icon {
  font-size: 2.2rem;
  line-height: 1;
}

.tile-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
}

.tile-desc {
  font-size: 0.83rem;
  color: #666;
  line-height: 1.5;
}

.tile-arrow {
  margin-top: auto;
  font-size: 0.8rem;
  color: #c62828;
  font-weight: 600;
}

/* ── CTA ────────────────────────────────────────────────── */
.cta {
  background: linear-gradient(135deg, #1a1a1a 0%, #3a0000 100%);
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  margin-bottom: 16px;
}

.cta h2 {
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 10px;
  border: none;
}

.cta p {
  color: rgba(255,255,255,0.7);
  margin-bottom: 28px;
  font-size: 1rem;
}

.cta a {
  display: inline-block;
  background: #c62828;
  color: #ffffff !important;
  padding: 13px 32px;
  border-radius: 32px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none !important;
  transition: background 0.2s, transform 0.15s;
}

.cta a:hover {
  background: #e53935;
  transform: translateY(-2px);
}

/* ── CIEMNY MOTYW ───────────────────────────────────────── */
[data-md-color-scheme="slate"] .tile {
  background: #1e1e1e;
  border-color: #2a2a2a;
}

[data-md-color-scheme="slate"] .tile:hover {
  border-color: #c62828;
}

[data-md-color-scheme="slate"] .tile-title { color: #f0f0f0; }
[data-md-color-scheme="slate"] .tile-desc  { color: #999; }

[data-md-color-scheme="slate"] .stat-box {
  background: #1e1e1e;
}

[data-md-color-scheme="slate"] .stat-label { color: #999; }
</style>

<!-- ═══════════════════════════════════════════════════════ -->
<!--  HERO                                                   -->
<!-- ═══════════════════════════════════════════════════════ -->
<div class="hero">
  <img src="assets/logo.png" alt="ŁKS Basket Łódź" />
  <div class="hero-slogan">Graj. <span>Rozwijaj się.</span> Wygrywaj.</div>
  <div class="hero-sub">Łódzki Klub Sportowy Basket — Łódź</div>
  <div class="hero-buttons">
    <a href="dolacz/" class="btn-primary">Dołącz do nas</a>
    <a href="kontakt/" class="btn-secondary">Kontakt</a>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════ -->
<!--  STATYSTYKI                                             -->
<!-- ═══════════════════════════════════════════════════════ -->
<div class="stats">
  <div class="stat-box">
    <div class="stat-number">120+</div>
    <div class="stat-label">Zawodników</div>
  </div>
  <div class="stat-box">
    <div class="stat-number">12</div>
    <div class="stat-label">Drużyn</div>
  </div>
  <div class="stat-box">
    <div class="stat-number">15+</div>
    <div class="stat-label">Lat działalności</div>
  </div>
  <div class="stat-box">
    <div class="stat-number">40+</div>
    <div class="stat-label">Turniejów w sezonie</div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════ -->
<!--  KAFELKI NAWIGACYJNE                                    -->
<!-- ═══════════════════════════════════════════════════════ -->
<div class="section-title">Co chcesz sprawdzić?</div>

<div class="tiles">
  <a href="o-klubie/" class="tile">
    <div class="tile-icon">🏛️</div>
    <div class="tile-title">O klubie</div>
    <div class="tile-desc">Historia, misja i wartości ŁKS Basket Łódź.</div>
    <div class="tile-arrow">Dowiedz się więcej →</div>
  </a>
  <a href="trenerzy/" class="tile">
    <div class="tile-icon">👨‍🏫</div>
    <div class="tile-title">Trenerzy</div>
    <div class="tile-desc">Poznaj naszą kadrę szkoleniową z licencjami PZKosz.</div>
    <div class="tile-arrow">Poznaj trenerów →</div>
  </a>
  <a href="harmonogram/" class="tile">
    <div class="tile-icon">📅</div>
    <div class="tile-title">Harmonogram</div>
    <div class="tile-desc">Plany treningów dla wszystkich drużyn — U11 do U19.</div>
    <div class="tile-arrow">Zobacz harmonogram →</div>
  </a>
  <a href="turnieje/" class="tile">
    <div class="tile-icon">🏆</div>
    <div class="tile-title">Turnieje</div>
    <div class="tile-desc">Kalendarz turniejów i rozgrywek ligowych w sezonie.</div>
    <div class="tile-arrow">Zobacz kalendarz →</div>
  </a>
  <a href="dolacz/" class="tile">
    <div class="tile-icon">🏀</div>
    <div class="tile-title">Dołącz do nas</div>
    <div class="tile-desc">Pierwsze zajęcia bezpłatne. Sprawdź jak zacząć.</div>
    <div class="tile-arrow">Dołącz teraz →</div>
  </a>
  <a href="sponsor/" class="tile">
    <div class="tile-icon">🤝</div>
    <div class="tile-title">Sponsoring</div>
    <div class="tile-desc">Wspieraj lokalny sport i buduj markę w Łodzi.</div>
    <div class="tile-arrow">Zostań sponsorem →</div>
  </a>
  <a href="kontakt/" class="tile">
    <div class="tile-icon">📬</div>
    <div class="tile-title">Kontakt</div>
    <div class="tile-desc">Napisz lub zadzwoń — odpowiadamy w 24 godziny.</div>
    <div class="tile-arrow">Skontaktuj się →</div>
  </a>
</div>

<!-- ═══════════════════════════════════════════════════════ -->
<!--  CTA                                                    -->
<!-- ═══════════════════════════════════════════════════════ -->
<div class="cta">
  <h2>Gotowy na pierwszy trening?</h2>
  <p>Przyjdź, sprawdź nas i przekonaj się sam. Pierwsze zajęcia są całkowicie bezpłatne.</p>
  <a href="dolacz/">Zapisz się na trening próbny</a>
</div>