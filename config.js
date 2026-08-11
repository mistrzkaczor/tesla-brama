/* ==========================================
   Tesla Gate Dashboard
   Konfiguracja
========================================== */

globalThis.CONFIG = {

    // wersja aplikacji
    VERSION: "3.5.0",

    // API
    STATUS_URL:
        "https://api.kozeramariusz.pl/status.php",

    OPEN_URL:
        "https://api.kozeramariusz.pl/open.php",

    CLOSE_URL:
        "https://api.kozeramariusz.pl/close.php",

    // Czas wyświetlania komunikatu
    MESSAGE_TIMEOUT: 2000,

    // Pierwsza kontrola po 30 sekundach
    VERIFY_INITIAL_DELAY: 30000,

    // Kolejne kontrole co 5 sekund
    VERIFY_RETRY_DELAY: 5000,

    // Maksymalnie 4 próby
    VERIFY_MAX_ATTEMPTS: 4,

    // Czas na ponowne dotknięcie przycisku
    CONFIRM_TIMEOUT: 3000,

    // Maksymalny czas oczekiwania na odpowiedź API
    FETCH_TIMEOUT: 5000,

    // Czas odświeżania statusu
    REFRESH_INTERVAL: 5000,

    // Tryb debug
    DEBUG: false
};
