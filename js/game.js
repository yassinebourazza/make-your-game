import { BrickGenerator } from "./bricks.js"

let currentX = 0
let currentY = 0
let moveY = -5
let moveX = 5
let lives = 3
let flag = true
let layers = {}

let container, ball, breaker, breakerPlace, ballPlace, containerPlace, heartLives;

let moveLeft = false;
let moveRight = false;

let play = document.getElementById('play')


function started() {

    document.body.innerHTML = `
    <div id="game">
        <header>
            <span><p>High Score</p><p>Score</p><p>Time</p></span>
            <span><p>0</p><p>15</p><p>10:00</p></span>
        </header>
        <div id="container">
          <div id="ball"></div>
          <div id="breaker"></div>
       </div>
       <div id="control">
        <div><span>lives :</span>
        <img class="lives" src="assets/heart.svg" alt="heart">
        <img class="lives" src="assets/heart.svg" alt="heart">
        <img class="lives" src="assets/heart.svg" alt="heart">
        </div>
        <div>
        <button id="pause-button"><img src="assets/pause.svg" alt="pause"><p>Pause</p></button>
        <button id="home-button"><img src="assets/home.svg" alt="home"><p>Home</p></button></div>
       </div>
    </div>
   `
    container = document.getElementById('container')
    ball = document.getElementById('ball')
    breaker = document.getElementById('breaker')
    heartLives = document.getElementsByClassName('lives')
    breakerPlace = breaker.getBoundingClientRect()
    containerPlace = container.getBoundingClientRect()
    layers = BrickGenerator()
    for (let i=1;i<=50 ;i++) {
        let g = document.getElementById('brick-'+i)            
        g.remove()
    }
}


function BallMovement() {
    
    ballPlace = ball.getBoundingClientRect()
    breakerPlace = breaker.getBoundingClientRect()
    ball.style.transform = `translate(${currentX+moveX}px,${currentY+moveY}px)`
    currentX += moveX
    currentY += moveY
    
    ballTouchTheBreaker()
   
    if (ballPlace.x > containerPlace.x+(containerPlace.width-2)-(ballPlace.width)) {
        moveX = moveX < 0 ? moveX : -moveX
    } else if (ballPlace.x <containerPlace.x) {
        moveX = moveX > 0 ? moveX : -moveX
    } else if (ballPlace.y < containerPlace.y) {
        moveY = moveY > 0 ? moveY : -moveY
    } else if (ballPlace.y + ballPlace.height > containerPlace.y+(containerPlace.height)-(ballPlace.height/2)) {
       lives--
        if (lives >0) {
            ball.style.transform = `translate(0px,0px)`
            moveX = 5
            moveY = -5
            currentX = 0
            currentY = 0
            heartLives[lives].remove()
       } else {
        heartLives[lives].remove()
        return
       }
    }

    ballTouchTheBricks()
    breakerMove()
    requestAnimationFrame(BallMovement)
}

function ballTouchTheBreaker() {
     if (ballPlace.y + ballPlace.height > breakerPlace.y && ballPlace.y < breakerPlace.y  
        && ballPlace.x + (ballPlace.width/2) > breakerPlace.x 
        && ballPlace.x + (ballPlace.width/2) < breakerPlace.x+breakerPlace.width) {
        if (ballPlace.x + (ballPlace.width/2) < breakerPlace.x+(breakerPlace.width*1/7)) {
            moveX = -5
            moveY = -5
        } else if (ballPlace.x + (ballPlace.width/2) < breakerPlace.x+(breakerPlace.width*2/7)) {
            moveX = -3
            moveY = -7
        } else if (ballPlace.x + (ballPlace.width/2) > breakerPlace.x+(breakerPlace.width*6/7)) {
            moveX = 5
            moveY = -5
        }else if (ballPlace.x + (ballPlace.width/2) > breakerPlace.x+(breakerPlace.width*5/7)) {
            moveX = 3
            moveY = -7
        } else {
            moveY =  moveY < 0 ? moveY : -moveY
        }
        
    }
}

function breakerMove() {
    if(moveRight && parseInt(breaker.offsetLeft)-5 < containerPlace.x + containerPlace.width - breakerPlace.width - 10) {
        breaker.style.left = breaker.offsetLeft + 7 + 'px';    
    }
    if(moveLeft && parseInt(breaker.offsetLeft)-5 > containerPlace.x) {
        breaker.style.left = breaker.offsetLeft - 7 + 'px';
    }

}


function ballTouchTheBricks() {
    for (let layer in layers) {
        if (ballPlace.y > layers[layer].yHeight) return
        if (ballPlace.y+ballPlace.height > layers[layer].y) {
            for (let current of layers[layer].bricks) {
                let br = current.getBoundingClientRect()                
                if (ballPlace.x+(ballPlace.width/2) > br.x && ballPlace.x + (ballPlace.width/2) < br.x+br.width) {
                    current.remove()
                    console.log(ballPlace.y+ballPlace.height,layers[layer].yHeight);
                    
                    console.log(br,ballPlace, 'move y');
                    moveY = -moveY
                }
                if (ballPlace.y+(ballPlace.width/2) < layers[layer].yHeight && ballPlace.y+(ballPlace.width/2) > layers[layer].y) {
                if ((ballPlace.x+(ballPlace.width) > br.x && ballPlace.x < br.x)
                        ||(ballPlace.x < br.x+br.width && ballPlace.x+ballPlace.width > br.x+br.width)) {
                        current.remove()
                        console.log(br,ballPlace, 'move x');
                        moveX = -moveX
                }
                }
            
            }
            
        }
        
    }    
}



addEventListener('keydown', (e)=> {
    if (e.key == ' ' && flag) {
        flag = !flag
        requestAnimationFrame(BallMovement)
        
    }
})

document.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight') moveRight = true;
    if(e.key === 'ArrowLeft') moveLeft = true;
});

document.addEventListener('keyup', e => {
    if(e.key === 'ArrowRight') moveRight = false;
    if(e.key === 'ArrowLeft') moveLeft = false;
});

play.addEventListener('click', ()=> {
    started()
})