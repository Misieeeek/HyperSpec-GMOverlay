function loadOverlay() {
    addBackground();
    addIcon();
    addInputFields();
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
            transition: "border-color 0.3s"
        });

        input.onfocus = () => input.style.borderColor = "#4CAF50";
        input.onblur = () => input.style.borderColor = "#ddd";

        container.appendChild(label);
        container.appendChild(input);
        background.appendChild(container);
    });

    const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

    const hoursContainer = document.createElement("div");
    hoursContainer.style.marginBottom = "20px";

    const hoursLabel = document.createElement("label");
    hoursLabel.innerText = "Godziny otwarcia\\ zamknięcia\n (AM -> przed południem, PM -> po południu)";
    hoursLabel.style.display = "block";
    hoursLabel.style.marginBottom = "10px";
    hoursLabel.style.fontWeight = "bold";
    hoursLabel.style.fontSize = "14px";
    hoursLabel.style.color = "#333";

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

    addButtonUpdateInfo();
}


function addButtonUpdateInfo() {
    const background = document.getElementById("overlay-background");

    const btn = document.createElement("button");
    btn.innerText = "Update info";
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
        const data = {
            nazwa: document.getElementById("input-name").value,
            adres: document.getElementById("input-address").value,
            telefon: document.getElementById("input-phone").value,
            strona: document.getElementById("input-website").value,
            godziny: document.getElementById("input-hours").value,
            kategoria: document.getElementById("input-category").value,
            lat: document.getElementById("input-lat").value,
            lon: document.getElementById("input-lon").value
        };

        console.log("Dane do aktualizacji:", data);
    };

    background.appendChild(btn);
}

window.addEventListener("load", () => {
    setTimeout(loadOverlay, 2000);
});
