/* ==========================================================
   Tesla Gate Dashboard
========================================================== */

console.log("APP.JS URUCHOMIONY");

const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");
const message = document.getElementById("message");
const versionElement = document.getElementById("version");

// Informacja, czy komenda otwierania lub zamykania jest w toku
let commandInProgress = false;



if (versionElement) {
    versionElement.textContent = `v${CONFIG.VERSION}`;
}


/* ==========================================================
   STATUS
========================================================== */

function setStatus(text, color = "#d9d9d9") {
    message.textContent = text;
    message.style.color = color;
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
            throw new Error(
                `Błąd HTTP podczas odczytu statusu: ${response.status}`
            );
        }

        const data = await response.json();

        if (CONFIG.DEBUG) {
            console.log("Odpowiedź SUPLA:", data);
        }

        if (!data.connected) {
            disableButtons();
            setStatus("⚪ Brak połączenia", "#9ca3af");
            return;
        }

        if (data.hi) {
            setStatus("🟢 Brama zamknięta", "#34C759");
            updateButtons(true);
        } else {
            setStatus("🔴 Brama otwarta", "#FF453A");
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

async function verifyGateState(expectedState) {
    if (CONFIG.DEBUG) {
        console.log(
            "Weryfikacja stanu. Oczekiwany stan:",
            expectedState
        );
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
            throw new Error(
                `Błąd HTTP podczas weryfikacji: ${response.status}`
            );
        }

        const data = await response.json();

        if (CONFIG.DEBUG) {
            console.log("Wynik weryfikacji:", data);
        }

        if (!data.connected) {
            disableButtons();
            setStatus(
                "⚪ Nie można potwierdzić stanu",
                "#9ca3af"
            );

            return false;
        }

        const isClosed = Boolean(data.hi);

        if (expectedState === "open" && !isClosed) {
            setStatus(
                "🟢 Brama została otwarta",
                "#34C759"
            );

            updateButtons(false);
            return true;
        }

        if (expectedState === "closed" && isClosed) {
            setStatus(
                "🟢 Brama została zamknięta",
                "#34C759"
            );

            updateButtons(true);
            return true;
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

        updateButtons(isClosed);
        return false;
    } catch (error) {
        if (CONFIG.DEBUG) {
            console.error(
                "Błąd weryfikacji stanu:",
                error
            );
        }

        disableButtons();

        if (error.name === "AbortError") {
            setStatus(
                "🟡 Upłynął czas weryfikacji",
                "#FFCC00"
            );
        } else {
            setStatus(
                "🟡 Nie można zweryfikować stanu",
                "#FFCC00"
            );
        }

        return false;
    }
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
        await fetchWithTimeout(
            url,
            {
                method: "GET",
                cache: "no-store",
                mode: "no-cors"
            }
        );

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

        if (error.name === "AbortError") {
            setStatus(
                "🔴 Przekroczono czas połączenia",
                "#FF453A"
            );
        } else {
            setStatus(
                "🔴 Błąd połączenia",
                "#FF453A"
            );
        }

        await readGateStatus();
        return;
    }

   setTimeout(async () => {
    stopLoading(button);

    try {
        await verifyGateState(expectedState);
    } finally {
        commandInProgress = false;
    }
}, CONFIG.VERIFY_DELAY);
}

/* ==========================================================
   ZDARZENIA PRZYCISKÓW
========================================================== */

btnOpen.addEventListener("click", () => {
    sendCommand(
        btnOpen,
        CONFIG.OPEN_URL,
        "opening",
        "open"
    );
});

btnClose.addEventListener("click", () => {
    sendCommand(
        btnClose,
        CONFIG.CLOSE_URL,
        "closing",
        "closed"
    );
});

/* ==========================================================
   URUCHOMIENIE APLIKACJI
========================================================== */

window.addEventListener("load",() => {
    console.log("STRONA ZA*ADOWANA");
    console.log("CONFIG*", CONFIG);
    console.log("VERSI*N:", CONFIG.VERSION);
    console.*og("ELEMENT VERSION:", versionElem*nt);

    if (versionElement) {
  *     versionElement.textContent = *v${CONFIG.VERSION}`;
    }

    se*Status("🟢 Łączenie...", "#34C759"*;

    // Pierwszy odczyt po uruch*mieniu aplikacji
    readGateStatu*();

    // Kolejne odczyty, ale t*lko gdy nie trwa obsługa komendy
 *  setInterval(() => {
        if (*commandInProgress) {
            r*adGateStatus();
        }
    }, C*NFIG.REFRESH_INTERVAL);
});
