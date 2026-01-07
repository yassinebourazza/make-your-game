let currentX = 0
let currentY = 0
let moveY = -3
let moveX = +3
let container = document.getElementById('container')
let ball = document.getElementById('ball')
let breaker = document.getElementById('breaker')
let breakerPlace = breaker.getBoundingClientRect()    
let containerPlace = container.getBoundingClientRect()

addEventListener('keydown', (e)=> {
    if (e.key == ' ') {
        requestAnimationFrame(BallMovement)
        requestAnimationFrame(breakerMove);
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
    
    if (ballPlace.y + ballPlace.height > breakerPlace.y && ballPlace.y < breakerPlace.y  && ballPlace.x + (ballPlace.width/2) > breakerPlace.x && ballPlace.x + (ballPlace.width/2) < breakerPlace.x+breakerPlace.width) {
        moveY = -3
    }
    if (ballPlace.x > containerPlace.x+(containerPlace.width-2)-(ballPlace.width)) {
        moveX = -3
    } else if (ballPlace.x <containerPlace.x) {
        moveX = 3
    } else if (ballPlace.y < containerPlace.y) {
        moveY = 3
    } else if (ballPlace.y > containerPlace.y+(containerPlace.height-2)-(ballPlace.height)) {
        clearInterval(id)
    }
        

    requestAnimationFrame(BallMovement)
}

function breakerMove() {
    if(moveRight && parseInt(breaker.offsetLeft)-5 < containerPlace.x + containerPlace.width - breakerPlace.width - 10) {
        breaker.style.left = breaker.offsetLeft + 5 + 'px';    
    }
    if(moveLeft && parseInt(breaker.offsetLeft)-5 > containerPlace.x) {
        breaker.style.left = breaker.offsetLeft - 5 + 'px';
    }

    requestAnimationFrame(breakerMove)
}

