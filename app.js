let state = { players: [], selectedAnimals: [], currentPlayerIndex: 0 };

const showScreen = (id) => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

document.getElementById('welcome-start-btn').onclick = () => showScreen('screen-players');

document.querySelectorAll('.player-count').forEach(btn => {
    btn.onclick = () => {
        const count = parseInt(btn.dataset.count);
        const container = document.getElementById('names-container');
        container.innerHTML = '';
        for(let i=0; i<count; i++) {
            container.innerHTML += `<input type="text" placeholder="Jugador ${i+1}" class="name-in">`;
        }
        showScreen('screen-names');
    };
});

document.getElementById('names-continue').onclick = () => {
    const inputs = document.querySelectorAll('.name-in');
    state.players = Array.from(inputs).map(inp => ({
        name: inp.value || "Herrera Rubia",
        scores: {}, animalCubes: {}, spiritId: "", total: 0
    }));
    renderAnimalSelection();
    showScreen('screen-animals');
};

function renderAnimalSelection() {
    const container = document.getElementById('animal-selection');
    container.innerHTML = animals.map(a => `
        <div class="animal-item" id="item-${a.id}" onclick="toggleAnimal('${a.id}')">
            <div style="font-size:2rem">🐾</div><span>${a.name}</span>
        </div>
    `).join('');
}

window.toggleAnimal = (id) => {
    const idx = state.selectedAnimals.indexOf(id);
    if(idx > -1) state.selectedAnimals.splice(idx, 1);
    else state.selectedAnimals.push(id);
    document.getElementById(`item-${id}`).classList.toggle('selected');
};

document.getElementById('animals-continue').onclick = () => {
    const container = document.getElementById('spirits-assign-container');
    container.innerHTML = state.players.map((p, i) => `
        <div class="card">
            <label>${p.name}:</label>
            <select id="sp-${i}" style="width:100%; padding:10px; margin-top:5px; border-radius:8px">
                <option value="">Sin Espíritu</option>
                ${spirits.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
        </div>
    `).join('');
    showScreen('screen-spirits');
};

document.getElementById('spirits-continue').onclick = () => {
    state.players.forEach((p, i) => p.spiritId = document.getElementById(`sp-${i}`).value);
    startScoring();
};

function startScoring() {
    const p = state.players[state.currentPlayerIndex];
    document.getElementById('score-player-name').innerText = `Puntos de ${p.name}`;
    renderHabitants();
    renderAnimalScoring();
    showScreen('score-screen');
    updateLiveTotal();
}

function renderHabitants() {
    const container = document.getElementById('habitats-container');
    container.innerHTML = habitats.map(h => `
        <div class="counter-row">
            <span>${h.icon} ${h.name}</span>
            <div style="display:flex; align-items:center">
                <button class="btn-qty" onclick="changeH('${h.id}', -1)">-</button>
                <span style="margin: 0 12px; font-weight:bold">${state.players[state.currentPlayerIndex].scores[h.id] || 0}</span>
                <button class="btn-qty" onclick="changeH('${h.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

function renderAnimalScoring() {
    const container = document.getElementById('animals-container');
    container.innerHTML = state.selectedAnimals.map(id => {
        const a = animals.find(x => x.id === id);
        const cubes = state.players[state.currentPlayerIndex].animalCubes[id] || 0;
        return `<div class="counter-row">
            <span>🐾 ${a.name}</span>
            <div style="display:flex; align-items:center">
                <button class="btn-qty" onclick="changeA('${id}', -1)">-</button>
                <span style="margin: 0 12px; font-weight:bold">${cubes}</span>
                <button class="btn-qty" onclick="changeA('${id}', 1)">+</button>
            </div>
        </div>`;
    }).join('');
}

window.changeH = (id, v) => {
    const p = state.players[state.currentPlayerIndex];
    p.scores[id] = Math.max(0, (p.scores[id] || 0) + v);
    renderHabitants();
    updateLiveTotal();
};

window.changeA = (id, v) => {
    const p = state.players[state.currentPlayerIndex];
    const a = animals.find(x => x.id === id);
    p.animalCubes[id] = Math.max(0, Math.min(a.pts.length, (p.animalCubes[id] || 0) + v));
    renderAnimalScoring();
    updateLiveTotal();
};

function updateLiveTotal() {
    const p = state.players[state.currentPlayerIndex];
    let t = 0;
    habitats.forEach(h => t += (p.scores[h.id] || 0) * h.pts);
    state.selectedAnimals.forEach(id => {
        const a = animals.find(x => x.id === id);
        const c = p.animalCubes[id] || 0;
        if(c > 0) t += a.pts[c-1];
    });
    if(p.spiritId) {
        const s = spirits.find(x => x.id === p.spiritId);
        t += (p.scores[s.link] || 0); 
    }
    p.total = t;
    let b = document.getElementById('live-t') || document.createElement('div');
    b.id = 'live-t'; b.className = 'total-bubble';
    b.innerText = `Subtotal: ${t} pts`;
    if(!document.getElementById('live-t')) document.body.appendChild(b);
}

document.getElementById('confirm-score').onclick = () => {
    state.currentPlayerIndex++;
    if(state.currentPlayerIndex < state.players.length) {
        startScoring();
    } else {
        showResults();
    }
};

function showResults() {
    if(document.getElementById('live-t')) document.getElementById('live-t').remove();
    showScreen('screen-results');
    state.players.sort((a,b) => b.total - a.total);
    document.getElementById('results-list').innerHTML = state.players.map((p, i) => `
        <div class="card" style="text-align:center; ${i===0?'border:3px solid gold':''}">
            <h2 style="margin:0">${i===0?'🏆 ':''}${p.name}</h2>
            <div style="font-size: 2rem; font-weight:bold; color:var(--primary)">${p.total} pts</div>
        </div>
    `).join('');
}