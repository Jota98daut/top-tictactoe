const GameBoard = (() => {
  let boardArray = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  let availableCells = 9;

  function placeMark(mark, pos) {
    const [x, y] = pos;
    if (x < 0 || x > 2 || y < 0 || y > 2) return false;
    if (boardArray[x][y] != "") return false;

    boardArray[x][y] = mark;
    availableCells--;
    return true;
  }

  function asMatrix() {
    return [[...boardArray[0]], [...boardArray[1]], [...boardArray[2]]];
  }

  function reset() {
    boardArray = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    availableCells = 9;
  }

  function checkFull() {
    return availableCells == 0;
  }

  function checkWinner() {
    let winnerMark;
    let b = boardArray;

    // Check rows
    for (let row of boardArray) {
      if (row[0] != "" && row[0] == row[1] && row[1] == row[2])
        winnerMark = row[0];
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (b[0][i] != "" && b[0][i] == b[1][i] && b[1][i] == b[2][i])
        winnerMark = b[0][i];
    }

    // Check main diagonal
    if (b[0][0] != "" && b[0][0] == b[1][1] && b[1][1] == b[2][2])
      winnerMark = b[0][0];

    // Check secondary diagonal
    if (b[0][2] != "" && b[0][2] == b[1][1] && b[1][1] == b[2][0])
      winnerMark = b[0][2];

    return winnerMark;
  }

  return { placeMark, asMatrix, checkFull, checkWinner, reset };
})();

const Player = (name, mark) => {
  let score = 0;

  function getName() {
    return name;
  }
  function setName(newName) {
    name = newName;
  }
  function getMark() {
    return mark;
  }
  function getScore() {
    return score;
  }
  function incrementScore() {
    score++;
  }

  return { getName, setName, getMark, getScore, incrementScore };
};

const player1 = Player("Player1", "X");
const player2 = Player("Player2", "O");

const GameSession = (() => {
  let winner;
  let turn = player1;
  let draw = false;

  function getTurn() {
    return turn;
  }

  function setTurn(player) {
    turn = player;
  }

  function getWinner() {
    return winner;
  }

  function setWinner(player) {
    winner = player;
  }

  function getDraw() {
    return draw;
  }

  function setDraw(d = true) {
    draw = d;
  }

  function makeMove(player, pos) {
    let mark = player.getMark();
    if (winner || draw) return;
    if (player != turn) return;
    let wasPlaced = GameBoard.placeMark(mark, pos);
    if (wasPlaced) {
      if (GameBoard.checkWinner()) {
        setWinner(player);
        player.incrementScore();
      } else if (GameBoard.checkFull()) {
        setDraw();
      } else {
        setTurn(turn == player1 ? player2 : player1);
      }
    }
  }

  function reset() {
    GameBoard.reset();
    turn = player1;
    winner = undefined;
    draw = false;
    setTurn(player1);
  }

  return { getTurn, getDraw, getWinner, makeMove, reset };
})();

const resetButton = document.querySelector("#reset");
const scoresDisplay = document.querySelector("#scores");
const resultDisplay = document.querySelector("#result");
const cells = document.querySelectorAll(".game-grid-cell");

function updateScores() {
  scoresDisplay.textContent = `${player1.getName()} ${player1.getScore()} - ${player2.getScore()} ${player2.getName()}`;
}

function renderBoard() {
  let m = GameBoard.asMatrix();

  for (let cell of cells) {
    let x = cell.dataset.x;
    let y = cell.dataset.y;
    cell.textContent = m[x][y];
  }
}

function handleClickOnCell(e) {
  let cell = e.target;
  let x = cell.dataset.x;
  let y = cell.dataset.y;
  let winner;

  GameSession.makeMove(GameSession.getTurn(), [x, y]);
  renderBoard();

  winner = GameSession.getWinner();
  if (winner || GameSession.getDraw()) {
    finishGame(winner);
  }
}

function finishGame(winner) {
  updateScores();
  resultDisplay.textContent = winner ? `${winner.getName()} wins!` : "Draw!";
  resetButton.classList.remove("hidden");
}

function handleReset() {
  GameSession.reset();
  resetButton.classList.add("hidden");
  resultDisplay.textContent = "";
  renderBoard();
}

function initialize() {
  updateScores();
  renderBoard();
  
  for (let cell of cells) {
    cell.addEventListener("click", handleClickOnCell);
  }

  resetButton.addEventListener("click", handleReset);
}

initialize();
