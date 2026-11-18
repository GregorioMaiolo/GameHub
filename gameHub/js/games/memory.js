
function initMemory() {
    const content = document.getElementById("gameContent");

    let game = document.getElementById("memoryGame");

    if (!game) {
        game = document.createElement("div");
        game.id = "memoryGame";
        game.className = "mini-game";
        content.appendChild(game);
    }

    game.classList.remove("hidden");

    const symbols = [
        "🍎", "🍌", "🍇", "🍒",
        "🍋", "🍉", "🥝", "🍓"
    ];

    let cards = [...symbols, ...symbols];

    cards.sort(() => Math.random() - 0.5);

    let firstCard = null;
    let secondCard = null;
    let locked = false;
    let moves = 0;
    let matches = 0;

    game.innerHTML = `
        <h2>Moves: <span id="memoryMoves">0</span></h2>
        <div class="memory-board">
            ${cards.map((symbol, index) => `
                <button class="memory-card" data-index="${index}">
                    ?
                </button>
            `).join("")}
        </div>
        <p id="memoryStatus">Find all matching pairs!</p>
        <button id="memoryRestart">Restart Game</button>
    `;

    const memoryCards = game.querySelectorAll(".memory-card");
    const movesElement = game.querySelector("#memoryMoves");
    const status = game.querySelector("#memoryStatus");

    memoryCards.forEach(card => {
        card.addEventListener("click", () => {
            if (locked || card.classList.contains("matched")) return;
            if (card === firstCard) return;

            const index = Number(card.dataset.index);

            card.textContent = cards[index];
            card.classList.add("revealed");

            if (!firstCard) {
                firstCard = card;
                return;
            }

            secondCard = card;
            moves++;

            movesElement.textContent = moves;
            locked = true;

            const firstIndex = Number(firstCard.dataset.index);
            const secondIndex = Number(secondCard.dataset.index);

            if (cards[firstIndex] === cards[secondIndex]) {
                firstCard.classList.add("matched");
                secondCard.classList.add("matched");

                matches++;

                firstCard = null;
                secondCard = null;
                locked = false;

                if (matches === symbols.length) {
                    status.textContent =
                        `Congratulations! You won in ${moves} moves!`;
                }
            } else {
                setTimeout(() => {
                    firstCard.textContent = "?";
                    secondCard.textContent = "?";

                    firstCard.classList.remove("revealed");
                    secondCard.classList.remove("revealed");

                    firstCard = null;
                    secondCard = null;
                    locked = false;
                }, 800);
            }
        });
    });

    game.querySelector("#memoryRestart").addEventListener(
        "click",
        initMemory
    );
}
