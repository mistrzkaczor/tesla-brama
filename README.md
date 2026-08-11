# Tesla Gate Dashboard

Panel webowy do sterowania i monitorowania bramy.

## Wersja

**3.5.0**

Wersja 3.5.0 wprowadza własne API pośredniczące pomiędzy frontendem a SUPLA.

## Architektura

Frontend:

https://mistrzkaczor.github.io/tesla-brama/

Backend API:

https://api.kozeramariusz.pl/

Frontend nie komunikuje się bezpośrednio z SUPLA.

Schemat:

Frontend
↓
Tesla Gate API
↓
SUPLA
↓
Sterownik bramy

## API

Backend udostępnia trzy endpointy:

GET `/status.php`

POST `/open.php`

POST `/close.php`

Dane dostępowe SUPLA znajdują się wyłącznie po stronie serwera.

## Funkcje

- odczyt aktualnego stanu bramy
- otwieranie bramy
- zamykanie bramy
- dwustopniowe potwierdzenie operacji
- automatyczna weryfikacja stanu po wykonaniu polecenia
- pierwsza weryfikacja po 30 sekundach
- kolejne próby co 5 sekund
- maksymalnie 4 próby
- obsługa utraty połączenia z internetem
- automatyczne wznowienie połączenia
- blokowanie przycisków podczas braku internetu
- obsługa błędów HTTP
- obsługa limitu żądań SUPLA
- Service Worker
- cache aplikacji

## Bezpieczeństwo

Frontend nie zawiera danych uwierzytelniających SUPLA.

Dane dostępowe do SUPLA są przechowywane w `config.php` na serwerze API.

## Wersjonowanie

### 3.5.0

- dodano własne API
- przeniesiono komunikację z SUPLA na serwer
- dodano `status.php`
- dodano `open.php`
- dodano `close.php`
- dodano obsługę CORS
- dostosowano frontend do odpowiedzi API
- poprawiono weryfikację stanu bramy
- zachowano obsługę offline
- poprawiono mechanizm retry
- wyłączono tryb DEBUG w wersji produkcyjnej

### 3.4.4

Wersja poprzedzająca migrację do własnego API.
