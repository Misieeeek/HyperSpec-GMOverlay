function loadOverlay() {
    addBackground();
    addIcon();
    addInputFields();
    addMailFields();
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
        { label: "Godziny otwarcia", id: "input-hours", type: "text" },
        { label: "Typ miejsca", id: "input-category", type: "text" },
        { label: "Współrzędne Lat", id: "input-lat", type: "text" },
        { label: "Współrzędne Lon", id: "input-lon", type: "text" }
    ];

    fields.forEach((field, index) => {
        const container = document.createElement("div");
        container.style.marginBottom = "20px";

        const label = document.createElement("label");
        label.innerText = field.label;
        label.htmlFor = field.id;
        label.style.display = "block";
        label.style.marginBottom = "5px";
        label.style.fontSize = "14px";
        label.style.fontWeight = "bold";
        label.style.color = "#333";

        const input = document.createElement("input");
        input.id = field.id;
        input.type = field.type;
        if (field.step) input.step = field.step;
        input.style.width = "100%";
        input.style.padding = "10px";
        input.style.fontSize = "14px";
        input.style.border = "2px solid #ddd";
        input.style.borderRadius = "5px";
        input.style.boxSizing = "border-box";
        input.style.outline = "none";
        input.style.transition = "border-color 0.3s";

        input.onfocus = () => {
            input.style.borderColor = "#4CAF50";
        };

        input.onblur = () => {
            input.style.borderColor = "#ddd";
        };

        container.appendChild(label);
        container.appendChild(input);
        background.appendChild(container);
    });

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

function addMailFields() {
    const background = document.getElementById("overlay-background");

    const separator = document.createElement("div");
    separator.style.borderTop = "2px solid #ddd";
    separator.style.marginTop = "40px";
    separator.style.marginBottom = "30px";
    background.appendChild(separator);

    const mailTitle = document.createElement("h2");
    mailTitle.innerText = "Wyślij maila";
    mailTitle.style.fontSize = "20px";
    mailTitle.style.marginBottom = "20px";
    mailTitle.style.color = "#333";
    background.appendChild(mailTitle);

    const emailContainer = document.createElement("div");
    emailContainer.style.marginBottom = "20px";

    const emailLabel = document.createElement("label");
    emailLabel.innerText = "Email odbiorcy";
    emailLabel.htmlFor = "input-email";
    emailLabel.style.display = "block";
    emailLabel.style.marginBottom = "5px";
    emailLabel.style.fontSize = "14px";
    emailLabel.style.fontWeight = "bold";
    emailLabel.style.color = "#333";

    const emailInput = document.createElement("input");
    emailInput.id = "input-email";
    emailInput.type = "email";
    emailInput.style.width = "100%";
    emailInput.style.padding = "10px";
    emailInput.style.fontSize = "14px";
    emailInput.style.border = "2px solid #ddd";
    emailInput.style.borderRadius = "5px";
    emailInput.style.boxSizing = "border-box";
    emailInput.style.outline = "none";
    emailInput.style.transition = "border-color 0.3s";

    emailInput.onfocus = () => {
        emailInput.style.borderColor = "#4CAF50";
    };

    emailInput.onblur = () => {
        emailInput.style.borderColor = "#ddd";
    };

    emailContainer.appendChild(emailLabel);
    emailContainer.appendChild(emailInput);
    background.appendChild(emailContainer);

    const contentContainer = document.createElement("div");
    contentContainer.style.marginBottom = "20px";

    const contentLabel = document.createElement("label");
    contentLabel.innerText = "Treść wiadomości";
    contentLabel.htmlFor = "input-mail";
    contentLabel.style.display = "block";
    contentLabel.style.marginBottom = "5px";
    contentLabel.style.fontSize = "14px";
    contentLabel.style.fontWeight = "bold";
    contentLabel.style.color = "#333";

    const contentTextarea = document.createElement("textarea");
    contentTextarea.id = "input-mail";
    contentTextarea.rows = 6;
    contentTextarea.style.width = "100%";
    contentTextarea.style.padding = "10px";
    contentTextarea.style.fontSize = "14px";
    contentTextarea.style.border = "2px solid #ddd";
    contentTextarea.style.borderRadius = "5px";
    contentTextarea.style.boxSizing = "border-box";
    contentTextarea.style.outline = "none";
    contentTextarea.style.transition = "border-color 0.3s";
    contentTextarea.style.resize = "vertical";
    contentTextarea.style.fontFamily = "inherit";

    contentTextarea.onfocus = () => {
        contentTextarea.style.borderColor = "#4CAF50";
    };

    contentTextarea.onblur = () => {
        contentTextarea.style.borderColor = "#ddd";
    };

    contentContainer.appendChild(contentLabel);
    contentContainer.appendChild(contentTextarea);
    background.appendChild(contentContainer);

    addButtonSendMail();
}

function addButtonSendMail() {
    const background = document.getElementById("overlay-background");

    const btn = document.createElement("button");
    btn.innerText = "Wyślij mail";
    btn.style.width = "100%";
    btn.style.padding = "15px 20px";
    btn.style.background = "#2196F3";
    btn.style.color = "white";
    btn.style.fontSize = "16px";
    btn.style.fontWeight = "bold";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.marginTop = "10px";
    btn.style.marginBottom = "20px";
    btn.style.transition = "background 0.3s";

    btn.onmouseover = () => {
        btn.style.background = "#1976D2";
    };

    btn.onmouseout = () => {
        btn.style.background = "#2196F3";
    };

    btn.onclick = () => {
        const mailContent = document.getElementById("input-mail").value;
        const mailTo = document.getElementById("input-email").value;
        if (!mailTo || !mailContent) {
            alert("Wypełnij wszystkie pola");
            return;
        }
        console.log("Mail content: ", mailContent);
        console.log("MailTo: ", mailTo);

    };

    background.appendChild(btn);
}

window.addEventListener("load", () => {
    setTimeout(loadOverlay, 2000);
});
