const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 960;
canvas.height = 540;


/* ======================== LOAD ======================== */

function load(src){
    const img=new Image();
    img.src=src;
    return img;
}

const startBG=load("assets/backgrounds/screenStart.png");
const selectBG=load("assets/backgrounds/fightSelector.png");
const fightBG=load("assets/backgrounds/bosqueBg/bosqueBg.png");

const luciImg=load("assets/players/luci/luciBase.png");
const nateImg=load("assets/players/nate/nateBase.png");

const characters=[
    {name:"luci",img:luciImg},
    {name:"nate",img:nateImg}
];


/* ======================== STATE ======================== */

let gameState="start";
let playerChoice=null;
let enemyChoice=null;
let cursor=0;

const keys={};


/* ======================== INPUT ======================== */

document.addEventListener("keydown",e=>{

    if(gameState==="start" && e.key==="Enter")
        gameState="select";

    else if(gameState==="select"){

        if(e.key==="ArrowRight")cursor=1;
        if(e.key==="ArrowLeft")cursor=0;

        if(e.key==="Enter"){

            if(!playerChoice){
                playerChoice=characters[cursor];
                cursor=0;
                return;
            }

            if(!enemyChoice){
                enemyChoice=characters[cursor];
                startFight();
            }
        }
    }

    if(gameState==="fight"){
        keys[e.key]=true;

        if(e.key==="k")player.attack(false);
        if(e.key===" ")player.attack(true);
    }
});

document.addEventListener("keyup",e=>keys[e.key]=false);


/* ======================== START ======================== */

function drawStart(){
    ctx.drawImage(startBG,0,0,canvas.width,canvas.height);

    ctx.fillStyle="white";
    ctx.font="28px Arial";
    ctx.textAlign="center";
    ctx.fillText("PRESS ENTER",canvas.width/2,canvas.height-80);
}


/* ======================== SELECT ======================== */

function drawCharacter(c,x,y,flip=false){

    ctx.save();

    if(flip){
        ctx.scale(-1,1);
        x=-x-150;
    }

    ctx.drawImage(c.img,0,0,120,150,x,y,150,190);

    ctx.restore();
}

function drawSelect(){

    ctx.drawImage(selectBG,0,0,canvas.width,canvas.height);

    const current=characters[cursor];

    const leftX=180;
    const rightX=630;
    const dynamicY=150;

    if(playerChoice)
        drawCharacter(playerChoice,leftX,dynamicY);
    else
        drawCharacter(current,leftX,dynamicY);

    if(playerChoice && enemyChoice)
        drawCharacter(enemyChoice,rightX,dynamicY,true);
    else if(playerChoice)
        drawCharacter(current,rightX,dynamicY,true);

    ctx.fillStyle="white";
    ctx.font="22px Arial";
    ctx.textAlign="center";

    if(!playerChoice)
        ctx.fillText("Choose Player",480,60);
    else if(!enemyChoice)
        ctx.fillText("Choose Enemy",480,60);
}


/* ======================== FIGHTER ======================== */

class Fighter{

    constructor(character,x){

        this.character=character;

        this.x=x;

        /* GROUND DESCIDO */
        this.ground=400;
        this.y=this.ground;

        /* PERSONA -5% */
        this.w=170;
        this.h=218;

        this.velX=0;
        this.velY=0;

        this.speed=5;
        this.jump=-20;
        this.gravity=0.9;

        this.onGround=true;

        this.hp=1000;

        /* ANIMAÇÃO */
        this.frame=0;
        this.frameTimer=0;
        this.state="idle";

        this.attacking=false;
        this.attackTimer=0;
        this.ki=false;
    }

    attack(isKi){

        if(this.attacking)return;

        this.attacking=true;
        this.attackTimer=20;
        this.ki=isKi;
        this.state="attack";
    }

    update(enemy){

        this.x+=this.velX;

        this.velY+=this.gravity;
        this.y+=this.velY;

        if(this.y>=this.ground){
            this.y=this.ground;
            this.velY=0;
            this.onGround=true;
        }

        /* STATE */
        if(this.attacking) this.state="attack";
        else if(!this.onGround) this.state="jump";
        else if(this.velX!==0) this.state="walk";
        else this.state="idle";

        /* FRAME CONTROL */
        this.frameTimer++;

        if(this.frameTimer>8){
            this.frame++;
            this.frameTimer=0;
        }

        const maxFrames={
            idle:3,
            walk:3,
            jump:3,
            attack:3
        };

        if(this.frame>=maxFrames[this.state])
            this.frame=0;

        /* DAMAGE */
        if(this.attacking){

            this.attackTimer--;

            if(this.attackTimer===10){

                if(Math.abs(this.x-enemy.x)<140)
                    enemy.hp-=this.ki?200:100;
            }

            if(this.attackTimer<=0)
                this.attacking=false;
        }
    }

    draw(enemy){

        ctx.save();

        const facing=enemy.x>this.x?1:-1;

        ctx.translate(this.x,this.y);

        if(facing===-1)ctx.scale(-1,1);

        const row={
            idle:0,
            walk:1,
            jump:2,
            attack:3
        }[this.state];

        ctx.drawImage(
            this.character.img,
            this.frame*120,
            row*150,
            120,150,
            -this.w/2,
            -this.h,
            this.w,
            this.h
        );

        ctx.restore();
    }
}


/* ======================== FIGHT ======================== */

let player;
let enemy;
let resultText="";

function startFight(){
    player=new Fighter(playerChoice,250);
    enemy=new Fighter(enemyChoice,700);
    gameState="fight";
}

function drawLife(){

    const max=300;

    ctx.fillStyle="red";
    ctx.fillRect(40,30,max,20);
    ctx.fillStyle="lime";
    ctx.fillRect(40,30,max*(player.hp/1000),20);
    ctx.fillText(player.character.name,190,70);

    ctx.fillStyle="red";
    ctx.fillRect(canvas.width-340,30,max,20);
    ctx.fillStyle="lime";
    ctx.fillRect(canvas.width-340,30,max*(enemy.hp/1000),20);
    ctx.fillText(enemy.character.name,canvas.width-190,70);
}

function updateFight(){

    player.velX=0;

    if(keys["a"])player.velX=-player.speed;
    if(keys["d"])player.velX=player.speed;

    if(keys["w"]&&player.onGround){
        player.velY=player.jump;
        player.onGround=false;
    }

    enemy.velX=player.x<enemy.x?-2:2;

    if(Math.random()<0.01)
        enemy.attack(false);

    player.update(enemy);
    enemy.update(player);

    if(player.hp<=0){
        resultText="GAME OVER";
        gameState="end";
    }

    if(enemy.hp<=0){
        resultText="WIN";
        gameState="end";
    }
}

function drawFight(){
    ctx.drawImage(fightBG,0,0,canvas.width,canvas.height);
    player.draw(enemy);
    enemy.draw(player);
    drawLife();
}


/* ======================== END ======================== */

function drawEnd(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="white";
    ctx.font="50px Arial";
    ctx.textAlign="center";
    ctx.fillText(resultText,canvas.width/2,canvas.height/2);
}


/* ======================== LOOP ======================== */

function loop(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(gameState==="start")drawStart();
    if(gameState==="select")drawSelect();
    if(gameState==="fight"){
        updateFight();
        drawFight();
    }
    if(gameState==="end")drawEnd();

    requestAnimationFrame(loop);
}

loop();