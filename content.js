function loadOverlay() {
    addBackground();
    // addInputField();
    addButtons();
}

function addBackground() {
    const background = document.createElement("div")
    background.style.position = "fixed";
    background.style.background = "white";
    background.style.top = "0";
    background.style.right = "0";          
    background.style.width = "500px";       
    background.style.height = "100vh";     
    background.style.background = "white";
    background.style.zIndex = "1000";    
    background.style.borderLeft = "5px solid black";

    const title = document.createElement("h1");
    title.style.position = "absolute";
    title.innerText = "Hyperspec - GMOverlay";
    title.textAlign = "center";
    title.style.fontSize = "24px";
    title.style.left = "25%";
    title.style.margin = "20px 0 20px 0";

    background.appendChild(title);
    document.body.appendChild(background);
}

function addInputField() {
    addInputName();
    addInputAddress();
    addInputWebsite();
    addInputCategory();
    addInputPhone();
    addInputOpeningHours();
}

function addInputName(){
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.top = "200px";
    input.style.right = "20px";
    input.style.zIndex = "1001";
    
    document.body.appendChild(input);
}

function addButtons() {
    addButtonUpdateInfo();
    // addButtonSendMail();
}

function addButtonUpdateInfo() {
    const btn = document.createElement("button");
    btn.innerText = "Update info";
    btn.style.position = "fixed";
    btn.style.top = "200px";
    btn.style.right = "20px";
    btn.style.zIndex = "1001";
    btn.style.padding = "10px 20px";
    btn.style.background = "green";
    btn.style.color = "white";
    btn.style.fontSize = "16px";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";

    btn.onclick = () => alert("Działa!");

    document.body.appendChild(btn);
}

window.addEventListener("load", () => {
    setTimeout(loadOverlay, 2000); 
});
