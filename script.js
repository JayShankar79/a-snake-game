const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

const playerColors = ["#ff006e", "#06d6a0", "#ffbe0b", "#3a86ff"];

const boardEl = document.getElementById("board");
const rollBtn = document.getElementById("rollBtn");
const newGameBtn = document.getElementById("newGameBtn");
const playerCountEl = document.getElementById("playerCount");
const diceEl = document.getElementById("dice");
const turnInfoEl = document.getElementById("turnInfo");
const eventInfoEl = document.getElementById("eventInfo");
const scoreboardEl = document.getElementById("scoreboard");

let players = [];
let currentPlayerIndex = 0;
let gameOver = false;

function boardOrder() {
  const order = [];
  for (let row = 9; row >= 0; row--) {
    const start = row * 10 + 1;
    const end = row * 10 + 10;
    if ((9 - row) % 2 === 0) {
      for (let n = start; n <= end; n++) {
        order.push(n);
      }
    } else {
      for (let n = end; n >= start; n--) {
        order.push(n);
      }
    }
  }
  return order;
}

function createBoard() {
  boardEl.innerHTML = "";
  boardOrder().forEach((num) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.cell = num;

    const number = document.createElement("div");
    number.className = "cell-number";
    number.textContent = num;

    const portal = document.createElement("div");
    portal.className = "portal";
    if (snakes[num]) {
      portal.classList.add("snake");
      portal.textContent = `🐍 ${snakes[num]}`;
    } else if (ladders[num]) {
      portal.classList.add("ladder");
      portal.textContent = `🪜 ${ladders[num]}`;
    }

    const tokens = document.createElement("div");
    tokens.className = "tokens";

    cell.append(number, portal, tokens);
    boardEl.appendChild(cell);
  });
}

function initPlayers(count) {
  players = Array.from({ length: count }, (_, i) => ({
    name: `Player ${i + 1}`,
    color: playerColors[i],
    position: 0,
  }));
  currentPlayerIndex = 0;
  gameOver = false;
}

function renderPlayers() {
  document.querySelectorAll(".tokens").forEach((el) => {
    el.innerHTML = "";
  });

  players.forEach((player) => {
    const cellNum = Math.max(player.position, 1);
    const slot = document.querySelector(`.cell[data-cell='${cellNum}'] .tokens`);
    if (!slot) return;

    const token = document.createElement("span");
    token.className = "token";
    token.style.backgroundColor = player.color;
    token.title = `${player.name}: ${player.position}`;
    slot.appendChild(token);
  });
}

function renderStatus(eventText = "") {
  const player = players[currentPlayerIndex];
  if (gameOver) {
    turnInfoEl.textContent = "Game over! Start a new game to play again.";
  } else {
    turnInfoEl.textContent = `${player.name}'s turn.`;
  }
  eventInfoEl.textContent = eventText;

  scoreboardEl.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<span style='color:${p.color};font-weight:700'>● ${p.name}</span> — Position: ${p.position}`;
    scoreboardEl.appendChild(li);
  });
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function playTurn() {
  if (gameOver) return;

  const player = players[currentPlayerIndex];
  const dice = rollDice();
  diceEl.textContent = dice;

  let nextPos = player.position + dice;
  let message = `${player.name} rolled ${dice}.`;

  if (nextPos > 100) {
    message += " Need exact roll to reach 100.";
  } else {
    player.position = nextPos;

    if (ladders[player.position]) {
      const end = ladders[player.position];
      message += ` Climbed a ladder to ${end}!`;
      player.position = end;
    } else if (snakes[player.position]) {
      const end = snakes[player.position];
      message += ` Bitten by a snake down to ${end}!`;
      player.position = end;
    }

    if (player.position === 100) {
      message += ` ${player.name} wins! 🎉`;
      gameOver = true;
      rollBtn.disabled = true;
    }
  }

  renderPlayers();
  renderStatus(message);

  if (!gameOver) {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    renderStatus(message);
  }
}

function newGame() {
  const count = Number(playerCountEl.value);
  initPlayers(count);
  createBoard();
  renderPlayers();
  diceEl.textContent = "-";
  rollBtn.disabled = false;
  renderStatus("New colorful game started!");
}

rollBtn.addEventListener("click", playTurn);
newGameBtn.addEventListener("click", newGame);
playerCountEl.addEventListener("change", newGame);

newGame();
