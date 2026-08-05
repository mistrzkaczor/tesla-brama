/* ==========================================================
   TESLA SUPLA DASHBOARD v3.0
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
   BUTTONS
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

/* ==========================================
   STATUS
========================================== */

async function readGateStatus(){

    console.log("readGateStatus()");

    try{

        const response = await fetch(CONFIG.STATUS_URL);

        const response = await fetch(CONFIG.STATUS_URL);

         const data = await response.json();

         console.log(data);

    }

    catch(error){

        console.error("BŁĄD:", error);

    }

}

/* ==========================================================
   COMMAND
========================================================== */

async function sendCommand(button, url, successText) {

    lockButtons(true);

    startLoading(button);

    setStatus("🔵 Wysyłanie polecenia...", "#4EA3FF");

    try {

        await fetch(url, {

            method: "GET",

            cache: "no-store",

            mode: "no-cors"

        });

        setStatus("🟢 " + successText, "#34C759");

    }

    catch (error) {

        if (CONFIG.DEBUG) {

    console.error(error);

}

        setStatus("🔴 Błąd połączenia", "#FF453A");

    }

    setTimeout(() => {

        stopLoading(button);

        lockButtons(false);

        setStatus("🟢 Gotowy", "#d9d9d9");

    }, CONFIG.MESSAGE_TIMEOUT);

}

/* ==========================================================
   EVENTS
========================================================== */

btnOpen.addEventListener("click", () => {

    sendCommand(

        btnOpen,

        CONFIG.OPEN_URL,

        "Brama otwierana"

    );

});

btnClose.addEventListener("click", () => {

    sendCommand(

        btnClose,

        CONFIG.CLOSE_URL,

        "Brama zamykana"

    );

});

/* ==========================================================
   START
========================================================== */

window.addEventListener("load", () => {

    setStatus("🟢 Gotowy");
    readGateStatus();
});
