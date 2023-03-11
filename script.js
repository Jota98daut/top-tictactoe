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

const player = Player("Player", "X");
const computer = Player("AI", "O");

const Computer = (() => {
  function turn(m) {
    let xCount = 0;
    let oCount = 0;

    for (let row of m) {
      for (let s of row) {
        if (s === "X") xCount++;
        if (s === "O") oCount++;
      }
    }

    if (xCount > oCount) return "O";
    else return "X";
  }

  function checkWinner(m) {
    let winnerMark;

    // Check rows
    for (let row of m) {
      if (row[0] != "" && row[0] == row[1] && row[1] == row[2])
        winnerMark = row[0];
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (m[0][i] != "" && m[0][i] == m[1][i] && m[1][i] == m[2][i])
        winnerMark = m[0][i];
    }

    // Check main diagonal
    if (m[0][0] != "" && m[0][0] == m[1][1] && m[1][1] == m[2][2])
      winnerMark = m[0][0];

    // Check secondary diagonal
    if (m[0][2] != "" && m[0][2] == m[1][1] && m[1][1] == m[2][0])
      winnerMark = m[0][2];

    return winnerMark;
  }

  function checkDraw(m) {
    return m.every((row) => row.every((cell) => cell !== ""));
  }

  function isEnded(m) {
    return checkWinner(m) !== undefined || checkDraw(m);
  }

  function successors(m) {
    let t = turn(m);
    let succs = [];

    for (let [i, row] of m.entries()) {
      for (let [j, cell] of row.entries()) {
        if (cell === "") {
          let succ = [[...m[0]], [...m[1]], [...m[2]]];
          succ[i][j] = t;
          succs.push(succ);
        }
      }
    }

    return succs;
  }

  function value(m) {
    let winner = checkWinner(m);

    if (winner === player.getMark()) return 1;
    else if (winner === computer.getMark()) return -1;
    else return 0;
  }

  function possibleMoves(m) {
    let moves = [];

    for (let [i, row] of m.entries()) {
      for (let [j, cell] of row.entries()) {
        if (cell === "") moves.push([i, j]);
      }
    }

    return moves;
  }

  function minimax(m) {
    if (isEnded(m)) return value(m);

    let x = -1;
    let y = 1;

    successors(m).forEach((succ) => {
      if (turn(m) === player.getMark()) x = Math.max(x, minimax(succ));
      else y = Math.min(y, minimax(succ));
    });

    return turn(m) === player.getMark() ? x : y;
  }

  function makeMove() {
    if (GameSession.getTurn() !== computer) return;

    let m = GameBoard.asMatrix();
    let bestMove;
    let bestSuccessorValue = 1;

    possibleMoves(m).forEach((move) => {
      let [i, j] = move;
      let succ = [[...m[0]], [...m[1]], [...m[2]]];
      succ[i][j] = "O";
      let succValue = minimax(succ);
      if (succValue < bestSuccessorValue) {
        bestMove = move;
        bestSuccessorValue = succValue;
      }
    });

    console.log(bestMove);
    GameSession.makeMove(computer, bestMove);
  }

  return { makeMove };
})();

const GameSession = (() => {
  let winner;
  let turn = player;
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

  function makeMove(p, pos) {
    if (winner || draw) return;
    if (p !== turn) return;

    let mark = p.getMark();
    let wasPlaced = GameBoard.placeMark(mark, pos);
    if (wasPlaced) {
      if (GameBoard.checkWinner()) {
        setWinner(p);
        p.incrementScore();
      } else if (GameBoard.checkFull()) {
        setDraw();
      } else {
        setTurn(turn == player ? computer : player);
        console.log(`Current turn ${turn.getName()}`);
      }
    }
  }

  function reset() {
    GameBoard.reset();
    turn = player;
    winner = undefined;
    draw = false;
    setTurn(player);
  }

  return { getTurn, getDraw, getWinner, makeMove, reset };
})();

const resetButton = document.querySelector("#reset");
const scoresDisplay = document.querySelector("#scores");
const resultDisplay = document.querySelector("#result");
const cells = document.querySelectorAll(".game-grid-cell");

function updateScores() {
  scoresDisplay.textContent = `${player.getName()} ${player.getScore()} - ${computer.getScore()} ${computer.getName()}`;
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

  GameSession.makeMove(player, [x, y]);
  renderBoard();

  winner = GameSession.getWinner();
  if (winner || GameSession.getDraw()) {
    finishGame(winner);
  }

  setTimeout(() => {
    Computer.makeMove();
    renderBoard();
    winner = GameSession.getWinner();
    if (winner || GameSession.getDraw()) {
      finishGame(winner);
    }
  }, 500);
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
