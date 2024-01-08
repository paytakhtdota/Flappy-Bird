const cvs = document.querySelector("canvas#main-cs");
let ctx = cvs.getContext("2d");

let degree = Math.PI / 180;
let frames = 0;

const sprite = new Image();
sprite.src = "img/original.png";

const SCORE = new Audio();
SCORE.src = "audio/score.wav";

const START = new Audio();
START.src="audio/start.wav";

const FLAP = new Audio();
FLAP.src="audio/flap.wav";

const HIT = new Audio();
HIT.src="audio/hit.wav";

const DIE = new Audio();
DIE.src="audio/die.wav";

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
            START.play();
            state.current = state.game;
            break;
        case state.game:
            FLAP.play();
            bird.flap();
            break;
        default:
            bird.speed = 0;
            bird.rotation = 0;
            pipes.position = [];
            score.value = 0;
            state.current = state.getReady;
            break;
    }
}

document.addEventListener("click", clickHandler);
document.addEventListener("keydown", (e) => {
    if (e.which  == 32) {
        console.log("space");
        clickHandler();
    }
})

const bg = new SpriteElement(0, 0, 275, 226, 0, cvs.height - 226);
bg.draw = function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
}

const fg = new SpriteElement(276, 0, 224, 112, 0, cvs.height - 112);
fg.dx = 2;
fg.draw = function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
}
fg.update = function () {
    if (state.current == state.game) {
        this.x = (this.x - this.dx) % (this.w / 2);
    }
}

let pipes = {
    top: {
        sX: 553,
        sY: 0,
    },
    bottom: {
        sX: 502,
        sY: 0,
    },
    w: 53,
    h: 400,
    dx: 2,
    gap: 120,
    position: [],
    maxYPos: -150,
    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);
            ctx.drawImage(sprite, this.bottom.sX, this.top.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }


    },
    update: function () {
        if (state.current != state.game) { return; }
        if (frames % 100 == 0) {
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1)
            })
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx;

            let buttomPipesPos = p.y + this.h + this.gap;
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                HIT.play();
                state.current = state.over;

            }
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > buttomPipesPos && bird.y - bird.radius < buttomPipesPos + this.h) {
                HIT.play();
                state.current = state.over;
            }
            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 10;
                SCORE.play();
                score.best = Math.max(score.value , score.best);
                localStorage.setItem("best", score.best)
            }
        }
    }
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
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 },
    ]
    ,
    w: 34,
    h: 26,
    x: 50,
    y: 150,
    speed: 0,
    gravity: 0.25,
    animationIndex: 0,
    rotation: 0,
    jump: 4.6,
    radius: 12,
    draw: function () {
        let birdStage = this.animation[this.animationIndex];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, birdStage.sX, birdStage.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    },
    update: function () {
        let period = state.current == state.getReady ? 10 : 4;
        this.animationIndex += frames % period == 0 ? 1 : 0;
        this.animationIndex = this.animationIndex % this.animation.length;
        if (state.current == state.getReady) {
            this.y = 150;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;
            if (this.speed < this.jump) {
                this.rotation = -25 * degree;
            } else {
                this.rotation = 90 * degree;
            }
        }
        if (this.y + this.h / 2 >= cvs.height - fg.h) {
            this.y = cvs.height - fg.h - this.h / 2;
            this.animationIndex = 1;
            if (state.current == state.game) {
                DIE.play();
                state.current = state.over;
            }
        }
    },
    flap: function () {
        this.speed = -this.jump;
    }
}

let score = {
    best: parseInt(localStorage.getItem("best")),
    value: 0,
    draw: function () {
        ctx.fillStyle = "#FFF"
        ctx.strokeStyle = "#000"
        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "25px IMPACT"
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
        }
        else if (state.current == state.over) {
            ctx.lineWidth = 2;
            ctx.font = "25px IMPACT";

            ctx.fillText(this.value, 225, 178);
            ctx.strokeText(this.value, 225, 178);

            ctx.fillText(this.best, 225, 220);
            ctx.strokeText(this.best, 225, 220);
        }
    }
}

function update() {
    bird.update();
    fg.update();
    pipes.update();
}

function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    getReady.draw();
    bird.draw();
    gameOver.draw();
    score.draw();
}

function animate() {
    update();
    draw();
    frames++;
    requestAnimationFrame(animate)

}
animate();

