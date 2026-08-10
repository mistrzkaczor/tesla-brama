/* ==========================================================
   Tesla Gate Dashboard
========================================================== */

const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");
const message = document.getElementById("message");
const versionElement = document.getElementById("version");

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
    timeout = 5000
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
   BUTTONS
========================================================== */

function startLoading(button) {*    button.classList.add("loading"*;
}

function stopLoading(button) *
    button.classList.remove("load*ng");
}

function disableButtons()*{
    btnOpen.disabled = true;
   *btnClose.disabled = true;

    btn*pen.classList.add("btn-inactive");*    btnClose.classList.add("btn-in*ctive");
}

function updateButtons*isClosed) {
    if (isClosed) {
        // OTWÓRZ aktywny
        btnOpen.classList.remove("btn-inactive");
        btnOpen.disabled = false;

        // ZAMKNIJ nieaktywny
        btnClose.classList.add("btn-inactive");
        btnClose.disabled = true;
    } else {
        // OTWÓRZ nieaktywny
        btnOpen.classList.add("btn-inactive");
        btnOpen.disabled = true;

        // ZAMKNIJ aktywny
        btnClose.classList.remove("btn-inactive");
        btnClose.disabled = false;
    }
}

/* ==========================================================
   ODCZYT STATUSU BRAMY
========================================================== */

async function readGateStatu*() {
    if (CONFIG.DEBUG) {
     *  console.log("readGateStatus()");*    }

    try {
        const res*onse = await fetchWithTimeout(
   *        CONFIG.STATUS_URL,
       *    {
                cache: "no-s*ore"
            },
            CO*FIG.FETCH_TIMEOUT ?? 5000
        *;

        if (!response.ok) {
   *        throw new Error(`Błąd HTTP* ${response.status}`);
        }

*       const data = await response*json();

        if (!data.connect*d) {
            disableButtons();*            setStatus("⚪ Brak połą*zenia", "#9ca3af");
        } else*if (data.hi) {
            setStat*s("🟢 Brama zamknięta", "#34C759")*
            updateButtons(true);
*       } else {
            setSta*us("🔴 Brama otwarta", "#FF453A");*            updateButtons(false);
        }

        if (CONFIG.DEBUG) {
            console.log("Status SUPLA:", data);
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
   RUCH BRAMY
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

async function sendCommand(button, url) {
    startLoading(button);

    if (button === btnOpen) {
        startGateMovement("opening");
    } else {
        startGateMovement("closing");
    }

    try {
        await fetchWithTimeout(
            url,
            {
                method: "GET",
                cache: "no-store",
                mode: "no-cors"
            },
            CONFIG.FETCH_TIMEOUT ?? 5000
        );
    } catch (error) {
        if (CONFIG.DEBUG) {
            console.error("Błąd wysyłania komendy:", error);
        }

        stopLoading(button);

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

        return;
    }

    setTimeout(() => {
        stopLoading(button);
    }, CONFIG.MESSAGE_TIMEOUT);
}

/* ==========================================================
   EVENTS
========================================================== */

btnOpen.addEventListener("click", () => {
    sendCommand(
        btnOpen,
        CONFIG.OPEN_URL
    );
});

btnClose.addEventListener("click", () => {
    sendCommand(
        btnClose,
        CONFIG.CLOSE_URL
    );
});

/* ==========================================================
   START
========================================================== */

window.addEventListener("load", () => {
    if (versionElement) {
        versionElement.textContent = `v${CONFIG.VERSION}`;
    }

    setStatus("🟢 Łączenie...");

    async function refreshStatus() {
        await readGateStatus();

        setTimeout(
            refreshStatus,
            CONFIG.REFRESH_INTERVAL
        );
    }

    refreshStatus();
});
