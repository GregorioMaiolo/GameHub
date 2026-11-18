
/* HTML Elements */

const libraryView = document.getElementById("libraryView");
const gameView = document.getElementById("gameView");

const gameCards = document.querySelectorAll(".game-card");
const searchInput = document.getElementById("searchInput");

const backButton = document.getElementById("backButton");

const gameTitle = document.getElementById("gameTitle");
const gameDescription = document.getElementById("gameDescription");
const gameCategory = document.getElementById("gameCategory");

const snakeGame = document.getElementById("snakeGame");
const placeholder = document.getElementById("placeholderGame");

/* Game Info Elements */

const infoModal = document.getElementById("infoModal");
const closeInfo = document.getElementById("closeInfo");

const infoTitle = document.getElementById("infoTitle");
const infoCategory = document.getElementById("infoCategory");
const infoDescription = document.getElementById("infoDescription");
const infoInstructions = document.getElementById("infoInstructions");
const infoControls = document.getElementById("infoControls");

/* Game Data */

const games = {
    snake: {
        title: "Snake",
        description: "Classic Arcade Game",
        category: "ARCADE",
        instructions: "Control the snake and collect as much food as possible. Every food item increases your score. Avoid hitting the walls or your own body.",
        controls: "WASD or Arrow Keys to move. SPACE to start."
    },

    tictactoe: {
        title: "Tic Tac Toe",
        description: "Classic Strategy Game",
        category: "STRATEGY",
        instructions: "Take turns placing X and O on a 3x3 grid. The first player to get three symbols in a row wins.",
        controls: "Click on an empty field to place your symbol."
    },

    pong: {
        title: "Pong",
        description: "Retro Arcade Game",
        category: "ARCADE",
        instructions: "Play against your opponent and try to get the ball past their paddle.",
        controls: "W and S or Arrow Keys to move."
    },

    memory: {
        title: "Memory",
        description: "Memory Challenge",
        category: "PUZZLE",
        instructions: "Find matching pairs of cards. Remember the positions and try to finish with as few moves as possible.",
        controls: "Click on two cards to reveal them."
    }
};

/* LocalStorage Data */

let favorites = JSON.parse(
    localStorage.getItem("gamehubFavorites")
) || [];

let recentlyPlayed = JSON.parse(
    localStorage.getItem("gamehubRecent")
) || [];

let currentFilter = "all";

/* Save Data */

function saveFavorites() {
    localStorage.setItem(
        "gamehubFavorites",
        JSON.stringify(favorites)
    );
}

function saveRecentlyPlayed() {
    localStorage.setItem(
        "gamehubRecent",
        JSON.stringify(recentlyPlayed)
    );
}

/* Favorites */

function updateFavoriteButtons() {
    gameCards.forEach(card => {
        const gameId = card.dataset.game;
        const button = card.querySelector(".favorite-btn");

        const isFavorite = favorites.includes(gameId);

        button.textContent = isFavorite ? "★" : "☆";
        button.classList.toggle("is-favorite", isFavorite);
        button.title = isFavorite
            ? "Remove from Favorites"
            : "Add to Favorites";
    });
}

function toggleFavorite(gameId) {
    if (favorites.includes(gameId)) {
        favorites = favorites.filter(id => id !== gameId);
    } else {
        favorites.push(gameId);
    }

    saveFavorites();
    updateFavoriteButtons();
    applyFilters();
}

/* Recently Played */

function addRecentlyPlayed(gameId) {
    recentlyPlayed = recentlyPlayed.filter(id => id !== gameId);

    recentlyPlayed.unshift(gameId);

    // Maximal 10 Spiele speichern
    recentlyPlayed = recentlyPlayed.slice(0, 10);

    saveRecentlyPlayed();
}

/* Filters */

function applyFilters() {
    const searchText = searchInput.value.toLowerCase();

    gameCards.forEach(card => {
        const gameId = card.dataset.game;
        const gameName = card.querySelector("h3").textContent.toLowerCase();

        const matchesSearch = gameName.includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "favorites") {
            matchesFilter = favorites.includes(gameId);
        }

        if (currentFilter === "recent") {
            matchesFilter = recentlyPlayed.includes(gameId);
        }

        card.style.display = matchesSearch && matchesFilter
            ? "block"
            : "none";
    });

    const visibleGames = [...gameCards].filter(
        card => card.style.display !== "none"
    );

    const countElement = document.getElementById("gameCount");

    if (countElement) {
        countElement.textContent =
            `${visibleGames.length} Games Available`;
    }
}

/* Game Info */

function openGameInfo(gameId) {
    const game = games[gameId];

    if (!game) return;

    infoTitle.textContent = game.title;
    infoCategory.textContent = game.category;
    infoDescription.textContent = game.description;
    infoInstructions.textContent = game.instructions;
    infoControls.textContent = game.controls;

    infoModal.classList.remove("hidden");
}

function closeGameInfo() {
    infoModal.classList.add("hidden");
}

/* Open Game */

function openGame(gameId) {
    const game = games[gameId];

    if (!game) return;

    stopSnake();

    addRecentlyPlayed(gameId);

    libraryView.classList.add("hidden");
    gameView.classList.remove("hidden");

    gameTitle.textContent = game.title;
    gameDescription.textContent = game.description;
    gameCategory.textContent = game.category;

    if (gameId === "snake") {
        snakeGame.classList.remove("hidden");
        placeholder.classList.add("hidden");

        initSnake();
    } else {
        snakeGame.classList.add("hidden");
        placeholder.classList.remove("hidden");
    }

    applyFilters();
}

/* Close Game */

function closeGame() {
    stopSnake();

    gameView.classList.add("hidden");
    libraryView.classList.remove("hidden");
}

/* Card Events */

gameCards.forEach(card => {
    const gameId = card.dataset.game;

    card.addEventListener("click", () => {
        openGame(gameId);
    });

    const favoriteButton = card.querySelector(".favorite-btn");

    favoriteButton.addEventListener("click", event => {
        event.stopPropagation();
        toggleFavorite(gameId);
    });

    const infoButton = card.querySelector(".info-btn");

    infoButton.addEventListener("click", event => {
        event.stopPropagation();
        openGameInfo(gameId);
    });
});

/* Sidebar Navigation */

document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        document.querySelectorAll(".sidebar nav a").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");

        currentFilter = link.dataset.filter;

        applyFilters();
    });
});

/* Search */

searchInput.addEventListener("input", applyFilters);

/* Other Events */

backButton.addEventListener("click", closeGame);

closeInfo.addEventListener("click", closeGameInfo);

infoModal.addEventListener("click", event => {
    if (event.target === infoModal) {
        closeGameInfo();
    }
});

/* Initial Setup */

updateFavoriteButtons();
applyFilters();

console.log("Welcome to GameHub!");
