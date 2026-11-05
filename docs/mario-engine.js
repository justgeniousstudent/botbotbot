const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Базовые настройки
const TILE_SIZE = 32;
const GRAVITY = 0.5;
const JUMP_FORCE = -11;
const SPEED = 4;

canvas.width = 800;
canvas.height = 480;

// Карта уровня (1 - земля, 2 - кирпич, 3 - вопрос, 4 - труба, 5 - монета)
const levelMap = [
    "                                                                                                                                                ",
    "                                                                                                                                                ",
    "                                                                                                                                                ",
    "                                                                                                                                                ",
    "                                                                                                                                                ",
    "                                                                                                                                                ",
    "                                                                                  3                                             ",
    "                                                                                                                                                ",
    "                      3                  22        3                                                                                             ",
    "                                       2222                      44                                                                             ",
    "                                                                 44                                                                             ",
    "                     11             11       11    11           44              11                                                              ",
    "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
];

let player = { x: 100, y: 100, w: 24, h: 32, vx: 0, vy: 0, isGrounded: false, facingRight: true };
let cameraX = 0;
let keys = { left: false, right: false, jump: false };
let platforms = [];
let coins = [];

// Парсинг карты
levelMap.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
        let char = row[x];
        if (char === '1' || char === '2' || char === '3' || char === '4') {
            platforms.push({ x: x * TILE_SIZE, y: y * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE, type: char });
        } else if (char === '5') {
            coins.push({ x: x * TILE_SIZE + TILE_SIZE/2, y: y * TILE_SIZE + TILE_SIZE/2, r: 8, collected: false });
        }
    }
});

function update() {
    // Горизонтальное движение
    player.vx = 0;
    if (keys.left) { player.vx = -SPEED; player.facingRight = false; }
    if (keys.right) { player.vx = SPEED; player.facingRight = true; }

    // Прыжок
    if (keys.jump && player.isGrounded) {
        player.vy = JUMP_FORCE;
        player.isGrounded = false;
    }

    // Гравитация
    player.vy += GRAVITY;
    player.x += player.vx;
    player.y += player.vy;

    // Коллизии с платформами
    player.isGrounded = false;
    platforms.forEach(p => {
        // Проверка на пересечение по X и Y
        if (player.x < p.x + p.w && player.x + player.w > p.x &&
            player.y < p.y + p.h && player.y + player.h > p.y) {
            
            // Если падаем на платформу
            if (player.vy > 0 && player.y + player.h - player.vy <= p.y) {
                player.y = p.y - player.h;
                player.vy = 0;
                player.isGrounded = true;
            }
            // Если бьемся головой
            else if (player.vy < 0 && player.y - player.vy >= p.y + p.h) {
                player.y = p.y + p.h;
                player.vy = 0;
                if (p.type === '3') { // Блок с вопросом
                    p.type = '1'; // Превращается в обычный
                }
            }
        }
    });

    // Камера
    if (player.x > canvas.width / 2) {
        cameraX = player.x - canvas.width / 2;
    }
    if (player.x < cameraX) {
        player.x = cameraX;
    }

    // Границы мира
    if (player.y > canvas.height + 200) {
        // Упал в пропасть - респавн
        player.x = 100; player.y = 100; player.vy = 0;
    }
}

function draw() {
    // Небо
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Платформы
    platforms.forEach(p => {
        if (p.type === '1') {
            ctx.fillStyle = "#8B4513"; // Земля
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = "#228B22"; // Трава сверху
            ctx.fillRect(p.x, p.y, p.w, 5);
        } else if (p.type === '2') {
            ctx.fillStyle = "#D2691E"; // Кирпич
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.strokeStyle = "#000"; ctx.strokeRect(p.x, p.y, p.w, p.h);
        } else if (p.type === '3') {
            ctx.fillStyle = "#FFD700"; // Блок с вопросом
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = "#000"; ctx.font = "20px Arial"; ctx.fillText("?", p.x + 10, p.y + 24);
        } else if (p.type === '4') {
            ctx.fillStyle = "#008000"; // Труба
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }
    });

    // Игрок (пока просто красный квадрат с глазами)
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = "#FFF";
    let eyeX = player.facingRight ? player.x + 16 : player.x + 4;
    ctx.fillRect(eyeX, player.y + 8, 4, 4);

    ctx.restore();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Управление с клавиатуры
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') keys.jump = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') keys.jump = false;
});

// Управление с кнопок на экране
document.getElementById('btn-left').addEventListener('touchstart', () => keys.left = true);
document.getElementById('btn-left').addEventListener('touchend', () => keys.left = false);
document.getElementById('btn-right').addEventListener('touchstart', () => keys.right = true);
document.getElementById('btn-right').addEventListener('touchend', () => keys.right = false);
document.getElementById('btn-jump').addEventListener('touchstart', () => keys.jump = true);
document.getElementById('btn-jump').addEventListener('touchend', () => keys.jump = false);

// Мышь для ПК (на всякий случай)
document.getElementById('btn-left').addEventListener('mousedown', () => keys.left = true);
document.getElementById('btn-left').addEventListener('mouseup', () => keys.left = false);
document.getElementById('btn-right').addEventListener('mousedown', () => keys.right = true);
document.getElementById('btn-right').addEventListener('mouseup', () => keys.right = false);
document.getElementById('btn-jump').addEventListener('mousedown', () => keys.jump = true);
document.getElementById('btn-jump').addEventListener('mouseup', () => keys.jump = false);

loop();
