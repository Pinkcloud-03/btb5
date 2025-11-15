const container = document.getElementById("container");
const bird = document.getElementById("bird");
const pole_1 = document.getElementById("pole_1");
const pole_2 = document.getElementById("pole_2");
const score_span = document.getElementById("score");
const play_btn = document.getElementById("play_btn");
const restart_btn = document.getElementById("restart_btn");

let game_interval;
let physics_interval;

// -------------------------
// THÔNG SỐ GAME: bản dễ chơi
// -------------------------
let speed = 1.6;        // ống chạy chậm hơn
let gravity = 0.18;     // rơi rất chậm
let jumpVelocity = 0;
let isPlaying = false;
let score = 0;

// -------------------------
// BẮT ĐẦU GAME
// -------------------------
play_btn.onclick = function () {
    play_btn.style.display = "none";
    startGame();
};

function startGame() {
    isPlaying = true;
    score = 0;
    let level = 1;
    let currentInterval = 40; // Level 1

    score_span.innerHTML = score;

    pole_1.style.right = "-64px";
    pole_2.style.right = "-64px";
    bird.style.top = "150px";

    jumpVelocity = 0;

    // Physics mượt hơn
    physics_interval = setInterval(() => {
        let bird_top = parseFloat(getComputedStyle(bird).top);

        jumpVelocity += gravity;
        bird.style.top = bird_top + jumpVelocity + "px";
    }, 20);

    game_interval = setInterval(gameLoop, 20);
}

// -------------------------
// GAME LOOP
// -------------------------
function gameLoop() {
    let pole_right = parseInt(getComputedStyle(pole_1).right);

    pole_1.style.right = pole_right + speed + "px";
    pole_2.style.right = pole_right + speed + "px";

    if (pole_right > 400) {
        changePipeHeight();
        function updateLevel() {
    if (score >= 50) {
        winGame();
        return;
    }

    if (score >= 40) {
        level = 4;
        currentInterval = 20;
    } else if (score >= 20) {
        level = 3;
        currentInterval = 25;
    } else if (score >= 5) {
        level = 2;
        currentInterval = 30;
    } else {
        level = 1;
        currentInterval = 40; 
    }

    // Reset game speed (interval)
    clearInterval(game_interval);
    game_interval = setInterval(gameLoop, currentInterval);
}

        pole_1.style.right = "-64px";
        pole_2.style.right = "-64px";

        score++;
        score_span.innerHTML = score;
updateLevel(
    function updateLevel() {
    let oldLevel = level;

    if (score >= 50) {
        winGame();
        return;
    }

    if (score >= 40) {
        level = 4;
        currentInterval = 20;
    } else if (score >= 20) {
        level = 3;
        currentInterval = 25;
    } else if (score >= 5) {
        level = 2;
        currentInterval = 30;
    } else {
        level = 1;
        currentInterval = 40; 
    }

    // Nếu lên level mới thì tăng speed
    if (level !== oldLevel) {
        if (level === 2) speed += 0.3;
        if (level === 3) speed += 0.3;
        if (level === 4) speed += 0.4;
    }

    // Reset tốc độ game theo interval mới
    clearInterval(game_interval);
    game_interval = setInterval(gameLoop, currentInterval);
}

); // cập nhật level

    }

    checkCollision();
}

// -------------------------
// RANDOM PIPE
// -------------------------
function changePipeHeight() {
    let gap = 135;
    let topHeight = Math.floor(Math.random() * 180) + 70;
    let bottomHeight = 480 - topHeight - gap;

    pole_1.style.height = topHeight + "px";
    pole_2.style.height = bottomHeight + "px";
}

// -------------------------
// JUMP MƯỢT, KHÔNG GIẬT
// -------------------------
document.addEventListener("keydown", jump);
document.addEventListener("click", jump);

function jump() {
    if (!isPlaying) return;
    jumpVelocity = -4.5;  // bay lên
}

// -------------------------
// COLLISION – DÙNG TRỌNG TÂM CON CHIM
// -------------------------
function checkCollision() {
    let bird_rect = bird.getBoundingClientRect();
    let top_pipe = pole_1.getBoundingClientRect();
    let bottom_pipe = pole_2.getBoundingClientRect();
    let container_rect = container.getBoundingClientRect();

    // Lấy điểm trọng tâm
    let centerX = bird_rect.left + bird_rect.width / 2;
    let centerY = bird_rect.top + bird_rect.height / 2;

    // Nếu trọng tâm vượt khỏi trên/dưới container → thua
    if (centerY <= container_rect.top || centerY >= container_rect.bottom) {
        gameOver();
        return;
    }

    // Trọng tâm chạm ống trên hoặc ống dưới → thua
    if (pointInsidePipe(centerX, centerY, top_pipe) ||
        pointInsidePipe(centerX, centerY, bottom_pipe)) {
        gameOver();
    }
}

function pointInsidePipe(x, y, rect) {
    return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
    );
}

// -------------------------
// GAME OVER
// -------------------------
function gameOver() {
    isPlaying = false;
    clearInterval(game_interval);
    clearInterval(physics_interval);

    restart_btn.style.display = "block";
}
function winGame() {
    isPlaying = false;
    clearInterval(game_interval);
    clearInterval(physics_interval);

    alert("🎉 CHIẾN THẮNG! Bạn đã đạt 50 điểm!");

    restart_btn.style.display = "block";
}

restart_btn.onclick = function () {
    restart_btn.style.display = "none";
    startGame();
};
