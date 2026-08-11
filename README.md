# Tesla Gate Dashboard 3.5.0

Nowoczesny dashboard do sterowania bramą z poziomu przeglądarki, telefonu oraz Tesla Browser.

Projekt wykorzystuje API SUPLA do:

- otwierania bramy,
- zamykania bramy,
- odczytu aktualnego stanu,
- weryfikacji wykonania komendy,
- pracy jako aplikacja PWA.

---

## Funkcje

### Sterowanie bramą

- Otwórz bramę
- Zamknij bramę
- Automatyczne blokowanie niewłaściwego przycisku
- Potwierdzanie wykonania komendy

---

## Zabezpieczenie przed przypadkowym kliknięciem

Każda komenda wymaga podwójnego potwierdzenia.

Pierwsze dotknięcie uzbraja przycisk.

Drugie dotknięcie w określonym czasie wysyła komendę.

Brak drugiego dotknięcia powoduje automatyczne anulowanie operacji.

---

## Inteligentna weryfikacja stanu

Po wysłaniu komendy aplikacja:

- oczekuje ustalony czas,
- wykonuje pierwszą próbę weryfikacji,
- ponawia kontrolę stanu w określonych odstępach,
- potwierdza wykonanie operacji lub zgłasza brak potwierdzenia.

---

## Aktualny stan bramy

Dostępne komunikaty:

- Brama zamknięta
- Brama otwarta
- Otwieranie bramy
- Zamykanie bramy
- Oczekiwanie na potwierdzenie
- Brak połączenia
- Brak połączenia z internetem

---

## Czas ostatniego poprawnego odczytu

Dashboard wyświetla datę i godzinę ostatniej poprawnej odpowiedzi urządzenia.

Pozwala to szybko ocenić aktualność prezentowanych informacji.

---

## Obsługa utraty internetu

Po utracie połączenia:

- przyciski zostają zablokowane,
- wyświetlany jest odpowiedni komunikat,
- odczyty statusu zostają wstrzymane.

Po odzyskaniu internetu aplikacja automatycznie pobiera aktualny stan urządzenia.

---

## Aktualizacja po powrocie do aplikacji

Po przełączeniu do innej karty lub aplikacji oraz powrocie do dashboardu wykonywany jest natychmiastowy odczyt statusu.

Dzięki temu użytkownik nie musi czekać na kolejne automatyczne odświeżenie.

---

## PWA

Aplikacja może zostać zainstalowana jak natywna aplikacja.

Obsługiwane funkcje:

- instalacja na telefonach i tabletach,
- instalacja w Tesla Browser,
- uruchamianie bez paska adresu,
- własna ikona aplikacji,
- własny ekran startowy,
- Service Worker,
- praca interfejsu offline.

---

## Service Worker

Dashboard wykorzystuje Service Workera do przechowywania lokalnych zasobów interfejsu.

Cache obejmuje:

- `index.html`
- `app.js`
- `config.js`
- `style.css`
- `manifest.json`
- `favicon.svg`
- `gate-open.svg`
- `gate-close.svg`
- `icon-192.png`
- `icon-512.png`

Nie są przechowywane w cache:

- odczyty statusu urządzenia,
- komendy otwierania,
- komendy zamykania,
- odpowiedzi API SUPLA.

Dzięki temu stan bramy jest zawsze pobierany z sieci i nie jest odczytywany z pamięci podręcznej.

---

## Automatyczne wersjonowanie

Numer wersji definiowany jest tylko w jednym miejscu:

`config.js`

Zmiana numeru wersji powoduje automatyczne odświeżenie zasobów aplikacji oraz utworzenie nowej wersji cache Service Workera.
