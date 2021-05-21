// Deze constante zal als 'key' gebruikt worden in de localStorage.
const LOCAL_STORAGE_KEY = "vakkenEnAantalUren";

// Deze methode zal een array van alle vakken bewaren, met per vak het aantal uren.
function save() {
    let vakkenEnAantalUren = [];
    let vakken = document.querySelectorAll("#vakkenlijst tbody tr");
    for (let i = 0; i < vakken.length; i++) {
        let vakId = vakken[i].getAttribute("id");

        // Ophalen van aantal uren dat werd ingevuld in de input.
        // Bemerk dat .value een string teruggeeft. 
        // Daarom gebeurt er een parseInt(): zo wordt de string omgezet naar een getal.
        // Per vak wordt een object op de array geplaatst met twee properties: vakId en aantalUren.
        let aantalUren = parseInt(document.querySelector(`#${vakId} input`).value);
        vakkenEnAantalUren.push({
            vakId: vakId,
            aantalUren: aantalUren
        });
    }

    // Aangezien localStorage met strings werkt moet de array omgezet worden naar een JSON array string.
    localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(vakkenEnAantalUren));
}

// Deze functie geeft visuele feedback bij overschrijding van het max aantal uren.
// Bemerk dat we een class 'maxAantalUren' hebben toegevoegd aan de <td>'s in de html om gemakkelijk het aantal uren op te halen.
function geefFeedbackBijOverschrijding(vakId) {
    let maxAantalUrenTd = document.querySelector(`#${vakId} .maxAantalUren`);
    let aantalUrenInput = document.querySelector(`#${vakId} input`);
    if (parseInt(aantalUrenInput.value) > parseInt(maxAantalUrenTd.innerText)) {
        aantalUrenInput.style.backgroundColor = "orange";
    } else {
        aantalUrenInput.style.backgroundColor = "unset";
    }
}

// Eerst zal er een controle gebeuren of er reeds uren zijn bewaard in de localStorage.
// Opgelet: dit kan dus null zijn indien de pagina een eerste keer getoond wordt.
// Deze code zal telkens éénmalig uitgevoerd bij het tonen/laden van de pagina.
let vakkenEnAantalUrenAsString = localStorage.getItem(LOCAL_STORAGE_KEY);
if (vakkenEnAantalUrenAsString) {
    // De value in een localStorage is steeds van het type string.
    // Aangezien we daar een JSON array string hebben in bewaard moeten we die weer omzetten naar een JavaScript array door middel van JSON.parse().
    let vakkenEnAantalUren = JSON.parse(vakkenEnAantalUrenAsString);
    for (let i = 0; i < vakkenEnAantalUren.length; i++) {
        let aantalUrenInput = document.querySelector(`#${vakkenEnAantalUren[i].vakId} input`);
        // Het aantal uren dat bij elk vak is bewaard wordt nu weer teruggezet in de overeenkomstige input.
        // Verder wordt er per vak ook weer nagegaan of er een overschrijding is van het aantal uren.
        aantalUrenInput.value = vakkenEnAantalUren[i].aantalUren;
        geefFeedbackBijOverschrijding(vakkenEnAantalUren[i].vakId);
    }
}

// De knop 'Correctie' zal alle 'readonly' attributen weghalen van de 'aantal uren' inputs.
// Zo kan een gebruiker rechtstreeks het aantal uren ingeven.
document.getElementById("corrigeerUren").addEventListener("click", (evt) => {
    let inputs = document.querySelectorAll("#vakkenlijst input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].removeAttribute("readonly");
    }
});

// Alle 'aantal uren' inputs krijgen een 'change' event handler.
// Dat zorgt ervoor dat, éénmaal alle readonly attributen zijn weggehaald door de 'Correctie' knop, er visuele feedback wordt gegeven indien
// het aantal uren groter wordt dan het max aantal uren. Verder wordt ook telkens save() aangeroepen zodat de wijziging direct naar de
// localstorage wordt geschreven.
let aantalUrenInputs = document.querySelectorAll("#vakkenlijst tbody input");
for (let i = 0; i < aantalUrenInputs.length; i++) {
    aantalUrenInputs[i].addEventListener("change", (evt) => {
        // evt.target bevat de 'input' waarop de change is gebeurd.
        // met evt.target.parentNode wordt de parent node opgehaald, nl. de <td> waarin de input zit.
        // met evt.target.parentNode.parentNode wordt vervolgens de parent van de <td> opgehaald en dat is dus de <tr>.
        // Die <tr> heeft een 'id' attribuut waarin het vak wordt bijgehouden.
        let vakId = evt.target.parentNode.parentNode.getAttribute("id");
        geefFeedbackBijOverschrijding(vakId);
        save();
    });
}

// Alle '+' buttons krijgen een 'click' event handler.
// Bij het kliken op een '+' button wordt de value van de overeenkomstige 'aantal uren' input opgehaald en met één verhoogd.
// Verder gebeurt ook hier weer een controle of het aantal uren > max aantal uren en gebeurt er een save() zodat de wijziging direct naar de
// localstorage wordt geschreven.
let verhoogAantalUrenButtons = document.querySelectorAll("#vakkenlijst tbody button");
for (let i = 0; i < verhoogAantalUrenButtons.length; i++) {
    verhoogAantalUrenButtons[i].addEventListener("click", (evt) => {
        let vakId = evt.target.parentNode.parentNode.getAttribute("id");
        let aantalUrenInput = document.querySelector(`#${vakId} input`);
        // Opgelet! -> de value van een input is van het type 'string'. Vandaar gebeurt een parseInt().
        aantalUrenInput.value = parseInt(aantalUrenInput.value) + 1;
        geefFeedbackBijOverschrijding(vakId);
        save();
    });
}