import { Vak } from "./vak";

// Deze constante zal als 'key' gebruikt worden in de localStorage.
const LOCAL_STORAGE_KEY = "vakkenLijst";

export class Vakkenlijst {
    constructor() {
        this._vakken = [];

        // Ophalen van de lijst van vakken uit de local storage.
        // Opgelet: dit kan null zijn indien de pagina een eerste keer getoond wordt.
        let vakkenLijstFromStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (vakkenLijstFromStorage) {
            // Indien niet null: de JSON string terug omzetten naar een array van vakken.
            // Opgelet: dit zijn gewone JavaScript objecten die niet (meer) afstammen van de Vak class.
            // Vandaar loopen we over alle vakken uit de JSON en maken we er terug volwaarde Vak-objecten van.
            let vakkenFromJson = JSON.parse(vakkenLijstFromStorage);
            vakkenFromJson.forEach(vakFromJson => {
                let vak = Vak.restoreFromJsonObject(this, vakFromJson);
                this._vakken.push(vak);
            });
        }
        else {
            // Indien wel null: al direct vakken toevoegen :)
            this._vakken.push(new Vak(this, -1, "Database systemen: basis", 4, 0));
            this._vakken.push(new Vak(this, -1, "Database systemen: gevorderd", 4, 0));
            this._vakken.push(new Vak(this, -1, "Object oriented analysis", 4, 0));
            this._vakken.push(new Vak(this, -1, "Programmeren met C#: basis", 6, 0));
            this._vakken.push(new Vak(this, -1, "Programmeren met C#: gevorderd", 6, 0));
            this._vakken.push(new Vak(this, -1, "Front end: basis", 4, 0));
            this._vakken.push(new Vak(this, -1, "Front end: gevorderd", 6, 0));
            this._vakken.push(new Vak(this, -1, "Geïntegreerd project 1", 3, 0));
            this._vakken.push(new Vak(this, -1, "Geïntegreerd project 2", 4, 0));
            this.save();
        }
    }

    // Met deze methode wordt een nieuw vak toegevoegd.
    addVak(naam, studiepunten) {
        // Als tweede argument (= id) wordt -1 doorgeven. Zo zal Vak ervoor zorgen dat er een nieuwe
        // id wordt toegekend.
        let vak = new Vak(this, -1, naam, studiepunten, 0);
        let bestaandVak = this._vakken.filter(v => v.naam === naam);
        if (bestaandVak.length > 0) throw `Er bestaat reeds een vak met de naam ${naam}`;
        else {
            this._vakken.push(vak);
            this.save();
            this._renderVakken();
        }
    }

    // Met deze methode wordt een vak verwijderd op basis van de id van het vak.
    // Bemerk dat de array methode 'splice' wordt gebruikt om een 'stukje' uit de array te knippen.
    deleteVak(id) {
        let indexToDelete = -1;
        for (let i = 0; i < this._vakken.length; i++) {
            if (this._vakken[i].id === id) {
                indexToDelete = i;
                break;
            }
        }
        if (indexToDelete >= 0) {
            this._vakken.splice(indexToDelete, 1);
            this.save();
            this._renderVakken();
        }
    }

    // Met deze methode worden alle vaken in de localStorage bewaard.
    save() {
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            // Hier is een addertje: aangezien Vakkenlijst verwijst naar Vak, en Vak ook weer naar Vakkenlijst hebben we een 'circulaire' situatie.
            // Met deze constructie kunnen we aangeven dat de _vakkenlijst van Vak mag genegeerd worden.
            JSON.stringify(this._vakken, (key, value) => {
                if (key === "_vakkenlijst") return;
                else return value;
            }));
    }

    // Een vakkenlijst moet zichzelf als <table> renderen in het html element dat de caller doorgeeft.
    render(element) {
        let table =
            `<table id="vakkenlijst" class="table">
                <thead>
                    <tr>
                        <th>Vak</th>
                        <th>Studiepunten</th>
                        <th>Geschat aantal uren</th>
                        <th>Aantal uren</th>
                        <th></th> <!-- Voor de action buttons -->
                    </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                    <tr>
                        <td><button id="voegVakToe" class="btn btn-secondary">Nieuw vak</button></td>
                        <td></td>
                        <td></td>
                        <td><button id="corrigeerUren" class="btn btn-secondary">Correctie</button></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>`;

        element.innerHTML = table;

        // Toevoegen van een event handler wanneer op de voegVakToe button wordt geklikt.
        document.getElementById("voegVakToe").addEventListener("click", (evt) => {
            this.addVak("Vak", 1);
        });

        // Toevoegen van een event handler wanneer op de corrigeerUren button wordt geklikt.
        // Deze event handler zal alle readonly attributen van de input fields weghalen.
        document.getElementById("corrigeerUren").addEventListener("click", (evt) => {
            let buttons = document.querySelectorAll("#vakkenlijst input");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].removeAttribute("readonly");
            }
        });

        // En nu kunnen alle vakken gerenderd (getoond) worden.
        this._renderVakken();
    }

    // render(), addVak() en deleteVak() zullen gebruik maken van deze methode om elk vak te renderen in de <tbody> van de table.
    // Elk Vak-object is dus verantwoordelijk om zichzelf te renderen...
    // Met _ geven we aan dat de methode 'private' is en dus best niet gebruikt wordt buiten deze klasse.
    _renderVakken() {
        let tbody = document.querySelector("#vakkenlijst tbody");
        tbody.innerHTML = ""; // Indien _renderVakken een tweede, derde, ... keer wordt aangeroepen: de rijen verwijderen en opnieuw aanmaken.
        for (let i = 0; i < this._vakken.length; i++) {
            // Elke rij mag zichzelf dan 'renderen' in het HTML document.
            this._vakken[i].render(tbody);
        }
    }
}