const cells = document.querySelectorAll(".cell");

const status = document.getElementById("status");

const xScore = document.getElementById("x-score");

const oScore = document.getElementById("o-score");

const drawScore = document.getElementById("draw-score");

const singlePlayerBtn = document.getElementById("single-player");

const twoPlayerBtn = document.getElementById("two-player");

const easyBtn = document.getElementById("easy-btn");

const mediumBtn = document.getElementById("medium-btn");

const hardBtn = document.getElementById("hard-btn");

const difficultyContainer = document.getElementById("difficulty-container");

let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameMode = "two-player";

let difficulty = "easy";

let gameRunning = true;

let scores = {
  x: 0,
  o: 0,
  draw: 0,
};

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

cells.forEach((cell) => {
  cell.addEventListener("click", handleMove);
});

function handleMove() {
  const index = this.dataset.index;

  if (board[index] !== "" || !gameRunning) return;

  board[index] = currentPlayer;

  this.textContent = currentPlayer;

  this.classList.add(currentPlayer.toLowerCase());

  checkWinner();

  if (!gameRunning) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "single-player" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function checkWinner() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameRunning = false;

      status.textContent = `Player ${board[a]} Wins!`;

      pattern.forEach((index) => {
        cells[index].classList.add("winner");
      });

      if (board[a] === "X") {
        scores.x++;
      } else {
        scores.o++;
      }

      confetti({
        particleCount: 150,
        spread: 90,
      });

      updateScores();

      return;
    }
  }

  if (!board.includes("")) {
    gameRunning = false;

    status.textContent = "Draw!";

    scores.draw++;

    updateScores();
  }
}

function updateScores() {
  xScore.textContent = scores.x;

  oScore.textContent = scores.o;

  drawScore.textContent = scores.draw;
  localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
}

document.getElementById("new-round").addEventListener("click", resetBoard);

document.getElementById("reset").addEventListener("click", () => {
  scores = {
    x: 0,
    o: 0,
    draw: 0,
  };

  localStorage.removeItem("ticTacToeScores");

  updateScores();

  resetBoard();
});

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];

  currentPlayer = "X";

  gameRunning = true;

  status.textContent = "Player X's Turn";

  cells.forEach((cell) => {
    cell.textContent = "";

    cell.className = "cell";
  });
}

const savedScores = JSON.parse(localStorage.getItem("ticTacToeScores"));

if (savedScores) {
  scores = savedScores;

  updateScores();
}

singlePlayerBtn.addEventListener("click", () => {
  gameMode = "single-player";

  singlePlayerBtn.classList.add("active");

  twoPlayerBtn.classList.remove("active");

  difficultyContainer.style.display = "block";

  resetBoard();
});

twoPlayerBtn.addEventListener("click", () => {
  gameMode = "two-player";

  twoPlayerBtn.classList.add("active");

  difficultyContainer.style.display = "none";

  singlePlayerBtn.classList.remove("active");

  difficultyContainer.style.display = "none";

  resetBoard();
});

twoPlayerBtn.classList.add("active");

difficultyContainer.style.display = "none";

function computerMove() {
  if (!gameRunning) return;

  let move;

  switch (difficulty) {
    case "easy":
      move = easyMove();
      break;

    case "medium":
      move = mediumMove();
      break;

    case "hard":
      move = hardMove();
      break;
  }

  board[move] = "O";

  cells[move].textContent = "O";

  cells[move].classList.add("o");

  checkWinner();

  if (!gameRunning) return;

  currentPlayer = "X";

  status.textContent = "Player X's Turn";
}

function easyMove() {
  const empty = board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);

  return empty[Math.floor(Math.random() * empty.length)];
}

function mediumMove() {
  if (board[4] === "") return 4;

  return easyMove();
}

function hardMove() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    const values = [board[a], board[b], board[c]];

    if (values.filter((v) => v === "O").length === 2 && values.includes("")) {
      if (board[a] === "") return a;
      if (board[b] === "") return b;
      return c;
    }
  }

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    const values = [board[a], board[b], board[c]];

    if (values.filter((v) => v === "X").length === 2 && values.includes("")) {
      if (board[a] === "") return a;
      if (board[b] === "") return b;
      return c;
    }
  }

  if (board[4] === "") return 4;

  return easyMove();
}

easyBtn.addEventListener("click", () => {
  difficulty = "easy";

  easyBtn.classList.add("active-difficulty");

  mediumBtn.classList.remove("active-difficulty");
  hardBtn.classList.remove("active-difficulty");
});

mediumBtn.addEventListener("click", () => {
  difficulty = "medium";

  mediumBtn.classList.add("active-difficulty");

  easyBtn.classList.remove("active-difficulty");
  hardBtn.classList.remove("active-difficulty");
});

hardBtn.addEventListener("click", () => {
  difficulty = "hard";

  hardBtn.classList.add("active-difficulty");

  easyBtn.classList.remove("active-difficulty");
  mediumBtn.classList.remove("active-difficulty");
});
