const plusKnoppen = document.querySelectorAll("tbody tr button");
const aantalUrenInputs = document.querySelectorAll("tbody tr input[type='number']");
const correctieKnop = document.getElementById("corrigeerUren");

for (let i = 0; i < plusKnoppen.length; i++) {
    plusKnoppen[i].addEventListener("click", (e) => {
        let trElement = e.currentTarget.parentElement.parentElement;
        let vakId = trElement.id;
        let aantalUrenInput = document.querySelector(`#${vakId} input[type='number']`);
        aantalUrenInput.value = parseInt(aantalUrenInput.value) + 1;
        localStorage.set(vakId, aantalUrenInput.value);
    });
}

for (let i = 0; i < aantalUrenInputs.length; i++) {    
    let vakId = aantalUrenInputs[i].id;

    if (localStorage.getItem(vakId)) {
        aantalUrenInputs[i].value = parseInt(localStorage.getItem);
    }

    aantalUrenInputs[i].addEventListener("change", (e) => {
        localStorage.set(vakId, aantalUrenInput.value);
    });
}

correctieKnop.addEventListener("click", () => {
    for (let i = 0; i < aantalUrenInputs.length; i++) 
    {
        aantalUrenInputs[i].removeAttribute('readonly');
    }
});