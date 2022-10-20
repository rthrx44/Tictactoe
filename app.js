//all required elements
const startGame = document.querySelector(".firstcon");
const selectBox = document.querySelector(".secondcon");
const gameArea = document.querySelector(".thirdcon");
const winCon = document.querySelector(".fourthcon");
const gameBoard = document.querySelector(".game-container");
const gameStatus = document.querySelector(".game-status");
const btnCon = document.querySelector(".btn-container");
const gameCells = document.querySelectorAll("span");
const statustext = document.querySelector(".status-text");

//buttons
const startBtn = document.getElementById("startBtn");
const playerX = document.getElementById("X");
const playerO = document.getElementById("O");
const prevBtn = document.getElementById("prev-btn");
const playAgain = document.getElementById("play-again-btn");
const nextBtn = document.getElementById("next-btn");
const replay = document.getElementById("replay-btn");

let gameActive = false;
let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer;
let gameHistory = [];
let prevHistory = [];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

gameStatus.innerHTML = currentPlayerTurn();

document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", cellClick));

function cellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !gameActive) return;

  //Logs every move into an object and pushes into gameHistory array
  let moveLogs = {};

  moveLogs.index = clickedCell;
  moveLogs.turn = currentPlayer;
  gameHistory.push(moveLogs);
  CellPlayed(clickedCell, clickedCellIndex);
  ResultValidation();
}

function CellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

//change player per move/game
function playerChange() {
  if (currentPlayer === "X") {
    currentPlayer = "O";
  } else {
    currentPlayer = "X";
  }
  gameStatus.innerHTML = currentPlayerTurn();
}

//round win/draw validation
function ResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statustext.innerHTML = winningMessage();
    gameStatus.innerHTML = winningMessage();
    gameActive = false;
    winCon.style.display = "flex";
    btnCon.style.display = "flex";
    gameArea.style.display = "none";
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    gameStatus.innerHTML = drawMessage();
    statustext.innerHTML = drawMessage();
    gameActive = false;
    winCon.style.display = "flex";
    btnCon.style.display = "flex";
    gameArea.style.display = "none";
    return;
  }
  playerChange();
}

//start button
function playStart() {
  selectBox.style.display = "flex";
  startGame.style.display = "none";
}
startBtn.addEventListener("click", playStart);

//reset game
function playAgainGame() {
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameCells.forEach((cell) => (cell.innerHTML = ""));
  gameStatus.innerHTML = currentPlayerTurn();
  gameStatus.style.display = "flex";
  gameBoard.style.display = "flex";
  gameHistory.length = [];
  prevHistory.length = [];
  playerChange();
}
selectBox.addEventListener("click", playAgainGame);

//choose player first move
function choosePlayer() {
  if (this.id === "X") {
    currentPlayer = "X";
  } else {
    currentPlayer = "O";
  }
  playerChange();

  gameArea.style.display = "flex";
  gameActive = true;
  selectBox.style.display = "none";
  btnCon.style.display = "none";
}
playerX.addEventListener("click", choosePlayer);
playerO.addEventListener("click", choosePlayer);

function displayHistory() {
  winCon.style.display = "none";
  gameArea.style.display = "flex";
}
replay.addEventListener("click", displayHistory);

function replayGame() {
  gameActive = false;
  btnCon.style.display = "none";

  playAgainGame();
}
playAgain.addEventListener("click", replayGame);
gameCells.forEach((cell) => cell.addEventListener("click", cellClick));

//pn button
prevBtn.addEventListener("click", () => {
  if (gameHistory.length != 0) {
    let lastMove = gameHistory[gameHistory.length - 1];
    let lastCell = lastMove.index;
    lastCell.innerHTML = "";
    prevHistory.push(lastMove);
    gameHistory.pop();
    nextBtn.style.opacity = "1";
  }
  if (gameHistory.length === 0) {
    prevBtn.style.opacity = "0";
  }
});

nextBtn.addEventListener("click", () => {
  if (prevHistory.length != 0) {
    let nextMove = prevHistory[prevHistory.length - 1];
    let nextCell = nextMove.index;
    let nextTurn = nextMove.turn;
    nextCell.innerHTML = nextTurn;
    gameHistory.push(nextMove);
    prevHistory.pop();
    prevBtn.style.opacity = "1";
  }
  if (prevHistory.length === 0) {
    nextBtn.style.opacity = "0";
  }
});
