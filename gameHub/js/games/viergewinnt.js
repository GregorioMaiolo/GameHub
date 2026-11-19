
function initVierGewinnt() {
    const gameElement = document.getElementById("viergewinntGame");

    if (!gameElement) {
        throw new Error("Vier Gewinnt container not found.");
    }

    gameElement.innerHTML = `
        <div class="connect-four">
            <div class="connect-four-header">
                <div>
                    <h2>Vier Gewinnt</h2>
                    <p id="vierStatus">Rot ist am Zug</p>
                </div>
                <button id="vierRestart" class="vier-restart">
                    Neues Spiel
                </button>
            </div>

            <div class="vier-players">
                <div class="vier-player active" id="vierRedPlayer">
                    <span class="vier-player-piece red"></span>
                    <span>Spieler Rot</span>
                </div>

                <div class="vier-player" id="vierYellowPlayer">
                    <span class="vier-player-piece yellow"></span>
                    <span>Spieler Gelb</span>
                </div>
            </div>

            <div id="vierBoard" class="vier-board"></div>

            <p class="vier-hint">
                Klicke auf eine Spalte, um deinen Stein einzuwerfen.
            </p>
        </div>
    `;

    const boardElement = document.getElementById("vierBoard");
    const statusElement = document.getElementById("vierStatus");
    const redPlayerElement = document.getElementById("vierRedPlayer");
    const yellowPlayerElement = document.getElementById("vierYellowPlayer");
    const restartButton = document.getElementById("vierRestart");

    const ROWS = 6;
    const COLS = 7;

    let board;
    let currentPlayer;
    let gameOver;

    function startGame() {
        board = Array.from(
            { length: ROWS },
            () => Array(COLS).fill(null)
        );

        currentPlayer = "red";
        gameOver = false;

        statusElement.textContent = "Rot ist am Zug";

        redPlayerElement.classList.add("active");
        yellowPlayerElement.classList.remove("active");

        renderBoard();
    }

    function renderBoard() {
        boardElement.innerHTML = "";

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement("button");

                cell.classList.add("vier-cell");
                cell.dataset.col = col;

                if (board[row][col]) {
                    cell.classList.add(board[row][col]);
                }

                cell.setAttribute(
                    "aria-label",
                    `Spalte ${col + 1}, Reihe ${row + 1}`
                );

                boardElement.appendChild(cell);
            }
        }
    }

    function dropPiece(col) {
        if (gameOver) return;

        // Freie Position von unten suchen
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === null) {
                board[row][col] = currentPlayer;

                renderBoard();

                if (checkWin(row, col)) {
                    gameOver = true;
                    statusElement.textContent =
                        currentPlayer === "red"
                            ? "Rot hat gewonnen!"
                            : "Gelb hat gewonnen!";

                    return;
                }

                if (isBoardFull()) {
                    gameOver = true;
                    statusElement.textContent = "Unentschieden!";
                    return;
                }

                switchPlayer();
                return;
            }
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === "red" ? "yellow" : "red";

        if (currentPlayer === "red") {
            statusElement.textContent = "Rot ist am Zug";
            redPlayerElement.classList.add("active");
            yellowPlayerElement.classList.remove("active");
        } else {
            statusElement.textContent = "Gelb ist am Zug";
            yellowPlayerElement.classList.add("active");
            redPlayerElement.classList.remove("active");
        }
    }

    function checkWin(row, col) {
        const directions = [
            [0, 1],   // Horizontal
            [1, 0],   // Vertikal
            [1, 1],   // Diagonal nach rechts
            [1, -1]   // Diagonal nach links
        ];

        for (const [rowDirection, colDirection] of directions) {
            let count = 1;

            count += countPieces(
                row,
                col,
                rowDirection,
                colDirection
            );

            count += countPieces(
                row,
                col,
                -rowDirection,
                -colDirection
            );

            if (count >= 4) {
                return true;
            }
        }

        return false;
    }

    function countPieces(row, col, rowDirection, colDirection) {
        let count = 0;

        let nextRow = row + rowDirection;
        let nextCol = col + colDirection;

        while (
            nextRow >= 0 &&
            nextRow < ROWS &&
            nextCol >= 0 &&
            nextCol < COLS &&
            board[nextRow][nextCol] === currentPlayer
        ) {
            count++;

            nextRow += rowDirection;
            nextCol += colDirection;
        }

        return count;
    }

    function isBoardFull() {
        return board[0].every(cell => cell !== null);
    }

    boardElement.addEventListener("click", function (event) {
        const cell = event.target.closest(".vier-cell");

        if (!cell || !boardElement.contains(cell)) return;

        const col = Number(cell.dataset.col);

        dropPiece(col);
    });

    restartButton.addEventListener("click", startGame);

    startGame();
}

// Für den Aufruf aus app.js
window.initVierGewinnt = initVierGewinnt;
