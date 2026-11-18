
// HTML Elemente
const libraryView = document.getElementById("libraryView");
const gameView = document.getElementById("gameView");

const gameCards = document.querySelectorAll(".game-card");
const searchInput = document.getElementById("searchInput");

const backButton = document.getElementById("backButton");
const gameTitle = document.getElementById("gameTitle");
const gameDescription = document.getElementById("gameDescription");
const gameCategory = document.getElementById("gameCategory");

// Spieldaten
const games = {
    snake: {
        title: "Snake",
        description: "Classic Arcade Game",
        category: "ARCADE"
    },

    tictactoe: {
        title: "Tic Tac Toe",
        description: "Classic Strategy Game",
        category: "STRATEGY"
    },

    pong: {
        title: "Pong",
        description: "Retro Arcade Game",
        category: "ARCADE"
    },

    memory: {
        title: "Memory",
        description: "Memory Challenge",
        category: "PUZZLE"
    }
};

// Spiel öffnen

function openGame(gameId) {
    const game = games[gameId];

    if (!game) {
        return;
    }

    // Anderes Spiel beenden
    stopSnake();

    libraryView.classList.add("hidden");
    gameView.classList.remove("hidden");

    gameTitle.textContent = game.title;
    gameDescription.textContent = game.description;
    gameCategory.textContent = game.category;

    const snakeGame = document.getElementById("snakeGame");
    const placeholder = document.getElementById("placeholderGame");

    if (gameId === "snake") {
        snakeGame.classList.remove("hidden");
        placeholder.classList.add("hidden");

        initSnake();
    } else {
        snakeGame.classList.add("hidden");
        placeholder.classList.remove("hidden");
    }
}


// Zurück zur Library

function closeGame() {
    stopSnake();

    gameView.classList.add("hidden");
    libraryView.classList.remove("hidden");

    console.log("Back to library");
}


// Klick auf eine Game-Card
gameCards.forEach(card => {
    card.addEventListener("click", () => {
        const gameId = card.dataset.game;

        openGame(gameId);
    });
});

// Zurück-Button
backButton.addEventListener("click", closeGame);

// Suchfunktion
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();

    gameCards.forEach(card => {
        const gameName = card.querySelector("h3").textContent.toLowerCase();

        card.style.display = gameName.includes(searchText)
            ? "block"
            : "none";
    });
});

console.log("Welcome to GameHub!");
