(()=>{var __webpack_modules__={138:()=>{eval('\ufeffconst localStorageKey = "vakkenEnAantalUren";\r\n\r\ndocument.getElementById("corrigeerUren").addEventListener("click", (evt) => {\r\n    let inputs = document.querySelectorAll("#vakkenlijst input");\r\n    for (let i = 0; i < inputs.length; i++) {\r\n        inputs[i].removeAttribute("readonly");\r\n    }\r\n});\r\n\r\nlet aantalUrenInputs = document.querySelectorAll("#vakkenlijst tbody input");\r\nfor (let i = 0; i < aantalUrenInputs.length; i++) {\r\n    aantalUrenInputs[i].addEventListener("change", (evt) => {\r\n        try {\r\n            resetError(aantalUrenInputs[i]);\r\n\r\n            let vakId = evt.target.parentNode.parentNode.getAttribute("id");\r\n            geefFeedbackBijOverschrijding(vakId);\r\n            save();\r\n        } catch (ex) {\r\n            setError(aantalUrenInputs[i], ex);\r\n        }\r\n    });\r\n}\r\n\r\nlet verhoogAantalUrenButtons = document.querySelectorAll("#vakkenlijst tbody button");\r\nfor (let i = 0; i < verhoogAantalUrenButtons.length; i++) {\r\n    verhoogAantalUrenButtons[i].addEventListener("click", (evt) => {\r\n        let vakId = evt.target.parentNode.parentNode.getAttribute("id");\r\n        let aantalUrenInput = document.querySelector(`#${vakId} input`);\r\n        aantalUrenInput.value = parseInt(aantalUrenInput.value) + 1;\r\n        geefFeedbackBijOverschrijding(vakId);\r\n        save();\r\n    });\r\n}\r\n\r\n\r\n// Ophalen van de lijst van vakken uit de local storage.\r\n// Opgelet: dit kan null zijn indien de pagina een eerste keer getoond wordt.\r\nlet vakkenEnAantalUrenAsString = localStorage.getItem(localStorageKey);\r\nif (vakkenEnAantalUrenAsString) {\r\n    let vakkenEnAantalUren = JSON.parse(vakkenEnAantalUrenAsString);\r\n    for (let i = 0; i < vakkenEnAantalUren.length; i++) {\r\n        let aantalUrenInput = document.querySelector(\'#\' + vakkenEnAantalUren[i].vakId + \' input\');\r\n        aantalUrenInput.value = vakkenEnAantalUren[i].aantalUren;\r\n    }\r\n}\r\n\r\nfunction save() {\r\n    let vakkenEnAantalUren = [];\r\n    let vakken = document.querySelectorAll("#vakkenlijst tbody tr");\r\n    for (let i = 0; i < vakken.length; i++) {\r\n        let vakId = vakken[i].getAttribute("id");\r\n        let aantalUren = document.querySelector(`#${vakId} input`).value;\r\n        vakkenEnAantalUren.push({\r\n            vakid: vakId,\r\n            aantalUren: aantalUren\r\n        });\r\n    }\r\n\r\n    localStorage.setItem(\r\n        localStorageKey,\r\n        JSON.stringify(vakkenEnAantalUren));\r\n}\r\n\r\nfunction geefFeedbackBijOverschrijding(vakId) {\r\n    // TODO\r\n    //    let aantalUrenInput = document.querySelector(`#vak-${this.id} input[name=\'aantalUren\']`);\r\n    //    if (this.aantalUren > this.geschatAantalUren) {\r\n    //        aantalUrenInput.style.backgroundColor = "orange";\r\n    //    } else {\r\n    //        aantalUrenInput.style.backgroundColor = "unset";\r\n    //    }\r\n}\r\n\r\nfunction resetError(input) {\r\n    input.setAttribute(\'title\', \'\');\r\n    input.style.backgroundColor = "unset";\r\n}\r\n\r\nfunction setError(input, message) {\r\n    input.setAttribute(\'title\', message);\r\n    input.style.backgroundColor = "red";\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkaWViZWxhc3Rpbmd0ZWxsZXIud2ViLy4vc3JjL2luZGV4LmpzP2I2MzUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxlQUFlLDZCQUE2QjtBQUM1QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxlQUFlLHFDQUFxQztBQUNwRDtBQUNBO0FBQ0EseURBQXlELE1BQU07QUFDL0Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLCtCQUErQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0Esb0RBQW9ELE1BQU07QUFDMUQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0QsUUFBUTtBQUN2RTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIxMzguanMiLCJzb3VyY2VzQ29udGVudCI6WyLvu79jb25zdCBsb2NhbFN0b3JhZ2VLZXkgPSBcInZha2tlbkVuQWFudGFsVXJlblwiO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb3JyaWdlZXJVcmVuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XHJcbiAgICBsZXQgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiN2YWtrZW5saWpzdCBpbnB1dFwiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaW5wdXRzW2ldLnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmxldCBhYW50YWxVcmVuSW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiN2YWtrZW5saWpzdCB0Ym9keSBpbnB1dFwiKTtcclxuZm9yIChsZXQgaSA9IDA7IGkgPCBhYW50YWxVcmVuSW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBhYW50YWxVcmVuSW5wdXRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJlc2V0RXJyb3IoYWFudGFsVXJlbklucHV0c1tpXSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFrSWQgPSBldnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcclxuICAgICAgICAgICAgZ2VlZkZlZWRiYWNrQmlqT3ZlcnNjaHJpamRpbmcodmFrSWQpO1xyXG4gICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgc2V0RXJyb3IoYWFudGFsVXJlbklucHV0c1tpXSwgZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5sZXQgdmVyaG9vZ0FhbnRhbFVyZW5CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiN2YWtrZW5saWpzdCB0Ym9keSBidXR0b25cIik7XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgdmVyaG9vZ0FhbnRhbFVyZW5CdXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2ZXJob29nQWFudGFsVXJlbkJ1dHRvbnNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcclxuICAgICAgICBsZXQgdmFrSWQgPSBldnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcclxuICAgICAgICBsZXQgYWFudGFsVXJlbklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7dmFrSWR9IGlucHV0YCk7XHJcbiAgICAgICAgYWFudGFsVXJlbklucHV0LnZhbHVlID0gcGFyc2VJbnQoYWFudGFsVXJlbklucHV0LnZhbHVlKSArIDE7XHJcbiAgICAgICAgZ2VlZkZlZWRiYWNrQmlqT3ZlcnNjaHJpamRpbmcodmFrSWQpO1xyXG4gICAgICAgIHNhdmUoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuLy8gT3BoYWxlbiB2YW4gZGUgbGlqc3QgdmFuIHZha2tlbiB1aXQgZGUgbG9jYWwgc3RvcmFnZS5cclxuLy8gT3BnZWxldDogZGl0IGthbiBudWxsIHppam4gaW5kaWVuIGRlIHBhZ2luYSBlZW4gZWVyc3RlIGtlZXIgZ2V0b29uZCB3b3JkdC5cclxubGV0IHZha2tlbkVuQWFudGFsVXJlbkFzU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlS2V5KTtcclxuaWYgKHZha2tlbkVuQWFudGFsVXJlbkFzU3RyaW5nKSB7XHJcbiAgICBsZXQgdmFra2VuRW5BYW50YWxVcmVuID0gSlNPTi5wYXJzZSh2YWtrZW5FbkFhbnRhbFVyZW5Bc1N0cmluZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZha2tlbkVuQWFudGFsVXJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBhYW50YWxVcmVuSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHZha2tlbkVuQWFudGFsVXJlbltpXS52YWtJZCArICcgaW5wdXQnKTtcclxuICAgICAgICBhYW50YWxVcmVuSW5wdXQudmFsdWUgPSB2YWtrZW5FbkFhbnRhbFVyZW5baV0uYWFudGFsVXJlbjtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZSgpIHtcclxuICAgIGxldCB2YWtrZW5FbkFhbnRhbFVyZW4gPSBbXTtcclxuICAgIGxldCB2YWtrZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3Zha2tlbmxpanN0IHRib2R5IHRyXCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWtrZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgdmFrSWQgPSB2YWtrZW5baV0uZ2V0QXR0cmlidXRlKFwiaWRcIik7XHJcbiAgICAgICAgbGV0IGFhbnRhbFVyZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt2YWtJZH0gaW5wdXRgKS52YWx1ZTtcclxuICAgICAgICB2YWtrZW5FbkFhbnRhbFVyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIHZha2lkOiB2YWtJZCxcclxuICAgICAgICAgICAgYWFudGFsVXJlbjogYWFudGFsVXJlblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIGxvY2FsU3RvcmFnZUtleSxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeSh2YWtrZW5FbkFhbnRhbFVyZW4pKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VlZkZlZWRiYWNrQmlqT3ZlcnNjaHJpamRpbmcodmFrSWQpIHtcclxuICAgIC8vIFRPRE9cclxuICAgIC8vICAgIGxldCBhYW50YWxVcmVuSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjdmFrLSR7dGhpcy5pZH0gaW5wdXRbbmFtZT0nYWFudGFsVXJlbiddYCk7XHJcbiAgICAvLyAgICBpZiAodGhpcy5hYW50YWxVcmVuID4gdGhpcy5nZXNjaGF0QWFudGFsVXJlbikge1xyXG4gICAgLy8gICAgICAgIGFhbnRhbFVyZW5JbnB1dC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIm9yYW5nZVwiO1xyXG4gICAgLy8gICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICBhYW50YWxVcmVuSW5wdXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ1bnNldFwiO1xyXG4gICAgLy8gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldEVycm9yKGlucHV0KSB7XHJcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJycpO1xyXG4gICAgaW5wdXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ1bnNldFwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRFcnJvcihpbnB1dCwgbWVzc2FnZSkge1xyXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0aXRsZScsIG1lc3NhZ2UpO1xyXG4gICAgaW5wdXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///138\n')}},__webpack_exports__={};__webpack_modules__[138]()})();