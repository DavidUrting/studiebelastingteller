let nextId = 0;

export class Vak {
    static restoreFromJsonObject(vakkenlijst, jsonObject) {
        // de id-teller op het maximaal 'tegengekomen' id zetten zodat er geen id-clashes ontstaan bij toevoegen van nieuwe vakken.
        nextId = Math.max(nextId, jsonObject._id + 1);

        // En het 'vak' object aanmaken op basis van de settings in het vak uit de JSON.
        let vak = new Vak(vakkenlijst, jsonObject._id, jsonObject._naam, jsonObject._studiepunten, jsonObject._aantalUren);
        return vak;
    }

    constructor(vakkenlijst, id, naam, studiepunten, aantalUren) {
        this._vakkenlijst = vakkenlijst;

        if (id === null || id === undefined || id < 0) {
            this._id = nextId++;
        } else {
            this._id = id;
        }
        this._naam = naam;
        this._studiepunten = studiepunten;
        this._aantalUren = aantalUren;
    }

    // Primaire (technische) sleutel van een vak.
    // Blijft ongewijzigd, zelfs bij wijzigingen van de naam van het vak.
    get id() {
        return this._id;
    }

    get naam() {
        return this._naam;
    }

    get studiepunten() {
        return this._studiepunten;
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

        // Na het aanpassen van de uren direct ook weer saven...
        this._vakkenlijst.save();
    }

    render(tbody) {
        let tr =
`<tr id="vak-${this.id}">
    <td>${this.naam}</td>
    <td>${this.studiepunten}</td>
    <td>${this.geschatAantalUren}</td>
    <td><input type="number" value="${this.aantalUren}" readonly /></td>
    <td>
        <button class="btn btn-primary">+</button>
        <button class="btn btn-danger float-end">x</button>
    </td>
</tr>`;
        tbody.innerHTML += tr;

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