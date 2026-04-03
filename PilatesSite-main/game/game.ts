const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Ground line
const GROUND_Y = HEIGHT - 50;

// ----------------------
// Player
// ----------------------
class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  gravity: number;
  jumpStrength: number;
  onGround: boolean;

  constructor() {
    this.width = 40;
    this.height = 40;
    this.x = 80;
    this.y = GROUND_Y - this.height;
    this.vy = 0;
    this.gravity = 0.8;
    this.jumpStrength = -15;
    this.onGround = true;
  }

  jump() {
    if (this.onGround) {
      this.vy = this.jumpStrength;
      this.onGround = false;
    }
  }

  update() {
    this.vy += this.gravity;
    this.y += this.vy;

    const groundLevel = GROUND_Y - this.height;
    if (this.y > groundLevel) {
      this.y = groundLevel;
      this.vy = 0;
      this.onGround = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }
}

// ----------------------
// Obstacles
// ----------------------
class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;

  constructor(speed: number) {
    this.width = 30;
    this.height = 40;
    this.x = WIDTH + this.width;
    this.y = GROUND_Y - this.height;
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#f44336";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }
}

// ----------------------
// Protein Shake Sprite
// ----------------------
const shakeImg = new Image();
shakeImg.src = "protein.png";

// ----------------------
// Protein Shake Collectible
// ----------------------
class Shake {
  x: number;
  y: number;
  width = 24;
  height = 32;
  speed: number;

  constructor(speed: number) {
    this.x = WIDTH + this.width;
    this.y = GROUND_Y - this.height - 10;
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (shakeImg.complete) {
      ctx.drawImage(shakeImg, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "yellow";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }
}

// ----------------------
// Game state
// ----------------------
const player = new Player();
let obstacles: Obstacle[] = [];
let shakes: Shake[] = [];

let lastTime = 0;
let spawnTimer = 0;
let shakeTimer = 0;

let spawnInterval = 1500;
let shakeInterval = 2000;

let speed = 6;
let gameOver = false;
let score = 0;
let shakesCollected = 0;

// ----------------------
// Input
// ----------------------
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameOver) {
      resetGame();
    } else {
      player.jump();
    }
  }
});

function resetGame() {
  obstacles = [];
  shakes = [];
  gameOver = false;
  score = 0;
  shakesCollected = 0;
  speed = 6;
  spawnInterval = 1500;
  shakeInterval = 2000;

  player.y = GROUND_Y - player.height;
  player.vy = 0;
  player.onGround = true;
}

// ----------------------
// Collision detection
// ----------------------
function isColliding(a: any, b: any) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// ----------------------
// Main loop
// ----------------------
function loop(timestamp: number) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Background
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Ground line
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(WIDTH, GROUND_Y);
  ctx.stroke();

  if (!gameOver) {
    player.update();

    // Spawn obstacles
    spawnTimer += delta;
    if (spawnTimer > spawnInterval) {
      obstacles.push(new Obstacle(speed));
      spawnTimer = 0;

      if (spawnInterval > 700) spawnInterval -= 20;
      speed += 0.05;
    }

    // Spawn shakes
    shakeTimer += delta;
    if (shakeTimer > shakeInterval) {
      shakes.push(new Shake(speed - 2));
      shakeTimer = 0;

      if (shakeInterval > 1200) shakeInterval -= 10;
    }

    // Update obstacles
    obstacles.forEach((o) => o.update());
    obstacles = obstacles.filter((o) => !o.isOffScreen());

    // Update shakes
    shakes.forEach((s) => s.update());
    shakes = shakes.filter((s) => !s.isOffScreen());

    // Collision with obstacles
    const p = player.getBounds();
    for (const o of obstacles) {
      if (isColliding(p, o.getBounds())) {
        gameOver = true;
        break;
      }
    }

    // Collect shakes
    shakes = shakes.filter((s) => {
      if (isColliding(p, s.getBounds())) {
        shakesCollected++;
        return false;
      }
      return true;
    });

    score += delta * 0.01;
  }

  // Draw
  player.draw(ctx);
  obstacles.forEach((o) => o.draw(ctx));
  shakes.forEach((s) => s.draw(ctx));

  // UI
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${Math.floor(score)}`, 20, 30);
  ctx.fillText(`Shakes: ${shakesCollected}`, 20, 60);

  if (gameOver) {
    ctx.font = "32px sans-serif";
    ctx.fillText("Game Over - Press SPACE to restart", 120, HEIGHT / 2);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
