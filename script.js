

const pump = document.getElementById("pump");
const balloonContainer = document.getElementById("balloon-container");
const wordDisplay = document.getElementById("word-display");

const balloonImages = [
    "assets/balloon1.png", "assets/balloon2.png", "assets/balloon3.png",
    "assets/balloon4.png", "assets/balloon5.png", "assets/balloon6.png",
    "assets/balloon7.png", "assets/balloon8.png", "assets/balloon9.png",
    "assets/balloon10.png"
];

const words = [
    "Apple", "Ball", "Cat", "Dog", "Elephant", "Fish", "Grapes", "Horse", "Igloo", "Jug",
    "Kite", "Lion", "Monkey", "Nest", "Orange", "Parrot", "Queen", "Rabbit", "Sun", "Tiger",
    "Umbrella", "Violin", "Watch", "Xylophone", "Yak", "Zebra"
];

let currentBalloon = null;
let currentLetterIndex = 0;
let balloonImageIndex = 0;
let isBalloonFlying = false;

function createBalloon() {
    if (currentLetterIndex >= 26 || isBalloonFlying) return;

    const balloon = document.createElement("div");
    balloon.classList.add("balloon");

    const img = document.createElement("img");
    img.src = balloonImages[balloonImageIndex];
    img.style.width = "60px";

    const letter = document.createElement("span");
    letter.textContent = String.fromCharCode(65 + currentLetterIndex);
    letter.classList.add("balloon-letter");
    letter.style.fontSize = "24px"; 

    balloon.appendChild(img);
    balloon.appendChild(letter);
    balloonContainer.appendChild(balloon);

    balloon.style.left = "45%";
    balloon.style.bottom = "20%";

    currentBalloon = balloon;
    balloonImageIndex = (balloonImageIndex + 1) % balloonImages.length;

    wordDisplay.textContent = `${letter.textContent} - ${words[currentLetterIndex]}`;
}

function inflateBalloon() {
    if (!currentBalloon) return;

    let img = currentBalloon.querySelector("img");
    let letter = currentBalloon.querySelector(".balloon-letter");
    let currentSize = parseInt(img.style.width) || 60;

    if (currentSize < 120) {
        currentSize += 10;
        img.style.width = currentSize + "px";
        letter.style.fontSize = (currentSize / 3.5) + "px";
    } else {
        isBalloonFlying = true;
        flyBalloon();
    }
}

function flyBalloon() {
    if (!currentBalloon) return;

    let balloon = currentBalloon;
    let xSpeed = (Math.random() - 0.5) * 0.5; // Slower horizontal movement
    let ySpeed = Math.random() * 0.5 + 0.2; // Slower upward movement
    let angle = 0;

    let balloonId = setInterval(() => {
        let rect = balloon.getBoundingClientRect();
        let gameContainerRect = document.getElementById("game-container").getBoundingClientRect();

        if (rect.top < gameContainerRect.top + 50) {
            clearInterval(balloonId);
            burstBalloon(balloon);
            return;
        }

        // Ensure balloon stays within the game boundaries
        let x = parseFloat(balloon.style.left) + xSpeed;
        let y = parseFloat(balloon.style.bottom) + ySpeed;

        if (x < 5) xSpeed = Math.abs(xSpeed);
        if (x > 90) xSpeed = -Math.abs(xSpeed);

        balloon.style.left = x + "%";
        balloon.style.bottom = y + "%";

    }, 50); // Slower animation loop

    currentBalloon = null;

    // Burst the balloon after **10 seconds** if not already burst
    setTimeout(() => {
        clearInterval(balloonId);
        burstBalloon(balloon);
    }, 10000); // Increased to 10 sec

    // Delay next balloon spawn
    setTimeout(() => {
        isBalloonFlying = false;
        currentLetterIndex++;
        if (currentLetterIndex < 26) {
            createBalloon();
        }
    }, 2000);
}

function burstBalloon(balloon) {
    if (!balloon) return;

    let img = balloon.querySelector("img");
    img.src = "assets/burst.png";
    balloon.classList.add("burst");

    // Remove the displayed word when the balloon bursts
    if (wordDisplay.textContent.includes(balloon.querySelector(".balloon-letter").textContent)) {
        wordDisplay.textContent = ""; 
    }

    setTimeout(() => {
        balloon.remove();
    }, 500);
}

pump.addEventListener("click", () => {
    pump.classList.add("pump-pressed");
    inflateBalloon();
    setTimeout(() => pump.classList.remove("pump-pressed"), 100);
});

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        pump.classList.add("pump-pressed");
        inflateBalloon();
        setTimeout(() => pump.classList.remove("pump-pressed"), 100);
    }
});

createBalloon();

