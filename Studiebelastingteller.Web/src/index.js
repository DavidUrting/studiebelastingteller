const localStorageKey = "vakkenEnAantalUren";

document.getElementById("corrigeerUren").addEventListener("click", (evt) => {
    let inputs = document.querySelectorAll("#vakkenlijst input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].removeAttribute("readonly");
    }
});

let aantalUrenInputs = document.querySelectorAll("#vakkenlijst tbody input");
for (let i = 0; i < aantalUrenInputs.length; i++) {
    aantalUrenInputs[i].addEventListener("change", (evt) => {
        try {
            resetError(evt.target);

            let vakId = evt.target.parentNode.parentNode.getAttribute("id");
            geefFeedbackBijOverschrijding(vakId);
            save();
        } catch (ex) {
            setError(evt.target, ex);
        }
    });
}

let verhoogAantalUrenButtons = document.querySelectorAll("#vakkenlijst tbody button");
for (let i = 0; i < verhoogAantalUrenButtons.length; i++) {
    verhoogAantalUrenButtons[i].addEventListener("click", (evt) => {
        let vakId = evt.target.parentNode.parentNode.getAttribute("id");
        let aantalUrenInput = document.querySelector(`#${vakId} input`);
        aantalUrenInput.value = parseInt(aantalUrenInput.value) + 1;
        geefFeedbackBijOverschrijding(vakId);
        save();
    });
}


// Ophalen van de lijst van vakken uit de local storage.
// Opgelet: dit kan null zijn indien de pagina een eerste keer getoond wordt.
let vakkenEnAantalUrenAsString = localStorage.getItem(localStorageKey);
if (vakkenEnAantalUrenAsString) {
    let vakkenEnAantalUren = JSON.parse(vakkenEnAantalUrenAsString);
    for (let i = 0; i < vakkenEnAantalUren.length; i++) {
        let aantalUrenInput = document.querySelector(`#${vakkenEnAantalUren[i].vakId} input`);
        aantalUrenInput.value = vakkenEnAantalUren[i].aantalUren;
    }
}

function save() {
    let vakkenEnAantalUren = [];
    let vakken = document.querySelectorAll("#vakkenlijst tbody tr");
    for (let i = 0; i < vakken.length; i++) {
        let vakId = vakken[i].getAttribute("id");
        let aantalUren = document.querySelector(`#${vakId} input`).value;
        vakkenEnAantalUren.push({
            vakId: vakId,
            aantalUren: aantalUren
        });
    }

    localStorage.setItem(
        localStorageKey,
        JSON.stringify(vakkenEnAantalUren));
}

function geefFeedbackBijOverschrijding(vakId) {
    //let maxAantalUren = parseInt(document.querySelector(`#vak-${vakId} .aantalUren`).innerText);
    //let aantalUrenInput = parseInt(document.querySelector(`#vak-${vakId} input[name='aantalUren']`).value);
    //if (aantalUrenInput > maxAantalUrenTd) {
    //    aantalUrenInput.style.backgroundColor = "orange";
    //} else {
    //    aantalUrenInput.style.backgroundColor = "unset";
    //}
}

function resetError(input) {
    input.setAttribute('title', '');
    input.style.backgroundColor = "unset";
}

function setError(input, message) {
    input.setAttribute('title', message);
    input.style.backgroundColor = "red";
}
