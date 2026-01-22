const $ = id => document.getElementById(id);
const screens = document.querySelectorAll(".screen");

const startBtn = $("start-btn");
const playersContinue = $("players-continue");
const namesContainer = $("names-container");
const namesContinue = $("names-continue");
const animalSelection = $("animal-selection");
const animalsContinue = $("animals-continue");
const playerList = $("player-list");
const scorePlayerName = $("score-player-name");
const habitatsContainer = $("habitats-container");
const animalsContainer = $("animals-container");
const confirmScore = $("confirm-score");
const resultsList = $("results-list");

let players = [];
let playerCount = 0;
let currentPlayer = 0;
let enabledAnimals = [];

function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

startBtn.onclick = () => show("screen-players");

document.querySelectorAll(".player-count").forEach(btn => {
  btn.onclick = () => {
    playerCount = +btn.dataset.count;
    document.querySelectorAll(".player-count").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    playersContinue.disabled = false;
  };
});

playersContinue.onclick = () => {
  namesContainer.innerHTML = "";
  for (let i = 0; i < playerCount; i++) {
    namesContainer.innerHTML += `<input placeholder="Jugador ${i + 1}">`;
  }
  show("screen-names");
};

namesContinue.onclick = () => {
  players = [...namesContainer.querySelectorAll("input")]
    .map(i => ({ name: i.value || "Jugador", score: 0 }));

  enabledAnimals = animals.filter(a => a.minPlayers <= playerCount);
  animalSelection.innerHTML = "";

  enabledAnimals.forEach(a => {
    animalSelection.innerHTML += `
      <label>
        <input type="checkbox" checked>
        ${animalIcons[a.id]} ${a.name}
      </label>`;
  });

  show("screen-animals");
};

animalsContinue.onclick = () => {
  playerList.innerHTML = "";
  players.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.className = "secondary";
    btn.textContent = p.name;
    btn.onclick = () => scorePlayer(i);
    playerList.appendChild(btn);
  });
  show("screen-select");
};

function scorePlayer(index) {
  currentPlayer = index;
  scorePlayerName.textContent = players[index].name;
  habitatsContainer.innerHTML = "";
  animalsContainer.innerHTML = "";

  habitats.forEach(h => {
    habitatsContainer.innerHTML += `
      <label>${h.name}
        <input type="number" min="0" data-points="${h.points}">
      </label>`;
  });

  enabledAnimals.forEach(a => {
    animalsContainer.innerHTML += `
      <label>${animalIcons[a.id]} ${a.name}
        <input type="checkbox" data-points="${a.points}">
      </label>`;
  });

  show("screen-score");
}

confirmScore.onclick = () => {
  let total = 0;

  habitatsContainer.querySelectorAll("input")
    .forEach(i => total += i.value * i.dataset.points);

  animalsContainer.querySelectorAll("input:checked")
    .forEach(i => total += +i.dataset.points);

  players[currentPlayer].score = total;

  if (currentPlayer < players.length - 1) {
    show("screen-select");
  } else {
    resultsList.innerHTML = players
      .sort((a, b) => b.score - a.score)
      .map(p => `<p>${p.name}: <strong>${p.score}</strong></p>`)
      .join("");
    show("screen-results");
  }
};
