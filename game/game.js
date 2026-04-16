const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//////////////////////////////////////////////////
// INPUT SYSTEM
//////////////////////////////////////////////////

const keys = {};

document.addEventListener("keydown", e=>{
    keys[e.key] = true;
});

document.addEventListener("keyup", e=>{
    keys[e.key] = false;
});

// MOBILE INPUT
function bindTouch(id,key){
    const btn = document.getElementById(id);

    btn.addEventListener("touchstart",()=>{
        keys[key]=true;
    });

    btn.addEventListener("touchend",()=>{
        keys[key]=false;
    });
}

bindTouch("left","ArrowLeft");
bindTouch("right","ArrowRight");
bindTouch("jump"," ");
bindTouch("attack","z");

//////////////////////////////////////////////////
// LOAD IMAGES
//////////////////////////////////////////////////

const bg = new Image();
bg.src = "assets/bg.png";

const playerIdle = new Image();
playerIdle.src = "assets/player_idle.png";

const playerAttack = new Image();
playerAttack.src = "assets/player_attack.png";

const playerHit = new Image();
playerHit.src = "assets/player_hit.png";

const enemyIdle = new Image();
enemyIdle.src = "assets/enemy_idle.png";

//////////////////////////////////////////////////
// PLAYER
//////////////////////////////////////////////////

const player = {
    x:100,
    y:300,
    w:64,
    h:64,
    vx:0,
    vy:0,
    speed:4,
    jump:-12,
    grounded:false,
    state:"idle"
};

//////////////////////////////////////////////////
// ENEMY
//////////////////////////////////////////////////

const enemy = {
    x:600,
    y:300,
    w:64,
    h:64
};

//////////////////////////////////////////////////
// GRAVITY
//////////////////////////////////////////////////

const gravity = 0.6;
const groundY = 350;

//////////////////////////////////////////////////
// UPDATE
//////////////////////////////////////////////////

function update(){

    // MOVIMENTO
    player.vx = 0;

    if(keys["ArrowLeft"])
        player.vx = -player.speed;

    if(keys["ArrowRight"])
        player.vx = player.speed;

    if(keys[" "] && player.grounded){
        player.vy = player.jump;
        player.grounded = false;
    }

    if(keys["z"])
        player.state="attack";
    else
        player.state="idle";

    // GRAVIDADE
    player.vy += gravity;

    player.x += player.vx;
    player.y += player.vy;

    // COLISÃO COM PLATAFORMA (imagem única)
    if(player.y >= groundY){
        player.y = groundY;
        player.vy = 0;
        player.grounded = true;
    }
}

//////////////////////////////////////////////////
// DRAW
//////////////////////////////////////////////////

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // BACKGROUND
    ctx.drawImage(bg,0,0,canvas.width,canvas.height);

    // PLAYER SPRITE
    let sprite = playerIdle;

    if(player.state==="attack")
        sprite = playerAttack;

    ctx.drawImage(
        sprite,
        player.x,
        player.y,
        player.w,
        player.h
    );

    // ENEMY
    ctx.drawImage(
        enemyIdle,
        enemy.x,
        enemy.y,
        enemy.w,
        enemy.h
    );
}

//////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////

function gameLoop(){

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();