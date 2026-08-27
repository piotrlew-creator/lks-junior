---
title: Kontakt
description: >-
  Skontaktuj się z ŁKS KM Junior — dane adresowe, mapa, formularz
  kontaktowy i media społecznościowe klubu.
---

# Kontakt

<div class="info-cards cols-2">
  <div class="info-card">
    <h3>📍 Dane klubu</h3>
    <p>
      <strong>Klub:</strong> ŁKS KM Junior<br>
      <strong>Adres:</strong> UZUPEŁNIJ – ulica, numer, kod pocztowy, Łódź<br>
      <strong>E-mail:</strong> <a href="mailto:kontakt@lkskm.pl">kontakt@lkskm.pl</a><br>
      <strong>Telefon:</strong> UZUPEŁNIJ numer telefonu
    </p>
  </div>
  <div class="info-card">
    <h3>💬 Media społecznościowe</h3>
    <p>
      📘 <a href="https://facebook.com/UZUPEŁNIJ-LINK-FB" target="_blank" rel="noopener">Facebook</a><br>
      📸 <a href="https://instagram.com/UZUPEŁNIJ-LINK-IG" target="_blank" rel="noopener">Instagram</a><br>
      Śledź relacje z treningów, meczów i turniejów na bieżąco.
    </p>
  </div>
</div>

<div class="fill-me">
  <strong>Uzupełnij:</strong> prawdziwy adres, numer telefonu i linki do
  mediów społecznościowych (te same dane trzeba też podmienić w pliku
  <code>mkdocs.yml</code> w sekcji <code>extra.social</code> — pojawiają
  się wtedy automatycznie w stopce każdej strony).
</div>

## Zapisy

Aby zapisać dziecko do klubu, napisz lub zadzwoń — pierwsze zajęcia są
bezpłatne! Pełną instrukcję krok po kroku znajdziesz na stronie
[Dołącz do nas](dolacz.md).

## Napisz do nas

<form class="lks-contact-form" action="https://formspree.io/f/UZUPEŁNIJ-ID-FORMSPREE" method="POST">
  <div class="lks-form-row">
    <label for="cf-name">Imię i nazwisko</label>
    <input id="cf-name" name="name" type="text" required>
  </div>
  <div class="lks-form-row">
    <label for="cf-email">E-mail</label>
    <input id="cf-email" name="_replyto" type="email" required>
  </div>
  <div class="lks-form-row">
    <label for="cf-team">Grupa wiekowa (opcjonalnie)</label>
    <input id="cf-team" name="team" type="text" placeholder="np. U13">
  </div>
  <div class="lks-form-row">
    <label for="cf-message">Wiadomość</label>
    <textarea id="cf-message" name="message" rows="5" required></textarea>
  </div>
  <button type="submit" class="lks-cal-btn">Wyślij wiadomość</button>
</form>

!!! info "Jak uruchomić ten formularz"
    Formularz jest gotowy do działania bez własnego serwera — korzysta
    z darmowej usługi [Formspree](https://formspree.io). Załóż tam
    konto, utwórz formularz i podmień `UZUPEŁNIJ-ID-FORMSPREE` w
    adresie `action` powyżej (plik `docs/kontakt.md`) na swój
    identyfikator. Do tego czasu formularz nie wyśle wiadomości —
    korzystaj z linku e-mail powyżej.

## Znajdź nas

<div class="fill-me">
  <strong>Uzupełnij:</strong> poniższa mapa pokazuje na razie centrum
  Łodzi. Podmień parametr wyszukiwania w adresie `src` poniżej (plik
  `docs/kontakt.md`) na dokładny adres hali/biura klubu.
</div>

<iframe
  src="https://www.google.com/maps?q=%C5%81%C3%B3d%C5%BA&output=embed"
  width="100%"
  height="360"
  style="border:0; border-radius: 14px;"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  title="Mapa — ŁKS KM Junior">
</iframe>
