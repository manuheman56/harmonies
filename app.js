let state = { players: [], selectedAnimals: [], currentPlayerIndex: 0 };

const show = (id) => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

document.getElementById('welcome-start-btn').onclick = () => show('screen-players');

document.querySelectorAll('.player-count').forEach(btn => {
    btn.onclick = () => {
        const count = parseInt(btn.dataset.count);
        const container = document.getElementById('names-container');
        container.innerHTML = '';
        for(let i=0; i<count; i++) {
            container.innerHTML += `<input type="text" placeholder="Nombre Arquitecto ${i+1}" class="name-in">`;
        }
        show('screen-names');
    };
});

document.getElementById('names-continue').onclick = () => {
    const inputs = document.querySelectorAll('.name-in');
    state.players = Array.from(inputs).map(inp => ({
        name: inp.value || "Herrera Rubia",
        scores: {}, animalCubes: {}, total: 0
    }));
    renderAnimals();
    show('screen-animals');
};

function renderAnimals() {
    const container = document.getElementById('animal-selection');
    container.innerHTML = animals.map(a => `
        <div class="animal-item" id="item-${a.id}" onclick="toggleA('${a.id}')">
            <div style="font-size:1.5rem">🐾</div><div>${a.name}</div>
        </div>
    `).join('');
}

window.toggleA = (id) => {
    const idx = state.selectedAnimals.indexOf(id);
    if(idx > -1) state.selectedAnimals.splice(idx, 1);
    else state.selectedAnimals.push(id);
    document.getElementById(`item-${id}`).classList.toggle('selected');
};

document.getElementById('animals-continue').onclick = () => startScoring();

function startScoring() {
    const p = state.players[state.currentPlayerIndex];
    document.getElementById('score-player-name').innerText = `Turno de: ${p.name}`;
    renderHabitants();
    renderAnimalCounters();
    show('score-screen');
    updateTotal();
}

function renderHabitants() {
    document.getElementById('habitats-container').innerHTML = habitats.map(h => `
        <div class="counter-row">
            <span>${h.icon} ${h.name}</span>
            <div style="display:flex; align-items:center">
                <button class="btn-qty" onclick="changeH('${h.id}', -1)">-</button>
                <span style="margin: 0 15px; font-weight:bold; min-width:20px; text-align:center">${state.players[state.currentPlayerIndex].scores[h.id] || 0}</span>
                <button class="btn-qty" onclick="changeH('${h.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

function renderAnimalCounters() {
    document.getElementById('animals-container').innerHTML = state.selectedAnimals.map(id => {
        const a = animals.find(x => x.id === id);
        return `<div class="counter-row">
            <span>🐾 ${a.name}</span>
            <div style="display:flex; align-items:center">
                <button class="btn-qty" onclick="changeA('${id}', -1)">-</button>
                <span style="margin: 0 15px; font-weight:bold">${state.players[state.currentPlayerIndex].animalCubes[id] || 0}</span>
                <button class="btn-qty" onclick="changeA('${id}', 1)">+</button>
            </div>
        </div>`;
    }).join('');
}

window.changeH = (id, v) => {
    const p = state.players[state.currentPlayerIndex];
    p.scores[id] = Math.max(0, (p.scores[id] || 0) + v);
    renderHabitants();
    updateTotal();
};

window.changeA = (id, v) => {
    const p = state.players[state.currentPlayerIndex];
    const a = animals.find(x => x.id === id);
    p.animalCubes[id] = Math.max(0, Math.min(a.pts.length, (p.animalCubes[id] || 0) + v));
    renderAnimalCounters();
    updateTotal();
};

function updateTotal() {
    const p = state.players[state.currentPlayerIndex];
    let t = 0;
    habitats.forEach(h => t += (p.scores[h.id] || 0) * h.pts);
    state.selectedAnimals.forEach(id => {
        const a = animals.find(x => x.id === id);
        const c = p.animalCubes[id] || 0;
        if(c > 0) t += a.pts[c-1];
    });
    p.total = t;
    let b = document.getElementById('live-t') || document.createElement('div');
    b.id = 'live-t'; b.className = 'total-bubble';
    b.innerText = `Puntos: ${t}`;
    if(!document.getElementById('live-t')) document.body.appendChild(b);
}

document.getElementById('confirm-score').onclick = () => {
    state.currentPlayerIndex++;
    if(state.currentPlayerIndex < state.players.length) startScoring();
    else {
        if(document.getElementById('live-t')) document.getElementById('live-t').remove();
        show('screen-results');
        state.players.sort((a,b) => b.total - a.total);
        document.getElementById('results-list').innerHTML = state.players.map((p, i) => `
            <div class="card" style="text-align:center">
                <h2>${i===0?'🏆 ':''}${p.name}</h2>
                <div style="font-size: 2rem; font-weight:bold; color:#6ab04c">${p.total} pts</div>
            </div>
        `).join('');
    }
};