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


 // Odświeżanie statusu (ms)
    REFRESH_INTERVAL: 5000,

    // Czas wyświetlania komunikatu po wysłaniu polecenia
    MESSAGE_TIMEOUT: 2000,

    // Włącz diagnostykę
    DEBUG: true


};
