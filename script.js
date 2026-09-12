const game = document.getElementById("game");
const player = document.getElementById("player");
const hpText = document.getElementById("hp");
const ammoText = document.getElementById("ammo");
const aliveText = document.getElementById("alive");
const zone = document.getElementById("zone");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;

let hp = 100;
let ammo = 30;
let alive = 100;
let gameOver = false;

const enemies = [];

// ================= PLAYER =================

function updatePlayer() {
  player.style.left = x + "px";
  player.style.top = y + "px";
}

function move(direction) {
  if (gameOver) return;

  const speed = 22;

  if (direction === "up") y -= speed;
  if (direction === "down") y += speed;
  if (direction === "left") x -= speed;
  if (direction === "right") x += speed;

  x = Math.max(25, Math.min(window.innerWidth - 25, x));
  y = Math.max(80, Math.min(window.innerHeight - 100, y));

  updatePlayer();
}

// ================= SAFE ZONE =================

let zoneRadius = 350;
let zoneCenterX = window.innerWidth / 2;
let zoneCenterY = window.innerHeight / 2;

function updateZone() {
  zone.style.width = (zoneRadius * 2) + "px";
  zone.style.height = (zoneRadius * 2) + "px";
  zone.style.left = zoneCenterX + "px";
  zone.style.top = zoneCenterY + "px";
}

function checkZone() {
  if (gameOver) return;

  const dx = x - zoneCenterX;
  const dy = y - zoneCenterY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // Player outside safe zone
  if (distance > zoneRadius) {

    hp -= 2;

    if (hp < 0) hp = 0;

    hpText.textContent = hp;

    if (hp <= 0) {
      loseGame();
    }
  }
}

// Zone धीरे-धीरे छोटी होगी
setInterval(() => {

  if (gameOver) return;

  if (zoneRadius > 110) {
    zoneRadius -= 25;
    updateZone();
  }

}, 10000);

// Zone damage
setInterval(checkZone, 1000);

// ================= ENEMY BOTS =================

function createEnemy() {

  const enemy = document.createElement("div");

  enemy.className = "enemy";

  enemy.style.position = "absolute";
  enemy.style.width = "32px";
  enemy.style.height = "58px";
  enemy.style.background = "#20252b";
  enemy.style.border = "2px solid #111";
  enemy.style.borderRadius = "8px";
  enemy.style.zIndex = "18";

  const head = document.createElement("div");

  head.style.width = "18px";
  head.style.height = "18px";
  head.style.background = "#b97855";
  head.style.borderRadius = "50%";
  head.style.margin = "3px auto";

  enemy.appendChild(head);

  let ex = Math.random() * (window.innerWidth - 100) + 50;
  let ey = Math.random() * (window.innerHeight - 180) + 100;

  enemy.style.left = ex + "px";
  enemy.style.top = ey + "px";

  game.appendChild(enemy);

  enemies.push({
    element: enemy,
    x: ex,
    y: ey,
    hp: 100
  });
}

// Prototype bots
for (let i = 0; i < 12; i++) {
  createEnemy();
}

// ================= SHOOTING =================

function shoot() {

  if (gameOver) return;

  if (ammo <= 0) {
    alert("Ammo खत्म!");
    return;
  }

  ammo--;
  ammoText.textContent = ammo;

  let nearest = null;
  let nearestDistance = Infinity;

  enemies.forEach(enemy => {

    if (enemy.hp <= 0) return;

    const dx = enemy.x - x;
    const dy = enemy.y - y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = enemy;
    }
  });

  const bullet = document.createElement("div");

  bullet.style.position = "absolute";
  bullet.style.width = "7px";
  bullet.style.height = "7px";
  bullet.style.borderRadius = "50%";
  bullet.style.background = "#ffd000";
  bullet.style.left = x + "px";
  bullet.style.top = y + "px";
  bullet.style.zIndex = "40";

  game.appendChild(bullet);

  let bx = x;
  let by = y;

  let targetX = nearest ? nearest.x : x + 500;
  let targetY = nearest ? nearest.y : y;

  const dx = targetX - bx;
  const dy = targetY - by;

  const distance = Math.sqrt(dx * dx + dy * dy) || 1;

  const vx = dx / distance * 14;
  const vy = dy / distance * 14;

  const timer = setInterval(() => {

    bx += vx;
    by += vy;

    bullet.style.left = bx + "px";
    bullet.style.top = by + "px";

    if (nearest && nearest.hp > 0) {

      const hitX = Math.abs(bx - nearest.x);
      const hitY = Math.abs(by - nearest.y);

      if (hitX < 25 && hitY < 35) {

        nearest.hp -= 50;

        bullet.remove();
        clearInterval(timer);

        if (nearest.hp <= 0) {

          nearest.element.remove();

          alive--;
          aliveText.textContent = alive;

          const index = enemies.indexOf(nearest);

          if (index !== -1) {
            enemies.splice(index, 1);
          }

          checkWinner();
        }
      }
    }

    if (
      bx < 0 ||
      bx > window.innerWidth ||
      by < 0 ||
      by > window.innerHeight
    ) {
      bullet.remove();
      clearInterval(timer);
    }

  }, 20);
}

// ================= ENEMY ATTACK =================

function enemyAttack() {

  if (gameOver) return;

  enemies.forEach(enemy => {

    const dx = x - enemy.x;
    const dy = y - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 280) {

      hp -= 2;

      if (hp < 0) hp = 0;

      hpText.textContent = hp;

      if (hp <= 0) {
        loseGame();
      }
    }
  });
}

// ================= ENEMY MOVEMENT =================

function moveEnemies() {

  if (gameOver) return;

  enemies.forEach(enemy => {

    const dx = x - enemy.x;
    const dy = y - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 100 && distance > 0) {

      enemy.x += dx / distance * 0.8;
      enemy.y += dy / distance * 0.8;
    }

    enemy.element.style.left = enemy.x + "px";
    enemy.element.style.top = enemy.y + "px";
  });
}

// ================= WIN =================

function checkWinner() {

  if (enemies.length === 0) {

    gameOver = true;

    const message = document.createElement("div");

    message.innerHTML =
      "🏆 YOU WIN!<br><small>Last Player Standing</small>";

    message.style.position = "fixed";
    message.style.left = "50%";
    message.style.top = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.zIndex = "200";
    message.style.background = "rgba(0,0,0,.9)";
    message.style.padding = "30px 45px";
    message.style.borderRadius = "15px";
    message.style.textAlign = "center";
    message.style.fontSize = "32px";
    message.style.fontWeight = "bold";

    document.body.appendChild(message);
  }
}

// ================= LOSE =================

function loseGame() {

  if (gameOver) return;

  gameOver = true;

  const message = document.createElement("div");

  message.innerHTML =
    "💀 ELIMINATED<br><small>Better luck next time</small>";

  message.style.position = "fixed";
  message.style.left = "50%";
  message.style.top = "50%";
  message.style.transform = "translate(-50%, -50%)";
  message.style.zIndex = "200";
  message.style.background = "rgba(0,0,0,.9)";
  message.style.padding = "30px 45px";
  message.style.borderRadius = "15px";
  message.style.textAlign = "center";
  message.style.fontSize = "30px";
  message.style.fontWeight = "bold";

  document.body.appendChild(message);
}

// ================= GAME LOOP =================

setInterval(enemyAttack, 1000);
setInterval(moveEnemies, 40);

updatePlayer();
updateZone();

window.addEventListener("resize", () => {

  zoneCenterX = window.innerWidth / 2;
  zoneCenterY = window.innerHeight / 2;

  updateZone();
});
