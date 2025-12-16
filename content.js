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
    title.innerText = "HyperSpec - GMOverlay";
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
    icon.alt = "HyperSpec Logo";
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
    addDiscountsFields(background);
    addUpdatedRadio(background);
    addSkipRadio(background);
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
    const days = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
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

    days.forEach((day, index) => {
        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gridTemplateColumns = "20px 20px 90px 90px 90px 50px";
        row.style.alignItems = "center";
        row.style.marginBottom = "8px";
        row.style.gap = "10px";

        const dayLabel = document.createElement("span");
        dayLabel.innerText = day;
        dayLabel.style.fontSize = "14px";

        const closedCheckbox = document.createElement("input");
        closedCheckbox.type = "checkbox";
        closedCheckbox.id = `hours-${day}-closed`;
        closedCheckbox.style.width = "18px";
        closedCheckbox.style.height = "18px";
        closedCheckbox.style.cursor = "pointer";
        closedCheckbox.style.margin = "0";

        const closedLabel = document.createElement("label");
        closedLabel.innerText = "Zamknięte";
        closedLabel.htmlFor = `hours-${day}-closed`;
        closedLabel.style.fontSize = "12px";
        closedLabel.style.cursor = "pointer";
        closedLabel.style.margin = "0";

        const inputFrom = document.createElement("input");
        inputFrom.type = "time";
        inputFrom.id = `hours-${day}-from`;
        inputFrom.style.padding = "6px";
        inputFrom.style.width = "100%";
        inputFrom.style.boxSizing = "border-box";
        inputFrom.setAttribute("lang", "pl");

        const inputTo = document.createElement("input");
        inputTo.type = "time";
        inputTo.id = `hours-${day}-to`;
        inputTo.style.padding = "6px";
        inputTo.style.width = "100%";
        inputTo.style.boxSizing = "border-box";
        inputTo.setAttribute("lang", "pl");

        closedCheckbox.addEventListener("change", () => {
            if (closedCheckbox.checked) {
                inputFrom.value = "";
                inputTo.value = "";
                inputFrom.disabled = true;
                inputTo.disabled = true;
                inputFrom.style.backgroundColor = "#e0e0e0";
                inputTo.style.backgroundColor = "#e0e0e0";
            } else {
                inputFrom.disabled = false;
                inputTo.disabled = false;
                inputFrom.style.backgroundColor = "";
                inputTo.style.backgroundColor = "";
            }
        });

        row.appendChild(dayLabel);
        row.appendChild(closedCheckbox);
        row.appendChild(closedLabel);
        row.appendChild(inputFrom);
        row.appendChild(inputTo);

        if (index < days.length - 1) {
            const fillButton = document.createElement("button");
            fillButton.innerText = "↓";
            fillButton.style.padding = "6px 12px";
            fillButton.style.fontSize = "16px";
            fillButton.style.fontWeight = "bold";
            fillButton.style.cursor = "pointer";
            fillButton.style.backgroundColor = "#4CAF50";
            fillButton.style.color = "white";
            fillButton.style.border = "none";
            fillButton.style.borderRadius = "4px";
            fillButton.style.width = "100%";
            fillButton.style.boxSizing = "border-box";
            fillButton.title = "Wypełnij poniższe dni tymi samymi godzinami";

            fillButton.addEventListener("click", (e) => {
                e.preventDefault();
                const fromValue = inputFrom.value;
                const toValue = inputTo.value;
                const isClosed = closedCheckbox.checked;

                for (let i = index + 1; i < days.length; i++) {
                    const nextDayFrom = document.getElementById(`hours-${days[i]}-from`);
                    const nextDayTo = document.getElementById(`hours-${days[i]}-to`);
                    const nextDayClosed = document.getElementById(`hours-${days[i]}-closed`);

                    if (isClosed) {
                        nextDayClosed.checked = true;
                        nextDayClosed.dispatchEvent(new Event('change'));
                    } else {
                        nextDayClosed.checked = false;
                        nextDayClosed.dispatchEvent(new Event('change'));
                        nextDayFrom.value = fromValue;
                        nextDayTo.value = toValue;
                    }
                }
            });

            row.appendChild(fillButton);
        } else {
            const emptySpace = document.createElement("div");
            row.appendChild(emptySpace);
        }

        hoursContainer.appendChild(row);
    });

    background.appendChild(hoursContainer);
}

function addDiscountsFields(background) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";

    const label = document.createElement("label");
    label.innerText = "Zniżki";
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

    const discountModeContainer = document.createElement("div");
    discountModeContainer.style.marginBottom = "10px";

    const discountModeLabel = document.createElement("label");
    discountModeLabel.innerText = "Typ zniżki";
    discountModeLabel.style.display = "block";
    discountModeLabel.style.marginBottom = "5px";
    discountModeLabel.style.fontSize = "13px";
    discountModeLabel.style.fontWeight = "bold";

    const discountModeSelect = document.createElement("select");
    discountModeSelect.className = "discount-mode";
    Object.assign(discountModeSelect.style, {
        width: "100%",
        padding: "8px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxSizing: "border-box"
    });

    const modeOptions = [
        { value: "single", text: "Wartość" },
        { value: "range", text: "Zakres" },
        { value: "dynamic", text: "Dynamiczne zniżki" },
        { value: "unspecified", text: "Nieokreślony" }
    ];

    modeOptions.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.innerText = opt.text;
        discountModeSelect.appendChild(option);
    });

    discountModeContainer.appendChild(discountModeLabel);
    discountModeContainer.appendChild(discountModeSelect);

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

    const rangeContainer = document.createElement("div");
    rangeContainer.style.marginBottom = "10px";
    rangeContainer.style.display = "none";

    const rangeLabel = document.createElement("label");
    rangeLabel.innerText = "Zakres wartości";
    rangeLabel.style.display = "block";
    rangeLabel.style.marginBottom = "5px";
    rangeLabel.style.fontSize = "13px";
    rangeLabel.style.fontWeight = "bold";

    const rangeInputsDiv = document.createElement("div");
    rangeInputsDiv.style.display = "grid";
    rangeInputsDiv.style.gridTemplateColumns = "1fr 1fr";
    rangeInputsDiv.style.gap = "10px";

    const valueFromInput = document.createElement("input");
    valueFromInput.type = "number";
    valueFromInput.step = "0.01";
    valueFromInput.className = "discount-value-from";
    valueFromInput.placeholder = "Od";
    Object.assign(valueFromInput.style, {
        width: "100%",
        padding: "8px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxSizing: "border-box"
    });

    const valueToInput = document.createElement("input");
    valueToInput.type = "number";
    valueToInput.step = "0.01";
    valueToInput.className = "discount-value-to";
    valueToInput.placeholder = "Do";
    Object.assign(valueToInput.style, {
        width: "100%",
        padding: "8px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxSizing: "border-box"
    });

    rangeInputsDiv.appendChild(valueFromInput);
    rangeInputsDiv.appendChild(valueToInput);
    rangeContainer.appendChild(rangeLabel);
    rangeContainer.appendChild(rangeInputsDiv);

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

    typeSelect.appendChild(priceOption);
    typeSelect.appendChild(percentOption);

    typeContainer.appendChild(typeLabel);
    typeContainer.appendChild(typeSelect);

    const studentContainer = document.createElement("div");
    studentContainer.style.marginBottom = "10px";
    studentContainer.style.display = "flex";
    studentContainer.style.alignItems = "center";
    studentContainer.style.gap = "10px";

    const studentBool = document.createElement("input");
    studentBool.type = "checkbox";
    studentBool.checked = false;
    studentBool.className = "discount-student";
    studentBool.style.width = "18px";
    studentBool.style.height = "18px";
    studentBool.style.cursor = "pointer";

    const studentLabel = document.createElement("label");
    studentLabel.innerText = "Tylko dla studentów?";
    studentLabel.style.fontSize = "13px";
    studentLabel.style.fontWeight = "bold";
    studentLabel.style.cursor = "pointer";

    studentContainer.appendChild(studentBool);
    studentContainer.appendChild(studentLabel);

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

    function updateVisibility() {
        const mode = discountModeSelect.value;
        valueContainer.style.display = "none";
        rangeContainer.style.display = "none";
        typeContainer.style.display = "none";
        conditionsContainer.style.display = "block";

        switch (mode) {
            case "single":
                valueContainer.style.display = "block";
                typeContainer.style.display = "block";
                break;
            case "range":
                rangeContainer.style.display = "block";
                typeContainer.style.display = "block";
                break;
            case "dynamic":
                break;
            case "unspecified":
                break;
        }
    }

    discountModeSelect.addEventListener("change", updateVisibility);

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

    row.appendChild(discountModeContainer);
    row.appendChild(valueContainer);
    row.appendChild(rangeContainer);
    row.appendChild(typeContainer);
    row.appendChild(studentContainer);
    row.appendChild(conditionsContainer);
    row.appendChild(removeBtn);

    wrapper.appendChild(row);

    updateVisibility();
}


function addUpdatedRadio(background) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = "input-verified";
    radio.name = "status"
    radio.style.width = "20px";
    radio.style.height = "20px";
    radio.style.cursor = "pointer";

    const label = document.createElement("label");
    label.innerText = "Potwierdzenie telefoniczne lub internetowe";
    label.htmlFor = "input-verified";
    label.style.fontSize = "14px";
    label.style.fontWeight = "bold";
    label.style.color = "#333";
    label.style.cursor = "pointer";

    container.appendChild(radio);
    container.appendChild(label);
    background.appendChild(container);
}

function addSkipRadio(background) {
    const container = document.createElement("div");
    container.style.marginBottom = "20px";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = "input-skip";
    radio.name = "status"
    radio.style.width = "20px";
    radio.style.height = "20px";
    radio.style.cursor = "pointer";

    const label = document.createElement("label");
    label.innerText = "Brak zniżek, informacji na temat obiektu lub obiekt jest nieczynny\\nie istnieje";
    label.htmlFor = "input-skip";
    label.style.fontSize = "14px";
    label.style.fontWeight = "bold";
    label.style.color = "#333";
    label.style.cursor = "pointer";

    container.appendChild(radio);
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
    const openingHours = collectOpeningHoursData();

    return {
        nazwa: document.getElementById("input-name").value,
        adres: document.getElementById("input-address").value,
        telefon: document.getElementById("input-phone").value,
        strona: document.getElementById("input-website").value,
        kategoria: document.getElementById("input-category").value,
        lat: document.getElementById("input-lat").value,
        lon: document.getElementById("input-lon").value,
        znizki: JSON.stringify(discounts),
        godziny_otwarcia: JSON.stringify(openingHours),
        zaktualizowano: document.getElementById("input-verified").checked,
        pomiń: document.getElementById("input-skip").checked
    };
}

function collectDiscountsData() {
    const wrapper = document.getElementById("discounts-wrapper");
    const rows = wrapper.querySelectorAll(".discount-row");
    const discounts = [];

    rows.forEach(row => {
        const mode = row.querySelector(".discount-mode").value;
        const type = row.querySelector(".discount-type")?.value;
        const student = row.querySelector(".discount-student").checked;
        const conditions = row.querySelector(".discount-conditions")?.value;

        let discount = {
            mode: mode,
            student: student
        };

        switch (mode) {
            case "single":
                const value = parseFloat(row.querySelector(".discount-value").value);
                if (!isNaN(value) && value > 0 && conditions && conditions.trim()) {
                    discount.value = value;
                    discount.type = type;
                    discount.conditions = conditions.trim();
                    discounts.push(discount);
                }
                break;

            case "range":
                const valueFrom = parseFloat(row.querySelector(".discount-value-from").value);
                const valueTo = parseFloat(row.querySelector(".discount-value-to").value);
                if (!isNaN(valueFrom) && !isNaN(valueTo) && valueFrom > 0 && valueTo > 0 && conditions && conditions.trim()) {
                    discount.valueFrom = valueFrom;
                    discount.valueTo = valueTo;
                    discount.type = type;
                    discount.conditions = conditions.trim();
                    discounts.push(discount);
                }
                break;

            case "dynamic":
                if (conditions && conditions.trim()) {
                    discount.conditions = conditions.trim();
                    discounts.push(discount);
                }
                break;

            case "unspecified":
                if (conditions && conditions.trim()) {
                    discount.conditions = conditions.trim();
                    discounts.push(discount);
                }
                break;
        }
    });

    return discounts;
}
function collectOpeningHoursData() {
    const days = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
    const openingHours = {};

    days.forEach(day => {
        const isClosed = document.getElementById(`hours-${day}-closed`)?.checked;

        if (isClosed) {
            openingHours[day] = {
                closed: true
            };
        } else {
            const from = document.getElementById(`hours-${day}-from`)?.value;
            const to = document.getElementById(`hours-${day}-to`)?.value;

            if (from && to) {
                openingHours[day] = {
                    closed: false,
                    from: from,
                    to: to
                };
            } else {
                openingHours[day] = null;
            }
        }
    });

    return openingHours;
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
