<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Tesla - Sterowanie Bramą</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
}

body{
    background:#111;
    color:white;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
}

.container{
    width:92%;
    max-width:900px;
}

h1{
    text-align:center;
    margin-bottom:35px;
    font-size:42px;
    color:#ddd;
}

button{
    width:100%;
    height:180px;
    margin:18px 0;
    border:none;
    border-radius:28px;
    font-size:48px;
    font-weight:bold;
    cursor:pointer;
    transition:.15s;
}

button:active{
    transform:scale(.98);
}

#open{
    background:#21b354;
    color:white;
}

#close{
    background:#d62d2d;
    color:white;
}

#status{
    text-align:center;
    margin-top:30px;
    font-size:28px;
    color:#bbb;
    min-height:40px;
}
</style>
</head>

<body>

<div class="container">

<h1>🚗 Tesla – Brama</h1>

<button id="open">
🟢 OTWÓRZ BRAMĘ
</button>

<button id="close">
🔴 ZAMKNIJ BRAMĘ
</button>

<div id="status"></div>

</div>

<script>

/************************************************
 * Wklej tutaj swoje linki z SUPLA
 ************************************************/

const OPEN_URL  = "https://svr20.supla.org/direct/1630/7ebdAmEowLmG/open";
const CLOSE_URL = "https://svr20.supla.org/direct/1631/Y9wnqZsr7rcm/close";

/************************************************/

async function send(url, txt){

    if(url.startsWith("TU_WKLEJ")){
        alert("Najpierw wpisz link z SUPLA.");
        return;
    }

    document.getElementById("status").innerHTML =
        "⏳ Wysyłanie polecenia...";

    try{

        await fetch(url,{
            method:"GET",
            mode:"no-cors"
        });

        document.getElementById("status").innerHTML =
            "✅ Polecenie wysłane";

    }catch(e){

        document.getElementById("status").innerHTML =
            "❌ Błąd połączenia";

    }

    setTimeout(()=>{
        document.getElementById("status").innerHTML="";
    },2500);

}

document.getElementById("open").onclick=()=>{
    send(OPEN_URL,"otwieranie");
}

document.getElementById("close").onclick=()=>{
    send(CLOSE_URL,"zamykanie");
}

</script>

</body>
</html>
