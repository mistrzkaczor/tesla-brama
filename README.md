Tesla Gate Dashboard

Panel sterowania bramą wjazdową zintegrowany z systemem SUPLA. Aplikacja została przygotowana z myślą o obsłudze w przeglądarce samochodu Tesla, na komputerze oraz na urządzeniach mobilnych.

Aktualna wersja

v3.2.1

Numer wersji jest przechowywany w pliku config.js i automatycznie wyświetlany w nagłówku aplikacji.

Najważniejsze funkcje
otwieranie bramy z poziomu dashboardu,
zamykanie bramy z poziomu dashboardu,
automatyczny odczyt rzeczywistego stanu bramy,
cykliczne odświeżanie statusu co 5 sekund,
synchronizacja stanu po użyciu pilota lub innego sterownika,
automatyczne blokowanie przycisku niezgodnego z aktualnym stanem bramy,
blokowanie obu przycisków przy braku połączenia z SUPLA,
zabezpieczenie przed wielokrotnym wysłaniem tej samej komendy,
limit czasu dla połączeń z API,
automatyczna weryfikacja stanu po wykonaniu komendy,
responsywny interfejs dla Tesli, komputerów i urządzeń mobilnych,
interfejs inspirowany stylistyką Tesla Dashboard.
Odczyt statusu

Aplikacja odczytuje rzeczywisty stan bramy za pomocą API SUPLA.

Standardowy interwał odświeżania wynosi:

Plain Text
1
5 sekund
Pokaż więcej wierszy

Podczas otwierania lub zamykania bramy automatyczne odświeżanie jest czasowo wstrzymywane. Zapobiega to nadpisaniu komunikatu informującego o wykonywanej operacji.

Po zakończeniu procesu weryfikacji regularne odświeżanie statusu zostaje automatycznie wznowione.

Weryfikacja wykonania komendy

Pełne otwarcie lub zamknięcie bramy trwa około 30 sekund. Po wysłaniu komendy aplikacja czeka 35 sekund, a następnie ponownie odczytuje rzeczywisty stan z SUPLA.

Przebieg operacji:

Użytkownik naciska przycisk otwierania lub zamykania.
Oba przyciski zostają tymczasowo zablokowane.
Aplikacja wysyła komendę do SUPLA.
Wyświetlany jest komunikat o oczekiwaniu na potwierdzenie.
Po 35 sekundach aplikacja odczytuje rzeczywisty stan bramy.
Użytkownik otrzymuje potwierdzenie wykonania operacji lub informację, że nie udało się jej potwierdzić.

Możliwe komunikaty:

Plain Text
🔵 Otwieranie bramy...
🔵 Zamykanie bramy...
🔵 Oczekiwanie na potwierdzenie...
🟢 Brama została otwarta
🟢 Brama została zamknięta
🟡 Nie potwierdzono otwarcia bramy
🟡 Nie potwierdzono zamknięcia bramy
Pokaż więcej wierszy
Zabezpieczenie przed wielokrotnym klikaniem

Na czas wykonywania i weryfikowania komendy ustawiana jest wewnętrzna blokada:

JavaScript
commandInProgress
``
Pokaż więcej wierszy

Dzięki temu kolejne kliknięcia są ignorowane do czasu zakończenia bieżącej operacji. Zapobiega to przypadkowemu wysyłaniu wielu komend do napędu bramy.

Timeout połączenia

Każde połączenie z API posiada maksymalny czas oczekiwania. Jeśli SUPLA nie odpowie w określonym czasie, zapytanie zostaje przerwane.

Domyślny timeout:

Plain Text
5 sekund
Pokaż więcej wierszy

Możliwe komunikaty:

Plain Text
⚪ Przekroczono czas połączenia
🔴 Błąd połączenia
⚪ Brak połączenia
🟡 Nie można zweryfikować stanu
Pokaż więcej wierszy
Konfiguracja czasowa

Najważniejsze ustawienia znajdują się w pliku config.js:

// Czas wyświetlania komunikatu lub animacji
MESSAGE_TIMEOUT: 2000,

// Czas oczekiwania na zakończenie ruchu bramy
VERIFY_DELAY: 35000,

// Maksymalny czas oczekiwania na odpowiedź API
FETCH_TIMEOUT: 5000,

// Interwał automatycznego odświeżania statusu
REFRESH_INTERVAL: 5000,

Wszystkie wartości są podawane w milisekundach.

Stabilność

Aplikacja została przygotowana do obsługi następujących sytuacji:

zmiana stanu bramy za pomocą dashboardu,
zmiana stanu bramy za pomocą pilota,
brak połączenia z urządzeniem SUPLA,
przekroczenie czasu odpowiedzi API,
wielokrotne kliknięcie przycisku,
czasowe opóźnienie podczas ruchu bramy,
brak potwierdzenia oczekiwanego stanu,
używanie aplikacji na ekranach o różnej rozdzielczości i wysokości.
Ważna informacja dotycząca bezpieczeństwa

Aplikacja jest obecnie hostowana w usłudze GitHub Pages, która obsługuje wyłącznie pliki statyczne. Adresy bezpośrednie SUPLA umieszczone w config.js mogą być odczytane przez osobę mającą dostęp do strony lub repozytorium.

Docelowo zalecane jest przeniesienie komunikacji z SUPLA do osobnego backendu lub funkcji serwerowej, tak aby linki sterujące i tokeny nie były dostępne w kodzie wykonywanym przez przeglądarkę.
