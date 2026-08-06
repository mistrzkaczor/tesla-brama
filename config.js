/* ==========================================
   Tesla SUPLA Dashboard
   Konfiguracja
========================================== */

const CONFIG = {

    // Link do otwarcia bramy
    OPEN_URL:
    "https://svr20.supla.org/direct/1630/7ebdAmEowLmG/open",


    // Link do zamknięcia bramy
    CLOSE_URL:
    "https://svr20.supla.org/direct/1631/Y9wnqZsr7rcm/close",


    // Link do odczytu statusu
    STATUS_URL:
    "https://svr20.supla.org/direct/1632/hMj8i64QTPFPN/read?format=json",

// Otwieranie bramy (ms)
OPEN_TIME: 30000,

// Zamykanie bramy (ms)
CLOSE_TIME: 35000,

// Odświeżanie statusu (ms)
REFRESH_INTERVAL: 2000,

// Czas wyświetlania komunikatu
MESSAGE_TIMEOUT: 2000,

// Tryb debug
DEBUG: true


};
