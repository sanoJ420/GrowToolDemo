const zelte = [
    { name: "60x60x160 cm", fläche: 0.36, volumen: 0.3456 },
    { name: "80x80x180 cm", fläche: 0.64, volumen: 0.9216 },
    { name: "100x100x200 cm", fläche: 1.0, volumen: 2.0 },
];

const lampen = [
    { name: "Sanlight EVO 3-60", watt: 190, ppfd: 500, geeignetFlaeche: 0.6, preis: 279 },
    { name: "Lumatek ATS 200W", watt: 200, ppfd: 550, geeignetFlaeche: 0.8, preis: 229 },
];

const luefter = [
    { name: "PrimaKlima 125mm", luftleistung: 280, preis: 69 },
    { name: "AC Infinity S4", luftleistung: 400, preis: 109 },
];

const ventilatoren = [
    { name: "GHP Clip-Ventilator", durchmesser: 15, preis: 19 },
    { name: "Secret Jardin Monkey Fan", durchmesser: 20, preis: 24 },
];

const modeRadios = document.getElementsByName("mode");

function populateSelect(id, items) {
    const select = document.getElementById(id);
    items.forEach(item => {
        const option = document.createElement("option");
        option.textContent = item.name;
        option.value = item.name;
        select.appendChild(option);
    });
}

function getSelected(list, id) {
    const selectedName = document.getElementById(id).value;
    return list.find(x => x.name === selectedName);
}

function getMode() {
    return [...modeRadios].find(r => r.checked).value;
}

document.addEventListener("DOMContentLoaded", () => {
    populateSelect("zelt", zelte);
    populateSelect("lampe", lampen);
    populateSelect("luefter", luefter);
    populateSelect("ventilator", ventilatoren);

    document.getElementById("calculateBtn").addEventListener("click", () => {
        const zelt = getSelected(zelte, "zelt");
        const lampe = getSelected(lampen, "lampe");
        const lueft = getSelected(luefter, "luefter");
        const venti = getSelected(ventilatoren, "ventilator");
        const mode = getMode();

        let warnung = "";
        if (lampe.geeignetFlaeche < zelt.fläche) {
            warnung += "⚠️ Lampe ist zu schwach für das gewählte Zelt.<br>";
        }
        if (lueft.luftleistung < zelt.volumen * 60) {
            warnung += "⚠️ Lüfter ist eventuell zu schwach für den Luftaustausch.<br>";
        }

        const gesamtPreis = lampe.preis + lueft.preis + venti.preis;

        let ergebnis = `💡 Gesamtkosten: ${gesamtPreis} €<br>`;
        ergebnis += `⚙️ Lampe: ${lampe.watt}W, Lüfter: ${lueft.luftleistung} m³/h<br>`;

        if (mode === "pro") {
            ergebnis += `🌱 PPFD: ${lampe.ppfd} µmol/m²/s<br>`;
            ergebnis += `💡 Geeignete Fläche der Lampe: ${lampe.geeignetFlaeche} m²<br>`;
        }

        ergebnis += `<br>${warnung}`;
        document.getElementById("result").innerHTML = ergebnis;
    });
});