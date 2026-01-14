const gameContainer = document.getElementById('game');
const resetBtn = document.getElementById('resetBtn');

let bottles = [];
let selectedBottle = null;
const colors = ['#ff595e','#ffca3a','#8ac926','#1982c4','#6a4c93','#ff924c'];

function initGame() {
  gameContainer.innerHTML = '';
  bottles = [];
  selectedBottle = null;

  // Generar colores aleatorios distribuidos entre botellas
  let allColors = [];
  const numColors = 4;
  const numBottles = numColors + 2;

  for (let c = 0; c < numColors; c++) {
    for (let i = 0; i < 4; i++) {
      allColors.push(colors[c]);
    }
  }
  allColors.sort(() => Math.random() - 0.5);

  for (let b = 0; b < numBottles; b++) {
    let bottleColors = allColors.splice(0, 4);
    bottles.push(bottleColors.length ? bottleColors : []);
  }

  renderBottles();
}

function renderBottles() {
  gameContainer.innerHTML = '';
  bottles.forEach((bottleColors, index) => {
    const bottle = document.createElement('div');
    bottle.className = 'bottle';
    bottle.dataset.index = index;

    bottleColors.forEach(color => {
      const seg = document.createElement('div');
      seg.className = 'segment';
      seg.style.background = color;
      bottle.appendChild(seg);
    });

    bottle.addEventListener('click', () => handleBottleClick(index));
    gameContainer.appendChild(bottle);
  });
}

function handleBottleClick(index) {
  const clicked = bottles[index];

  if (!selectedBottle) {
    if (clicked.length === 0) return;
    selectedBottle = index;
    highlightBottle(index, true);
  } else {
    if (index === selectedBottle) {
      highlightBottle(index, false);
      selectedBottle = null;
      return;
    }
    pour(selectedBottle, index);
    highlightBottle(selectedBottle, false);
    selectedBottle = null;
  }
}

function highlightBottle(index, active) {
  const bottle = document.querySelectorAll('.bottle')[index];
  bottle.style.transform = active ? 'scale(1.15)' : 'scale(1)';
}

function pour(fromIdx, toIdx) {
  let from = bottles[fromIdx];
  let to = bottles[toIdx];

  if (from.length === 0) return;
  if (to.length === 4) return;

  const colorToPour = from[from.length - 1];
  const topColor = to[to.length - 1];

  if (to.length === 0 || topColor === colorToPour) {
    from.pop();
    to.push(colorToPour);
    renderBottles();
    checkWin();
  }
}

function checkWin() {
  const isWin = bottles.every(
    b => b.length === 0 || (b.length === 4 && new Set(b).size === 1)
  );
  if (isWin) {
    setTimeout(() => alert('🎉 ¡Nivel completado! 🎉'), 300);
  }
}

resetBtn.addEventListener('click', initGame);
initGame();
