const trie = new Trie();

let grid = [];
let letters = [];
let selected = [];
let word = "";
let score = 0;

async function loadDictionary() {
  const res = await fetch("words.txt");
  const txt = await res.text();

  txt.split("\n").forEach(w => {
    w = w.trim().toUpperCase();
    if (w.length >= 3) trie.insert(w.replace("QU","Q"));
  });
}

function randomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random()*alphabet.length)];
}

function generateGrid() {
  const g = document.getElementById("grid");
  g.innerHTML = "";
  grid = [];
  letters = [];

  for (let i = 0; i < 16; i++) {
    let l = randomLetter();
    if (l === "Q") l = "QU";

    letters.push(l.replace("QU","Q"));

    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = l;
    cell.dataset.index = i;
    g.appendChild(cell);
    grid.push(cell);
  }
}

function isAdjacent(a,b){
  const i1=+a.dataset.index, i2=+b.dataset.index;
  const x1=i1%4,y1=Math.floor(i1/4);
  const x2=i2%4,y2=Math.floor(i2/4);
  return Math.abs(x1-x2)<=1 && Math.abs(y1-y2)<=1;
}

function drawLine(){
  const c=document.getElementById("canvas");
  const ctx=c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);

  ctx.strokeStyle="#007aff";
  ctx.lineWidth=6;
  ctx.beginPath();

  selected.forEach((el,i)=>{
    const r=el.getBoundingClientRect();
    const p=document.getElementById("game").getBoundingClientRect();
    const x=r.left-p.left+r.width/2;
    const y=r.top-p.top+r.height/2;
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });

  ctx.stroke();
}

function resetSelection(){
  selected.forEach(c=>c.classList.remove("active"));
  selected=[];
  word="";
  drawLine();
  updateWord();
}

function updateWord(){
  document.getElementById("word").textContent=word;
}

document.addEventListener("touchmove", e=>{
  const t=e.touches[0];
  const el=document.elementFromPoint(t.clientX,t.clientY);

  if(el && el.classList.contains("cell")){
    if(selected.includes(el)) return;

    if(selected.length===0 || isAdjacent(selected.at(-1),el)){
      const letter = el.textContent === "QU" ? "Q" : el.textContent;
      word += letter;

      if (!trie.isPrefix(word)) return;

      selected.push(el);
      el.classList.add("active");
      updateWord();
      drawLine();
      if(navigator.vibrate) navigator.vibrate(10);
    }
  }
});

document.addEventListener("touchend", ()=>{
  if(trie.isWord(word)){
    score += getScore(word);
    document.getElementById("score").textContent=score+" punti";
  }
  setTimeout(resetSelection,200);
});

function getScore(w){
  const l=w.length;
  if(l<=4) return 1;
  if(l===5) return 2;
  if(l===6) return 3;
  if(l===7) return 5;
  return 11;
}

function showSolutions(){
  const sol = solveBoard(letters, trie);
  alert("Parole trovate:\n"+sol.join(", "));
}

function startGame(){
  score=0;
  document.getElementById("score").textContent="0 punti";
  generateGrid();
  resetSelection();
}

(async ()=>{
  await loadDictionary();
  startGame();
})();
