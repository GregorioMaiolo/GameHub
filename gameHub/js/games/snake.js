
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("snakeScore");
const highscoreElement = document.getElementById("snakeHighscore");
const messageElement = document.getElementById("snakeMessage");
const restartButton = document.getElementById("snakeRestart");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let direction;
let nextDirection;
let score;
let highscore = Number(localStorage.getItem("snakeHighscore")) || 0;

let gameInterval = null;
let gameRunning = false;
let gameActive = false;

highscoreElement.textContent = highscore;

// Spiel initialisieren
function initSnake() {
    gameActive = true;
    resetSnake();
}

// Spiel zurücksetzen
function resetSnake() {
    clearInterval(gameInterval);

    gameRunning = false;

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;

    createFood();

    scoreElement.textContent = score;
    messageElement.textContent = "Press SPACE to start";

    drawSnake();
}

// Essen erstellen
function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    // Essen darf nicht auf der Schlange liegen
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        createFood();
    }
}

// Spiel starten
function startSnake() {
    if (!gameActive || gameRunning) {
        return;
    }

    gameRunning = true;
    messageElement.textContent = "";

    gameInterval = setInterval(moveSnake, 110);
}

// Schlange bewegen
function moveSnake() {
    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    const ateFood = head.x === food.x && head.y === food.y;

    // Kollision mit Wänden
    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {
        endSnake();
        return;
    }

    // Kollision mit dem eigenen Körper
    const body = ateFood ? snake : snake.slice(0, -1);

    if (body.some(part => part.x === head.x && part.y === head.y)) {
        endSnake();
        return;
    }

    snake.unshift(head);

    if (ateFood) {
        score += 10;
        scoreElement.textContent = score;

        if (score > highscore) {
            highscore = score;

            localStorage.setItem("snakeHighscore", highscore);
            highscoreElement.textContent = highscore;
        }

        createFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

// Spiel beenden
function endSnake() {
    clearInterval(gameInterval);

    gameRunning = false;

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

    if (event.key === " " && !gameRunning) {
        startSnake();
        return;
    }

    if (!gameRunning) {
        return;
    }
    
    if (!gameActive) {
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

restartButton.addEventListener("click", () => {
    if (!gameActive) return;

    resetSnake();
    startSnake();
});

// Spiel verlassen
function stopSnake() {
    clearInterval(gameInterval);
    gameRunning = false;
    gameActive = false;
}
