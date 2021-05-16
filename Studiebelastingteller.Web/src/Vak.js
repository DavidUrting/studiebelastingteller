export class Vak {
    constructor(naam, studiepunten) {
        this._naam = naam;
        this._studiepunten = studiepunten;
        this._aantalUren = 0;
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
        this._aantalUren = value;
    }

    render(tbody) {
        tbody.innerHTML += `<tr><td>${this.naam}</td><td>${this.studiepunten}</td><td>${this.geschatAantalUren}</td><td>${this.aantalUren}</td></tr>`
    }
}