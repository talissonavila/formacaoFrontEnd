const generatePasswordButton = document.querySelector("#generate-password");
const generatedPasswordElement = document.querySelector("#generated-password");
const toggleGenerateOptions = document.querySelector("#open-generate-password");
const generatePasswordContainer = document.querySelector("#generate-options");
const lenthInput = document.querySelector("#length");
const upperLettersInput = document.querySelector("#upperletters");
const lowerLettersInput = document.querySelector("#lowerletters");
const numbersInput = document.querySelector("#numbers");
const symbolsInput = document.querySelector("#symbols");
const copyPasswordButton = document.querySelector("#copy-password")


const getLetterLowerCase = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

const getLetterUpperCase = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

const getNumber = () => {
    return Math.floor(Math.random() * 10).toString();
}

const getSymbol = () => {
    const symbols = "!@#$%^&*()_+~|}{[]:";
    return symbols[Math.floor(Math.random() * symbols.length)];
}

const generatePassword = (getLetterLowerCase, getLetterUpperCase, getNumber, getSymbol) => {
    let password = "";

    const passwordLength = +lenthInput.value;

    const generators = [];

    if(lowerLettersInput.checked) {
        generators.push(getLetterLowerCase);
    }
    if(upperLettersInput.checked) {
        generators.push(getLetterUpperCase);
    }
    if(numbersInput.checked) {
        generators.push(getNumber);
    }
    if(symbolsInput.checked) {
        generators.push(getSymbol);
    }

    if (generators.length === 0) return;

    for (i = 0; i < passwordLength; i = i + generators.length) {
        generators.forEach(() => {
            const randomValue = generators[Math.floor(Math.random() * generators.length)]();

            password += randomValue;
        });
    }
    password = password.slice(0, passwordLength);
    generatedPasswordElement.style.display = "block";
    generatedPasswordElement.querySelector("h4").innerText = password;
}

generatePasswordButton.addEventListener("click", () => {
    generatePassword(
        getLetterLowerCase,
        getLetterUpperCase,
        getNumber,
        getSymbol
    );
});

toggleGenerateOptions.addEventListener("click", () => {
    generatePasswordContainer.classList.toggle("hide");
});

copyPasswordButton.addEventListener("click", (event) => {
    event.preventDefault();
    const password = generatedPasswordElement.querySelector("h4").innerText;
    navigator.clipboard.writeText(password).then(() => {
        copyPasswordButton.innerText = "Senha copiada";

        setTimeout(() => {
            copyPasswordButton.innerText = "Copiar";
        }, 1500);
    });
});
