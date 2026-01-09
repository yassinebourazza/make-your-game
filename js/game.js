import { BrickGenerator } from "./bricks.js"

let currentX = 0
let currentY = 0
let moveY = -5
let moveX = 5
let flag = true
let layers = {}

let container;
let ball;
let breaker;
let breakerPlace;    
let containerPlace;


let play = document.getElementById('play')
play.addEventListener('click', ()=> {
    started()
})
function started() {
    
    document.body.innerHTML = `
    <div id="container">
       <div id="ball"></div>
       <div id="breaker"></div>
    </div>
   `

    container = document.getElementById('container')
    ball = document.getElementById('ball')
    breaker = document.getElementById('breaker')
    breakerPlace = breaker.getBoundingClientRect()
    containerPlace = container.getBoundingClientRect()
    layers = BrickGenerator()
    for (let i=1;i<=50 ;i++) {
        let g = document.getElementById('brick-'+i)            
        g.remove()
    }
}


addEventListener('keydown', (e)=> {
    if (e.key == ' ' && flag) {
        flag = !flag
        requestAnimationFrame(BallMovement)
        
    }
})




let moveLeft = false;
let moveRight = false;

document.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight') moveRight = true;
    if(e.key === 'ArrowLeft') moveLeft = true;
});

document.addEventListener('keyup', e => {
    if(e.key === 'ArrowRight') moveRight = false;
    if(e.key === 'ArrowLeft') moveLeft = false;
});

function BallMovement() {
    
    let ballPlace = ball.getBoundingClientRect()
    breakerPlace = breaker.getBoundingClientRect()
    ball.style.transform = `translate(${currentX+moveX}px,${currentY+moveY}px)`
    currentX += moveX
    currentY += moveY
    
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
    if (ballPlace.x > containerPlace.x+(containerPlace.width-2)-(ballPlace.width)) {
        moveX = moveX < 0 ? moveX : -moveX
    } else if (ballPlace.x <containerPlace.x) {
        moveX = moveX > 0 ? moveX : -moveX
    } else if (ballPlace.y < containerPlace.y) {
        moveY = moveY > 0 ? moveY : -moveY
    } else if (ballPlace.y > containerPlace.y+(containerPlace.height-2)-(ballPlace.height)) {
        return
    }

    ballTouchTheBricks(ballPlace)
    breakerMove()
    requestAnimationFrame(BallMovement)
}

function breakerMove() {
    if(moveRight && parseInt(breaker.offsetLeft)-5 < containerPlace.x + containerPlace.width - breakerPlace.width - 10) {
        breaker.style.left = breaker.offsetLeft + 7 + 'px';    
    }
    if(moveLeft && parseInt(breaker.offsetLeft)-5 > containerPlace.x) {
        breaker.style.left = breaker.offsetLeft - 7 + 'px';
    }

}


function ballTouchTheBricks(ballPlace) {
    for (let layer in layers) {
        if (ballPlace.y > layers[layer].yHeight) return
        if (ballPlace.y+ballPlace.height > layers[layer].y) {
            for (let current of layers[layer].bricks) {
                let br = current.getBoundingClientRect()                
                if (ballPlace.x+(ballPlace.width/2) > br.x && ballPlace.x + (ballPlace.width/2) < br.x+br.width) {
                    current.remove()
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
