const buttons = document.querySelectorAll("#image-picker li");
const image = document.querySelector("#product-image");

buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        buttons.forEach((btn) => {
            btn.querySelector(".color").classList.remove("selected");
        });
        
        const selectedButton = event.target;
        const selectedButtonId = selectedButton.getAttribute("id");

        selectedButton.querySelector(".color").classList.add("selected");

        image.classList.add("changing");
        image.setAttribute("src", `img/iphone_${selectedButtonId}.jpg`);

        setTimeout(() => {
            image.classList.toggle("changing");
        }, 200);
    });
});
