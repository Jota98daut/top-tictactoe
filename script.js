const gameGrid = document.querySelector("#game-grid");
const turnDisplay = document.querySelector("#turn-display");
const X = "X";
const O = "O";
const N = "";

const GameBoard = (() => {
  let boardArray = [
    [N,N,N],
    [N,N,N],
    [N,N,N],
  ];

  const getBoardArray = () => {
    let arrayCopy = [];
    for (let i = 0; i < 3; i++) arrayCopy.push([...boardArray[i]]);
    return arrayCopy;
  };

  const placeMark = (mark, x, y) => {
    if (x < 0 || x > 2 || y < 0 || y > 2) return false;
    if (boardArray[x][y] != N) return false;
    if (mark != X && mark != O) return false;

    boardArray[x][y] = mark;
    return true;
  };

  return { getBoardArray, placeMark };
})();

const Player = (name, mark) => {
  const getMark = () => mark;
  const getName = () => name;

  return { getName, getMark };
};

let home = Player('joel', X);
let away = Player('juan', O);

const GameSession = (() => {
  let turn = home;
  turnDisplay.textContent = turn.getName();

  const getTurn = () => turn;

  const makeMove = (x, y) => {
    let success = GameBoard.placeMark(turn.getMark(), x, y);
    if (success) {
      turn = turn == home ? away : home;
      renderBoard(GameBoard.getBoardArray());
      turnDisplay.textContent = turn.getName();
    }
  };

  return { getTurn, makeMove };
})();

function renderBoard(boardArray) {
  gameGrid.innerHTML = "";
  for (const [i, row] of boardArray.entries()) {
    for (const [j, element] of row.entries()) {
      let cell = document.createElement("div");
      gameGrid.appendChild(cell);
      cell.classList.add("game-grid-cell");
      cell.textContent = element;
      cell.addEventListener('click', () => GameSession.makeMove(i, j));
    }
  }
}

renderBoard(GameBoard.getBoardArray());
