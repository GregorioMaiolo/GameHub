
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("snakeScore");
const highscoreElement = document.getElementById("snakeHighscore");
const messageElement = document.getElementById("snakeMessage");
const livesElement = document.getElementById("snakeLives");
const restartButton = document.getElementById("snakeRestart");

const settingsElement = document.getElementById("snakeSettings");
const extraLivesToggle = document.getElementById("snakeExtraLives");
const obstaclesToggle = document.getElementById("snakeObstacles");
const startButton = document.getElementById("snakeStart");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let heart;
let blocks = [];

let extraLivesEnabled = false;
let obstaclesEnabled = false;

let direction;
let nextDirection;

let score;
let lives = 0;

let highscore = Number(localStorage.getItem("snakeHighscore")) || 0;

let gameInterval = null;
let gameRunning = false;
let gameActive = false;
let gamePaused = false;
let gameOver = false;

// Zufällige Anzahl Essen bis zum nächsten Herz
let foodsUntilHeart;

// Zufällige Anzahl Essen bis zum nächsten Block
let foodsUntilBlock;

highscoreElement.textContent = highscore;

// Spiel initialisieren
function initSnake() {
    gameActive = true;
    resetSnake();
}

// Zufällige Zahl zwischen min und max
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Freie Position auf dem Spielfeld finden
function getRandomPosition() {
    let position;

    do {
        position = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

    } while (
        snake.some(part => part.x === position.x && part.y === position.y) ||
        (food && food.x === position.x && food.y === position.y) ||
        (heart && heart.x === position.x && heart.y === position.y) ||
        blocks.some(block => block.x === position.x && block.y === position.y)
    );

    return position;
}

// Spiel zurücksetzen
function resetSnake() {
    clearInterval(gameInterval);

    gameRunning = false;
    gamePaused = false;
    gameOver = false;

    extraLivesToggle.disabled = false;
    obstaclesToggle.disabled = false;

    settingsElement.classList.remove("hidden");
    startButton.classList.remove("hidden");

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;
    lives = 0;

    heart = null;
    blocks = [];

    foodsUntilHeart = randomNumber(7, 10);
    foodsUntilBlock = randomNumber(5, 7);

    createFood();

    scoreElement.textContent = score;
    livesElement.textContent = lives;

    messageElement.textContent = "Choose your settings";
    drawSnake();
}

// Essen erstellen
function createFood() {
    food = getRandomPosition();
}

// Herz erstellen
function createHeart() {
    heart = getRandomPosition();
}

// Block erstellen
function createBlock() {
    blocks.push(getRandomPosition());
}

// Spiel starten
function startSnake() {
    if (!gameActive || gameRunning || gameOver) {
        return;
    }

    // Einstellungen übernehmen
    extraLivesEnabled = extraLivesToggle.checked;
    obstaclesEnabled = obstaclesToggle.checked;

    // Einstellungen während des Spiels sperren
    extraLivesToggle.disabled = true;
    obstaclesToggle.disabled = true;

    settingsElement.classList.add("hidden");

    gameRunning = true;
    gamePaused = false;

    messageElement.textContent = "";

    gameInterval = setInterval(moveSnake, 110);
}

// Spiel pausieren oder fortsetzen
function togglePause() {
    if (!gameActive || gameOver) {
        return;
    }

    if (gameRunning) {
        clearInterval(gameInterval);

        gameRunning = false;
        gamePaused = true;

        messageElement.textContent = "PAUSED - Press P to continue";

    } else if (gamePaused) {
        gamePaused = false;
        gameRunning = true;

        messageElement.textContent = "";

        gameInterval = setInterval(moveSnake, 110);
    }
}

// Schlange bewegen
function moveSnake() {
    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    const ateFood = head.x === food.x && head.y === food.y;

    const ateHeart = heart &&
        head.x === heart.x &&
        head.y === heart.y;

    // Kollision mit Wänden
    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {
        loseLife();
        return;
    }

    // Kollision mit Hindernissen
    if (blocks.some(block => block.x === head.x && block.y === head.y)) {
        loseLife();
        return;
    }

    // Kollision mit dem eigenen Körper
    const body = ateFood ? snake : snake.slice(0, -1);

    if (body.some(part => part.x === head.x && part.y === head.y)) {
        loseLife();
        return;
    }

    snake.unshift(head);

    // Normales Essen
    if (ateFood) {
        score += 10;

        scoreElement.textContent = score;

        if (score > highscore) {
            highscore = score;

            localStorage.setItem("snakeHighscore", highscore);

            highscoreElement.textContent = highscore;
        }

        createFood();

        // Herz-Zähler
        if (extraLivesEnabled && !heart) {
            foodsUntilHeart--;

            if (foodsUntilHeart <= 0) {
                createHeart();
            }
        }

        // Hindernis-Zähler
        if (obstaclesEnabled) {
            foodsUntilBlock--;

            if (foodsUntilBlock <= 0) {
                createBlock();

                foodsUntilBlock = randomNumber(5, 7);
            }
        }

    } else {
        snake.pop();
    }

    // Herz einsammeln
    if (ateHeart) {
        lives++;

        livesElement.textContent = lives;

        heart = null;

        foodsUntilHeart = randomNumber(7, 10);
    }

    drawSnake();
}

// Leben verlieren
function loseLife() {
    if (lives > 0) {
        lives--;

        livesElement.textContent = lives;

        // Schlange zurücksetzen
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];

        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };

        messageElement.textContent = "LIFE LOST!";

        drawSnake();

    } else {
        endSnake();
    }
}

// Spiel beenden
function endSnake() {
    clearInterval(gameInterval);

    gameRunning = false;
    gamePaused = false;
    gameOver = true;

    messageElement.textContent = "GAME OVER! Press Restart";
}

// Spielfeld zeichnen
function drawSnake() {
    ctx.fillStyle = "#10151b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Spielfeld-Raster
    ctx.strokeStyle = "#202a33";
    ctx.lineWidth = 0.5;

    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Essen zeichnen
    ctx.fillStyle = "#ef4444";

    ctx.fillRect(
        food.x * gridSize + 3,
        food.y * gridSize + 3,
        gridSize - 6,
        gridSize - 6
    );

    // Herz zeichnen
    if (heart) {
        ctx.fillStyle = "#ec4899";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            "♥",
            heart.x * gridSize + gridSize / 2,
            heart.y * gridSize + gridSize / 2
        );
    }

    // Hindernisse zeichnen
    blocks.forEach(block => {
        ctx.fillStyle = "#64748b";

        ctx.fillRect(
            block.x * gridSize + 1,
            block.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );

        ctx.strokeStyle = "#94a3b8";
        ctx.strokeRect(
            block.x * gridSize + 2,
            block.y * gridSize + 2,
            gridSize - 4,
            gridSize - 4
        );
    });

    // Schlange zeichnen
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#a78bfa" : "#8b5cf6";

        ctx.fillRect(
            part.x * gridSize + 1,
            part.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
}

// Tastatursteuerung
function handleSnakeKeys(event) {
    const keys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        " "
    ];

    if (keys.includes(event.key)) {
        event.preventDefault();
    }

    // Pause mit P
    if (event.key === "p" || event.key === "P") {
        togglePause();
        return;
    }

    // Spiel mit SPACE starten
    if (event.key === " " && !gameRunning && !gamePaused) {
        startSnake();
        return;
    }

    if (!gameRunning || !gameActive) {
        return;
    }

    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
            if (direction.y !== 1) {
                nextDirection = { x: 0, y: -1 };
            }
            break;

        case "ArrowDown":
        case "s":
        case "S":
            if (direction.y !== -1) {
                nextDirection = { x: 0, y: 1 };
            }
            break;

        case "ArrowLeft":
        case "a":
        case "A":
            if (direction.x !== 1) {
                nextDirection = { x: -1, y: 0 };
            }
            break;

        case "ArrowRight":
        case "d":
        case "D":
            if (direction.x !== -1) {
                nextDirection = { x: 1, y: 0 };
            }
            break;
    }
}

// Events
document.addEventListener("keydown", handleSnakeKeys);

startButton.addEventListener("click", startSnake);

restartButton.addEventListener("click", () => {
    if (!gameActive) return;

    resetSnake();
});

// Spiel verlassen
function stopSnake() {
    clearInterval(gameInterval);

    gameRunning = false;
    gamePaused = false;
    gameActive = false;
}
