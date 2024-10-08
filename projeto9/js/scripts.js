const data = [
    {
        min: 0,
        max: 18.4,
        classification: "Menor que 18,5",
        info: "Magreza",
        obesity: "0",
    },
    {
        min: 18.5,
        max: 24.9,
        classification: "Entre 18,5 e 24,9",
        info: "Normal",
        obesity: "0",
    },
    {
        min: 25,
        max: 29.9,
        classification: "Entre 25 e 29,9",
        info: "Sobrepeso",
        obesity: "I",
    },
    {
        min: 30,
        max: 39.9,
        classification: "Entre 30 e 39,9",
        info: "Obesidade",
        obesity: "II",
    },
    {
        min: 40,
        max: 99,
        classification: "Maior que 40",
        info: "Obesidade grave",
        obesity: "II",
    },
];

const imcTable = document.querySelector("#imc-table");
const heightInput = document.querySelector("#height");
const weightInput = document.querySelector("#weight");

const calcBtn = document.querySelector("#calc-btn");
const clearBtn = document.querySelector("#clear-btn");
const backBtn = document.querySelector("#back-btn");

const imcValue = document.querySelector("#imc-number span");
const imcInfo = document.querySelector("#imc-info span");

const calcContainer = document.querySelector("#calc-container");
const resultContainer = document.querySelector("#result-container");

function createTable(data) {
    data.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("table-data");

        const classification = document.createElement("p");
        classification.innerText = item.classification;

        const info = document.createElement("p");
        info.innerText = item.info;

        const obesity = document.createElement("p");
        obesity.innerText = item.obesity;

        div.appendChild(classification);
        div.appendChild(info);
        div.appendChild(obesity);

        imcTable.appendChild(div);
    });
}

function clearInputs() {
    heightInput.value = "";
    weightInput.value = "";
    imcValue.classList = "";
    imcInfo.classList = "";
}

function validateInput(input) {
    return input.replace(/[^0-9,]/g, "");
}

function caclutateImc(weight, height) {
    const imc = weight / (height * height);
    return imc.toFixed(2);
}

function showOrHideResults() {
    calcContainer.classList.toggle("hide");
    resultContainer.classList.toggle("hide");
}

createTable(data);

[heightInput, weightInput].forEach((input) => {
    input.addEventListener("input", (event) => {
        const validatedInput = validateInput(event.target.value);
        event.target.value = validatedInput;
    });
});

calcBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const height = +heightInput.value.replace(",", ".");
    const weight = +weightInput.value.replace(",", ".");
    if (!height || !weight) return; 

    const imc = caclutateImc(weight, height)

    let info;

    data.forEach((item) => {
        if (imc >= item.min && imc <= item.max)  {
            info = item.info;
        }
    });
    if (!info) return;

    imcValue.innerText = imc;
    imcInfo.innerText = info;

    switch (info) {
        case "Magreza":
            imcValue.classList.add("low");
            imcInfo.classList.add("low");
            break;
        case "Normal":
            imcValue.classList.add("good");
            imcInfo.classList.add("good");
            break;
        case "Sobrepeso":
            imcValue.classList.add("low");
            imcInfo.classList.add("low");
            break;
        case "Obesidade":
            imcValue.classList.add("medium");
            imcInfo.classList.add("medium");
            break;
        case "Obesidade grave":
            imcValue.classList.add("high");
            imcInfo.classList.add("high");
            break;
    }

    showOrHideResults();
});

clearBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearInputs();
});

backBtn.addEventListener("click", () => {
    clearInputs();
    showOrHideResults();
});