import { Vakkenlijst } from "./vakkenlijst";

let vakkenlijst = new Vakkenlijst();

document.getElementById("voegVakToe").addEventListener("click", function (evt) {
    vakkenlijst.addVak("Test", 4);
});

document.getElementById("corrigeerUren").addEventListener("click", function (evt) {
    let buttons = document.querySelectorAll("input[type='number']");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].removeAttribute("readonly");
    }
});