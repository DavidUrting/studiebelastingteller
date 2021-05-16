import { Vak } from "./vak";

export class Vakkenlijst {
    constructor() {
        this._vakken = [];
    }

    initialiseer() {
        // Hier localStorage uitlezen
        this.voegVakToe("Front end gevorderd", 6);

        let tbody = document.querySelector("tbody");
        for (let i = 0; i < this._vakken.length; i++) {
            this._vakken[i].render(tbody);
        }
    }

    voegVakToe(naam, studiepunten) {
        let vak = new Vak(naam, studiepunten);
        let bestaandVak = this._vakken.filter(v => v.naam === naam);
        if (bestaandVak.length > 0) throw `Er bestaat reeds een vak met de naam ${naam}`;
        else {
            this._vakken.push(vak);
            this.save();
        }
    }

    verhoogAantalUren(naam) {
        let bestaandVak = this._vakken.filter(v => v.naam === naam);
        if (bestaandVak.length === 1) {
            bestaandVak.aantalUren++;
            this.save();
        }
    }

    corrigeerAantalUren(naam, aantalUren) {
        let bestaandVak = this._vakken.filter(v => v.naam === naam);
        if (bestaandVak.length === 1) {
            bestaandVak.aantalUren = aantalUren;
            this.save();
        }
    }

    verwijderVak(naam) {
        let indexToDelete = -1;
        for (let i = 0; i < this._vakken.length; i++) {
            if (this._vakken[i].naam === naam) {
                indexToDelete = i;
                break;
            }
        }
        if (indexToDelete >= 0) {
            this._vakken.splice(indexToDelete, 1);
            this.save();
        }
    }

    save() {
        // Hier localstorage wegschrijven
    }
}