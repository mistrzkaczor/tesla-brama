/* ==========================================================
   Tesla Gate Dashboard
========================================================== */

const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");
const message = document.getElementById("message");
const versionElement = document.getElementById("version");

let commandInProgress = false;

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
        btnOpen.classList.add("btn-inactive
