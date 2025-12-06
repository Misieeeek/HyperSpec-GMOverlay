function loadOverlay() {
    addBackground();
    addIcon();
    addInputFields();
    addResetButton();
}

function addBackground() {
    const background = document.createElement("div");
    background.id = "overlay-background";
    background.style.position = "fixed";
    background.style.background = "white";
    background.style.top = "0";
    background.style.right = "0";
    background.style.width = "500px";
    background.style.height = "100vh";
    background.style.zIndex = "1000";
    background.style.borderLeft = "5px solid black";
    background.style.overflowY = "auto";
    background.style.padding = "20px";
    background.style.boxSizing = "border-box";

    const title = document.createElement("h1");
    title.innerText = "Hyperspec - GMOverlay";
    title.style.textAlign = "center";
    title.style.fontSize = "24px";
    title.style.margin = "0 0 30px 0";

    background.appendChild(title);
    document.body.appendChild(background);
}

function addIcon() {
    const background = document.getElementById("overlay-background");

    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("icon.png");
    icon.alt = "Hyperspec Logo";
    icon.style.position = "absolute";
    icon.style.top = "15px";
    icon.style.right = "20px";
    icon.style.width = "40px";
    icon.style.height = "40px";
    icon.style.cursor = "pointer";
    icon.style.transition = "transform 0.2s";

    icon.onmouseover = () => {
        icon.style.transform = "scale(1.1)";
    };

    icon.onmouseout = () => {
        icon.style.transform = "scale(1)";
    };

    background.appendChild(icon);
}

function addInputFields() {
    const background = document.getElementById("overlay-background");

    const counter = document.createElement("div");
    counter.id = "row-counter";
    counter.style.textAlign = "center";
    counter.style.fontSize = "16px";
    counter.style.fontWeight = "bold";
    counter.style.marginBottom = "20px";
    counter.style.color = "#4CAF50";
    counter.innerText = "Wiersz: 0 / 0";
    background.appendChild(counter);

    const fields = [
        { label: "Nazwa", id: "input-name", type: "text" },
        { label: "Adres", id: "input-address", type: "text" },
        { label: "Numer telefonu", id: "input-phone", type: "tel" },
        { label: "Strona", id: "input-website", type: "url" },
        { label: "Typ miejsca", id: "input-category", type: "text" },
        { label: "Współrzędne Lat", id: "input-lat", type: "text" },
        { label: "Współrzędne Lon", id: "input-lon", type: "text" }
    ];

    fields.forEach((field) => {
        const container = document.createElement("div");
        container.style.marginBottom = "20px";

        const label = document.createElement("label");
        label.innerText = field.label;
        label.htmlFor = field.id;

        Object.assign(label.style, {
            display: "block",
            marginBottom: "5px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333"
        });

        const input = document.createElement("input");
        input.id = field.id;
        input.type = field.type;
        Object.assign(input.style, {
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            border: "2px solid #ddd",
            borderRadius: "5px",
            outline: "none",
            transition: "border-color 0.3s",
            boxSizing: "border-box"
        });

        input.onfocus = () => input.style.borderColor = "#4CAF50";
        input.onblur = () => input.style.borderColor = "#ddd";

        container.appendChild(label);
        container.appendChild(input);
        background.appendChild(container);
    });

    addOpeningHours(background);

    addStudentDiscountsField(background);

    addUpdatedCheckbox(background);
    addSkipCheckbox(background);

    addButtonUpdateInfo();
}

function addOpeningHours(background) {
    const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

    const hoursContainer = document.createElement("div");
    hoursContainer.style.marginBottom = "20px";

    const hoursLabel = document.createElement("label");
    hoursLabel.innerText = "Godziny otwarcia/zamknięcia\n(AM -> przed południem, PM -> po południu)";
    hoursLabel.style.display = "block";
    hoursLabel.style.marginBottom = "10px";
    hoursLabel.style.fontWeight = "bold";
    hoursLabel.style.fontSize = "14px";
    hoursLabel.style.color = "#333";
    hoursLabel.style.whiteSpace = "pre-line";

    hoursContainer.appendChild(hoursLabel);

    days.forEach((day) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.marginBottom = "8px";
        row.style.gap = "10px";

        const dayLabel = document.createElement("span");
        dayLabel.innerText = day;
        dayLabel.style.width = "100px";
        dayLabel.style.fontSize = "14px";

        const inputFrom = document.createElement("input");
        inputFrom.type = "time";
        inputFrom.id = `hours-${day}-from`;
        inputFrom.style.flex = "1";
        inputFrom.style.padding = "6px";
        inputFrom.setAttribute("lang", "pl");

        const inputTo = document.createElement("input");
        inputTo.type = "time";
        inputTo.id = `hours-${day}-to`;
        inputTo.style.flex = "1";
        inputTo.style.padding = "6px";
        inputTo.setAttribute("lang", "pl");

        row.appendChild(dayLabel);
        row.appendChild(inputFrom);
        row.appendChild(inputTo);

        hoursContainer.appendChild(row);
    });

    background.appendChild(hoursContainer);
}

function addStudentDiscountsField(background) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";

    const label = document.createElement("label");
    label.innerText = "Zniżki studenckie";
    label.htmlFor = "input-student-discounts";
    Object.assign(label.style, {
        display: "block",
        marginBottom: "5px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333"
    });

    const textarea = document.createElement("textarea");
    textarea.id = "input-student-discounts";
    textarea.placeholder = "Opisz dostępne zniżki dla studentów...";
    Object.assign(textarea.style, {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        border: "2px solid #ddd",
        borderRadius: "5px",
        outline: "none",
        transition: "border-color 0.3s",
        minHeight: "80px",
        resize: "vertical",
        fontFamily: "inherit",
        boxSizing: "border-box"
    });

    textarea.onfocus = () => textarea.style.borderColor = "#4CAF50";
    textarea.onblur = () => textarea.style.borderColor = "#ddd";

    container.appendChild(label);
    container.appendChild(textarea);
    background.appendChild(container);
}

function addUpdatedCheckbox(background) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "input-verified";
    checkbox.style.width = "20px";
    checkbox.style.height = "20px";
    checkbox.style.cursor = "pointer";

    const label = document.createElement("label");
    label.innerText = "Potwierdzenie telefoniczne lub internetowe";
    label.htmlFor = "input-verified";
    label.style.fontSize = "14px";
    label.style.fontWeight = "bold";
    label.style.color = "#333";
    label.style.cursor = "pointer";

    container.appendChild(checkbox);
    container.appendChild(label);
    background.appendChild(container);
}

function addSkipCheckbox(background) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "input-skip";
    checkbox.style.width = "20px";
    checkbox.style.height = "20px";
    checkbox.style.cursor = "pointer";

    const label = document.createElement("label");
    label.innerText = "Brak zniżek, informacji na temat obiektu lub obiekt jest nieczynny\\nie istnieje";
    label.htmlFor = "input-skip";
    label.style.fontSize = "14px";
    label.style.fontWeight = "bold";
    label.style.color = "#333";
    label.style.cursor = "pointer";

    container.appendChild(checkbox);
    container.appendChild(label);
    background.appendChild(container);
}

function addButtonUpdateInfo() {
    const background = document.getElementById("overlay-background");

    const btn = document.createElement("button");
    btn.innerText = "Update info - Następna lokalizacja";
    btn.style.width = "100%";
    btn.style.padding = "15px 20px";
    btn.style.background = "green";
    btn.style.color = "white";
    btn.style.fontSize = "16px";
    btn.style.fontWeight = "bold";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.marginTop = "30px";
    btn.style.transition = "background 0.3s";

    btn.onmouseover = () => {
        btn.style.background = "#45a049";
    };

    btn.onmouseout = () => {
        btn.style.background = "green";
    };

    btn.onclick = () => {
        if (typeof csvNavigator !== 'undefined') {
            csvNavigator.goToNextLocation();
        } else {
            alert("Navigator nie jest załadowany!");
        }
    };

    background.appendChild(btn);

    const exportBtn = document.createElement("button");
    exportBtn.innerText = "Eksportuj zaktualizowany CSV";
    exportBtn.style.width = "100%";
    exportBtn.style.padding = "12px 20px";
    exportBtn.style.background = "#2196F3";
    exportBtn.style.color = "white";
    exportBtn.style.fontSize = "14px";
    exportBtn.style.fontWeight = "bold";
    exportBtn.style.borderRadius = "8px";
    exportBtn.style.border = "none";
    exportBtn.style.cursor = "pointer";
    exportBtn.style.marginTop = "10px";
    exportBtn.style.transition = "background 0.3s";

    exportBtn.onmouseover = () => {
        exportBtn.style.background = "#0b7dda";
    };

    exportBtn.onmouseout = () => {
        exportBtn.style.background = "#2196F3";
    };

    exportBtn.onclick = () => {
        if (typeof csvNavigator !== 'undefined') {
            csvNavigator.saveCurrentRowData();
            csvNavigator.exportToCSV();
            alert("CSV został pobrany!");
        } else {
            alert("Navigator nie jest załadowany!");
        }
    };

    background.appendChild(exportBtn);
}

function collectFormData() {
    return {
        nazwa: document.getElementById("input-name").value,
        adres: document.getElementById("input-address").value,
        telefon: document.getElementById("input-phone").value,
        strona: document.getElementById("input-website").value,
        kategoria: document.getElementById("input-category").value,
        lat: document.getElementById("input-lat").value,
        lon: document.getElementById("input-lon").value,
        znizki_studenckie: document.getElementById("input-student-discounts").value,
        zaktualizowano: document.getElementById("input-updated").checked
    };
}

function addResetButton() {
    const background = document.getElementById("overlay-background");

    const resetBtn = document.createElement("button");
    resetBtn.innerText = "⚠️ ZRESETUJ do pliku CSV";
    resetBtn.style.width = "100%";
    resetBtn.style.padding = "10px";
    resetBtn.style.marginTop = "20px";
    resetBtn.style.background = "#d9534f";
    resetBtn.style.color = "white";
    resetBtn.style.border = "none";
    resetBtn.style.borderRadius = "5px";
    resetBtn.style.cursor = "pointer";
    resetBtn.style.fontWeight = "bold";

    resetBtn.onclick = () => {
        csvNavigator.resetToOriginal();
    };

    background.appendChild(resetBtn);
}

window.addEventListener("load", () => {
    setTimeout(loadOverlay, 2000);
});
