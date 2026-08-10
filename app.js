/* ==========================================================
   Tesla Gate Dashboard
  =========================================================== */

/* ==========================================================
   WERSJA PROGRAMU
========================================================== */
const version = document.getElementById("version");


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

function startLoading(button) {

    button.classList.add("loading");

}

function stopLoading(button) {

    button.classList.remove("loading");

}

function updateButtons(isClosed){

    if(isClosed){

        // OTWÓRZ aktywny
        btnOpen.classList.remove("btn-inactive");
        btnOpen.disabled = false;

        // ZAMKNIJ nieaktywny
        btnClose.classList.add("btn-inactive");
        btnClose.disabled = true;

    }
    else{

        // OTWÓRZ nieaktywny
        btnOpen.classList.add("btn-inactive");
        btnOpen.disabled = true;

        // ZAMKNIJ aktywny
        btnClose.classList.remove("btn-inactive");
        btnClose.disabled = false;

    }

}


/* ==========================================
   STATUS
========================================== */

async function readGateStatus(){

   
    if (CONFIG.DEBUG) {

        console.log("readGateStatus()");

    }

    try{

        const response = await fetch(CONFIG.STATUS_URL);

        const data = await response.json();

        if (!data.connected) {

            setStatus("⚪ Brak połączenia", "#9ca3af");

        }
        else if (data.hi) {

            setStatus("🟢 Brama zamknięta", "#34C759");

            updateButtons(true);

        }
        else {

            setStatus("🔴 Brama otwarta", "#FF453A");

            updateButtons(false);

        }

        if (CONFIG.DEBUG) {

            console.log(data);

        }

    }

    catch(error){

    if(CONFIG.DEBUG){

        console.error(error);

    }

    setStatus("⚪ Brak połączenia", "#9ca3af");

}
}
/* ==========================================
   GATE MOVEMENT
========================================== */

function startGateMovement(direction) {


    if (direction === "opening") {

        setStatus("🔵 Otwieranie bramy...", "#4EA3FF");

    }
    else {

        setStatus("🔵 Zamykanie bramy...", "#4EA3FF");

    }

}


/* ==========================================================
   COMMAND
========================================================== */

async function sendCommand(button, url) {

    startLoading(button);

    if (button === btnOpen) {

        startGateMovement("opening");

    } else {

        startGateMovement("closing");

    }

    try {

        await fetch(url, {
            method: "GET",
            cache: "no-store",
            mode: "no-cors"
        });

    }
    catch (error) {

        if (CONFIG.DEBUG) {
            console.error(error);
        }

        stopLoading(button);

        setStatus("🔴 Błąd połączenia", "#FF453A");

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

    setStatus("🟢 Łączenie...");

    async function refreshStatus() {

        await readGateStatus();

        setTimeout(refreshStatus, CONFIG.REFRESH_INTERVAL);

    }

    refreshStatus();

});
