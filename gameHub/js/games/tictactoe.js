
function initTicTacToe() {
    const content = document.getElementById("gameContent");

    let game = document.getElementById("tictactoeGame");

    if (!game) {
        game = document.createElement("div");
        game.id = "tictactoeGame";
        game.className = "mini-game";
        content.appendChild(game);
    }

    game.classList.remove("hidden");

    let board = Array(9).fill("");
    let currentPlayer = "X";
    let finished = false;

    game.innerHTML = `
        <h2 id="tttStatus">Player X's turn</h2>
        <div class="ttt-board">
            ${board.map((_, i) =>
                `<button class="ttt-cell" data-index="${i}"></button>`
            ).join("")}
        </div>
        <button id="tttRestart">Restart Game</button>
    `;

    const cells = game.querySelectorAll(".ttt-cell");
    const status = game.querySelector("#tttStatus");

    function checkWinner() {
        const combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of combinations) {
            const [a, b, c] = combo;

            if (
                board[a] &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                return board[a];
            }
        }

        return null;
    }

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const index = Number(cell.dataset.index);

            if (board[index] || finished) return;

            board[index] = currentPlayer;
            cell.textContent = currentPlayer;

            const winner = checkWinner();

            if (winner) {
                status.textContent = `Player ${winner} wins!`;
                finished = true;
                return;
            }

            if (board.every(field => field !== "")) {
                status.textContent = "It's a draw!";
                finished = true;
                return;
            }

            currentPlayer = currentPlayer === "X" ? "O" : "X";
            status.textContent = `Player ${currentPlayer}'s turn`;
        });
    });

    game.querySelector("#tttRestart").addEventListener("click", initTicTacToe);
}
