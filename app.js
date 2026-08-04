/* ==========================================
   Tesla SUPLA Dashboard v1.1
========================================== */

const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");
const message = document.getElementById("message");

/* ==========================================
   START
========================================== */

window.onload = () => {

    btnOpen.addEventListener("click", () => {
        sendCommand(CONFIG.OPEN_URL);
    });

    btnClose.addEventListener("click", () => {
        sendCommand(CONFIG.CLOSE_URL);
    });

    showMessage("Gotowy");

};

/* ==========================================
   Komunikaty
========================================== */

function showMessage(text) {

    message.innerHTML = text;

}

/* ==========================================
   Blokada przycisków
========================================== */

function lockButtons(lock) {

    btnOpen.disabled = lock;
    btnClose.disabled = lock;

}

/* ==========================================
   Wysłanie polecenia
========================================== */

async function sendCommand(url) {

    lockButtons(true);

    showMessage("⏳ Wysyłanie polecenia...");

    try {

        await fetch(url, {
            mode: "no-cors",
            cache: "no-store"
        });

        showMessage("✅ Polecenie wysłane");

    }
    catch (err) {

        console.error(err);

        showMessage("❌ Błąd komunikacji");

    }

    setTimeout(() => {

        lockButtons(false);

        showMessage("Gotowy");

    }, 2000);

}
