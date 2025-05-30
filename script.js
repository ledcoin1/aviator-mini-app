const plane = document.getElementById("plane");
const coefText = document.getElementById("coefficient");
const balanceEl = document.getElementById("balance");
const betInput = document.getElementById("bet");
const startBtn = document.getElementById("startBtn");
const cashOutBtn = document.getElementById("cashOutBtn");
const historyEl = document.getElementById("history");

const bgMusic = document.getElementById("bgMusic");
const beep = document.getElementById("beep");

let balance = 1000;
let bet = 0;
let coefficient = 1.00;
let interval;
let crashed = false;
let started = false;
let planeY = 10;

function startGame() {
  bet = parseFloat(betInput.value);
  if (isNaN(bet) || bet <= 0 || bet > balance) return alert("Некорректная ставка");

  coefficient = 1.00;
  crashed = false;
  started = true;
  planeY = 10;
  updateUI();

  balance -= bet;
  balanceEl.textContent = balance;

  bgMusic.play();
  startBtn.disabled = true;
  cashOutBtn.disabled = false;

  interval = setInterval(() => {
    coefficient += 0.01;
    coefText.textContent = `${coefficient.toFixed(2)}x`;

    planeY += 2;
    plane.style.transform = `translateY(-${planeY}px)`;

    // Рандомный краш
    if (Math.random() < 0.01 + coefficient / 200) {
      crash();
    }
  }, 50);
}

function crash() {
  clearInterval(interval);
  crashed = true;
  cashOutBtn.disabled = true;
  startBtn.disabled = false;
  bgMusic.pause();
  beep.play();
  logHistory(coefficient.toFixed(2), false);
  alert(`💥 Самолет упал! Коэффициент: ${coefficient.toFixed(2)}x`);
}

function cashOut() {
  if (!started || crashed) return;

  clearInterval(interval);
  const win = (bet * coefficient).toFixed(2);
  balance += parseFloat(win);
  balanceEl.textContent = balance;
  cashOutBtn.disabled = true;
  startBtn.disabled = false;
  bgMusic.pause();
  beep.play();
  logHistory(coefficient.toFixed(2), true);
  alert(`✅ Забрано: ${win} TON при ${coefficient.toFixed(2)}x`);
}

function updateUI() {
  coefText.textContent = "1.00x";
  plane.style.transform = "translateY(0px)";
}

function logHistory(coef, won) {
  const li = document.createElement("li");
  li.textContent = `${won ? "✅" : "💥"} ${coef}x`;
  historyEl.prepend(li);
}

startBtn.onclick = startGame;
cashOutBtn.onclick = cashOut;
