(()=>{"use strict";var __webpack_modules__={856:()=>{eval('\n;// CONCATENATED MODULE: ./src/vak.js\n\ufefflet nextId = 0;\r\n\r\nclass Vak {\r\n    static restoreFromJsonObject(vakkenlijst, jsonObject) {\r\n        // de id-teller op het maximaal \'tegengekomen\' id zetten zodat er geen id-clashes ontstaan bij toevoegen van nieuwe vakken.\r\n        nextId = Math.max(nextId, jsonObject._id + 1);\r\n\r\n        // En het \'vak\' object aanmaken op basis van de settings in het vak uit de JSON.\r\n        let vak = new Vak(vakkenlijst, jsonObject._id, jsonObject._naam, jsonObject._studiepunten, jsonObject._aantalUren);\r\n        return vak;\r\n    }\r\n\r\n    constructor(vakkenlijst, id, naam, studiepunten, aantalUren) {\r\n        this._vakkenlijst = vakkenlijst;\r\n\r\n        if (id === null || id === undefined || id < 0) {\r\n            this._id = nextId++;\r\n        } else {\r\n            this._id = id;\r\n        }\r\n        this._naam = naam;\r\n        this._studiepunten = studiepunten;\r\n        this._aantalUren = aantalUren;\r\n    }\r\n\r\n    // Primaire (technische) sleutel van een vak.\r\n    // Blijft ongewijzigd, zelfs bij wijzigingen van de naam van het vak.\r\n    get id() {\r\n        return this._id;\r\n    }\r\n\r\n    get naam() {\r\n        return this._naam;\r\n    }\r\n\r\n    set naam(val) {\r\n        if (!val) {\r\n            throw "Een vaknaam moet minstens uit één teken bestaan";\r\n        }\r\n        this._naam = val;\r\n    }\r\n\r\n    get studiepunten() {\r\n        return this._studiepunten;\r\n    }\r\n\r\n    set studiepunten(val) {\r\n        if (isNaN(val) || val < 1) {\r\n            throw "Gelieve een getal groter dan 0 op te geven";\r\n        }\r\n        this._studiepunten = val;\r\n    }\r\n\r\n    // Het geschat aantal uren is een \'berekende\' property.\r\n    // Deze heeft dus geen \'setter\'.\r\n    get geschatAantalUren() {\r\n        return this._studiepunten * 30;\r\n    }\r\n\r\n    get aantalUren() {\r\n        return this._aantalUren;\r\n    }\r\n\r\n    set aantalUren(val) {\r\n        if (isNaN(val) || val < 0) {\r\n            throw "Gelieve een getal groter dan of gelijk aan 0 op te geven";\r\n        }\r\n        this._aantalUren = val;\r\n\r\n        // Na het aanpassen van de uren direct ook weer saven...\r\n        this._vakkenlijst.save();\r\n    }\r\n\r\n    render(tbody) {\r\n        let tr =\r\n            `<tr id="vak-${this.id}">\r\n                <td><input name="naam" type="text" value="${this.naam}" class="form-control" /></td>\r\n                <td><input name="studiepunten" type="number" value="${this.studiepunten}" min="1" class="form-control" /></td>\r\n                <td><span>${this.geschatAantalUren}</span></td>\r\n                <td><input name="aantalUren" type="number" value="${this.aantalUren}" min="0" class="form-control" readonly /></td>\r\n                <td>\r\n                    <button class="btn btn-primary">+</button>\r\n                    <button class="btn btn-danger float-end">x</button>\r\n                </td>\r\n            </tr>`;\r\n\r\n        // innerHTML gebruiken is gevaarlijk: want de tweede keer dat je een rij toevoegt zal de HTML content vervangen worden waardoor\r\n        // alle event handlers weggegooid worden...\r\n        tbody.insertAdjacentHTML(\'beforeend\', tr);\r\n\r\n        let naamInput = document.querySelector(`#vak-${this.id} input[name=\'naam\']`);\r\n        naamInput.addEventListener("change", (evt) => {\r\n            try {\r\n                this._resetError(naamInput);\r\n\r\n                this.naam = evt.target.value;\r\n                this._vakkenlijst.save();\r\n            } catch (ex) {\r\n                this._setError(naamInput, ex);\r\n            }\r\n        });\r\n\r\n        let studiepuntenInput = document.querySelector(`#vak-${this.id} input[name=\'studiepunten\']`);\r\n        let geschatAantalUrenSpan = document.querySelector(`#vak-${this.id} span`);\r\n        studiepuntenInput.addEventListener("change", (evt) => {\r\n            try {\r\n                this._resetError(studiepuntenInput);\r\n\r\n                this.studiepunten = evt.target.value;\r\n                this._geefFeedbackBijOverschrijding();\r\n                geschatAantalUrenSpan.innerText = this.geschatAantalUren;\r\n                this._vakkenlijst.save();\r\n            } catch (ex) {\r\n                this._setError(studiepuntenInput, ex);\r\n            }\r\n        });\r\n\r\n\r\n        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name=\'aantalUren\']`);\r\n        aantalUrenInput.addEventListener("change", (evt) => {\r\n            try {\r\n                this._resetError(aantalUrenInput);\r\n\r\n                this.aantalUren = evt.target.value;\r\n                this._geefFeedbackBijOverschrijding();\r\n            } catch (ex) {\r\n                aantalUrenInput.value = this.aantalUren;\r\n                this._setError(aantalUrenInput, ex);\r\n            }            \r\n        });\r\n\r\n        let verhoogAantalUrenButton = document.querySelector(`#vak-${this.id} > td:last-child > button:first-child`);\r\n        verhoogAantalUrenButton.addEventListener("click", (evt) => {\r\n            this.aantalUren++;\r\n            aantalUrenInput.value = this.aantalUren;\r\n            this._geefFeedbackBijOverschrijding();\r\n        });\r\n\r\n        let deleteButton = document.querySelector(`#vak-${this.id} > td:last-child > button:last-child`);\r\n        deleteButton.addEventListener("click", (evt) => {\r\n            this._vakkenlijst.deleteVak(this.id);\r\n        });\r\n\r\n        // En ook al direct een eerste keer aanroepen (want het zou kunnen dat het aantal uren al groter is dan het geschat aantal uren).\r\n        this._geefFeedbackBijOverschrijding();\r\n    }\r\n\r\n    _geefFeedbackBijOverschrijding() {\r\n        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name=\'aantalUren\']`);\r\n        if (this.aantalUren > this.geschatAantalUren) {\r\n            aantalUrenInput.style.backgroundColor = "orange";\r\n        } else {\r\n            aantalUrenInput.style.backgroundColor = "unset";\r\n        }\r\n    }\r\n\r\n    _resetError(input) {\r\n        input.setAttribute(\'title\', \'\');\r\n        input.style.backgroundColor = "unset";\r\n    }\r\n\r\n    _setError(input, message) {\r\n        input.setAttribute(\'title\', message);\r\n        input.style.backgroundColor = "red";\r\n    }\r\n}\n;// CONCATENATED MODULE: ./src/vakkenlijst.js\n\ufeff\r\n\r\nconst localStorageKey = "vakkenLijst";\r\n\r\nclass Vakkenlijst {\r\n    constructor() {\r\n        this._vakken = [];\r\n\r\n        // Ophalen van de lijst van vakken uit de local storage.\r\n        // Opgelet: dit kan null zijn indien de pagina een eerste keer getoond wordt.\r\n        let vakkenLijstFromStorage = localStorage.getItem(localStorageKey);\r\n        if (vakkenLijstFromStorage) {\r\n            // Indien niet null: de JSON string terug omzetten naar een array van vakken.\r\n            // Opgelet: dit zijn gewone JavaScript objecten die niet (meer) afstammen van de Vak class.\r\n            // Vandaar loopen we over alle vakken uit de JSON en maken we terug volwaarde Vak-objecten van.\r\n            let vakkenFromJson = JSON.parse(vakkenLijstFromStorage);\r\n            vakkenFromJson.forEach(vakFromJson => {\r\n                let vak = Vak.restoreFromJsonObject(this, vakFromJson);\r\n                this._vakken.push(vak);\r\n            });\r\n        }\r\n        else {\r\n            // Indien wel null: al direct vakken toevoegen :)\r\n            this._vakken.push(new Vak(this, -1, "Database systemen: basis", 4, 0));\r\n            this._vakken.push(new Vak(this, -1, "Database systemen: gevorderd", 4, 0));\r\n            this._vakken.push(new Vak(this, -1, "Object oriented analysis", 4, 0));\r\n            this._vakken.push(new Vak(this, -1, "Programmeren met C#: basis", 6, 0));\r\n            this._vakken.push(new Vak(this, -1, "Programmeren met C#: gevorderd", 6, 0));\r\n            this._vakken.push(new Vak(this, -1, "Front end: basis", 4, 0));\r\n            this._vakken.push(new Vak(this, -1, "Front end: gevorderd", 6, 0));\r\n            this._vakken.push(new Vak(this, -1, "Geïntegreerd project 1", 3, 0));\r\n            this._vakken.push(new Vak(this, -1, "Geïntegreerd project 2", 4, 0));\r\n            this.save();\r\n        }\r\n    }\r\n\r\n    addVak(naam, studiepunten) {\r\n        let vak = new Vak(this, -1, naam, studiepunten, 0);\r\n        let bestaandVak = this._vakken.filter(v => v.naam === naam);\r\n        if (bestaandVak.length > 0) throw `Er bestaat reeds een vak met de naam ${naam}`;\r\n        else {\r\n            this._vakken.push(vak);\r\n            this.save();\r\n            this._renderVakken();\r\n        }\r\n    }\r\n\r\n    deleteVak(id) {\r\n        let indexToDelete = -1;\r\n        for (let i = 0; i < this._vakken.length; i++) {\r\n            if (this._vakken[i].id === id) {\r\n                indexToDelete = i;\r\n                break;\r\n            }\r\n        }\r\n        if (indexToDelete >= 0) {\r\n            this._vakken.splice(indexToDelete, 1);\r\n            this.save();\r\n            this._renderVakken();\r\n        }\r\n    }\r\n\r\n    save() {\r\n        localStorage.setItem(\r\n            localStorageKey,\r\n            // Hier is een addertje: aangezien Vakkenlijst verwijst naar Vak, en Vak ook weer naar Vakkenlijst hebben we een \'circulaire\' situatie.\r\n            // Met deze constructie kunnen we aangeven dat de _vakkenlijst van Vak mag genegeerd worden.\r\n            JSON.stringify(this._vakken, (key, value) => {\r\n                if (key === "_vakkenlijst") return;\r\n                else return value;\r\n            }));\r\n    }\r\n\r\n    render(element) {\r\n        let table =\r\n            `<table id="vakkenlijst" class="table">\r\n                <thead>\r\n                    <tr>\r\n                        <th>Vak</th>\r\n                        <th>Studiepunten</th>\r\n                        <th>Geschat aantal uren</th>\r\n                        <th>Aantal uren</th>\r\n                        <th></th> \x3c!-- Voor de action buttons --\x3e\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                </tbody>\r\n                <tfoot>\r\n                    <tr>\r\n                        <td><button id="voegVakToe" class="btn btn-secondary">Nieuw vak</button></td>\r\n                        <td></td>\r\n                        <td></td>\r\n                        <td><button id="corrigeerUren" class="btn btn-secondary">Correctie</button></td>\r\n                        <td></td>\r\n                    </tr>\r\n                </tfoot>\r\n            </table>`;\r\n\r\n        element.innerHTML = table;\r\n\r\n        document.getElementById("voegVakToe").addEventListener("click", (evt) => {\r\n            this.addVak("Vak", 1);\r\n        });\r\n\r\n        document.getElementById("corrigeerUren").addEventListener("click", (evt) => {\r\n            let buttons = document.querySelectorAll("#vakkenlijst input");\r\n            for (let i = 0; i < buttons.length; i++) {\r\n                buttons[i].removeAttribute("readonly");\r\n            }\r\n        });\r\n\r\n        this._renderVakken();\r\n    }\r\n\r\n    _renderVakken() {\r\n        let tbody = document.querySelector("#vakkenlijst tbody");\r\n        tbody.innerHTML = ""; // Indien render een zoveelste keer wordt aangeroepen: de rijen verwijderen en opnieuw aanmaken.\r\n        for (let i = 0; i < this._vakken.length; i++) {\r\n            // Elke rij mag zichzelf dan \'renderen\' in het HTML document.\r\n            this._vakken[i].render(tbody);\r\n        }\r\n    }\r\n}\n;// CONCATENATED MODULE: ./src/index.js\n\ufeff\r\n\r\nlet vakkenlijst = new Vakkenlijst();\r\nvakkenlijst.render(document.querySelector("section"));\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNUO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvQkFBb0I7QUFDaEQ7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUIsd0JBQXdCLHlCQUF5QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7O0FDMUhBLENBQTZDO0FBQzdDO0FBQ0Esc0JBQXNCLFdBQVc7QUFDakMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGllbnQvLi9zcmMvdmFrLmpzP2Y2ZmQiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL3Zha2tlbmxpanN0LmpzPzFjYTIiLCJ3ZWJwYWNrOi8vY2xpZW50Ly4vc3JjL2luZGV4LmpzP2I2MzUiXSwic291cmNlc0NvbnRlbnQiOlsi77u/bGV0IG5leHRJZCA9IDA7XHJcblxyXG5leHBvcnQgY2xhc3MgVmFrIHtcclxuICAgIHN0YXRpYyByZXN0b3JlRnJvbUpzb25PYmplY3QodmFra2VubGlqc3QsIGpzb25PYmplY3QpIHtcclxuICAgICAgICAvLyBkZSBpZC10ZWxsZXIgb3AgaGV0IG1heGltYWFsICd0ZWdlbmdla29tZW4nIGlkIHpldHRlbiB6b2RhdCBlciBnZWVuIGlkLWNsYXNoZXMgb250c3RhYW4gYmlqIHRvZXZvZWdlbiB2YW4gbmlldXdlIHZha2tlbi5cclxuICAgICAgICBuZXh0SWQgPSBNYXRoLm1heChuZXh0SWQsIGpzb25PYmplY3QuX2lkICsgMSk7XHJcblxyXG4gICAgICAgIC8vIEVuIGhldCAndmFrJyBvYmplY3QgYWFubWFrZW4gb3AgYmFzaXMgdmFuIGRlIHNldHRpbmdzIGluIGhldCB2YWsgdWl0IGRlIEpTT04uXHJcbiAgICAgICAgbGV0IHZhayA9IG5ldyBWYWsodmFra2VubGlqc3QsIGpzb25PYmplY3QuX2lkLCBqc29uT2JqZWN0Ll9uYWFtLCBqc29uT2JqZWN0Ll9zdHVkaWVwdW50ZW4sIGpzb25PYmplY3QuX2FhbnRhbFVyZW4pO1xyXG4gICAgICAgIHJldHVybiB2YWs7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFra2VubGlqc3QsIGlkLCBuYWFtLCBzdHVkaWVwdW50ZW4sIGFhbnRhbFVyZW4pIHtcclxuICAgICAgICB0aGlzLl92YWtrZW5saWpzdCA9IHZha2tlbmxpanN0O1xyXG5cclxuICAgICAgICBpZiAoaWQgPT09IG51bGwgfHwgaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5faWQgPSBuZXh0SWQrKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9uYWFtID0gbmFhbTtcclxuICAgICAgICB0aGlzLl9zdHVkaWVwdW50ZW4gPSBzdHVkaWVwdW50ZW47XHJcbiAgICAgICAgdGhpcy5fYWFudGFsVXJlbiA9IGFhbnRhbFVyZW47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJpbWFpcmUgKHRlY2huaXNjaGUpIHNsZXV0ZWwgdmFuIGVlbiB2YWsuXHJcbiAgICAvLyBCbGlqZnQgb25nZXdpanppZ2QsIHplbGZzIGJpaiB3aWp6aWdpbmdlbiB2YW4gZGUgbmFhbSB2YW4gaGV0IHZhay5cclxuICAgIGdldCBpZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5hYW0oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hYW07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG5hYW0odmFsKSB7XHJcbiAgICAgICAgaWYgKCF2YWwpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJFZW4gdmFrbmFhbSBtb2V0IG1pbnN0ZW5zIHVpdCDDqcOpbiB0ZWtlbiBiZXN0YWFuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX25hYW0gPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN0dWRpZXB1bnRlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3R1ZGllcHVudGVuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzdHVkaWVwdW50ZW4odmFsKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkgfHwgdmFsIDwgMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkdlbGlldmUgZWVuIGdldGFsIGdyb3RlciBkYW4gMCBvcCB0ZSBnZXZlblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zdHVkaWVwdW50ZW4gPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGV0IGdlc2NoYXQgYWFudGFsIHVyZW4gaXMgZWVuICdiZXJla2VuZGUnIHByb3BlcnR5LlxyXG4gICAgLy8gRGV6ZSBoZWVmdCBkdXMgZ2VlbiAnc2V0dGVyJy5cclxuICAgIGdldCBnZXNjaGF0QWFudGFsVXJlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3R1ZGllcHVudGVuICogMzA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGFhbnRhbFVyZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FhbnRhbFVyZW47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGFhbnRhbFVyZW4odmFsKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkgfHwgdmFsIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkdlbGlldmUgZWVuIGdldGFsIGdyb3RlciBkYW4gb2YgZ2VsaWprIGFhbiAwIG9wIHRlIGdldmVuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2FhbnRhbFVyZW4gPSB2YWw7XHJcblxyXG4gICAgICAgIC8vIE5hIGhldCBhYW5wYXNzZW4gdmFuIGRlIHVyZW4gZGlyZWN0IG9vayB3ZWVyIHNhdmVuLi4uXHJcbiAgICAgICAgdGhpcy5fdmFra2VubGlqc3Quc2F2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0Ym9keSkge1xyXG4gICAgICAgIGxldCB0ciA9XHJcbiAgICAgICAgICAgIGA8dHIgaWQ9XCJ2YWstJHt0aGlzLmlkfVwiPlxyXG4gICAgICAgICAgICAgICAgPHRkPjxpbnB1dCBuYW1lPVwibmFhbVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCIke3RoaXMubmFhbX1cIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgbmFtZT1cInN0dWRpZXB1bnRlblwiIHR5cGU9XCJudW1iZXJcIiB2YWx1ZT1cIiR7dGhpcy5zdHVkaWVwdW50ZW59XCIgbWluPVwiMVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkPjxzcGFuPiR7dGhpcy5nZXNjaGF0QWFudGFsVXJlbn08L3NwYW4+PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgbmFtZT1cImFhbnRhbFVyZW5cIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9XCIke3RoaXMuYWFudGFsVXJlbn1cIiBtaW49XCIwXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiByZWFkb25seSAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPis8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgZmxvYXQtZW5kXCI+eDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPC90cj5gO1xyXG5cclxuICAgICAgICAvLyBpbm5lckhUTUwgZ2VicnVpa2VuIGlzIGdldmFhcmxpams6IHdhbnQgZGUgdHdlZWRlIGtlZXIgZGF0IGplIGVlbiByaWogdG9ldm9lZ3QgemFsIGRlIEhUTUwgY29udGVudCB2ZXJ2YW5nZW4gd29yZGVuIHdhYXJkb29yXHJcbiAgICAgICAgLy8gYWxsZSBldmVudCBoYW5kbGVycyB3ZWdnZWdvb2lkIHdvcmRlbi4uLlxyXG4gICAgICAgIHRib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdHIpO1xyXG5cclxuICAgICAgICBsZXQgbmFhbUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3Zhay0ke3RoaXMuaWR9IGlucHV0W25hbWU9J25hYW0nXWApO1xyXG4gICAgICAgIG5hYW1JbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldnQpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0RXJyb3IobmFhbUlucHV0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hYW0gPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFra2VubGlqc3Quc2F2ZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RXJyb3IobmFhbUlucHV0LCBleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHN0dWRpZXB1bnRlbklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3Zhay0ke3RoaXMuaWR9IGlucHV0W25hbWU9J3N0dWRpZXB1bnRlbiddYCk7XHJcbiAgICAgICAgbGV0IGdlc2NoYXRBYW50YWxVcmVuU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCN2YWstJHt0aGlzLmlkfSBzcGFuYCk7XHJcbiAgICAgICAgc3R1ZGllcHVudGVuSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldEVycm9yKHN0dWRpZXB1bnRlbklucHV0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0dWRpZXB1bnRlbiA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZWVmRmVlZGJhY2tCaWpPdmVyc2NocmlqZGluZygpO1xyXG4gICAgICAgICAgICAgICAgZ2VzY2hhdEFhbnRhbFVyZW5TcGFuLmlubmVyVGV4dCA9IHRoaXMuZ2VzY2hhdEFhbnRhbFVyZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWtrZW5saWpzdC5zYXZlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRFcnJvcihzdHVkaWVwdW50ZW5JbnB1dCwgZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgYWFudGFsVXJlbklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3Zhay0ke3RoaXMuaWR9IGlucHV0W25hbWU9J2FhbnRhbFVyZW4nXWApO1xyXG4gICAgICAgIGFhbnRhbFVyZW5JbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldnQpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0RXJyb3IoYWFudGFsVXJlbklucHV0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFhbnRhbFVyZW4gPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2VlZkZlZWRiYWNrQmlqT3ZlcnNjaHJpamRpbmcoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIGFhbnRhbFVyZW5JbnB1dC52YWx1ZSA9IHRoaXMuYWFudGFsVXJlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldEVycm9yKGFhbnRhbFVyZW5JbnB1dCwgZXgpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCB2ZXJob29nQWFudGFsVXJlbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCN2YWstJHt0aGlzLmlkfSA+IHRkOmxhc3QtY2hpbGQgPiBidXR0b246Zmlyc3QtY2hpbGRgKTtcclxuICAgICAgICB2ZXJob29nQWFudGFsVXJlbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFhbnRhbFVyZW4rKztcclxuICAgICAgICAgICAgYWFudGFsVXJlbklucHV0LnZhbHVlID0gdGhpcy5hYW50YWxVcmVuO1xyXG4gICAgICAgICAgICB0aGlzLl9nZWVmRmVlZGJhY2tCaWpPdmVyc2NocmlqZGluZygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgZGVsZXRlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3Zhay0ke3RoaXMuaWR9ID4gdGQ6bGFzdC1jaGlsZCA+IGJ1dHRvbjpsYXN0LWNoaWxkYCk7XHJcbiAgICAgICAgZGVsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbmxpanN0LmRlbGV0ZVZhayh0aGlzLmlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gRW4gb29rIGFsIGRpcmVjdCBlZW4gZWVyc3RlIGtlZXIgYWFucm9lcGVuICh3YW50IGhldCB6b3Uga3VubmVuIGRhdCBoZXQgYWFudGFsIHVyZW4gYWwgZ3JvdGVyIGlzIGRhbiBoZXQgZ2VzY2hhdCBhYW50YWwgdXJlbikuXHJcbiAgICAgICAgdGhpcy5fZ2VlZkZlZWRiYWNrQmlqT3ZlcnNjaHJpamRpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBfZ2VlZkZlZWRiYWNrQmlqT3ZlcnNjaHJpamRpbmcoKSB7XHJcbiAgICAgICAgbGV0IGFhbnRhbFVyZW5JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCN2YWstJHt0aGlzLmlkfSBpbnB1dFtuYW1lPSdhYW50YWxVcmVuJ11gKTtcclxuICAgICAgICBpZiAodGhpcy5hYW50YWxVcmVuID4gdGhpcy5nZXNjaGF0QWFudGFsVXJlbikge1xyXG4gICAgICAgICAgICBhYW50YWxVcmVuSW5wdXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJvcmFuZ2VcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhYW50YWxVcmVuSW5wdXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ1bnNldFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfcmVzZXRFcnJvcihpbnB1dCkge1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnJyk7XHJcbiAgICAgICAgaW5wdXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ1bnNldFwiO1xyXG4gICAgfVxyXG5cclxuICAgIF9zZXRFcnJvcihpbnB1dCwgbWVzc2FnZSkge1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndGl0bGUnLCBtZXNzYWdlKTtcclxuICAgICAgICBpbnB1dC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJlZFwiO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgVmFrIH0gZnJvbSBcIi4vdmFrXCI7XHJcblxyXG5jb25zdCBsb2NhbFN0b3JhZ2VLZXkgPSBcInZha2tlbkxpanN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmFra2VubGlqc3Qge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fdmFra2VuID0gW107XHJcblxyXG4gICAgICAgIC8vIE9waGFsZW4gdmFuIGRlIGxpanN0IHZhbiB2YWtrZW4gdWl0IGRlIGxvY2FsIHN0b3JhZ2UuXHJcbiAgICAgICAgLy8gT3BnZWxldDogZGl0IGthbiBudWxsIHppam4gaW5kaWVuIGRlIHBhZ2luYSBlZW4gZWVyc3RlIGtlZXIgZ2V0b29uZCB3b3JkdC5cclxuICAgICAgICBsZXQgdmFra2VuTGlqc3RGcm9tU3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUtleSk7XHJcbiAgICAgICAgaWYgKHZha2tlbkxpanN0RnJvbVN0b3JhZ2UpIHtcclxuICAgICAgICAgICAgLy8gSW5kaWVuIG5pZXQgbnVsbDogZGUgSlNPTiBzdHJpbmcgdGVydWcgb216ZXR0ZW4gbmFhciBlZW4gYXJyYXkgdmFuIHZha2tlbi5cclxuICAgICAgICAgICAgLy8gT3BnZWxldDogZGl0IHppam4gZ2V3b25lIEphdmFTY3JpcHQgb2JqZWN0ZW4gZGllIG5pZXQgKG1lZXIpIGFmc3RhbW1lbiB2YW4gZGUgVmFrIGNsYXNzLlxyXG4gICAgICAgICAgICAvLyBWYW5kYWFyIGxvb3BlbiB3ZSBvdmVyIGFsbGUgdmFra2VuIHVpdCBkZSBKU09OIGVuIG1ha2VuIHdlIHRlcnVnIHZvbHdhYXJkZSBWYWstb2JqZWN0ZW4gdmFuLlxyXG4gICAgICAgICAgICBsZXQgdmFra2VuRnJvbUpzb24gPSBKU09OLnBhcnNlKHZha2tlbkxpanN0RnJvbVN0b3JhZ2UpO1xyXG4gICAgICAgICAgICB2YWtrZW5Gcm9tSnNvbi5mb3JFYWNoKHZha0Zyb21Kc29uID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWsgPSBWYWsucmVzdG9yZUZyb21Kc29uT2JqZWN0KHRoaXMsIHZha0Zyb21Kc29uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKHZhayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gSW5kaWVuIHdlbCBudWxsOiBhbCBkaXJlY3QgdmFra2VuIHRvZXZvZWdlbiA6KVxyXG4gICAgICAgICAgICB0aGlzLl92YWtrZW4ucHVzaChuZXcgVmFrKHRoaXMsIC0xLCBcIkRhdGFiYXNlIHN5c3RlbWVuOiBiYXNpc1wiLCA0LCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKG5ldyBWYWsodGhpcywgLTEsIFwiRGF0YWJhc2Ugc3lzdGVtZW46IGdldm9yZGVyZFwiLCA0LCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKG5ldyBWYWsodGhpcywgLTEsIFwiT2JqZWN0IG9yaWVudGVkIGFuYWx5c2lzXCIsIDQsIDApKTtcclxuICAgICAgICAgICAgdGhpcy5fdmFra2VuLnB1c2gobmV3IFZhayh0aGlzLCAtMSwgXCJQcm9ncmFtbWVyZW4gbWV0IEMjOiBiYXNpc1wiLCA2LCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKG5ldyBWYWsodGhpcywgLTEsIFwiUHJvZ3JhbW1lcmVuIG1ldCBDIzogZ2V2b3JkZXJkXCIsIDYsIDApKTtcclxuICAgICAgICAgICAgdGhpcy5fdmFra2VuLnB1c2gobmV3IFZhayh0aGlzLCAtMSwgXCJGcm9udCBlbmQ6IGJhc2lzXCIsIDQsIDApKTtcclxuICAgICAgICAgICAgdGhpcy5fdmFra2VuLnB1c2gobmV3IFZhayh0aGlzLCAtMSwgXCJGcm9udCBlbmQ6IGdldm9yZGVyZFwiLCA2LCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKG5ldyBWYWsodGhpcywgLTEsIFwiR2XDr250ZWdyZWVyZCBwcm9qZWN0IDFcIiwgMywgMCkpO1xyXG4gICAgICAgICAgICB0aGlzLl92YWtrZW4ucHVzaChuZXcgVmFrKHRoaXMsIC0xLCBcIkdlw69udGVncmVlcmQgcHJvamVjdCAyXCIsIDQsIDApKTtcclxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZFZhayhuYWFtLCBzdHVkaWVwdW50ZW4pIHtcclxuICAgICAgICBsZXQgdmFrID0gbmV3IFZhayh0aGlzLCAtMSwgbmFhbSwgc3R1ZGllcHVudGVuLCAwKTtcclxuICAgICAgICBsZXQgYmVzdGFhbmRWYWsgPSB0aGlzLl92YWtrZW4uZmlsdGVyKHYgPT4gdi5uYWFtID09PSBuYWFtKTtcclxuICAgICAgICBpZiAoYmVzdGFhbmRWYWsubGVuZ3RoID4gMCkgdGhyb3cgYEVyIGJlc3RhYXQgcmVlZHMgZWVuIHZhayBtZXQgZGUgbmFhbSAke25hYW19YDtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fdmFra2VuLnB1c2godmFrKTtcclxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclZha2tlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVWYWsoaWQpIHtcclxuICAgICAgICBsZXQgaW5kZXhUb0RlbGV0ZSA9IC0xO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmFra2VuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl92YWtrZW5baV0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleFRvRGVsZXRlID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbmRleFRvRGVsZXRlID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fdmFra2VuLnNwbGljZShpbmRleFRvRGVsZXRlLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclZha2tlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzYXZlKCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VLZXksXHJcbiAgICAgICAgICAgIC8vIEhpZXIgaXMgZWVuIGFkZGVydGplOiBhYW5nZXppZW4gVmFra2VubGlqc3QgdmVyd2lqc3QgbmFhciBWYWssIGVuIFZhayBvb2sgd2VlciBuYWFyIFZha2tlbmxpanN0IGhlYmJlbiB3ZSBlZW4gJ2NpcmN1bGFpcmUnIHNpdHVhdGllLlxyXG4gICAgICAgICAgICAvLyBNZXQgZGV6ZSBjb25zdHJ1Y3RpZSBrdW5uZW4gd2UgYWFuZ2V2ZW4gZGF0IGRlIF92YWtrZW5saWpzdCB2YW4gVmFrIG1hZyBnZW5lZ2VlcmQgd29yZGVuLlxyXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLl92YWtrZW4sIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIl92YWtrZW5saWpzdFwiKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IHRhYmxlID1cclxuICAgICAgICAgICAgYDx0YWJsZSBpZD1cInZha2tlbmxpanN0XCIgY2xhc3M9XCJ0YWJsZVwiPlxyXG4gICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlZhazwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdHVkaWVwdW50ZW48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+R2VzY2hhdCBhYW50YWwgdXJlbjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5BYW50YWwgdXJlbjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPiA8IS0tIFZvb3IgZGUgYWN0aW9uIGJ1dHRvbnMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPHRmb290PlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxidXR0b24gaWQ9XCJ2b2VnVmFrVG9lXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiPk5pZXV3IHZhazwvYnV0dG9uPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxidXR0b24gaWQ9XCJjb3JyaWdlZXJVcmVuXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiPkNvcnJlY3RpZTwvYnV0dG9uPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8L3Rmb290PlxyXG4gICAgICAgICAgICA8L3RhYmxlPmA7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGFibGU7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidm9lZ1Zha1RvZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFZhayhcIlZha1wiLCAxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb3JyaWdlZXJVcmVuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiN2YWtrZW5saWpzdCBpbnB1dFwiKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25zW2ldLnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlclZha2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIF9yZW5kZXJWYWtrZW4oKSB7XHJcbiAgICAgICAgbGV0IHRib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN2YWtrZW5saWpzdCB0Ym9keVwiKTtcclxuICAgICAgICB0Ym9keS5pbm5lckhUTUwgPSBcIlwiOyAvLyBJbmRpZW4gcmVuZGVyIGVlbiB6b3ZlZWxzdGUga2VlciB3b3JkdCBhYW5nZXJvZXBlbjogZGUgcmlqZW4gdmVyd2lqZGVyZW4gZW4gb3BuaWV1dyBhYW5tYWtlbi5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Zha2tlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvLyBFbGtlIHJpaiBtYWcgemljaHplbGYgZGFuICdyZW5kZXJlbicgaW4gaGV0IEhUTUwgZG9jdW1lbnQuXHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbltpXS5yZW5kZXIodGJvZHkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IFZha2tlbmxpanN0IH0gZnJvbSBcIi4vdmFra2VubGlqc3RcIjtcclxuXHJcbmxldCB2YWtrZW5saWpzdCA9IG5ldyBWYWtrZW5saWpzdCgpO1xyXG52YWtrZW5saWpzdC5yZW5kZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInNlY3Rpb25cIikpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///856\n')}},__webpack_exports__={};__webpack_modules__[856]()})();