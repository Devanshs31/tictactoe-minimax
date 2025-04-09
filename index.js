// Select DOM elements
const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const userVsUserBtn = document.querySelector("#userVsUserBtn");
const userVsComputerBtn = document.querySelector("#userVsComputerBtn");
const normalModeBtn = document.querySelector("#normalModeBtn");
const hardModeBtn = document.querySelector("#hardModeBtn");
const difficultySelection = document.querySelector("#difficultySelection");

// Define winning conditions for Tic Tac Toe
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Game state variables
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let gameMode = "UserVsUser"; // Default mode
let difficulty = "Normal"; // Default difficulty

// Initialize the game
initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    userVsUserBtn.addEventListener("click", () => setGameMode("UserVsUser"));
    userVsComputerBtn.addEventListener("click", () => setGameMode("UserVsComputer"));
    easyModeBtn.addEventListener("click", () => setDifficulty("Easy"));
    normalModeBtn.addEventListener("click", () => setDifficulty("Normal"));
    hardModeBtn.addEventListener("click", () => setDifficulty("Hard"));

    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

// Set the game mode (User vs User or User vs Computer)
function setGameMode(mode) {
    gameMode = mode;
    restartGame(); // Reset the game when switching modes

    if (mode === "UserVsComputer") {
        difficultySelection.style.display = "block"; // Show difficulty options
    } else {
        difficultySelection.style.display = "none"; // Hide difficulty options
    }
}

// Set the difficulty level (Normal or Hard)
function setDifficulty(level) {
    difficulty = level;
    restartGame(); // Reset the game when changing difficulty
}

// Handle cell click events
function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    // Ignore clicks on already filled cells or if the game is not running
    if (options[cellIndex] != "" || !running) {
        return;
    }

    // Update the clicked cell and check for a winner
    updateCell(this, cellIndex);
    checkWinner();

    // If it's the computer's turn, make a move
    if (gameMode === "UserVsComputer" && running && currentPlayer === "O") {
        setTimeout(computerMove, 500); // Add a slight delay for the computer's move
    }
}

// Update the clicked cell with the current player's symbol
function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

// Switch to the other player
function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

// Check if there is a winner or a draw
function checkWinner() {
    let roundWon = false;

    // Check all win conditions
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    // Update the game status based on the result
    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

// Restart the game
function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;

    // Always hide the difficulty buttons when restarting
    difficultySelection.style.display = "none";
}

// Handle the computer's move
function computerMove() {
    if (!running) return;

    let bestMove;
    const emptyCells = getEmptyCells(options);

    if (difficulty === "Easy") {
        // Easy mode: Make a completely random move
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === "Normal") {
        // Normal mode: Alternate between random and Minimax
        const useMinimax = Math.random() < 0.5; // 50% chance to use Minimax
        if (useMinimax) {
            bestMove = minimax(options, currentPlayer).index;
        } else {
            bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    } else if (difficulty === "Hard") {
        // Hard mode: Always use Minimax
        bestMove = minimax(options, currentPlayer).index;
    }

    const cell = cells[bestMove];
    updateCell(cell, bestMove);
    checkWinner();
}

