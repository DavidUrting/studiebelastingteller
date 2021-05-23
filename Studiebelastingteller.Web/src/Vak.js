let nextId = 0;

// Objecten van deze klasse stellen een vak voor.
// Elk vak heeft een unieke ID (= een technische sleutel).
// Om zeker te zijn dat een sleutel slechts éénmaal wordt toegekend hebben we een variabele nextId gedeclareerd
// die telkens zal verhoogd worden bij aanmaak van een nieuw vak.
export class Vak {

    // Een object dat wordt aangemaakt vanuit een JSON object is 'klasseloos'.
    // We moeten daar dus zelf weer een Vak-object van maken.
    // Bemerk dat dit een 'static' methode is: Vakkenlijst kan dit dus aanroepen op de Vak-class.
    static restoreFromJsonObject(vakkenlijst, jsonObject) {
        // de id-teller op het maximaal 'tegengekomen' id zetten zodat er geen id-clashes ontstaan bij toevoegen van nieuwe vakken.
        nextId = Math.max(nextId, jsonObject._id + 1);

        // En het 'vak' object aanmaken op basis van de settings in het vak uit de JSON.
        let vak = new Vak(vakkenlijst, jsonObject._id, jsonObject._naam, jsonObject._studiepunten, jsonObject._aantalUren);
        return vak;
    }

    // Een vak krijgt een aantal argumenten mee bij constructie.
    // Onder andere geeft het Vakkenlijst-object zichzelf door aan het vak.
    // Zo kan het vak methods aanroepen op de Vakkenlijst bij bepaalde gebeurtenissen (zoals de save() en deleteVak() methoden).
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

    // Een vak moet zichzelf als <tr> renderen in de <tbody> die de Vakkenlijst doorgeeft.
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
        // Dit kan je oplossen door gebruik te maken van insertAdjacentHTML.
        tbody.insertAdjacentHTML('beforeend', tr);

        // Toevoegen van een 'change' handler aan alle input fields voor de naam van het vak.
        // De handler heeft een try-catch omdat de 'naam' setter mogelijks exceptions kan opgooien indien de naam bijvoorbeeld leeg is.
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

        // Toevoegen van een 'change' handler aan alle input fields voor de studiepunten van het vak.
        // De handler heeft een try-catch omdat de 'studiepunten' setter mogelijks exceptions kan opgooien indien het aantal studiepunten kleiner dan 1 is.
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

        // Toevoegen van een 'change' handler aan alle input fields voor het aantal uren van het vak.
        // De handler heeft een try-catch omdat de 'aantalUren' setter mogelijks exceptions kan opgooien indien het aantal uren kleiner dan 0 is.
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

        // Toevoegen van een 'click' handler aan alle '+' buttons.
        // Dit zorgt voor het verhogen van het aantal uren.
        let verhoogAantalUrenButton = document.querySelector(`#vak-${this.id} > td:last-child > button:first-child`);
        verhoogAantalUrenButton.addEventListener("click", (evt) => {
            this.aantalUren++;
            aantalUrenInput.value = this.aantalUren;
            this._geefFeedbackBijOverschrijding();
        });

        // Toevoegen van een 'click' handler aan alle delete buttons.
        // Dit zorgt voor het verwijderen van het vak waarop geklikt is.
        let deleteButton = document.querySelector(`#vak-${this.id} > td:last-child > button:last-child`);
        deleteButton.addEventListener("click", (evt) => {
            this._vakkenlijst.deleteVak(this.id);
        });

        // En ook al direct een eerste keer aanroepen (want het zou kunnen dat het aantal uren al groter is dan het geschat aantal uren).
        this._geefFeedbackBijOverschrijding();
    }

    // Deze methode zorgt voor visuele feedback indien het aantal uren groter is dan het maximum aantal uren.
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