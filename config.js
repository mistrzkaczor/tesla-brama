/* ==========================================
   Tesla Gate Dashboard
   Konfiguracja
========================================== */

const CONFIG = {

// wersja aplikacji
VERSION: "3.2.1",
   
// Link do otwarcia bramy
    OPEN_URL:
    "https://svr20.supla.org/direct/1630/7ebdAmEowLmG/open",

// Link do zamknięcia bramy
    CLOSE_URL:
    "https://svr20.supla.org/direct/1631/Y9wnqZsr7rcm/close",

// Link do odczytu statusu
    STATUS_URL:
    "https://svr20.supla.org/direct/1634/Wweiib2Y7Pbhxog/read?format=json",

// Czas wyświetlania komunikatu
   MESSAGE_TIMEOUT: 2000,

// Maksymalny czas oczekiwania na odpowiedź
   FETCH_TIMEOUT: 5000,

 // Czas odświeżania statusu
   REFRESH_INTERVAL: 5000,

   
// Tryb debug
   DEBUG: true

};
