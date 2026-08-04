/* ==========================================
   Tesla SUPLA Dashboard v1.0
   app.js
========================================== */

let refreshTimer = null;

const statusIcon = document.getElementById("statusIcon");
const statusText = document.getElementById("statusText");
const lastUpdate = document.getElementById("lastUpdate");
const message = document.getElementById("message");

const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");

/* ===========================
   Inicjalizacja
=========================== */

window.onload = () => {

    btnOpen.addEventListener("click", () => sendCommand(CONFIG.OPEN_URL));
    btnClose.addEventListener("click", () => sendCommand(CONFIG.CLOSE_URL));

    readStatus();

    refreshTimer = setInterval(readStatus, CONFIG.REFRESH_INTERVAL);

};

/* ===========================
   Odczyt statusu
=========================== */

async function readStatus() {

    if (CONFIG.DEBUG)
        console.clear();

    try {

        const response = await fetch(CONFIG.STATUS_URL, {
            cache: "no-store"
        });

        const text = await response.text();

        if (CONFIG.DEBUG) {

            console.log("HTTP:", response.status);
            console.log("Odpowiedź:");
            console.log(text);

        }

        showRawResponse(text);

    }
    catch (err) {

        setStatus(
            "⚪",
            "Brak połączenia",
            "Błąd komunikacji z SUPLA"
        );

        console.error(err);

    }

}

/* ===========================
   Wyświetlenie odpowiedzi
=========================== */

function showRawResponse(text){

    statusIcon.innerHTML = "🟦";

    statusText.innerHTML = text.length
        ? text
        : "(pusta odpowiedź)";

    lastUpdate.innerHTML =
        "Aktualizacja: "
        + new Date().toLocaleTimeString();

}

/* ===========================
   Ustawienie statusu
=========================== */

function setStatus(icon,text,msg){

    statusIcon.innerHTML = icon;

    statusText.innerHTML = text;

    lastUpdate.innerHTML =
        "Aktualizacja: "
        + new Date().toLocaleTimeString();

    message.innerHTML = msg;

}

/* ===========================
   Wysłanie polecenia
=========================== */

async function sendCommand(url){

    btnOpen.disabled = true;
    btnClose.disabled = true;

    message.innerHTML =
        "Wysyłanie polecenia...";

    try{

        await fetch(url,{
            cache:"no-store",
            mode:"no-cors"
        });

        message.innerHTML =
            "Polecenie wysłane";

    }
    catch(e){

        message.innerHTML =
            "Błąd wysyłania";

    }

    setTimeout(()=>{

        btnOpen.disabled=false;
        btnClose.disabled=false;

        readStatus();

    },1500);

}
