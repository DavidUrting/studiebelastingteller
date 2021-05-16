let id = 0;

export class Vak {
    constructor(naam, studiepunten) {
        this._id = id++;
        this._naam = naam;
        this._studiepunten = studiepunten;
        this._aantalUren = 0;
    }

    init(vakkenlijst) {
        this._vakkenlijst = vakkenlijst;
    }

    // Primaire (technische) sleutel van een vak.
    // Blijft ongewijzigd, zelfs bij wijzigingen van de naam van het vak.
    get id() {
        return this._id;
    }

    get naam() {
        return this._naam;
    }

    set naam(val) {
        this._naam = val;
    }

    get studiepunten() {
        return this._studiepunten;
    }

    set studiepunten(val) {
        if (isNaN(val) || val < 0) {
            throw "Gelieve een getal groter dan 0 op te geven";
        }
        this._studiepunten = value;
    }

    // Het geschat aantal uren is een 'berekende' property.
    // Deze heeft dus geen 'setter'.
    get geschatAantalUren() {
        return this._studiepunten * 30;
    }

    get aantalUren() {
        return this._aantalUren;
    }

    set aantalUren(val) {
        if (isNaN(val) || val < 0) {
            throw "Gelieve een getal groter dan 0 op te geven";
        }
        this._aantalUren = val;
    }

    render(tbody) {
        tbody.innerHTML += `<tr id="vak-${this.id}"><td>${this.naam}</td><td>${this.studiepunten}</td><td>${this.geschatAantalUren}</td><td><input type="number" value="${this.aantalUren}" readonly /></td><td><button class="btn btn-primary">+</button><button class="btn btn-danger float-end">x</button></td></tr>`;
        let input = document.querySelector(`#vak-${this.id} input[type='number']`);
        let verhoogAantalUrenButton = document.querySelector(`#vak-${this.id} > td:last-child > button:first-child`);
        verhoogAantalUrenButton.addEventListener("click", (evt) => {
            this.aantalUren++;
            input.value = this.aantalUren;
        });

        let deleteButton = document.querySelector(`#vak-${this.id} > td:last-child > button:last-child`);
        deleteButton.addEventListener("click", (evt) => {
            this._vakkenlijst.deleteVak(this.id);
        });
    }
}