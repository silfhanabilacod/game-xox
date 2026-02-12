document.addEventListener("DOMContentLoaded", () => {

const boardElement = document.getElementById("board");
const turnInfo = document.getElementById("turnInfo");
const popup = document.getElementById("popup");
const winnerText = document.getElementById("winnerText");
const resultText = document.getElementById("resultText");

const bgm = document.getElementById("bgm");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let board = Array(9).fill("");
let gameOver = false;
let playerName = "";

const user = "O";
const computer = "X";

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// START GAME
window.startGame = function () {
    const input = document.getElementById("playerName").value.trim();

    if (input === "") {
        alert("Masukkan nama dulu ya!");
        return;
    }

    playerName = input;
    document.getElementById("landing").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    bgm.volume = 0.3;
    bgm.play();

    createBoard();
};

// CREATE BOARD
function createBoard() {
    boardElement.innerHTML = "";
    board.fill("");
    gameOver = false;
    turnInfo.innerText = "Giliran Kamu";

    board.forEach((_, i) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.addEventListener("click", () => userMove(i));
        boardElement.appendChild(cell);
    });
}

// USER MOVE
function userMove(i) {
    if (board[i] !== "" || gameOver) return;

    clickSound.currentTime = 0;
    clickSound.play();

    board[i] = user;
    updateBoard();

    if (checkWinner(user)) {
        showPopup(playerName);
        return;
    }

    if (isDraw()) {
        showDraw();
        return;
    }

    turnInfo.innerText = "Giliran Bot";
    setTimeout(computerMove, 500);
}

// COMPUTER MOVE
function computerMove() {
    if (gameOver) return;

    const empty = board
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    if (empty.length === 0) return;

    const pick = empty[Math.floor(Math.random() * empty.length)];
    board[pick] = computer;
    updateBoard();

    if (checkWinner(computer)) {
        showPopup("Komputer");
        return;
    }

    if (isDraw()) {
        showDraw();
        return;
    }

    turnInfo.innerText = "Giliran Kamu";
}

// UPDATE BOARD
function updateBoard() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
        cell.innerText = board[i];
    });
}

// CHECK WINNER
function checkWinner(p) {
    return winPatterns.some(pattern =>
        pattern.every(i => board[i] === p)
    );
}

// DRAW
function isDraw() {
    return board.every(cell => cell !== "");
}

// POPUP
function showPopup(winner) {
    bgm.pause();
    gameOver = true;
    popup.classList.remove("hidden");

    if (winner === playerName) {
        winnerText.innerText = `🎉 ${playerName} MENANG!`;
        resultText.innerText = "Silahkan ambil doorprize";
        winSound.currentTime = 0;
        winSound.play();
    } else {
        winnerText.innerText = "Kamu Kalah";
        resultText.innerText = "Coba lagi ya";
    }
}

function showDraw() {
    bgm.pause();
    gameOver = true;
    popup.classList.remove("hidden");
    winnerText.innerText = "Seri!";
    resultText.innerText = "Tidak ada pemenang";
}

window.closePopup = function () {
    popup.classList.add("hidden");
};

window.resetGame = function () {
    createBoard();
};

});
