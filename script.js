const player = document.getElementById("player");
const hpText = document.getElementById("hp");
const ammoText = document.getElementById("ammo");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;

let hp = 100;
let ammo = 30;

function updatePlayer() {
  player.style.left = x + "px";
  player.style.top = y + "px";
}

function move(direction) {
  const speed = 25;

  if (direction === "up") y -= speed;
  if (direction === "down") y += speed;
  if (direction === "left") x -= speed;
  if (direction === "right") x += speed;

  x = Math.max(20, Math.min(window.innerWidth - 20, x));
  y = Math.max(80, Math.min(window.innerHeight - 100, y));

  updatePlayer();
}

function shoot() {
  if (ammo <= 0) {
    alert("Ammo खत्म!");
    return;
  }

  ammo--;
  ammoText.textContent = ammo;

  const bullet = document.createElement("div");

  bullet.style.position = "absolute";
  bullet.style.width = "8px";
  bullet.style.height = "8px";
  bullet.style.borderRadius = "50%";
  bullet.style.background = "#ffd000";
  bullet.style.left = x + "px";
  bullet.style.top = y + "px";
  bullet.style.zIndex = "30";

  document.getElementById("game").appendChild(bullet);

  let bx = x;
  let by = y;

  const timer = setInterval(() => {
    bx += 12;
    bullet.style.left = bx + "px";
    bullet.style.top = by + "px";

    if (bx > window.innerWidth) {
      clearInterval(timer);
      bullet.remove();
    }
  }, 20);
}

updatePlayer();
