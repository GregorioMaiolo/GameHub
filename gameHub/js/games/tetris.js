
let tetrisInterval = null;
let tetrisKeyHandler = null;

function stopTetris() {
    if (tetrisInterval) {
        clearInterval(tetrisInterval);
        tetrisInterval = null;
    }

    if (tetrisKeyHandler) {
        document.removeEventListener("keydown", tetrisKeyHandler);
        tetrisKeyHandler = null;
    }
}

function initTetris() {
    const container = document.getElementById("tetrisGame");

    if (!container) return;

    stopTetris();

    container.innerHTML = `
        <div class="tetris-container">
            <div class="tetris-header">
                <h2>Tetris</h2>
                <button id="tetrisRestart">Neues Spiel</button>
            </div>

            <div class="tetris-layout">
                <canvas id="tetrisCanvas" width="300" height="600"></canvas>

                <div class="tetris-sidebar">
                    <div class="tetris-stat">
                        <p>SCORE</p>
                        <h2 id="tetrisScore">0</h2>
                    </div>

                    <div class="tetris-stat">
                        <p>LEVEL</p>
                        <h2 id="tetrisLevel">1</h2>
                    </div>

                    <div class="tetris-stat">
                        <p>LINES</p>
                        <h2 id="tetrisLines">0</h2>
                    </div>

                    <button id="tetrisPause">Pause</button>

                    <p id="tetrisMessage">Viel Glück!</p>

                    <div class="tetris-controls">
                        <h3>Steuerung</h3>
                        <p>← → Bewegen</p>
                        <p>↑ Drehen</p>
                        <p>↓ Schneller fallen</p>
                        <p>SPACE Sofort fallen</p>
                        <p>P Pause</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById("tetrisCanvas");
    const ctx = canvas.getContext("2d");

    const scoreElement = document.getElementById("tetrisScore");
    const levelElement = document.getElementById("tetrisLevel");
    const linesElement = document.getElementById("tetrisLines");
    const messageElement = document.getElementById("tetrisMessage");
    const pauseButton = document.getElementById("tetrisPause");
    const restartButton = document.getElementById("tetrisRestart");

    const COLS = 10;
    const ROWS = 20;
    const SIZE = 30;

    const colors = {
        I: "#06b6d4",
        O: "#facc15",
        T: "#a855f7",
        S: "#22c55e",
        Z: "#ef4444",
        J: "#3b82f6",
        L: "#f97316"
    };

    const shapes = {
        I: [
            [1, 1, 1, 1]
        ],
        O: [
            [1, 1],
            [1, 1]
        ],
        T: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        S: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        Z: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        J: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        L: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    };

    let board;
    let currentPiece;
    let score;
    let lines;
    let level;
    let gameOver;
    let paused;

    function createBoard() {
        return Array.from(
            { length: ROWS },
            () => Array(COLS).fill(null)
        );
    }

    function createPiece() {
        const types = Object.keys(shapes);
        const type = types[Math.floor(Math.random() * types.length)];

        const shape = shapes[type].map(row => [...row]);

        return {
            type,
            shape,
            x: Math.floor((COLS - shape[0].length) / 2),
            y: 0
        };
    }

    function startGame() {
        board = createBoard();

        score = 0;
        lines = 0;
        level = 1;

        gameOver = false;
        paused = false;

        currentPiece = createPiece();

        messageElement.textContent = "Viel Glück!";
        pauseButton.textContent = "Pause";

        updateStats();
        drawBoard();
        startTimer();
    }

    function startTimer() {
        if (tetrisInterval) {
            clearInterval(tetrisInterval);
        }

        const speed = Math.max(100, 800 - (level - 1) * 70);

        tetrisInterval = setInterval(() => {
            if (!paused && !gameOver) {
                moveDown();
            }
        }, speed);
    }

    function updateStats() {
        scoreElement.textContent = score;
        levelElement.textContent = level;
        linesElement.textContent = lines;
    }

    function drawBoard() {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Bereits platzierte Steine zeichnen
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (board[row][col]) {
                    drawCell(col, row, board[row][col]);
                }
            }
        }

        // Aktuellen Stein zeichnen
        if (currentPiece) {
            currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        drawCell(
                            currentPiece.x + x,
                            currentPiece.y + y,
                            colors[currentPiece.type]
                        );
                    }
                });
            });
        }

        // Raster zeichnen
        ctx.strokeStyle = "#273449";
        ctx.lineWidth = 1;

        for (let row = 0; row <= ROWS; row++) {
            ctx.beginPath();
            ctx.moveTo(0, row * SIZE);
            ctx.lineTo(canvas.width, row * SIZE);
            ctx.stroke();
        }

        for (let col = 0; col <= COLS; col++) {
            ctx.beginPath();
            ctx.moveTo(col * SIZE, 0);
            ctx.lineTo(col * SIZE, canvas.height);
            ctx.stroke();
        }
    }

    function drawCell(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(
            x * SIZE + 1,
            y * SIZE + 1,
            SIZE - 2,
            SIZE - 2
        );

        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.strokeRect(
            x * SIZE + 1,
            y * SIZE + 1,
            SIZE - 2,
            SIZE - 2
        );
    }

    function isValidMove(piece, offsetX = 0, offsetY = 0, shape = piece.shape) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (!shape[y][x]) continue;

                const newX = piece.x + x + offsetX;
                const newY = piece.y + y + offsetY;

                if (
                    newX < 0 ||
                    newX >= COLS ||
                    newY >= ROWS
                ) {
                    return false;
                }

                if (newY >= 0 && board[newY][newX]) {
                    return false;
                }
            }
        }

        return true;
    }

    function moveDown() {
        if (isValidMove(currentPiece, 0, 1)) {
            currentPiece.y++;
        } else {
            lockPiece();
        }

        drawBoard();
    }

    function lockPiece() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const boardY = currentPiece.y + y;
                    const boardX = currentPiece.x + x;

                    if (boardY >= 0) {
                        board[boardY][boardX] =
                            colors[currentPiece.type];
                    }
                }
            });
        });

        clearLines();

        currentPiece = createPiece();

        if (!isValidMove(currentPiece)) {
            endGame();
        }

        updateStats();
    }

    function clearLines() {
        let cleared = 0;

        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== null)) {
                board.splice(row, 1);
                board.unshift(Array(COLS).fill(null));

                cleared++;
                row++;
            }
        }

        if (cleared > 0) {
            lines += cleared;

            const points = [0, 100, 300, 500, 800];

            score += points[cleared] * level;

            const newLevel = Math.floor(lines / 10) + 1;

            if (newLevel > level) {
                level = newLevel;
                startTimer();
            }

            updateStats();
        }
    }

    function moveHorizontal(direction) {
        if (isValidMove(currentPiece, direction, 0)) {
            currentPiece.x += direction;
            drawBoard();
        }
    }

    function rotatePiece() {
        const rotated = currentPiece.shape[0].map((_, index) =>
            currentPiece.shape.map(row => row[index]).reverse()
        );

        if (isValidMove(currentPiece, 0, 0, rotated)) {
            currentPiece.shape = rotated;
            drawBoard();
        }
    }

    function hardDrop() {
        while (isValidMove(currentPiece, 0, 1)) {
            currentPiece.y++;
            score += 2;
        }

        lockPiece();
        drawBoard();
        updateStats();
    }

    function togglePause() {
        if (gameOver) return;

        paused = !paused;

        pauseButton.textContent = paused ? "Weiter" : "Pause";

        messageElement.textContent = paused
            ? "Spiel pausiert"
            : "Viel Glück!";

        drawBoard();
    }

    function endGame() {
        gameOver = true;

        messageElement.textContent = "Game Over!";
        pauseButton.textContent = "Pause";

        clearInterval(tetrisInterval);
        tetrisInterval = null;
    }

    tetrisKeyHandler = function(event) {
        if (
            ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "]
                .includes(event.key)
        ) {
            event.preventDefault();
        }

        if (event.key.toLowerCase() === "p") {
            togglePause();
            return;
        }

        if (paused || gameOver) return;

        switch (event.key) {
            case "ArrowLeft":
                moveHorizontal(-1);
                break;

            case "ArrowRight":
                moveHorizontal(1);
                break;

            case "ArrowDown":
                if (isValidMove(currentPiece, 0, 1)) {
                    currentPiece.y++;
                    score++;
                    updateStats();
                } else {
                    lockPiece();
                }

                drawBoard();
                break;

            case "ArrowUp":
                rotatePiece();
                break;

            case " ":
                hardDrop();
                break;
        }
    };

    document.addEventListener("keydown", tetrisKeyHandler);

    pauseButton.addEventListener("click", togglePause);
    restartButton.addEventListener("click", startGame);

    startGame();
}
