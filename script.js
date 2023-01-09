const gameGrid = document.querySelector("#game-grid");
const X = "X";
const O = "O";
const S = " ";

const GameBoard = (() => {
  let boardArray = [
    [X, O, X],
    [O, X, S],
    [X, S, X],
  ];

  const getBoardArray = () => {
    let arrayCopy = [];
    for (let i = 0; i < 3; i++) arrayCopy.push([...boardArray[i]]);
    return arrayCopy;
  };
  return { getBoardArray };
})();

const Player = () => {
  return {};
};

const GameSession = (() => {
  return {};
})();

function renderBoard(boardArray) {
  for (const row of boardArray) {
    for (const element of row) {
      let cell = document.createElement('div');
      gameGrid.appendChild(cell);
      cell.classList.add('game-grid-cell');
      cell.textContent = element;
    }
  }
}

renderBoard(GameBoard.getBoardArray());
