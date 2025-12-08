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
        { label: "Strona", id: "input-website", type: "url" }
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

    addCategorySelect(background);
    addCoordinatesFields(background);
    addOpeningHours(background);
    addStudentDiscountsFields(background);
    addUpdatedCheckbox(background);
    addSkipCheckbox(background);
    addButtonUpdateInfo();
}

function addCategorySelect(background) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";

    const label = document.createElement("label");
    label.innerText = "Typ miejsca";
    label.htmlFor = "input-category";
    Object.assign(label.style, {
        display: "block",
        marginBottom: "5px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333"
    });

    const select = document.createElement("select");
    select.id = "input-category";
    Object.assign(select.style, {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        border: "2px solid #ddd",
        borderRadius: "5px",
        outline: "none",
        transition: "border-color 0.3s",
        boxSizing: "border-box",
        cursor: "pointer"
    });

    const categories = [
        "Wybierz kategorię",
        "Restauracja",
        "Kawiarnia",
        "Bar",
        "Pub",
        "Klub nocny",
        "Fast food",
        "Kultura i Rozrywka",
        "Muzea i Galerie",
        "Edukacja i Biblioteki",
        "Sport i Rekreacja",
        "Klub nocny",
        "Inne"
    ];

    categories.forEach((category, index) => {
        const option = document.createElement("option");
        option.value = index === 0 ? "" : category;
        option.innerText = category;
        if (index === 0) {
            option.disabled = true;
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.onfocus = () => select.style.borderColor = "#4CAF50";
    select.onblur = () => select.style.borderColor = "#ddd";

    container.appendChild(label);
    container.appendChild(select);
    background.appendChild(container);
}

function addCoordinatesFields(background) {
    const coordFields = [
        { label: "Współrzędne Lat", id: "input-lat" },
        { label: "Współrzędne Lon", id: "input-lon" }
    ];

    coordFields.forEach((field) => {
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
        input.type = "text";
        input.readOnly = true;
        Object.assign(input.style, {
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            border: "2px solid #ddd",
            borderRadius: "5px",
            outline: "none",
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
            cursor: "not-allowed",
            color: "#666"
        });

        container.appendChild(label);
        container.appendChild(input);
        background.appendChild(container);
    });
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

function addStudentDiscountsFields(background) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";

    const label = document.createElement("label");
    label.innerText = "Zniżki studenckie";
    Object.assign(label.style, {
        display: "block",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333"
    });

    container.appendChild(label);

    const discountsWrapper = document.createElement("div");
    discountsWrapper.id = "discounts-wrapper";
    container.appendChild(discountsWrapper);

    addDiscountRow(discountsWrapper);

    const addBtn = document.createElement("button");
    addBtn.innerText = "+ Dodaj zniżkę";
    addBtn.type = "button";
    Object.assign(addBtn.style, {
        width: "100%",
        padding: "8px",
        marginTop: "10px",
        background: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold"
    });

    addBtn.onclick = () => addDiscountRow(discountsWrapper);

    container.appendChild(addBtn);
    background.appendChild(container);
}

function addDiscountRow(wrapper) {
    const row = document.createElement("div");
    row.className = "discount-row";
    row.style.marginBottom = "15px";
    row.style.padding = "15px";
    row.style.border = "2px solid #ddd";
    row.style.borderRadius = "5px";
    row.style.position = "relative";

    const valueContainer = document.createElement("div");
    valueContainer.style.marginBottom = "10px";

    const valueLabel = document.createElement("label");
    valueLabel.innerText = "Wartość";
    valueLabel.style.display = "block";
    valueLabel.style.marginBottom = "5px";
    valueLabel.style.fontSize = "13px";
    valueLabel.style.fontWeight = "bold";

    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.step = "0.01";
    valueInput.className = "discount-value";
    valueInput.placeholder = "np. 15";
    Object.assign(valueInput.style, {
        width: "100%",
        padding: "8px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxSizing: "border-box"
    });

    valueContainer.appendChild(valueLabel);
    valueContainer.appendChild(valueInput);

    const typeContainer = document.createElement("div");
    typeContainer.style.marginBottom = "10px";

    const typeLabel = document.createElement("label");
    typeLabel.innerText = "Typ";
    typeLabel.style.display = "block";
    typeLabel.style.marginBottom = "5px";
    typeLabel.style.fontSize = "13px";
    typeLabel.style.fontWeight = "bold";

    const typeSelect = document.createElement("select");
    typeSelect.className = "discount-type";
    Object.assign(typeSelect.style, {
        width: "100%",
        padding: "8px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxSizing: "border-box"
    });

    const percentOption = document.createElement("option");
    percentOption.value = "percent";
    percentOption.innerText = "Procent (%)";

    const priceOption = document.createElement("option");
    priceOption.value = "price";
    priceOption.innerText = "Cena (zł)";

    typeSelect.appendChild(percentOption);
    typeSelect.appendChild(priceOption);

    typeContainer.appendChild(typeLabel);
    typeContainer.appendChild(typeSelect);

    const conditionsContainer = document.createElement("div");
    conditionsContainer.style.marginBottom = "10px";

    const conditionsLabel = document.createElement("label");
    conditionsLabel.innerText = "Warunki";
    conditionsLabel.style.display = "block";
    conditionsLabel.style.marginBottom = "5px";
    conditionsLabel.style.fontSize = "13px";
    conditionsLabel.style.fontWeight = "bold";

    const conditionsInput = document.createElement("input");
    conditionsInput.type = "text";
    conditionsInput.className = "discount-conditions";
    conditionsInput.placeholder = "np. Tylko dla studentów AGH";
    Object.assign(conditionsInput.style, {
        width: "100%",
        padding: "8px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxSizing: "border-box"
    });

    conditionsContainer.appendChild(conditionsLabel);
    conditionsContainer.appendChild(conditionsInput);

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "✕";
    removeBtn.type = "button";
    Object.assign(removeBtn.style, {
        position: "absolute",
        top: "10px",
        right: "10px",
        width: "25px",
        height: "25px",
        background: "#d9534f",
        color: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "16px",
        lineHeight: "1",
        padding: "0"
    });

    removeBtn.onclick = () => {
        if (wrapper.children.length > 1) {
            row.remove();
        } else {
            alert("Musisz mieć przynajmniej jedną zniżkę!");
        }
    };

    row.appendChild(valueContainer);
    row.appendChild(typeContainer);
    row.appendChild(conditionsContainer);
    row.appendChild(removeBtn);

    wrapper.appendChild(row);
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
    const discounts = collectDiscountsData();

    return {
        nazwa: document.getElementById("input-name").value,
        adres: document.getElementById("input-address").value,
        telefon: document.getElementById("input-phone").value,
        strona: document.getElementById("input-website").value,
        kategoria: document.getElementById("input-category").value,
        lat: document.getElementById("input-lat").value,
        lon: document.getElementById("input-lon").value,
        znizki_studenckie: JSON.stringify(discounts),
        zaktualizowano: document.getElementById("input-verified").checked
    };
}

function collectDiscountsData() {
    const wrapper = document.getElementById("discounts-wrapper");
    const rows = wrapper.querySelectorAll(".discount-row");
    const discounts = [];

    rows.forEach(row => {
        const value = parseFloat(row.querySelector(".discount-value").value);
        const type = row.querySelector(".discount-type").value;
        const conditions = row.querySelector(".discount-conditions").value;

        if (!isNaN(value) && value > 0 && conditions.trim()) {
            discounts.push({
                value: value,
                type: type,
                conditions: conditions.trim()
            });
        }
    });

    return discounts;
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
