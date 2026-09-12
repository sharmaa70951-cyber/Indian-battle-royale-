const lobby = document.getElementById("lobby");
const game = document.getElementById("game");
const startBtn = document.getElementById("startBtn");
const player = document.getElementById("player");

const matchScreen = document.getElementById("matchScreen");
const countdown = document.getElementById("countdown");
const train = document.getElementById("train");

let x = 50;
let y = 55;
let gameStarted = false;


/* ================= START MATCH ================= */

startBtn.addEventListener("click", () => {

  if (gameStarted) return;

  gameStarted = true;

  lobby.style.display = "none";
  game.style.display = "block";

  startMatch();

});


/* ================= MATCH SYSTEM ================= */

function startMatch() {

  matchScreen.style.display = "block";

  let time = 5;

  countdown.textContent = time;

  const timer = setInterval(() => {

    time--;

    countdown.textContent = time;

    if (time <= 0) {

      clearInterval(timer);

      matchScreen.style.display = "none";

      startTrain();

    }

  }, 1000);

}


/* ================= TRAIN ================= */

function startTrain() {

  train.style.display = "block";

  train.style.left = "-120px";

  setTimeout(() => {

    train.style.left = "110%";

  }, 100);

  /*
    Train लगभग 8 seconds में map को cross करेगी.
    इसके बाद player को map पर control मिलेगा.
  */

  setTimeout(() => {

    train.style.display = "none";

    player.style.display = "block";

  }, 8200);

}


/* ================= PLAYER MOVEMENT ================= */

function move(direction) {

  if (!gameStarted) return;

  const speed = 2;

  if (direction === "up") {
    y -= speed;
  }

  if (direction === "down") {
    y += speed;
  }

  if (direction === "left") {
    x -= speed;
  }

  if (direction === "right") {
    x += speed;
  }


  /* Map के बाहर जाने से रोकना */

  x = Math.max(3, Math.min(97, x));
  y = Math.max(8, Math.min(92, y));


  player.style.left = x + "%";
  player.style.top = y + "%";

}


/* ================= KEYBOARD CONTROLS ================= */

document.addEventListener("keydown", (event) => {

  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "w") {
    move("up");
  }

  if (key === "arrowdown" || key === "s") {
    move("down");
  }

  if (key === "arrowleft" || key === "a") {
    move("left");
  }

  if (key === "arrowright" || key === "d") {
    move("right");
  }

});
