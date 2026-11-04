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
    
    // Проверяем, какую игру нажали
    if (btn.textContent.includes('Змейка')) {
        // Загружаем игру Змейка в iframe
        document.getElementById('game-box').innerHTML = `<iframe src="snake.html" style="width:100%; height:100%; border:none; border-radius:20px;"></iframe>`;
    } else {
        // Для остальных игр показываем заглушку
        document.getElementById('game-box').innerHTML = `
            <h2>${btn.textContent}</h2>
            <p>Игра будет здесь</p>
        `;
    }
    
    show('game');
    startTimer();
  });
});

document.getElementById('back').addEventListener('click', () => {
    // Очищаем iframe, чтобы игра остановилась, когда мы выходим в меню
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
