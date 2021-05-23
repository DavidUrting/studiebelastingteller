(()=>{"use strict";var __webpack_modules__={856:()=>{eval('\n;// CONCATENATED MODULE: ./src/vak.js\n\ufefflet nextId = 0;\r\n\r\n// Objecten van deze klasse stellen een vak voor.\r\n// Elk vak heeft een unieke ID (= een technische sleutel).\r\n// Om zeker te zijn dat een sleutel slechts éénmaal wordt toegekend hebben we een variabele nextId gedeclareerd\r\n// die telkens zal verhoogd worden bij aanmaak van een nieuw vak.\r\nclass Vak {\r\n\r\n    // Een object dat wordt aangemaakt vanuit een JSON object is \'klasseloos\'.\r\n    // We moeten daar dus zelf weer een Vak-object van maken.\r\n    static restoreFromJsonObject(vakkenlijst, jsonObject) {\r\n        // de id-teller op het maximaal \'tegengekomen\' id zetten zodat er geen id-clashes ontstaan bij toevoegen van nieuwe vakken.\r\n        nextId = Math.max(nextId, jsonObject._id + 1);\r\n\r\n        // En het \'vak\' object aanmaken op basis van de settings in het vak uit de JSON.\r\n        let vak = new Vak(vakkenlijst, jsonObject._id, jsonObject._naam, jsonObject._studiepunten, jsonObject._aantalUren);\r\n        return vak;\r\n    }\r\n\r\n    // Een vak krijgt een aantal argumenten mee bij constructie.\r\n    // Onder andere geeft het Vakkenlijst-object zichzelf ook door aan het vak.\r\n    // Zo kan het vak methods aanroepen op de Vakkenlijst bij bepaalde gebeurtenissen (zoals de save() methode).\r\n    constructor(vakkenlijst, id, naam, studiepunten, aantalUren) {\r\n        this._vakkenlijst = vakkenlijst;\r\n\r\n        if (id === null || id === undefined || id < 0) {\r\n            this._id = nextId++;\r\n        } else {\r\n            this._id = id;\r\n        }\r\n        this._naam = naam;\r\n        this._studiepunten = studiepunten;\r\n        this._aantalUren = aantalUren;\r\n    }\r\n\r\n    // Primaire (technische) sleutel van een vak.\r\n    // Blijft ongewijzigd, zelfs bij wijzigingen van de naam van het vak.\r\n    get id() {\r\n        return this._id;\r\n    }\r\n\r\n    get naam() {\r\n        return this._naam;\r\n    }\r\n\r\n    set naam(val) {\r\n        if (!val) {\r\n            throw "Een vaknaam moet minstens uit één teken bestaan";\r\n        }\r\n        this._naam = val;\r\n    }\r\n\r\n    get studiepunten() {\r\n        return this._studiepunten;\r\n    }\r\n\r\n    set studiepunten(val) {\r\n        if (isNaN(val) || val < 1) {\r\n            throw "Gelieve een getal groter dan 0 op te geven";\r\n        }\r\n        this._studiepunten = val;\r\n    }\r\n\r\n    // Het geschat aantal uren is een \'berekende\' property.\r\n    // Deze heeft dus geen \'setter\'.\r\n    get geschatAantalUren() {\r\n        return this._studiepunten * 30;\r\n    }\r\n\r\n    get aantalUren() {\r\n        return this._aantalUren;\r\n    }\r\n\r\n    set aantalUren(val) {\r\n        if (isNaN(val) || val < 0) {\r\n            throw "Gelieve een getal groter dan of gelijk aan 0 op te geven";\r\n        }\r\n        this._aantalUren = val;\r\n\r\n        // Na het aanpassen van de uren direct ook weer saven...\r\n        this._vakkenlijst.save();\r\n    }\r\n\r\n    // Een vak moet zichzelf als <tr> renderen in de <tbody> die de Vakkenlijst doorgeeft.\r\n    render(tbody) {\r\n        let tr =\r\n            `<tr id="vak-${this.id}">\r\n                <td><input name="naam" type="text" value="${this.naam}" class="form-control" /></td>\r\n                <td><input name="studiepunten" type="number" value="${this.studiepunten}" min="1" class="form-control" /></td>\r\n                <td><span>${this.geschatAantalUren}</span></td>\r\n                <td><input name="aantalUren" type="number" value="${this.aantalUren}" min="0" class="form-control" readonly /></td>\r\n                <td>\r\n                    <button class="btn btn-primary">+</button>\r\n                    <button class="btn btn-danger float-end">x</button>\r\n                </td>\r\n            </tr>`;\r\n\r\n        // innerHTML gebruiken is gevaarlijk: want de tweede keer dat je een rij toevoegt zal de HTML content vervangen worden waardoor\r\n        // alle event handlers weggegooid worden...\r\n        tbody.insertAdjacentHTML(\'beforeend\', tr);\r\n\r\n        let naamInput = document.querySelector(`#vak-${this.id} input[name=\'naam\']`);\r\n        naamInput.addEventListener("change", (evt) => {\r\n            try {\r\n                this._resetError(naamInput);\r\n\r\n                this.naam = evt.target.value;\r\n                this._vakkenlijst.save();\r\n            } catch (ex) {\r\n                this._setError(naamInput, ex);\r\n            }\r\n        });\r\n\r\n        let studiepuntenInput = document.querySelector(`#vak-${this.id} input[name=\'studiepunten\']`);\r\n        let geschatAantalUrenSpan = document.querySelector(`#vak-${this.id} span`);\r\n        studiepuntenInput.addEventListener("change", (evt) => {\r\n            try {\r\n                this._resetError(studiepuntenInput);\r\n\r\n                this.studiepunten = evt.target.value;\r\n                this._geefFeedbackBijOverschrijding();\r\n                geschatAantalUrenSpan.innerText = this.geschatAantalUren;\r\n                this._vakkenlijst.save();\r\n            } catch (ex) {\r\n                this._setError(studiepuntenInput, ex);\r\n            }\r\n        });\r\n\r\n\r\n        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name=\'aantalUren\']`);\r\n        aantalUrenInput.addEventListener("change", (evt) => {\r\n            try {\r\n                this._resetError(aantalUrenInput);\r\n\r\n                this.aantalUren = evt.target.value;\r\n                this._geefFeedbackBijOverschrijding();\r\n            } catch (ex) {\r\n                aantalUrenInput.value = this.aantalUren;\r\n                this._setError(aantalUrenInput, ex);\r\n            }            \r\n        });\r\n\r\n        let verhoogAantalUrenButton = document.querySelector(`#vak-${this.id} > td:last-child > button:first-child`);\r\n        verhoogAantalUrenButton.addEventListener("click", (evt) => {\r\n            this.aantalUren++;\r\n            aantalUrenInput.value = this.aantalUren;\r\n            this._geefFeedbackBijOverschrijding();\r\n        });\r\n\r\n        let deleteButton = document.querySelector(`#vak-${this.id} > td:last-child > button:last-child`);\r\n        deleteButton.addEventListener("click", (evt) => {\r\n            this._vakkenlijst.deleteVak(this.id);\r\n        });\r\n\r\n        // En ook al direct een eerste keer aanroepen (want het zou kunnen dat het aantal uren al groter is dan het geschat aantal uren).\r\n        this._geefFeedbackBijOverschrijding();\r\n    }\r\n\r\n    _geefFeedbackBijOverschrijding() {\r\n        let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name=\'aantalUren\']`);\r\n        if (this.aantalUren > this.geschatAantalUren) {\r\n            aantalUrenInput.style.backgroundColor = "orange";\r\n        } else {\r\n            aantalUrenInput.style.backgroundColor = "unset";\r\n        }\r\n    }\r\n\r\n    _resetError(input) {\r\n        input.setAttribute(\'title\', \'\');\r\n        input.style.backgroundColor = "unset";\r\n    }\r\n\r\n    _setError(input, message) {\r\n        input.setAttribute(\'title\', message);\r\n        input.style.backgroundColor = "red";\r\n    }\r\n}\n;// CONCATENATED MODULE: ./src/vakkenlijst.js\n\ufeff\r\n\r\nconst localStorageKey = "vakkenLijst";\r\n\r\nclass Vakkenlijst {\r\n    constructor() {\r\n        this._vakken = [];\r\n\r\n        // Ophalen van de lijst van vakken uit de local storage.\r\n        // Opgelet: dit kan null zijn indien de pagina een eerste keer getoond wordt.\r\n        let vakkenLijstFromStorage = localStorage.getItem(localStorageKey);\r\n        if (vakkenLijstFromStorage) {\r\n            // Indien niet null: de JSON string terug omzetten naar een array van vakken.\r\n            // Opgelet: dit zijn gewone JavaScript objecten die niet (meer) afstammen van de Vak class.\r\n            // Vandaar loopen we over alle vakken uit de JSON en maken we terug volwaarde Vak-objecten van.\r\n            let vakkenFromJson = JSON.parse(vakkenLijstFromStorage);\r\n            vakkenFromJson.forEach(vakFromJson => {\r\n                let vak = Vak.restoreFromJsonObject(this, vakFromJson);\r\n                this._vakken.push(vak);\r\n            });\r\n        }\r\n        else {\r\n            // Indien wel null: al direct vakken toevoegen :)\r\n            this._vakken.push(new Vak(this, -1, "Database systemen: basis", 4, 0));\r\n            this._vakken.push(new Vak(this, -1, "Database systemen: gevorderd", 4, 0));\r\n            this._vakken.push(new Vak(this, -1, "Object oriented analysis", 4, 0));\r\n            this._vakken.push(new Vak(this, -1, "Programmeren met C#: basis", 6, 0));\r\n            this._vakken.push(new Vak(this, -1, "Programmeren met C#: gevorderd", 6, 0));\r\n            this._vakken.push(new Vak(this, -1, "Front end: basis", 4, 0));\r\n            this._vakken.push(new Vak(this, -1, "Front end: gevorderd", 6, 0));\r\n            this._vakken.push(new Vak(this, -1, "Geïntegreerd project 1", 3, 0));\r\n            this._vakken.push(new Vak(this, -1, "Geïntegreerd project 2", 4, 0));\r\n            this.save();\r\n        }\r\n    }\r\n\r\n    addVak(naam, studiepunten) {\r\n        let vak = new Vak(this, -1, naam, studiepunten, 0);\r\n        let bestaandVak = this._vakken.filter(v => v.naam === naam);\r\n        if (bestaandVak.length > 0) throw `Er bestaat reeds een vak met de naam ${naam}`;\r\n        else {\r\n            this._vakken.push(vak);\r\n            this.save();\r\n            this._renderVakken();\r\n        }\r\n    }\r\n\r\n    deleteVak(id) {\r\n        let indexToDelete = -1;\r\n        for (let i = 0; i < this._vakken.length; i++) {\r\n            if (this._vakken[i].id === id) {\r\n                indexToDelete = i;\r\n                break;\r\n            }\r\n        }\r\n        if (indexToDelete >= 0) {\r\n            this._vakken.splice(indexToDelete, 1);\r\n            this.save();\r\n            this._renderVakken();\r\n        }\r\n    }\r\n\r\n    save() {\r\n        localStorage.setItem(\r\n            localStorageKey,\r\n            // Hier is een addertje: aangezien Vakkenlijst verwijst naar Vak, en Vak ook weer naar Vakkenlijst hebben we een \'circulaire\' situatie.\r\n            // Met deze constructie kunnen we aangeven dat de _vakkenlijst van Vak mag genegeerd worden.\r\n            JSON.stringify(this._vakken, (key, value) => {\r\n                if (key === "_vakkenlijst") return;\r\n                else return value;\r\n            }));\r\n    }\r\n\r\n    // Een vakkenlijst moet zichzelf als <table> renderen in het html element dat de caller doorgeeft.\r\n    render(element) {\r\n        let table =\r\n            `<table id="vakkenlijst" class="table">\r\n                <thead>\r\n                    <tr>\r\n                        <th>Vak</th>\r\n                        <th>Studiepunten</th>\r\n                        <th>Geschat aantal uren</th>\r\n                        <th>Aantal uren</th>\r\n                        <th></th> \x3c!-- Voor de action buttons --\x3e\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                </tbody>\r\n                <tfoot>\r\n                    <tr>\r\n                        <td><button id="voegVakToe" class="btn btn-secondary">Nieuw vak</button></td>\r\n                        <td></td>\r\n                        <td></td>\r\n                        <td><button id="corrigeerUren" class="btn btn-secondary">Correctie</button></td>\r\n                        <td></td>\r\n                    </tr>\r\n                </tfoot>\r\n            </table>`;\r\n\r\n        element.innerHTML = table;\r\n\r\n        document.getElementById("voegVakToe").addEventListener("click", (evt) => {\r\n            this.addVak("Vak", 1);\r\n        });\r\n\r\n        document.getElementById("corrigeerUren").addEventListener("click", (evt) => {\r\n            let buttons = document.querySelectorAll("#vakkenlijst input");\r\n            for (let i = 0; i < buttons.length; i++) {\r\n                buttons[i].removeAttribute("readonly");\r\n            }\r\n        });\r\n\r\n        this._renderVakken();\r\n    }\r\n\r\n    _renderVakken() {\r\n        let tbody = document.querySelector("#vakkenlijst tbody");\r\n        tbody.innerHTML = ""; // Indien render een zoveelste keer wordt aangeroepen: de rijen verwijderen en opnieuw aanmaken.\r\n        for (let i = 0; i < this._vakken.length; i++) {\r\n            // Elke rij mag zichzelf dan \'renderen\' in het HTML document.\r\n            this._vakken[i].render(tbody);\r\n        }\r\n    }\r\n}\n;// CONCATENATED MODULE: ./src/index.js\n\ufeff\r\n\r\n// Zoals je ziet is index.js vrij leeg: de functionaliteit werd verdeeld over twee classes:\r\n// (1) Vakkenlijst: dit stelt een tabel van vakken voor. In dit tabel kan je vakken toevoegen en weer verwijderen.\r\n// (2) Vak: dit stelt één vak voor, inclusief het aantal uren. De vakkenlijst zal objecten van deze klasse aanmaken.\r\nlet vakkenlijst = new Vakkenlijst();\r\n\r\n// De \'render\' methode van vakkenlijst is verantwoordelijk voor het renderen van een <table> in de section.\r\nvakkenlijst.render(document.querySelector("section"));\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkaWViZWxhc3Rpbmd0ZWxsZXIud2ViLy4vc3JjL3Zhay5qcz9mNmZkIiwid2VicGFjazovL3N0dWRpZWJlbGFzdGluZ3RlbGxlci53ZWIvLi9zcmMvdmFra2VubGlqc3QuanM/MWNhMiIsIndlYnBhY2s6Ly9zdHVkaWViZWxhc3Rpbmd0ZWxsZXIud2ViLy4vc3JjL2luZGV4LmpzP2I2MzUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsUUFBUTtBQUNuQyw0REFBNEQsVUFBVTtBQUN0RSxzRUFBc0Usa0JBQWtCO0FBQ3hGLDRCQUE0Qix1QkFBdUI7QUFDbkQsb0VBQW9FLGdCQUFnQjtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1REFBdUQsUUFBUTtBQUMvRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUzs7QUFFVCwrREFBK0QsUUFBUTtBQUN2RSxtRUFBbUUsUUFBUTtBQUMzRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7OztBQUdULDZEQUE2RCxRQUFRO0FBQ3JFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhO0FBQ0EsU0FBUzs7QUFFVCxxRUFBcUUsUUFBUTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQsMERBQTBELFFBQVE7QUFDbEU7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkRBQTZELFFBQVE7QUFDckU7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOztBQ2hMQSxDQUE2Qjs7QUFFN0I7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQix5QkFBeUI7QUFDbkQ7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLEdBQUc7QUFDckMsa0NBQWtDLEdBQUc7QUFDckMsa0NBQWtDLEdBQUc7QUFDckMsa0NBQWtDLEdBQUc7QUFDckMsa0NBQWtDLEdBQUc7QUFDckMsa0NBQWtDLEdBQUc7QUFDckMsa0NBQWtDLEdBQUc7QUFDckMsa0NBQWtDLEdBQUc7QUFDckMsa0NBQWtDLEdBQUc7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLEdBQUc7QUFDekI7QUFDQSxrRkFBa0YsS0FBSztBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSwyQkFBMkIsb0JBQW9CO0FBQy9DO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qix1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7QUMzSEEsQ0FBNkM7O0FBRTdDO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixXQUFXOztBQUVqQztBQUNBIiwiZmlsZSI6Ijg1Ni5qcyIsInNvdXJjZXNDb250ZW50IjpbIu+7v2xldCBuZXh0SWQgPSAwO1xyXG5cclxuLy8gT2JqZWN0ZW4gdmFuIGRlemUga2xhc3NlIHN0ZWxsZW4gZWVuIHZhayB2b29yLlxyXG4vLyBFbGsgdmFrIGhlZWZ0IGVlbiB1bmlla2UgSUQgKD0gZWVuIHRlY2huaXNjaGUgc2xldXRlbCkuXHJcbi8vIE9tIHpla2VyIHRlIHppam4gZGF0IGVlbiBzbGV1dGVsIHNsZWNodHMgw6nDqW5tYWFsIHdvcmR0IHRvZWdla2VuZCBoZWJiZW4gd2UgZWVuIHZhcmlhYmVsZSBuZXh0SWQgZ2VkZWNsYXJlZXJkXHJcbi8vIGRpZSB0ZWxrZW5zIHphbCB2ZXJob29nZCB3b3JkZW4gYmlqIGFhbm1hYWsgdmFuIGVlbiBuaWV1dyB2YWsuXHJcbmV4cG9ydCBjbGFzcyBWYWsge1xyXG5cclxuICAgIC8vIEVlbiBvYmplY3QgZGF0IHdvcmR0IGFhbmdlbWFha3QgdmFudWl0IGVlbiBKU09OIG9iamVjdCBpcyAna2xhc3NlbG9vcycuXHJcbiAgICAvLyBXZSBtb2V0ZW4gZGFhciBkdXMgemVsZiB3ZWVyIGVlbiBWYWstb2JqZWN0IHZhbiBtYWtlbi5cclxuICAgIHN0YXRpYyByZXN0b3JlRnJvbUpzb25PYmplY3QodmFra2VubGlqc3QsIGpzb25PYmplY3QpIHtcclxuICAgICAgICAvLyBkZSBpZC10ZWxsZXIgb3AgaGV0IG1heGltYWFsICd0ZWdlbmdla29tZW4nIGlkIHpldHRlbiB6b2RhdCBlciBnZWVuIGlkLWNsYXNoZXMgb250c3RhYW4gYmlqIHRvZXZvZWdlbiB2YW4gbmlldXdlIHZha2tlbi5cclxuICAgICAgICBuZXh0SWQgPSBNYXRoLm1heChuZXh0SWQsIGpzb25PYmplY3QuX2lkICsgMSk7XHJcblxyXG4gICAgICAgIC8vIEVuIGhldCAndmFrJyBvYmplY3QgYWFubWFrZW4gb3AgYmFzaXMgdmFuIGRlIHNldHRpbmdzIGluIGhldCB2YWsgdWl0IGRlIEpTT04uXHJcbiAgICAgICAgbGV0IHZhayA9IG5ldyBWYWsodmFra2VubGlqc3QsIGpzb25PYmplY3QuX2lkLCBqc29uT2JqZWN0Ll9uYWFtLCBqc29uT2JqZWN0Ll9zdHVkaWVwdW50ZW4sIGpzb25PYmplY3QuX2FhbnRhbFVyZW4pO1xyXG4gICAgICAgIHJldHVybiB2YWs7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRWVuIHZhayBrcmlqZ3QgZWVuIGFhbnRhbCBhcmd1bWVudGVuIG1lZSBiaWogY29uc3RydWN0aWUuXHJcbiAgICAvLyBPbmRlciBhbmRlcmUgZ2VlZnQgaGV0IFZha2tlbmxpanN0LW9iamVjdCB6aWNoemVsZiBvb2sgZG9vciBhYW4gaGV0IHZhay5cclxuICAgIC8vIFpvIGthbiBoZXQgdmFrIG1ldGhvZHMgYWFucm9lcGVuIG9wIGRlIFZha2tlbmxpanN0IGJpaiBiZXBhYWxkZSBnZWJldXJ0ZW5pc3NlbiAoem9hbHMgZGUgc2F2ZSgpIG1ldGhvZGUpLlxyXG4gICAgY29uc3RydWN0b3IodmFra2VubGlqc3QsIGlkLCBuYWFtLCBzdHVkaWVwdW50ZW4sIGFhbnRhbFVyZW4pIHtcclxuICAgICAgICB0aGlzLl92YWtrZW5saWpzdCA9IHZha2tlbmxpanN0O1xyXG5cclxuICAgICAgICBpZiAoaWQgPT09IG51bGwgfHwgaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5faWQgPSBuZXh0SWQrKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9uYWFtID0gbmFhbTtcclxuICAgICAgICB0aGlzLl9zdHVkaWVwdW50ZW4gPSBzdHVkaWVwdW50ZW47XHJcbiAgICAgICAgdGhpcy5fYWFudGFsVXJlbiA9IGFhbnRhbFVyZW47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJpbWFpcmUgKHRlY2huaXNjaGUpIHNsZXV0ZWwgdmFuIGVlbiB2YWsuXHJcbiAgICAvLyBCbGlqZnQgb25nZXdpanppZ2QsIHplbGZzIGJpaiB3aWp6aWdpbmdlbiB2YW4gZGUgbmFhbSB2YW4gaGV0IHZhay5cclxuICAgIGdldCBpZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5hYW0oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hYW07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG5hYW0odmFsKSB7XHJcbiAgICAgICAgaWYgKCF2YWwpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJFZW4gdmFrbmFhbSBtb2V0IG1pbnN0ZW5zIHVpdCDDqcOpbiB0ZWtlbiBiZXN0YWFuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX25hYW0gPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN0dWRpZXB1bnRlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3R1ZGllcHVudGVuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzdHVkaWVwdW50ZW4odmFsKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkgfHwgdmFsIDwgMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkdlbGlldmUgZWVuIGdldGFsIGdyb3RlciBkYW4gMCBvcCB0ZSBnZXZlblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zdHVkaWVwdW50ZW4gPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGV0IGdlc2NoYXQgYWFudGFsIHVyZW4gaXMgZWVuICdiZXJla2VuZGUnIHByb3BlcnR5LlxyXG4gICAgLy8gRGV6ZSBoZWVmdCBkdXMgZ2VlbiAnc2V0dGVyJy5cclxuICAgIGdldCBnZXNjaGF0QWFudGFsVXJlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3R1ZGllcHVudGVuICogMzA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGFhbnRhbFVyZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FhbnRhbFVyZW47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGFhbnRhbFVyZW4odmFsKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkgfHwgdmFsIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkdlbGlldmUgZWVuIGdldGFsIGdyb3RlciBkYW4gb2YgZ2VsaWprIGFhbiAwIG9wIHRlIGdldmVuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2FhbnRhbFVyZW4gPSB2YWw7XHJcblxyXG4gICAgICAgIC8vIE5hIGhldCBhYW5wYXNzZW4gdmFuIGRlIHVyZW4gZGlyZWN0IG9vayB3ZWVyIHNhdmVuLi4uXHJcbiAgICAgICAgdGhpcy5fdmFra2VubGlqc3Quc2F2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEVlbiB2YWsgbW9ldCB6aWNoemVsZiBhbHMgPHRyPiByZW5kZXJlbiBpbiBkZSA8dGJvZHk+IGRpZSBkZSBWYWtrZW5saWpzdCBkb29yZ2VlZnQuXHJcbiAgICByZW5kZXIodGJvZHkpIHtcclxuICAgICAgICBsZXQgdHIgPVxyXG4gICAgICAgICAgICBgPHRyIGlkPVwidmFrLSR7dGhpcy5pZH1cIj5cclxuICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgbmFtZT1cIm5hYW1cIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJHt0aGlzLm5hYW19XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IG5hbWU9XCJzdHVkaWVwdW50ZW5cIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9XCIke3RoaXMuc3R1ZGllcHVudGVufVwiIG1pbj1cIjFcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZD48c3Bhbj4ke3RoaXMuZ2VzY2hhdEFhbnRhbFVyZW59PC9zcGFuPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IG5hbWU9XCJhYW50YWxVcmVuXCIgdHlwZT1cIm51bWJlclwiIHZhbHVlPVwiJHt0aGlzLmFhbnRhbFVyZW59XCIgbWluPVwiMFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcmVhZG9ubHkgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj4rPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGZsb2F0LWVuZFwiPng8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDwvdHI+YDtcclxuXHJcbiAgICAgICAgLy8gaW5uZXJIVE1MIGdlYnJ1aWtlbiBpcyBnZXZhYXJsaWprOiB3YW50IGRlIHR3ZWVkZSBrZWVyIGRhdCBqZSBlZW4gcmlqIHRvZXZvZWd0IHphbCBkZSBIVE1MIGNvbnRlbnQgdmVydmFuZ2VuIHdvcmRlbiB3YWFyZG9vclxyXG4gICAgICAgIC8vIGFsbGUgZXZlbnQgaGFuZGxlcnMgd2VnZ2Vnb29pZCB3b3JkZW4uLi5cclxuICAgICAgICB0Ym9keS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRyKTtcclxuXHJcbiAgICAgICAgbGV0IG5hYW1JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCN2YWstJHt0aGlzLmlkfSBpbnB1dFtuYW1lPSduYWFtJ11gKTtcclxuICAgICAgICBuYWFtSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldEVycm9yKG5hYW1JbnB1dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5uYWFtID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Zha2tlbmxpanN0LnNhdmUoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldEVycm9yKG5hYW1JbnB1dCwgZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBzdHVkaWVwdW50ZW5JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCN2YWstJHt0aGlzLmlkfSBpbnB1dFtuYW1lPSdzdHVkaWVwdW50ZW4nXWApO1xyXG4gICAgICAgIGxldCBnZXNjaGF0QWFudGFsVXJlblNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjdmFrLSR7dGhpcy5pZH0gc3BhbmApO1xyXG4gICAgICAgIHN0dWRpZXB1bnRlbklucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRFcnJvcihzdHVkaWVwdW50ZW5JbnB1dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHVkaWVwdW50ZW4gPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2VlZkZlZWRiYWNrQmlqT3ZlcnNjaHJpamRpbmcoKTtcclxuICAgICAgICAgICAgICAgIGdlc2NoYXRBYW50YWxVcmVuU3Bhbi5pbm5lclRleHQgPSB0aGlzLmdlc2NoYXRBYW50YWxVcmVuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFra2VubGlqc3Quc2F2ZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RXJyb3Ioc3R1ZGllcHVudGVuSW5wdXQsIGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IGFhbnRhbFVyZW5JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCN2YWstJHt0aGlzLmlkfSBpbnB1dFtuYW1lPSdhYW50YWxVcmVuJ11gKTtcclxuICAgICAgICBhYW50YWxVcmVuSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldEVycm9yKGFhbnRhbFVyZW5JbnB1dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hYW50YWxVcmVuID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dlZWZGZWVkYmFja0Jpak92ZXJzY2hyaWpkaW5nKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICBhYW50YWxVcmVuSW5wdXQudmFsdWUgPSB0aGlzLmFhbnRhbFVyZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRFcnJvcihhYW50YWxVcmVuSW5wdXQsIGV4KTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgdmVyaG9vZ0FhbnRhbFVyZW5CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjdmFrLSR7dGhpcy5pZH0gPiB0ZDpsYXN0LWNoaWxkID4gYnV0dG9uOmZpcnN0LWNoaWxkYCk7XHJcbiAgICAgICAgdmVyaG9vZ0FhbnRhbFVyZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hYW50YWxVcmVuKys7XHJcbiAgICAgICAgICAgIGFhbnRhbFVyZW5JbnB1dC52YWx1ZSA9IHRoaXMuYWFudGFsVXJlbjtcclxuICAgICAgICAgICAgdGhpcy5fZ2VlZkZlZWRiYWNrQmlqT3ZlcnNjaHJpamRpbmcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGRlbGV0ZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCN2YWstJHt0aGlzLmlkfSA+IHRkOmxhc3QtY2hpbGQgPiBidXR0b246bGFzdC1jaGlsZGApO1xyXG4gICAgICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl92YWtrZW5saWpzdC5kZWxldGVWYWsodGhpcy5pZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEVuIG9vayBhbCBkaXJlY3QgZWVuIGVlcnN0ZSBrZWVyIGFhbnJvZXBlbiAod2FudCBoZXQgem91IGt1bm5lbiBkYXQgaGV0IGFhbnRhbCB1cmVuIGFsIGdyb3RlciBpcyBkYW4gaGV0IGdlc2NoYXQgYWFudGFsIHVyZW4pLlxyXG4gICAgICAgIHRoaXMuX2dlZWZGZWVkYmFja0Jpak92ZXJzY2hyaWpkaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2dlZWZGZWVkYmFja0Jpak92ZXJzY2hyaWpkaW5nKCkge1xyXG4gICAgICAgIGxldCBhYW50YWxVcmVuSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjdmFrLSR7dGhpcy5pZH0gaW5wdXRbbmFtZT0nYWFudGFsVXJlbiddYCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYWFudGFsVXJlbiA+IHRoaXMuZ2VzY2hhdEFhbnRhbFVyZW4pIHtcclxuICAgICAgICAgICAgYWFudGFsVXJlbklucHV0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwib3JhbmdlXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWFudGFsVXJlbklucHV0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidW5zZXRcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3Jlc2V0RXJyb3IoaW5wdXQpIHtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJycpO1xyXG4gICAgICAgIGlucHV0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidW5zZXRcIjtcclxuICAgIH1cclxuXHJcbiAgICBfc2V0RXJyb3IoaW5wdXQsIG1lc3NhZ2UpIHtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgbWVzc2FnZSk7XHJcbiAgICAgICAgaW5wdXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCB7IFZhayB9IGZyb20gXCIuL3Zha1wiO1xyXG5cclxuY29uc3QgbG9jYWxTdG9yYWdlS2V5ID0gXCJ2YWtrZW5MaWpzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZha2tlbmxpanN0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX3Zha2tlbiA9IFtdO1xyXG5cclxuICAgICAgICAvLyBPcGhhbGVuIHZhbiBkZSBsaWpzdCB2YW4gdmFra2VuIHVpdCBkZSBsb2NhbCBzdG9yYWdlLlxyXG4gICAgICAgIC8vIE9wZ2VsZXQ6IGRpdCBrYW4gbnVsbCB6aWpuIGluZGllbiBkZSBwYWdpbmEgZWVuIGVlcnN0ZSBrZWVyIGdldG9vbmQgd29yZHQuXHJcbiAgICAgICAgbGV0IHZha2tlbkxpanN0RnJvbVN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2VLZXkpO1xyXG4gICAgICAgIGlmICh2YWtrZW5MaWpzdEZyb21TdG9yYWdlKSB7XHJcbiAgICAgICAgICAgIC8vIEluZGllbiBuaWV0IG51bGw6IGRlIEpTT04gc3RyaW5nIHRlcnVnIG9temV0dGVuIG5hYXIgZWVuIGFycmF5IHZhbiB2YWtrZW4uXHJcbiAgICAgICAgICAgIC8vIE9wZ2VsZXQ6IGRpdCB6aWpuIGdld29uZSBKYXZhU2NyaXB0IG9iamVjdGVuIGRpZSBuaWV0IChtZWVyKSBhZnN0YW1tZW4gdmFuIGRlIFZhayBjbGFzcy5cclxuICAgICAgICAgICAgLy8gVmFuZGFhciBsb29wZW4gd2Ugb3ZlciBhbGxlIHZha2tlbiB1aXQgZGUgSlNPTiBlbiBtYWtlbiB3ZSB0ZXJ1ZyB2b2x3YWFyZGUgVmFrLW9iamVjdGVuIHZhbi5cclxuICAgICAgICAgICAgbGV0IHZha2tlbkZyb21Kc29uID0gSlNPTi5wYXJzZSh2YWtrZW5MaWpzdEZyb21TdG9yYWdlKTtcclxuICAgICAgICAgICAgdmFra2VuRnJvbUpzb24uZm9yRWFjaCh2YWtGcm9tSnNvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFrID0gVmFrLnJlc3RvcmVGcm9tSnNvbk9iamVjdCh0aGlzLCB2YWtGcm9tSnNvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWtrZW4ucHVzaCh2YWspO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIEluZGllbiB3ZWwgbnVsbDogYWwgZGlyZWN0IHZha2tlbiB0b2V2b2VnZW4gOilcclxuICAgICAgICAgICAgdGhpcy5fdmFra2VuLnB1c2gobmV3IFZhayh0aGlzLCAtMSwgXCJEYXRhYmFzZSBzeXN0ZW1lbjogYmFzaXNcIiwgNCwgMCkpO1xyXG4gICAgICAgICAgICB0aGlzLl92YWtrZW4ucHVzaChuZXcgVmFrKHRoaXMsIC0xLCBcIkRhdGFiYXNlIHN5c3RlbWVuOiBnZXZvcmRlcmRcIiwgNCwgMCkpO1xyXG4gICAgICAgICAgICB0aGlzLl92YWtrZW4ucHVzaChuZXcgVmFrKHRoaXMsIC0xLCBcIk9iamVjdCBvcmllbnRlZCBhbmFseXNpc1wiLCA0LCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKG5ldyBWYWsodGhpcywgLTEsIFwiUHJvZ3JhbW1lcmVuIG1ldCBDIzogYmFzaXNcIiwgNiwgMCkpO1xyXG4gICAgICAgICAgICB0aGlzLl92YWtrZW4ucHVzaChuZXcgVmFrKHRoaXMsIC0xLCBcIlByb2dyYW1tZXJlbiBtZXQgQyM6IGdldm9yZGVyZFwiLCA2LCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKG5ldyBWYWsodGhpcywgLTEsIFwiRnJvbnQgZW5kOiBiYXNpc1wiLCA0LCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKG5ldyBWYWsodGhpcywgLTEsIFwiRnJvbnQgZW5kOiBnZXZvcmRlcmRcIiwgNiwgMCkpO1xyXG4gICAgICAgICAgICB0aGlzLl92YWtrZW4ucHVzaChuZXcgVmFrKHRoaXMsIC0xLCBcIkdlw69udGVncmVlcmQgcHJvamVjdCAxXCIsIDMsIDApKTtcclxuICAgICAgICAgICAgdGhpcy5fdmFra2VuLnB1c2gobmV3IFZhayh0aGlzLCAtMSwgXCJHZcOvbnRlZ3JlZXJkIHByb2plY3QgMlwiLCA0LCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGRWYWsobmFhbSwgc3R1ZGllcHVudGVuKSB7XHJcbiAgICAgICAgbGV0IHZhayA9IG5ldyBWYWsodGhpcywgLTEsIG5hYW0sIHN0dWRpZXB1bnRlbiwgMCk7XHJcbiAgICAgICAgbGV0IGJlc3RhYW5kVmFrID0gdGhpcy5fdmFra2VuLmZpbHRlcih2ID0+IHYubmFhbSA9PT0gbmFhbSk7XHJcbiAgICAgICAgaWYgKGJlc3RhYW5kVmFrLmxlbmd0aCA+IDApIHRocm93IGBFciBiZXN0YWF0IHJlZWRzIGVlbiB2YWsgbWV0IGRlIG5hYW0gJHtuYWFtfWA7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5wdXNoKHZhayk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJWYWtrZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlVmFrKGlkKSB7XHJcbiAgICAgICAgbGV0IGluZGV4VG9EZWxldGUgPSAtMTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Zha2tlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdmFra2VuW2ldLmlkID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXhUb0RlbGV0ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5kZXhUb0RlbGV0ZSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Zha2tlbi5zcGxpY2UoaW5kZXhUb0RlbGV0ZSwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJWYWtrZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZSgpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5LFxyXG4gICAgICAgICAgICAvLyBIaWVyIGlzIGVlbiBhZGRlcnRqZTogYWFuZ2V6aWVuIFZha2tlbmxpanN0IHZlcndpanN0IG5hYXIgVmFrLCBlbiBWYWsgb29rIHdlZXIgbmFhciBWYWtrZW5saWpzdCBoZWJiZW4gd2UgZWVuICdjaXJjdWxhaXJlJyBzaXR1YXRpZS5cclxuICAgICAgICAgICAgLy8gTWV0IGRlemUgY29uc3RydWN0aWUga3VubmVuIHdlIGFhbmdldmVuIGRhdCBkZSBfdmFra2VubGlqc3QgdmFuIFZhayBtYWcgZ2VuZWdlZXJkIHdvcmRlbi5cclxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5fdmFra2VuLCAoa2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gXCJfdmFra2VubGlqc3RcIikgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFZW4gdmFra2VubGlqc3QgbW9ldCB6aWNoemVsZiBhbHMgPHRhYmxlPiByZW5kZXJlbiBpbiBoZXQgaHRtbCBlbGVtZW50IGRhdCBkZSBjYWxsZXIgZG9vcmdlZWZ0LlxyXG4gICAgcmVuZGVyKGVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgdGFibGUgPVxyXG4gICAgICAgICAgICBgPHRhYmxlIGlkPVwidmFra2VubGlqc3RcIiBjbGFzcz1cInRhYmxlXCI+XHJcbiAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+VmFrPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlN0dWRpZXB1bnRlbjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5HZXNjaGF0IGFhbnRhbCB1cmVuPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFhbnRhbCB1cmVuPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+IDwhLS0gVm9vciBkZSBhY3Rpb24gYnV0dG9ucyAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8dGZvb3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cInZvZWdWYWtUb2VcIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCI+TmlldXcgdmFrPC9idXR0b24+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiBpZD1cImNvcnJpZ2VlclVyZW5cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCI+Q29ycmVjdGllPC9idXR0b24+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDwvdGZvb3Q+XHJcbiAgICAgICAgICAgIDwvdGFibGU+YDtcclxuXHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0YWJsZTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2b2VnVmFrVG9lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVmFrKFwiVmFrXCIsIDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvcnJpZ2VlclVyZW5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3Zha2tlbmxpanN0IGlucHV0XCIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnNbaV0ucmVtb3ZlQXR0cmlidXRlKFwicmVhZG9ubHlcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVmFra2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3JlbmRlclZha2tlbigpIHtcclxuICAgICAgICBsZXQgdGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Zha2tlbmxpanN0IHRib2R5XCIpO1xyXG4gICAgICAgIHRib2R5LmlubmVySFRNTCA9IFwiXCI7IC8vIEluZGllbiByZW5kZXIgZWVuIHpvdmVlbHN0ZSBrZWVyIHdvcmR0IGFhbmdlcm9lcGVuOiBkZSByaWplbiB2ZXJ3aWpkZXJlbiBlbiBvcG5pZXV3IGFhbm1ha2VuLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmFra2VuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIEVsa2UgcmlqIG1hZyB6aWNoemVsZiBkYW4gJ3JlbmRlcmVuJyBpbiBoZXQgSFRNTCBkb2N1bWVudC5cclxuICAgICAgICAgICAgdGhpcy5fdmFra2VuW2ldLnJlbmRlcih0Ym9keSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IHsgVmFra2VubGlqc3QgfSBmcm9tIFwiLi92YWtrZW5saWpzdFwiO1xyXG5cclxuLy8gWm9hbHMgamUgemlldCBpcyBpbmRleC5qcyB2cmlqIGxlZWc6IGRlIGZ1bmN0aW9uYWxpdGVpdCB3ZXJkIHZlcmRlZWxkIG92ZXIgdHdlZSBjbGFzc2VzOlxyXG4vLyAoMSkgVmFra2VubGlqc3Q6IGRpdCBzdGVsdCBlZW4gdGFiZWwgdmFuIHZha2tlbiB2b29yLiBJbiBkaXQgdGFiZWwga2FuIGplIHZha2tlbiB0b2V2b2VnZW4gZW4gd2VlciB2ZXJ3aWpkZXJlbi5cclxuLy8gKDIpIFZhazogZGl0IHN0ZWx0IMOpw6luIHZhayB2b29yLCBpbmNsdXNpZWYgaGV0IGFhbnRhbCB1cmVuLiBEZSB2YWtrZW5saWpzdCB6YWwgb2JqZWN0ZW4gdmFuIGRlemUga2xhc3NlIGFhbm1ha2VuLlxyXG5sZXQgdmFra2VubGlqc3QgPSBuZXcgVmFra2VubGlqc3QoKTtcclxuXHJcbi8vIERlICdyZW5kZXInIG1ldGhvZGUgdmFuIHZha2tlbmxpanN0IGlzIHZlcmFudHdvb3JkZWxpamsgdm9vciBoZXQgcmVuZGVyZW4gdmFuIGVlbiA8dGFibGU+IGluIGRlIHNlY3Rpb24uXHJcbnZha2tlbmxpanN0LnJlbmRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic2VjdGlvblwiKSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///856\n')}},__webpack_exports__={};__webpack_modules__[856]()})();