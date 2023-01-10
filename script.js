const gameGrid = document.querySelector("#game-grid");
const textDisplay = document.querySelector("#text-display");
const resetButton = document.querySelector("#reset");
const X = "X";
const O = "O";
const N = "";

const GameBoard = (() => {
  let boardArray = [
    [N, N, N],
    [N, N, N],
    [N, N, N],
  ];

  let availableCells = 9;

  const render = () => {
    gameGrid.innerHTML = "";
    for (const [i, row] of boardArray.entries()) {
      for (const [j, element] of row.entries()) {
        let cell = document.createElement("div");
        gameGrid.appendChild(cell);
        cell.classList.add("game-grid-cell");
        cell.textContent = element;
        cell.addEventListener("click", () => GameSession.makeMove(i, j));
      }
    }
  };

  const placeMark = (mark, x, y) => {
    if (x < 0 || x > 2 || y < 0 || y > 2) return false;
    if (boardArray[x][y] != N) return false;

    boardArray[x][y] = mark;
    availableCells--;
    return true;
  };

  const checkWinner = () => {
    let winnerMark;

    // Check rows
    for (const row of boardArray) {
      if (row[0] == row[1] && row[1] == row[2]) {
        winnerMark = row[0];
        break;
      }
    }

    // Check columns
    let b = boardArray;
    for (let j = 0; j < 3; j++) {
      if (b[0][j] == b[1][j] && b[1][j] == b[2][j]) {
        winnerMark = b[0][j];
        break;
      }
    }

    // Check main diagonal
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) winnerMark = b[0][0];

    // Check the other diagonal
    if (b[2][0] == b[1][1] && b[1][1] == b[0][2]) winnerMark = b[2][0];

    return winnerMark;
  };

  const reset = () => {
    boardArray = [
      [N, N, N],
      [N, N, N],
      [N, N, N],
    ];
    availableCells = 9;
    render();
  };

  const checkFull = () => availableCells == 0;

  return { placeMark, checkWinner, checkFull, reset, render };
})();

const Player = (name, mark) => {
  const getMark = () => mark;
  const getName = () => name;

  return { getName, getMark };
};

let home = Player(prompt("Name of the first player") || "Player 1", X);
let away = Player(prompt("Name of the second player") || "Player 2", O);

const GameSession = (() => {
  let turn;
  let winner;

  const getTurn = () => turn;

  const setTurn = (player) => {
    turn = player;
    textDisplay.textContent = `playing: ${player.getName()}`;
  };

  setTurn(home);

  const setWinner = (player) => {
    winner = player;
    displayWinner(player);
    resetButton.classList.remove("hidden");
  };

  const displayWinner = (winner) => {
    textDisplay.textContent = `winner: ${winner.getName()}`;
  };

  const setDraw = () => {
    textDisplay.textContent = `draw!`;
    resetButton.classList.remove("hidden");
  }

  const makeMove = (x, y) => {
    if (winner || GameBoard.checkFull()) return;
    let success = GameBoard.placeMark(turn.getMark(), x, y);
    if (success) {
      GameBoard.render()
      let winnerMark = GameBoard.checkWinner();
      if (winnerMark) {
        setWinner(home.getMark() == winnerMark ? home : away);
      } else if (GameBoard.checkFull()) {
        setDraw();
      } else {
        setTurn(turn == home ? away : home);
      }
    }
  };

  const reset = () => {
    GameBoard.reset();
    turn = home;
    winner = undefined;
    setTurn(home);
    resetButton.classList.add("hidden");
  };

  return { getTurn, makeMove, reset };
})();

GameBoard.render();
resetButton.addEventListener("click", GameSession.reset);
