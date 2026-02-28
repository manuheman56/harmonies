const ANIMALS = [
  "abeja","alce","ardilla","bisonte","buho","camaleon","ciervo","conejo",
  "erizo","fennec","flamenco","foca","halcon","jabali","leon","lobo",
  "mapache","marmota","nutria","oso","panda","pato","puma","rana",
  "raton","serpiente","tigre","topo","tortuga","vaca","zorro","ciervo2"
].map(id => ({
  id,
  img: `assets/animals/${id}.webp`
}));

const players = Array.from({ length: 4 }, (_, i) => ({
  name: `Jugador ${i+1}`,
  animals: [],
  trees: { t1:0, t2:0, t3:0 },
  mountains: { h2:0, h3:0 },
  fields: 0,
  buildings: 0,
  water: { side:"A", value:0 },
  spirits: 0
}));

let active = 0;

function startApp(){
  document.getElementById("coverScreen").style.display="none";
}

function setVal(cat,key,val){
  players[active][cat][key]=Number(val)||0;
  recalc();
}

function addAnimal(){
  const v = Number(prompt("Valor del espacio vacío más alto (0 si llena):",0));
  if(isNaN(v))return;
  players[active].animals.push(v);
  recalc();
}

function score(p){
  return (
    p.animals.reduce((a,b)=>a+b,0) +
    p.trees.t1*1 + p.trees.t2*3 + p.trees.t3*7 +
    p.mountains.h2*3 + p.mountains.h3*7 +
    p.fields*5 + p.buildings*5 +
    (p.water.side==="B"
      ? Math.max(1,p.water.value)*5
      : p.water.value<=6
        ? [0,0,2,5,8,11,15][p.water.value]||0
        : 15+(p.water.value-6)*4
    ) +
    Number(p.spirits)
  );
}

function recalc(){
  renderPlayers();
  renderRanking();
}

function renderPlayers(){
  document.getElementById("playersContainer").innerHTML =
    players.map((p,i)=>`
      <div class="p-3 rounded-xl ${i===active?"bg-emerald-200":"bg-gray-100"}">
        <input value="${p.name}" class="font-bold w-full bg-transparent"
          onchange="players[${i}].name=this.value; recalc()">
        <button onclick="active=${i}; recalc()" class="text-xs underline">
          Seleccionar
        </button>
        <div class="text-sm mt-1">Total: ${score(p)} pts</div>
      </div>
    `).join("");
}

function renderAnimals(){
  document.getElementById("animalButtons").innerHTML =
    ANIMALS.map(a=>`
      <button onclick="addAnimal()"
        class="animal-btn bg-white rounded-xl shadow p-2 active:scale-95">
        <img src="${a.img}" alt="${a.id}"
             class="animal-img">
      </button>
    `).join("");
}

function renderRanking(){
  const medals=["🥇","🥈","🥉"];
  document.getElementById("rankingList").innerHTML =
    [...players].map(p=>({name:p.name,pts:score(p)}))
    .sort((a,b)=>b.pts-a.pts)
    .map((p,i)=>`
      <div class="flex justify-between bg-gray-100 p-2 rounded-xl">
        <span>${medals[i]||"🎖️"} ${p.name}</span>
        <strong>${p.pts}</strong>
      </div>
    `).join("");
}

renderPlayers();
renderAnimals();
renderRanking();