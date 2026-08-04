/* ==========================================================
   TESLA SUPLA DASHBOARD v2.2
========================================================== */

const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");
const message = document.getElementById("message");

/* ==========================================================
   STATUS
========================================================== */

function setStatus(text, color = "#d9d9d9") {

    message.textContent = text;
    message.style.color = color;

}

/* ==========================================================
   PRZYCISKI
========================================================== */

function lockButtons(lock) {

    btnOpen.disabled = lock;
    btnClose.disabled = lock;

}

function startLoading(button) {

    button.classList.add("loading");

}

function stopLoading(button) {

    button.classList.remove("loading");

}

/* ==========================================================
   WYSŁANIE KOMENDY
========================================================== */

async function sendCommand(button, url, successMessage) {

    lockButtons(true);

    startLoading(button);

    setStatus("🔵 Wysyłanie polecenia...", "#4EA3FF");

    try {

        const response = await fetch(url, {

            method: "GET",
            cache: "no-store"

        });

        if (!response.ok) {

            throw new Error("HTTP " + response.status);

        }

        setStatus("🟢 " + successMessage, "#34C759");

    }

    catch (err) {

        console.error(err);

        setStatus("🔴 Błąd połączenia", "#FF453A");

    }

    finally {

        setTimeout(() => {

            stopLoading(button);

            lockButtons(false);

            setStatus("🟢 Gotowy", "#d9d9d9");

        }, 2000);

    }

}

/* ==========================================================
   ZDARZENIA
========================================================== */

btnOpen.addEventListener("click", () => {

    sendCommand(

        btnOpen,

        OPEN_URL,

        "Polecenie OTWÓRZ wysłane"

    );

});

btnClose.addEventListener("click", () => {

    sendCommand(

        btnClose,

        CLOSE_URL,

        "Polecenie ZAMKNIJ wysłane"

    );

});

/* ==========================================================
   START
========================================================== */

window.addEventListener("load", () => {

    setStatus("🟢 Gotowy");

});
