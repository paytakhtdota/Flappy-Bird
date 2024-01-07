const cvs = document.querySelector("canvas#main-cs");
let ctx = cvs.getContext("2d");

let frames = 0;

const sprite = new Image();
sprite.src = "img/original.png";

class SpriteElement {
    constructor(sX, sY, w, h, x, y) {
        this.sX = sX;
        this.sY = sY;
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
    }
}

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

const clickHandler = function () {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        default:
            state.current = state.getReady
            break;
    }
}

document.addEventListener("click", clickHandler);
document.addEventListener("keydown", (e) => {
    if (e.keycode == 32) {
        clickHandler();
    }
})

const bg = new SpriteElement(0, 0, 275, 226, 0, cvs.height - 226);
bg.draw = function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
}

const fg = new SpriteElement(276, 0, 224, 112, 0, cvs.height - 112);
fg.draw = function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
}

const getReady = new SpriteElement(0, 228, 173, 152, cvs.width / 2 - 173 / 2, 80);
getReady.draw = function () {
    if (state.current == state.getReady) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}

const gameOver = new SpriteElement(175, 228, 225, 202, cvs.width / 2 - 225 / 2, 80);
gameOver.draw = function () {
    if (state.current == state.over) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}

let bird = {
     animation : [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139},
    ]
    ,
    w: 34,
    h: 26,
    x: 50,
    y: 150,
    animationIndex : 0,
    l:0,
    draw: function() {
        let birdStage = this.animation[this.animationIndex];
        ctx.drawImage(sprite, birdStage.sX, birdStage.sY, this.w, this.h, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    },
    update:function(){
        this.animationIndex += frames % 10 == 0 ? 1 : 0;
        this.animationIndex = this.animationIndex % this.animation.length;
    },
    flap : function(){

    }
}



function update() {
    bird.update();
}

function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    fg.draw();
    getReady.draw();
    bird.draw();
    gameOver.draw();
}

function animate() {
    update();
    draw();
    frames++;
    requestAnimationFrame(animate)
    
}
      animate();

