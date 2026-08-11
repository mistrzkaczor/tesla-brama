/* ==========================================================
   Tesla Gate Dashboard
========================================================== */

console.log("APP.JS URUCHOMIONY");

const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");
const message = document.getElementById("message");
const versionElement = document.getElementById("version");
const lastReadElement = document.getElementById("lastRead");

// Informacja, czy komenda otwierania lub zamykania jest w toku
let commandInProgress = false;

// Przycisk oczekujący na drugie dotknięcie
let pendingConfirmationButton = null;

// Licznik czasu oczekiwania na potwierdzenie
let confirmationTimer = null;


/* ==========================================================
   STATUS
========================================================== */

function setStatus(text, color = "#d9d9d9") {
    message.textContent = text;
    message.style.color = color;
}

/* ==========================================================
   CZAS OSTATNIEGO POPRAWNEGO ODCZYTU
========================================================== */

function updateLastReadTime() {

    // Sprawdzenie, czy element czasu istnieje w pliku HTML
    if (!lastReadElement) {
        return;
    }

    // Pobranie aktualnej daty i godziny
    const now = new Date();

    // Sformatowanie godziny w polskim formacie: GG:MM:SS
    const time = now.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    // Wyświetlenie czasu ostatniego poprawnego odczytu
    lastReadElement.textContent = `Ostatni odczyt: ${time}`;
}

/* ==========================================================
   FETCH Z TIMEOUTEM
========================================================== */

async function fetchWithTimeout(
    url,
    options = {},
    timeout = CONFIG.FETCH_TIMEOUT
) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal
        });
    } finally {
        clearTimeout(timeoutId);
    }
}

/* ==========================================================
   OBSŁUGA PRZYCISKÓW
========================================================== */

function startLoading(button) {
    button.classList.add("loading");
}

function stopLoading(button) {
    button.classList.remove("loading");
}

function disableButtons() {
    btnOpen.disabled = true;
    btnClose.disabled = true;

    btnOpen.classList.add("btn-inactive");
    btnClose.classList.add("btn-inactive");
}

function updateButtons(isClosed) {
    if (isClosed) {
        // Brama zamknięta: można ją otworzyć.
        btnOpen.classList.remove("btn-inactive");
        btnOpen.disabled = false;

        btnClose.classList.add("btn-inactive");
        btnClose.disabled = true;
    } else {
        // Brama otwarta: można ją zamknąć.
        btnOpen.classList.add("btn-inactive");
        btnOpen.disabled = true;

        btnClose.classList.remove("btn-inactive");
        btnClose.disabled = false;
    }
}

/* ==========================================================
   ODCZYT STATUSU BRAMY
========================================================== */

async function readGateStatus() {
    if (CONFIG.DEBUG) {
        console.log("Odczyt statusu bramy...");
    }

    try {
        const response = await fetchWithTimeout(
            CONFIG.STATUS_URL,
            {
                method: "GET",
                cache: "no-store"
            }
        );

if (!response.ok) {

    if (response.status === 429) {
        throw new Error("SUPLA_RATE_LIMIT");
    }

    throw new Error(
        `Błąd HTTP podczas odczytu statusu: ${response.status}`
    );
}

const data = await response.json();

if (CONFIG.DEBUG) {
    console.log("Odpowiedź API:", data);
}

if (!data.success) {
    throw new Error(data.error || "API_ERROR");
}

const suplaData = data.data;

if (CONFIG.DEBUG) {
    console.log("Odpowiedź SUPLA:", suplaData);
}

if (!suplaData || !suplaData.connected) {
    disableButtons();
    setStatus("⚪ Brak połączenia", "#9ca3af");
    return;
}

updateLastReadTime();

if (suplaData.hi) {
    setStatus(
        "🟢 Brama zamknięta",
        "#34C759"
    );

    updateButtons(true);
} else {
    setStatus(
        "🔴 Brama otwarta",
        "#FF453A"
    );

    updateButtons(false);
}
    } catch (error) {
        if (CONFIG.DEBUG) {
            console.error("Błąd odczytu statusu:", error);
        }

        disableButtons();

if (error.name === "AbortError") {

    setStatus(
        "⚪ Przekroczono czas połączenia",
        "#9ca3af"
    );

} else if (error.message === "SUPLA_RATE_LIMIT") {

    setStatus(
        "🟡 Zbyt wiele żądań — spróbuj ponownie za chwilę",
        "#FFCC00"
    );

} else {

    setStatus(
        "⚪ Brak połączenia",
        "#9ca3af"
    );
}
    }
}

/* ==========================================================
   WERYFIKACJA STANU PO KOMENDZIE
========================================================== */

/* ==========================================================
   POJEDYNCZA WERYFIKACJA STANU
========================================================== */

function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function waitForInternet() {
    if (navigator.onLine) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const handleOnline = () => {
            window.removeEventListener("online", handleOnline);
            resolve();
        };

        window.addEventListener("online", handleOnline);
    });
}


async function verifyGateState(expectedState, attempt, maxAttempts) {
    if (CONFIG.DEBUG) {
        console.log(
            `Weryfikacja stanu: próba ${attempt} z ${maxAttempts}`
        );
    }

    setStatus(
        `🔵 Weryfikacja stanu: próba ${attempt} z ${maxAttempts}`,
        "#4EA3FF"
    );

    try {

if (!navigator.onLine) {
    return "offline";
}

    const response = await fetchWithTimeout(
            CONFIG.STATUS_URL,
            {
                method: "GET",
                cache: "no-store"
            }
        );

if (!response.ok) {
    throw new Error(
        `Błąd HTTP podczas weryfikacji: ${response.status}`
    );
}

       const data = await response.json();

if (CONFIG.DEBUG) {
    console.log("Wynik weryfikacji:", data);
}

if (!data.connected) {
    return false;
}

// Aktualizacja czasu po potwierdzeniu połączenia z urządzeniem
updateLastReadTime();

const isClosed = Boolean(data.data.hi);

if (expectedState === "open" && !isClosed) {
    setStatus(
        "🟢 Otwarcie bramy potwierdzone",
        "#34C759"
    );

    updateButtons(false);
    return true;
}

        if (expectedState === "closed" && isClosed) {
            setStatus(
                "🟢 Zamknięcie bramy potwierdzone",
                "#34C759"
            );

            updateButtons(true);
            return true;
        }

        return false;
} catch (error) {
    if (CONFIG.DEBUG) {
        console.error(
            `Błąd próby ${attempt}:`,
            error
        );
    }

    if (!navigator.onLine) {
        return "offline";
    }

    return false;
}
}

/* ==========================================================
   WIELOKROTNA WERYFIKACJA STANU
========================================================== */

async function verifyGateStateWithRetries(expectedState) {
    const maxAttempts = CONFIG.VERIFY_MAX_ATTEMPTS;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        const confirmed = await verifyGateState(
            expectedState,
            attempt,
            maxAttempts
        );

        if (confirmed === true) {
            return true;
        }

        if (confirmed === "offline") {
            setStatus(
                "⚪ Brak połączenia z internetem",
                "#9ca3af"
            );

            await waitForInternet();

            // Utrata internetu nie zabiera jednej z prób.
            attempt--;

            continue;
        }

        if (attempt < maxAttempts) {
            setStatus(
                `🟡 Brak potwierdzenia. Ponowna próba za ${CONFIG.VERIFY_RETRY_DELAY / 1000} sekund...`,
                "#FFCC00"
            );

            await delay(CONFIG.VERIFY_RETRY_DELAY);
        }
    }

    if (expectedState === "open") {
        setStatus(
            "🟡 Nie potwierdzono otwarcia bramy",
            "#FFCC00"
        );
    } else {
        setStatus(
            "🟡 Nie potwierdzono zamknięcia bramy",
            "#FFCC00"
        );
    }

    await readGateStatus();
    return false;
}

/* ==========================================================
   INFORMACJA O RUCHU BRAMY
========================================================== */

function startGateMovement(direction) {
    if (direction === "opening") {
        setStatus(
            "🔵 Otwieranie bramy...",
            "#4EA3FF"
        );
    } else {
        setStatus(
            "🔵 Zamykanie bramy...",
            "#4EA3FF"
        );
    }
}

/* ==========================================================
   WYSYŁANIE KOMENDY
========================================================== */

async function sendCommand(
    button,
    url,
    direction,
    expectedState
) {
    if (commandInProgress) {
        if (CONFIG.DEBUG) {
            console.log(
                "Komenda jest już wykonywana."
            );
        }

        return;
    }

    commandInProgress = true;

    disableButtons();
    startLoading(button);
    startGateMovement(direction);

    try {
const response = await fetchWithTimeout(
    url,
    {
        method: "POST",
        cache: "no-store"
    }
);

if (!response.ok) {
    if (response.status === 429) {
        throw new Error("SUPLA_RATE_LIMIT");
    }

    throw new Error(
        `Błąd HTTP API: ${response.status}`
    );
}

const data = await response.json();

if (!data.success) {
    throw new Error(
        data.error || "API_ERROR"
    );
}

        setStatus(
            "🔵 Oczekiwanie na potwierdzenie...",
            "#4EA3FF"
        );
    } catch (error) {
        if (CONFIG.DEBUG) {
            console.error(
                "Błąd wysyłania komendy:",
                error
            );
        }

        stopLoading(button);
        commandInProgress = false;

if (error.name === "AbortError")

        await readGateStatus();
        return;
    }

setTimeout(async () => {
    stopLoading(button);

    try {
        await verifyGateStateWithRetries(expectedState);
    } finally {
        commandInProgress = false;
    }
}, CONFIG.VERIFY_INITIAL_DELAY);
}

function clearCommandConfirmation() {
    if (confirmationTimer) {
        clearTimeout(confirmationTimer);
        confirmationTimer = null;
    }

    pendingConfirmationButton = null;
}

async function requestCommandConfirmation(
    button,
    url,
    direction,
    expectedState
) {
    // Brak możliwości rozpoczęcia kolejnej operacji,
    // jeśli poprzednia komenda jest nadal obsługiwana
    if (commandInProgress) {
        return;
    }

    // Drugie dotknięcie tego samego przycisku
    if (pendingConfirmationButton === button) {
        clearCommandConfirmation();

        await sendCommand(
            button,
            url,
            direction,
            expectedState
        );

        return;
    }

    // Anulowanie wcześniejszego oczekiwania na inny przycisk
    clearCommandConfirmation();

    // Zapamiętanie przycisku oczekującego na potwierdzenie
    pendingConfirmationButton = button;

    if (direction === "opening") {
        setStatus(
            "🟡 Dotknij ponownie, aby otworzyć bramę",
            "#FFCC00"
        );
    } else {
        setStatus(
            "🟡 Dotknij ponownie, aby zamknąć bramę",
            "#FFCC00"
        );
    }

    // Automatyczne anulowanie potwierdzenia po czasie określonym w konfiguracji
    confirmationTimer = setTimeout(async () => {
        clearCommandConfirmation();

        setStatus(
            "⚪ Potwierdzenie anulowane",
            "#9ca3af"
        );

        await readGateStatus();
    }, CONFIG.CONFIRM_TIMEOUT);
}

/* ==========================================================
   ZDARZENIA PRZYCISKÓW
========================================================== */

btnOpen.addEventListener("click", () => {
    requestCommandConfirmation(
        btnOpen,
        CONFIG.OPEN_URL,
        "opening",
        "open"
    );
});

btnClose.addEventListener("click", () => {
    requestCommandConfirmation(
        btnClose,
        CONFIG.CLOSE_URL,
        "closing",
        "closed"
    );
});

/* ==========================================================
   UTRATA POŁĄCZENIA Z INTERNETEM
========================================================== */

window.addEventListener("offline", () => {
    clearCommandConfirmation();
    disableButtons();

    setStatus(
        "⚪ Brak połączenia z internetem",
        "#9ca3af"
    );

    if (CONFIG.DEBUG) {
        console.log("Utracono połączenie z internetem.");
    }
});

/* ==========================================================
   ODZYSKANIE POŁĄCZENIA Z INTERNETEM
========================================================== */

window.addEventListener("online", async () => {
    if (CONFIG.DEBUG) {
        console.log("Przywrócono połączenie z internetem.");
    }

    if (
        commandInProgress ||
        pendingConfirmationButton !== null
    ) {
        return;
    }

    setStatus(
        "🔵 Przywracanie połączenia...",
        "#4EA3FF"
    );

    await readGateStatus();
});

/* ==========================================================
   POWRÓT DO KARTY APLIKACJI
========================================================== */

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (CONFIG.DEBUG) {
            console.log("Aplikacja działa w tle.");
        }

        return;
    }

    if (CONFIG.DEBUG) {
        console.log(
            "Powrót do aplikacji. Odświeżanie statusu..."
        );
    }

    if (
        !commandInProgress &&
        pendingConfirmationButton === null &&
        navigator.onLine
    ) {
        setStatus(
            "🔵 Aktualizowanie statusu...",
            "#4EA3FF"
        );

        readGateStatus();
    }
});

/* ==========================================================
   URUCHOMIENIE APLIKACJI
========================================================== */

window.addEventListener("load", () => {
    console.log("STRONA ZAŁADOWANA");
    console.log("CONFIG:", CONFIG);
    console.log("VERSION:", CONFIG.VERSION);
    console.log("ELEMENT VERSION:", versionElement);

    if (versionElement) {
        versionElement.textContent = `v${CONFIG.VERSION}`;
    }

    if (!navigator.onLine) {
        disableButtons();

        setStatus(
            "⚪ Brak połączenia z internetem",
            "#9ca3af"
        );
    } else {
        setStatus(
            "🟢 Łączenie...",
            "#34C759"
        );

        // Pierwszy odczyt po uruchomieniu aplikacji
        readGateStatus();
    }

    // Automatyczne odświeżanie statusu
    setInterval(() => {
        if (
            !commandInProgress &&
            pendingConfirmationButton === null &&
            navigator.onLine
        ) {
            readGateStatus();
        }
    }, CONFIG.REFRESH_INTERVAL);

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("./service-worker.js")

        .then(() => {
            if (CONFIG.DEBUG) {
                console.log(
                    "Service Worker zarejestrowany."
                );
            }
        })

        .catch((error) => {
            console.error(
                "Błąd rejestracji Service Workera:",
                error
            );
        });
}
   
});
