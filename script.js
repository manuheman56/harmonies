const ANIMALS = [
  { id: "abeja", name: "Abeja", img: "assets/animals/abeja.webp" },
  { id: "alce", name: "Alce", img: "assets/animals/alce.webp" },
  { id: "ardilla", name: "Ardilla", img: "assets/animals/ardilla.webp" },
  { id: "buho", name: "Búho", img: "assets/animals/buho.webp" },
  { id: "buitre", name: "Buitre", img: "assets/animals/buitre.webp" },
  { id: "cabra_montesa", name: "Cabra montesa", img: "assets/animals/cabra_montesa.webp" },
  { id: "castor", name: "Castor", img: "assets/animals/castor.webp" },
  { id: "ciguena", name: "Cigüeña", img: "assets/animals/ciguena.webp" },
  { id: "cocodrilo", name: "Cocodrilo", img: "assets/animals/cocodrilo.webp" },
  { id: "conejo", name: "Conejo", img: "assets/animals/conejo.webp" },
  { id: "cuervo", name: "Cuervo", img: "assets/animals/cuervo.webp" },
  { id: "erizo", name: "Erizo", img: "assets/animals/erizo.webp" },
  { id: "flamenco", name: "Flamenco", img: "assets/animals/flamenco.webp" },
  { id: "gato", name: "Gato", img: "assets/animals/gato.webp" },
  { id: "jabali", name: "Jabalí", img: "assets/animals/jabali.webp" },
  { id: "jilguero", name: "Jilguero", img: "assets/animals/jilguero.webp" },
  { id: "koala", name: "Koala", img: "assets/animals/koala.webp" },
  { id: "lagarto", name: "Lagarto", img: "assets/animals/lagarto.webp" },
  { id: "leon", name: "León", img: "assets/animals/leon.webp" },
  { id: "libelula", name: "Libélula", img: "assets/animals/libelula.webp" },
  { id: "llama", name: "Llama", img: "assets/animals/llama.webp" },
  { id: "lobo", name: "Lobo", img: "assets/animals/lobo.webp" },
  { id: "loro", name: "Loro", img: "assets/animals/loro.webp" },
  { id: "mandril", name: "Mandril", img: "assets/animals/mandril.webp" },
  { id: "manta_raya", name: "Manta raya", img: "assets/animals/manta_raya.webp" },
  { id: "mapache", name: "Mapache", img: "assets/animals/mapache.webp" },
  { id: "mariposa", name: "Mariposa", img: "assets/animals/mariposa.webp" },
  { id: "mariquita", name: "Mariquita", img: "assets/animals/mariquita.webp" },
  { id: "murcielago", name: "Murciélago", img: "assets/animals/murcielago.webp" },
  { id: "musarana", name: "Musaraña", img: "assets/animals/musarana.webp" },
  { id: "nutria", name: "Nutria", img: "assets/animals/nutria.webp" },
  { id: "oso", name: "Oso", img: "assets/animals/oso.webp" },
  { id: "oso_polar", name: "Oso polar", img: "assets/animals/oso_polar.webp" },
  { id: "pato", name: "Pato", img: "assets/animals/pato.webp" },
  { id: "pavo_real", name: "Pavo real", img: "assets/animals/pavo_real.webp" },
  { id: "pinguinos", name: "Pingüinos", img: "assets/animals/pinguinos.webp" },
  { id: "puma", name: "Puma", img: "assets/animals/puma.webp" },
  { id: "rana", name: "Rana", img: "assets/animals/rana.webp" },
  { id: "salmon", name: "Salmón", img: "assets/animals/salmon.webp" },
  { id: "suricatos", name: "Suricatos", img: "assets/animals/suricatos.webp" },
  { id: "tortuga", name: "Tortuga", img: "assets/animals/tortuga.webp" },
  { id: "zorro", name: "Zorro", img: "assets/animals/zorro.webp" }
];
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