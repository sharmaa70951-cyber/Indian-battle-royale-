const lobby = document.getElementById("lobby");
const game = document.getElementById("game");
const startBtn = document.getElementById("startBtn");
const player = document.getElementById("player");

let x = 50;
let y = 55;

startBtn.addEventListener("click", () => {
  lobby.style.display = "none";
  game.style.display = "block";
});

function move(direction) {
  const speed = 2;

  if (direction === "up") y -= speed;
  if (direction === "down") y += speed;
  if (direction === "left") x -= speed;
  if (direction === "right") x += speed;

  x = Math.max(3, Math.min(97, x));
  y = Math.max(8, Math.min(92, y));

  player.style.left = x + "%";
  player.style.top = y + "%";
}

/* Keyboard controls */
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
    move("up");
  }

  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
    move("down");
  }

  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    move("left");
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    move("right");
  }
});
