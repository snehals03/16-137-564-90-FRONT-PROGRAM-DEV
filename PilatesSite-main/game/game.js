var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
// Ground line
var GROUND_Y = HEIGHT - 50;
// ----------------------
// Player
// ----------------------
var Player = /** @class */ (function () {
    function Player() {
        this.width = 40;
        this.height = 40;
        this.x = 80;
        this.y = GROUND_Y - this.height;
        this.vy = 0;
        this.gravity = 0.8;
        this.jumpStrength = -15;
        this.onGround = true;
    }
    Player.prototype.jump = function () {
        if (this.onGround) {
            this.vy = this.jumpStrength;
            this.onGround = false;
        }
    };
    Player.prototype.update = function () {
        this.vy += this.gravity;
        this.y += this.vy;
        var groundLevel = GROUND_Y - this.height;
        if (this.y > groundLevel) {
            this.y = groundLevel;
            this.vy = 0;
            this.onGround = true;
        }
    };
    Player.prototype.draw = function (ctx) {
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    Player.prototype.getBounds = function () {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    };
    return Player;
}());
// ----------------------
// Obstacles
// ----------------------
var Obstacle = /** @class */ (function () {
    function Obstacle(speed) {
        this.width = 30;
        this.height = 40;
        this.x = WIDTH + this.width;
        this.y = GROUND_Y - this.height;
        this.speed = speed;
    }
    Obstacle.prototype.update = function () {
        this.x -= this.speed;
    };
    Obstacle.prototype.draw = function (ctx) {
        ctx.fillStyle = "#f44336";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    Obstacle.prototype.isOffScreen = function () {
        return this.x + this.width < 0;
    };
    Obstacle.prototype.getBounds = function () {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    };
    return Obstacle;
}());
// ----------------------
// Protein Shake Sprite
// ----------------------
var shakeImg = new Image();
shakeImg.src = "protein.png";
// ----------------------
// Protein Shake Collectible
// ----------------------
var Shake = /** @class */ (function () {
    function Shake(speed) {
        this.width = 24;
        this.height = 32;
        this.x = WIDTH + this.width;
        this.y = GROUND_Y - this.height - 10;
        this.speed = speed;
    }
    Shake.prototype.update = function () {
        this.x -= this.speed;
    };
    Shake.prototype.draw = function (ctx) {
        if (shakeImg.complete) {
            ctx.drawImage(shakeImg, this.x, this.y, this.width, this.height);
        }
        else {
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    Shake.prototype.isOffScreen = function () {
        return this.x + this.width < 0;
    };
    Shake.prototype.getBounds = function () {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    };
    return Shake;
}());
// ----------------------
// Game state
// ----------------------
var player = new Player();
var obstacles = [];
var shakes = [];
var lastTime = 0;
var spawnTimer = 0;
var shakeTimer = 0;
var spawnInterval = 1500;
var shakeInterval = 2000;
var speed = 6;
var gameOver = false;
var score = 0;
var shakesCollected = 0;
// ----------------------
// Input
// ----------------------
window.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        if (gameOver) {
            resetGame();
        }
        else {
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
function isColliding(a, b) {
    return (a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y);
}
// ----------------------
// Main loop
// ----------------------
function loop(timestamp) {
    var delta = timestamp - lastTime;
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
            if (spawnInterval > 700)
                spawnInterval -= 20;
            speed += 0.05;
        }
        // Spawn shakes
        shakeTimer += delta;
        if (shakeTimer > shakeInterval) {
            shakes.push(new Shake(speed - 2));
            shakeTimer = 0;
            if (shakeInterval > 1200)
                shakeInterval -= 10;
        }
        // Update obstacles
        obstacles.forEach(function (o) { return o.update(); });
        obstacles = obstacles.filter(function (o) { return !o.isOffScreen(); });
        // Update shakes
        shakes.forEach(function (s) { return s.update(); });
        shakes = shakes.filter(function (s) { return !s.isOffScreen(); });
        // Collision with obstacles
        var p_1 = player.getBounds();
        for (var _i = 0, obstacles_1 = obstacles; _i < obstacles_1.length; _i++) {
            var o = obstacles_1[_i];
            if (isColliding(p_1, o.getBounds())) {
                gameOver = true;
                break;
            }
        }
        // Collect shakes
        shakes = shakes.filter(function (s) {
            if (isColliding(p_1, s.getBounds())) {
                shakesCollected++;
                return false;
            }
            return true;
        });
        score += delta * 0.01;
    }
    // Draw
    player.draw(ctx);
    obstacles.forEach(function (o) { return o.draw(ctx); });
    shakes.forEach(function (s) { return s.draw(ctx); });
    // UI
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.fillText("Score: ".concat(Math.floor(score)), 20, 30);
    ctx.fillText("Shakes: ".concat(shakesCollected), 20, 60);
    if (gameOver) {
        ctx.font = "32px sans-serif";
        ctx.fillText("Game Over - Press SPACE to restart", 120, HEIGHT / 2);
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
