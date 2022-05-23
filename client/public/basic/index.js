// Elke rij in tbody stelt een vak voor...
const vakkenTableRows = document.querySelectorAll("tbody tr");
for (let i = 0; i < vakkenTableRows.length; i++) {
    // ID van het vak (= id attribuut van de tr).
    const vakId = vakkenTableRows[i].id;

    // Aantal uren 'input' element dat hoort bij dit vak.
    const aantalUrenInput = document.querySelector(`#${vakId} input[type='number']`);

    // Indien er een aantal uren werd bewaard voor dit vak, dan wordt dat nu terug in 
    // de 'input' gezet.
    if (localStorage.getItem(vakId)) {        
        aantalUrenInput.value = parseInt(localStorage.getItem(vakId));
        waardeWerdBijgewerkt(aantalUrenInput, false);
    }

    // Als het 'readonly' attribuut van de input is weggehaald kan de gebruiker
    // rechtstreeks getallen ingeven. In dat geval moet de 'input' event onderschept worden.
    aantalUrenInput.addEventListener("input", (e) => {
        // Alternatief: je kan de boom 'opklimmen' om de ID van de ancestor row te bepalen.
        // Daarvoor moet je onderstaande code gebruiken:
        //   waardeWerdBijgewerkt(e.currentTarget.parentElement.parentElement);
        waardeWerdBijgewerkt(aantalUrenInput, true);
    });

    // En uiteindelijk wordt er ook een event handler aan de '+' button gekoppeld.
    const plusButton = document.querySelector(`#${vakId} button`);
    plusButton.addEventListener("click", (e) => {        
        // Alternatief: je kan de boom 'opklimmen' om de ID van de ancestor row te bepalen.
        // Daarvoor moet je onderstaande code gebruiken:
        //   let trElement = e.currentTarget.parentElement.parentElement;
        //   let vakId = trElement.id;
        //   let aantalUrenInput = document.querySelector(`#${vakId} input[type='number']`);
        aantalUrenInput.value = parseInt(aantalUrenInput.value) + 1;

        // Alternatief: waardeWerdBijgewerkt(e.currentTarget.parentElement.parentElement);
        waardeWerdBijgewerkt(aantalUrenInput, true);
    });
}

// En uiteindelijk moet er ook een handler gekoppeld worden aan de 'Correctie' button.
// Deze zal van alle aantal uren 'inputs' het readonly attribuut verwijderen.
const correctieKnop = document.getElementById("corrigeerUren");
const aantalUrenInputs = document.querySelectorAll("tbody tr input[type='number']");
correctieKnop.addEventListener("click", () => {    
    for (let i = 0; i < aantalUrenInputs.length; i++) 
    {
        aantalUrenInputs[i].removeAttribute('readonly');
    }
});

// Deze functie wordt aangeroepen wanneer de waarde in het input veld werd bijgewerkt
// (door een 'input' event van het element of door een 'click' op de '+' button).
function waardeWerdBijgewerkt(aantalUrenInput, save) {
    // De rij van het vak (tr) wordt bepaald door de DOM boom op te klimmen.
    let vakTableRow = aantalUrenInput.parentElement.parentElement;

    // Maximaal aantal uren voor dit vak
    const maxAantalUrenTd = document.querySelector(`#${vakTableRow.id} td:nth-child(3)`);
    const maxAantalUren = parseInt(maxAantalUrenTd.innerText);

    // Instellen van een kleur (op de rij) van zodra er een overschrijding is.
    if (parseInt(aantalUrenInput.value) > maxAantalUren) {
        vakTableRow.className = "overschrijding";
    }
    else {
        vakTableRow.className = "";
    }

    // Als de caller aangeeft dat er bewaard moet worden in localStorage...
    if (save) {
        localStorage.setItem(vakTableRow.id, aantalUrenInput.value);
    }    
}