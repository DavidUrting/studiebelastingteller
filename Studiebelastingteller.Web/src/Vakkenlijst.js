import { Vak } from "./vak";

const localStorageKey = "vakkenLijst";

export class Vakkenlijst {
    constructor() {
        this._vakken = [];

        // Ophalen van de lijst van vakken uit de local storage.
        // Opgelet: dit kan null zijn indien de pagina een eerste keer getoond wordt.
        let vakkenLijstFromStorage = localStorage.getItem(localStorageKey);
        if (vakkenLijstFromStorage) {
            // Indien niet null: de JSON string terug omzetten naar een array van vakken.
            // Opgelet: dit zijn gewone JavaScript objecten die niet (meer) afstammen van de Vak class.
            // Vandaar loopen we over alle vakken uit de JSON en maken we terug volwaarde Vak-objecten van.
            let vakkenFromJson = JSON.parse(vakkenLijstFromStorage);
            vakkenFromJson.forEach(vakFromJson => {
                let vak = Vak.restoreFromJsonObject(this, vakFromJson);
                this._vakken.push(vak);
            });
        }
        else {
            // Indien wel null: al direct een cool vak toevoegen om toch iets te tonen :)
            let vak = new Vak(this, "Front end gevorderd", 6);
            this._vakken.push(vak);
        }

        // Nadien kan de lijst van vakkenop het scherm 'gerenderd' worden.
        this.render();
    }

    addVak(naam, studiepunten) {
        let vak = new Vak(this, naam, studiepunten);
        let bestaandVak = this._vakken.filter(v => v.naam === naam);
        if (bestaandVak.length > 0) throw `Er bestaat reeds een vak met de naam ${naam}`;
        else {
            this._vakken.push(vak);
            this.save();
            this.render();
        }
    }

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
            this.render();
        }
    }

    save() {
        localStorage.setItem(
            localStorageKey,
            // Hier is een addertje: aangezien Vakkenlijst verwijst naar Vak, en Vak ook weer naar Vakkenlijst hebben we een 'circulaire' situatie.
            // Met deze constructie kunnen we aangeven dat de _vakkenlijst van Vak mag genegeerd worden.
            JSON.stringify(this._vakken, (key, value) => {
                if (key === "_vakkenlijst") return;
                else return value;
            }));
    }

    render() {
        let tbody = document.querySelector("tbody");

        tbody.innerHTML = ""; // Indien render een zoveelste keer wordt aangeroepen: de rijen verwijderen en opnieuw aanmaken.
        for (let i = 0; i < this._vakken.length; i++) {
            // Elke rij mag zichzelf dan 'renderen' in het HTML document.
            this._vakken[i].render(tbody);
        }
    }
}