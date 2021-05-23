import { Vakkenlijst } from "./vakkenlijst";

// Zoals je ziet is index.js vrij leeg: de functionaliteit werd verdeeld over twee classes:
// (1) Vakkenlijst: dit stelt een tabel van vakken voor. In dit tabel kan je vakken toevoegen en weer verwijderen.
// (2) Vak: dit stelt één vak voor, inclusief het aantal uren. De vakkenlijst zal objecten van deze klasse aanmaken.
let vakkenlijst = new Vakkenlijst();

// De 'render' methode van vakkenlijst is verantwoordelijk voor het renderen van een <table> in de section.
vakkenlijst.render(document.querySelector("section"));
