let tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const TRIAL = 600;
let timeLeft = TRIAL;
let timerId = null;
let unlimited = localStorage.getItem('unlimited') === 'true';

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function updateTimer() {
  if (unlimited) { document.getElementById('timer').textContent = '✅ Безлимит активен'; return; }
  let m = Math.floor(timeLeft/60), s = timeLeft%60;
  document.getElementById('timer').textContent = `⏳ Пробный: ${m}:${s.toString().padStart(2,'0')}`;
}

function startTimer() {
  if (unlimited || timerId) return;
  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) { clearInterval(timerId); timerId = null; show('pay'); }
  }, 1000);
}

document.querySelectorAll('.game-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!unlimited && timeLeft <= 0) { show('pay'); return; }
    
    let src = '';
    const txt = btn.textContent;
    if (txt.includes('Змейка')) src = 'snake.html';
   else if (txt.includes('Марио')) src = 'mario.html';
    else if (txt.includes('Flappy')) src = 'flappy.html';
    else if (txt.includes('2048')) src = '2048.html';
    else if (txt.includes('Тетрис')) src = 'tetris.html';
    else if (txt.includes('Понг')) src = 'pong.html';
    else if (txt.includes('Арканоид')) src = 'breakout.html';
    else if (txt.includes('Инвейдеры')) src = 'invaders.html';
    else if (txt.includes('Память')) src = 'memory.html';
    else if (txt.includes('Кликер')) src = 'clicker.html';

    if (src) {
        document.getElementById('game-box').innerHTML = `<iframe src="${src}"></iframe>`;
    } else {
        document.getElementById('game-box').innerHTML = `<h2 style="text-align:center; margin-top:50px;">В разработке...</h2>`;
    }
    
    show('game');
    startTimer();
  });
});

document.getElementById('back').addEventListener('click', () => {
    document.getElementById('game-box').innerHTML = '';
    show('menu');
});

document.getElementById('pay-btn').addEventListener('click', () => {
  alert('Имитация оплаты 20 ⭐');
  unlimited = true;
  localStorage.setItem('unlimited','true');
  updateTimer(); show('menu');
  if (timerId) { clearInterval(timerId); timerId = null; }
});

updateTimer();
