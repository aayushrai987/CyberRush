// --- 1. Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');

// Game Constants
const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 600;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 5;

const OBSTACLE_WIDTH = 60;
const OBSTACLE_HEIGHT = 20;

// Game State Variables
let player, obstacles, score, obstacleSpeed, obstacleSpawnCounter, isRunning, keys;

// --- 2. Input Handling ---
const pressedKeys = {};
window.addEventListener('keydown', (e) => {
    pressedKeys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
    pressedKeys[e.key.toLowerCase()] = false;
});

// --- 3. Game Functions ---
function init() {
    // Reset game state
    player = {
        x: SCREEN_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: SCREEN_HEIGHT - 80,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT
    };
    obstacles = [];
    score = 0;
    obstacleSpeed = 3;
    obstacleSpawnCounter = 0;
    isRunning = true;

    // Update UI
    scoreEl.textContent = `Score: 0`;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    // Start the game loop
    gameLoop();
}

function handlePlayerMovement() {
    if (pressedKeys['arrowleft'] || pressedKeys['a']) {
        player.x -= PLAYER_SPEED;
    }
    if (pressedKeys['arrowright'] || pressedKeys['d']) {
        player.x += PLAYER_SPEED;
    }

    // Keep player within bounds
    if (player.x < 0) player.x = 0;
    if (player.x > SCREEN_WIDTH - PLAYER_WIDTH) player.x = SCREEN_WIDTH - PLAYER_WIDTH;
}

function spawnObstacle() {
    const x = Math.random() * (SCREEN_WIDTH - OBSTACLE_WIDTH);
    obstacles.push({
        x: x,
        y: -OBSTACLE_HEIGHT,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT
    });
}

function updateObstacles() {
    obstacleSpawnCounter++;
    // Spawn rate increases with speed
    if (obstacleSpawnCounter > (100 / obstacleSpeed)) {
        spawnObstacle();
        obstacleSpawnCounter = 0;
    }

    // Move and remove obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.y += obstacleSpeed;

        if (obstacle.y > SCREEN_HEIGHT) {
            obstacles.splice(i, 1);
            score++;
            scoreEl.textContent = `Score: ${score}`;
        }
    }
    
    // Increase difficulty
    if (score > 0 && score % 10 === 0) {
        obstacleSpeed = 3 + (score / 10);
    }
}

function checkCollision() {
    for (const obstacle of obstacles) {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            isRunning = false;
        }
    }
}

function gameOver() {
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// --- 4. Drawing Functions ---
function draw() {
    // Clear canvas
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw player
    ctx.fillStyle = '#00bfff'; // Bright blue
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    ctx.fillStyle = '#e94560'; // Red
    for (const obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// --- 5. Main Game Loop ---
function gameLoop() {
    if (!isRunning) {
        gameOver();
        return;
    }

    handlePlayerMovement();
    updateObstacles();
    checkCollision();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// --- 6. Event Listeners for Buttons ---
startButton.addEventListener('click', init);
restartButton.addEventListener('click', init);