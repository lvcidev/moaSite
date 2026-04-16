// ===============================
// CANVAS
// ===============================

const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

ctx.imageSmoothingEnabled = false

// canvas menor no PC
if(window.innerWidth > 900){
    canvas.width = 900
    canvas.height = 500
}else{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight * 0.6
}

// ===============================
// LOAD ASSETS
// ===============================

const bg = new Image()
bg.src = "assets/bg.png"

const playerImg = new Image()
playerImg.src = "assets/player.png"

const enemyImg = new Image()
enemyImg.src = "assets/enemy.png"

// ===============================
// CONFIG SPRITE
// ===============================

const FRAME_W = 40
const FRAME_H = 64
const START_X = 16
const TOTAL_FRAMES = 6

const SCALE = 3

// ajuste fino da altura
const GROUND_OFFSET = 90

// ===============================
// GAME STATE
// ===============================

let gameStarted = false

// ===============================
// PLAYER
// ===============================

const player = {
    x: 40,
    y: 0,
    speed: 4,

    frame:0,
    timer:0,

    facing:1 // olhando direita
}

// ===============================
// ENEMY
// ===============================

const enemy = {
    x:0,
    y:0,
    frame:0,
    timer:0,
    facing:-1
}

// ===============================
// INPUT
// ===============================

const keys = {}

document.addEventListener("keydown",e=>{

keys[e.key]=true

if(e.key==="Enter")
gameStarted=true

})

document.addEventListener("keyup",e=>{
keys[e.key]=false
})

// ===============================
// MOBILE CONTROLS
// ===============================

function createMobileControls(){

if(window.innerWidth>900)return

const controls=document.createElement("div")
controls.id="mobileControls"

controls.innerHTML=`
<button id="left">◀</button>
<button id="right">▶</button>
`

document.body.appendChild(controls)

const press=(key,val)=>{
keys[key]=val
}

document.getElementById("left")
.addEventListener("touchstart",()=>press("ArrowLeft",true))

document.getElementById("left")
.addEventListener("touchend",()=>press("ArrowLeft",false))

document.getElementById("right")
.addEventListener("touchstart",()=>press("ArrowRight",true))

document.getElementById("right")
.addEventListener("touchend",()=>press("ArrowRight",false))

}

createMobileControls()

// ===============================
// PLAYER UPDATE
// ===============================

function updatePlayer(){

let moving=false

if(keys["ArrowLeft"]){
player.x-=player.speed
player.facing=-1
moving=true
}

if(keys["ArrowRight"]){
player.x+=player.speed
player.facing=1
moving=true
}

// animação correta
if(moving){

player.timer++

if(player.timer>=6){
player.timer=0
player.frame++

if(player.frame>=TOTAL_FRAMES)
player.frame=0
}

}else{

player.frame=0
player.timer=0

}

}

// ===============================
// ENEMY UPDATE (IDLE LOOP)
// ===============================

function updateEnemy(){

enemy.timer++

if(enemy.timer>=12){
enemy.timer=0
enemy.frame++
if(enemy.frame>=TOTAL_FRAMES)
enemy.frame=0
}

}

// ===============================
// DRAW SPRITE
// ===============================

function drawCharacter(img,char){

const groundY =
canvas.height -
(FRAME_H*SCALE) -
GROUND_OFFSET

char.y=groundY

ctx.save()

ctx.translate(
char.x + FRAME_W*SCALE/2,
char.y
)

ctx.scale(char.facing,1)

ctx.drawImage(
img,
START_X + char.frame*FRAME_W,
0,
FRAME_W,
FRAME_H,
-(FRAME_W*SCALE)/2,
0,
FRAME_W*SCALE,
FRAME_H*SCALE
)

ctx.restore()

}

// ===============================
// START POSITIONS
// ===============================

function setupPositions(){

player.x=40
player.facing=1

enemy.x=canvas.width-140
enemy.facing=-1

}

// ===============================
// LOOP
// ===============================

function loop(){

ctx.clearRect(0,0,canvas.width,canvas.height)

// BG
ctx.drawImage(bg,0,0,canvas.width,canvas.height)

if(!gameStarted){

ctx.fillStyle="white"
ctx.font="28px Arial"
ctx.textAlign="center"
ctx.fillText(
"PRESSIONE ENTER",
canvas.width/2,
canvas.height/2
)

requestAnimationFrame(loop)
return
}

updatePlayer()
updateEnemy()

drawCharacter(playerImg,player)
drawCharacter(enemyImg,enemy)

requestAnimationFrame(loop)

}

setupPositions()
loop()