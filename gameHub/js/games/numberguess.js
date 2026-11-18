
let secretNumber;
let attempts = 0;

function initNumberGuess() {

    const game = document.getElementById("numberguessGame");

    game.classList.remove("hidden");

    const maxInput = document.getElementById("maxNumber");
    const startButton = document.getElementById("startGuessing");
    const guessArea = document.getElementById("guessArea");

    const guessInput = document.getElementById("guessInput");
    const guessButton = document.getElementById("guessButton");

    const message = document.getElementById("guessMessage");
    const attemptsDisplay = document.getElementById("guessAttempts");

    const restartButton = document.getElementById("guessRestart");

    function startGame() {

        const maxNumber = Number(maxInput.value);

        if (!Number.isInteger(maxNumber) || maxNumber < 2) {
            message.textContent = "Enter a valid maximum number!";
            return;
        }

        secretNumber = Math.floor(Math.random() * maxNumber) + 1;

        attempts = 0;

        attemptsDisplay.textContent = attempts;
        message.textContent = "Good luck!";

        guessInput.value = "";
        guessInput.min = 1;
        guessInput.max = maxNumber;

        guessArea.classList.remove("hidden");
        guessInput.focus();
    }

    function checkGuess() {

        const guess = Number(guessInput.value);
        const maxNumber = Number(maxInput.value);

        if (
            guessInput.value.trim() === "" ||
            !Number.isInteger(guess) ||
            guess < 1 ||
            guess > maxNumber
        ) {
            message.textContent = `Enter a number between 1 and ${maxNumber}!`;
            return;
        }

        attempts++;

        attemptsDisplay.textContent = attempts;

        if (guess === secretNumber) {

            message.textContent = `Correct! You needed ${attempts} attempts!`;

        } else if (guess < secretNumber) {

            message.textContent = "Too low! Try a higher number.";

        } else {

            message.textContent = "Too high! Try a lower number.";

        }

        guessInput.value = "";
        guessInput.focus();
    }

    startButton.onclick = startGame;
    restartButton.onclick = startGame;
    guessButton.onclick = checkGuess;

    guessInput.onkeydown = function(event) {
        if (event.key === "Enter") {
            checkGuess();
        }
    };

    startGame();
}
