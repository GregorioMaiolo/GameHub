
let pongAnimation = null;
let pongActive = false;

function initPong() {
    const content = document.getElementById("gameContent");

    let game = document.getElementById("pongGame");

    if (!game) {
        game = document.createElement("div");
        game.id = "pongGame";
        game.className = "mini-game";
        content.appendChild(game);
    }

    game.classList.remove("hidden");

    game.innerHTML = `
        <h2 id="pongScore">0 : 0</h2>
        <canvas id="pongCanvas" width="600" height="350"></canvas>
        <p>Controls: W / S</p>
    `;

    const canvas = game.querySelector("#pongCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = game.querySelector("#pongScore");

    let playerY = 140;
    let computerY = 140;

    let ballX = 300;
    let ballY = 175;
    let ballSpeedX = 4;
    let ballSpeedY = 3;

    let playerScore = 0;
    let computerScore = 0;

    let keys = {};

    pongActive = true;

    function keyDown(event) {
        keys[event.key.toLowerCase()] = true;
    }

    function keyUp(event) {
        keys[event.key.toLowerCase()] = false;
    }

    function draw() {
        if (!pongActive) return;

        ctx.fillStyle = "#10151b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Mittellinie
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(300, 0);
        ctx.lineTo(300, 350);
        ctx.stroke();
        ctx.setLineDash([]);

        // Schläger und Ball
        ctx.fillStyle = "#a78bfa";
        ctx.fillRect(15, playerY, 12, 70);
        ctx.fillRect(573, computerY, 12, 70);

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Spieler bewegen
        if (keys["w"]) playerY -= 6;
        if (keys["s"]) playerY += 6;

        playerY = Math.max(0, Math.min(280, playerY));

        // Computer bewegen
        if (computerY + 35 < ballY - 10) computerY += 3;
        if (computerY + 35 > ballY + 10) computerY -= 3;

        // Ball bewegen
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Obere und untere Wand
        if (ballY < 8 || ballY > 342) {
            ballSpeedY *= -1;
        }

        // Spieler-Kollision
        if (
            ballX < 27 &&
            ballX > 15 &&
            ballY > playerY &&
            ballY < playerY + 70
        ) {
            ballSpeedX = Math.abs(ballSpeedX);
        }

        // Computer-Kollision
        if (
            ballX > 573 &&
            ballX < 585 &&
            ballY > computerY &&
            ballY < computerY + 70
        ) {
            ballSpeedX = -Math.abs(ballSpeedX);
        }

        // Punkt für Computer
        if (ballX < 0) {
            computerScore++;
            resetBall();
        }

        // Punkt für Spieler
        if (ballX > 600) {
            playerScore++;
            resetBall();
        }

        scoreElement.textContent =
            `${playerScore} : ${computerScore}`;

        pongAnimation = requestAnimationFrame(draw);
    }

    function resetBall() {
        ballX = 300;
        ballY = 175;
        ballSpeedX = ballSpeedX > 0 ? -4 : 4;
        ballSpeedY = Math.random() > 0.5 ? 3 : -3;
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    // Funktionen für das Beenden
    game.stop = () => {
        pongActive = false;
        cancelAnimationFrame(pongAnimation);
        document.removeEventListener("keydown", keyDown);
        document.removeEventListener("keyup", keyUp);
    };

    draw();
}

function stopPong() {
    const game = document.getElementById("pongGame");

    if (game && game.stop) {
        game.stop();
    }
}
