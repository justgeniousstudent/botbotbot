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
  if (unlimited) { document.getElementById('timer').textContent = '✅ Безлимит'; return; }
  let m = Math.floor(timeLeft/60), s = timeLeft%60;
  document.getElementById('timer').textContent = `⏳ Пробный: ${m}:${s.toString().padStart(2,'0')}`;
}

function startTimer() {
  if (unlimited || timerId) return;
  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) { 
        clearInterval(timerId); 
        timerId = null; 
        show('pay'); 
    }
  }, 1000);
}

document.querySelectorAll('.game-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!unlimited && timeLeft <= 0) { show('pay'); return; }
    
    let gameContent = '';
    const btnText = btn.textContent;
    
    if (btnText.includes('Змейка')) {
        gameContent = `<iframe src="snake.html" style="width:100%; height:100%; border:none; border-radius:20px;"></iframe>`;
    } else if (btnText.includes('Flappy')) {
        gameContent = `<iframe src="flappy.html" style="width:100%; height:100%; border:none; border-radius:20px;"></iframe>`;
    } else if (btnText.includes('2048')) {
        gameContent = `<iframe src="2048.html" style="width:100%; height:100%; border:none; border-radius:20px;"></iframe>`;
    } else if (btnText.includes('Тетрис')) {
        gameContent = `<iframe src="tetris.html" style="width:100%; height:100%; border:none; border-radius:20px;"></iframe>`;
    } else {
        gameContent = `<h2>${btnText}</h2><p>Игра будет здесь</p>`;
    }
    
    document.getElementById('game-box').innerHTML = gameContent;
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
