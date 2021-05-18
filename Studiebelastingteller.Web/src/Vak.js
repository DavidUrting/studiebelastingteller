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

    set naam(val) {
        if (!val) {
            throw "Een vaknaam moet minstens uit één teken bestaan";
        }
        this._naam = val;
    }

    get studiepunten() {
        return this._studiepunten;
    }

    set studiepunten(val) {
        if (isNaN(val) || val < 1) {
            throw "Gelieve een getal groter dan 0 op te geven";
        }
        this._studiepunten = val;
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
            throw "Gelieve een getal groter dan of gelijk aan 0 op te geven";
        }
        this._aantalUren = val;

        // Na het aanpassen van de uren direct ook weer saven...
        this._vakkenlijst.save();
    }

    render(tbody) {
        let tr =
            `<tr id="vak-${this.id}">
                <td><input name="naam" type="text" value="${this.naam}" class="form-control" /></td>
                <td><input name="studiepunten" type="number" value="${this.studiepunten}" min="1" class="form-control" /></td>
                <td><span>${this.geschatAantalUren}</span></td>
                <td><input name="aantalUren" type="number" value="${this.aantalUren}" min="0" class="form-control" readonly /></td>
                <td>
                    <button class="btn btn-primary">+</button>
                    <button class="btn btn-danger float-end">x</button>
                </td>
            </tr>`;

        // innerHTML gebruiken is gevaarlijk: want de tweede keer dat je een rij toevoegt zal de HTML content vervangen worden waardoor
        // alle event handlers weggegooid worden...
        tbody.insertAdjacentHTML('beforeend', tr);

        let naamInput = document.querySelector(`#vak-${this.id} input[name='naam']`);
        naamInput.addEventListener("change", (evt) => {
            try {
                this._resetError(naamInput);

                this.naam = evt.target.value;
                this._vakkenlijst.save();
            } catch (ex) {
                this._setError(naamInput, ex);
            }
        });

        let studiepuntenInput = document.querySelector(`#vak-${this.id} input[name='studiepunten']`);
        let geschatAantalUrenSpan = document.querySelector(`#vak-${this.id} span`);
        studiepuntenInput.addEventListener("change", (evt) => {
            try {
                this._resetError(studiepuntenInput);

                this.studiepunten = evt.target.value;
                this._geefFeedbackBijOverschrijding();
                geschatAantalUrenSpan.innerText = this.geschatAantalUren;
                this._vakkenlijst.save();
            } catch (ex) {
                this._setError(studiepuntenInput, ex);
            }
        });


        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name='aantalUren']`);
        aantalUrenInput.addEventListener("change", (evt) => {
            try {
                this._resetError(aantalUrenInput);

                this.aantalUren = evt.target.value;
                this._geefFeedbackBijOverschrijding();
            } catch (ex) {
                aantalUrenInput.value = this.aantalUren;
                this._setError(aantalUrenInput, ex);
            }            
        });

        let verhoogAantalUrenButton = document.querySelector(`#vak-${this.id} > td:last-child > button:first-child`);
        verhoogAantalUrenButton.addEventListener("click", (evt) => {
            this.aantalUren++;
            aantalUrenInput.value = this.aantalUren;
            this._geefFeedbackBijOverschrijding();
        });

        let deleteButton = document.querySelector(`#vak-${this.id} > td:last-child > button:last-child`);
        deleteButton.addEventListener("click", (evt) => {
            this._vakkenlijst.deleteVak(this.id);
        });

        // En ook al direct een eerste keer aanroepen (want het zou kunnen dat het aantal uren al groter is dan het geschat aantal uren).
        this._geefFeedbackBijOverschrijding();
    }

    _geefFeedbackBijOverschrijding() {
        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name='aantalUren']`);
        if (this.aantalUren > this.geschatAantalUren) {
            aantalUrenInput.style.backgroundColor = "orange";
        } else {
            aantalUrenInput.style.backgroundColor = "unset";
        }
    }

    _resetError(input) {
        input.setAttribute('title', '');
        input.style.backgroundColor = "unset";
    }

    _setError(input, message) {
        input.setAttribute('title', message);
        input.style.backgroundColor = "red";
    }
}