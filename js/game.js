import { BrickGenerator } from "./bricks.js"


//pages
const gameContainer = document.getElementById('game-container')
const homeContainer = document.getElementById('home-container')
const pauseContainer = document.getElementById('pause-container')
const finalGameContainer = document.getElementById('final-game-container')

//elements
const ball = document.getElementById('ball')
const breaker = document.getElementById('breaker')
const container = document.getElementById('container')
const pressToPLay = document.getElementById('press-to-play')
let chances = document.getElementById('chances')
let heartLives = document.getElementsByClassName('lives')
let finalGameTitle = document.getElementById('final-game-title')

//buttons
const playButton = document.getElementById('play')
const pauseButton = document.getElementById('pause-button')
const resumeButton = document.getElementById('resume-button')
const restartButton = document.getElementsByClassName('restart-button')
const exitButton = document.getElementsByClassName('exit-button')

//score
let score = document.getElementById('score')
let highScore = document.getElementById('high-score')
let time = document.getElementById('time')

//action
let pressToPLayFlag = true

let frame = 0
let currentX = 0
let currentY = 0
let moveY = -5
let moveX = 5
let lives = 3
let layers = {}

let bricks,
    minutes,
    seconds,
    ballPlace,
    containerPlace,
    breakerPlace,
    animationBallMove,
    initialBreakerLeft;

let moveLeft = false;
let moveRight = false;



function started(flag) {
    lives = 3
    finalGameTitle.innerText = 'Game Over'
    seconds=0
    minutes= 5
    if (parseInt(highScore.innerHTML)<parseInt(score.innerHTML)) highScore.innerHTML = score.innerHTML
    score.innerHTML= `0`
    time.innerHTML = `5:00`
    chances.innerHTML = `<span>Lives </span>
            <img class="lives" src="assets/heart.svg" alt="heart">
            <img class="lives" src="assets/heart.svg" alt="heart">
            <img class="lives" src="assets/heart.svg" alt="heart">`
    gameContainer.style.display = 'flex'
    pressToPLay.style.display = 'flex'
    homeContainer.style.display = 'none'
  

    bricks = Array.from(document.getElementsByClassName('brick'))
    for (let brick of bricks) {
        brick.remove()
    }

    layers = BrickGenerator()
    if (flag) {
        initialBreakerLeft = breaker.offsetLeft
    } else {
      resetGame()

    }

    bricks = document.getElementsByClassName('brick')
    
}


function BallMovement() {
    
    ballPlace = ball.getBoundingClientRect()
    containerPlace = container.getBoundingClientRect()
    breakerPlace = breaker.getBoundingClientRect()
    
    currentX += moveX
    currentY += moveY
    ball.style.transform = `translate(${currentX}px,${currentY}px)`
    
    ballTouchTheBricks()
    
    if (ballPlace.x >= containerPlace.x + (containerPlace.width - 2) - (ballPlace.width)) {
        moveX = moveX <= 0 ? moveX : -moveX
    } else if (ballPlace.x < containerPlace.x) {
        moveX = moveX >= 0 ? moveX : -moveX
    } else if (ballPlace.y < containerPlace.y) {
        moveY = moveY >= 0 ? moveY : -moveY
    } else if (ballPlace.y + ballPlace.height >= containerPlace.y + (containerPlace.height) - (ballPlace.height / 2)) {
        console.log(lives, heartLives);
        lives--
        
        if (lives > 0) {
            heartLives[lives].remove()
            pressToPLay.style.display = 'flex'
            return resetGame()
        } else {            
            heartLives[lives].remove()
            finalGameContainer.style.display ='flex'
            pressToPLayFlag= false
            return resetGame()
        }
    }
    
    if (seconds == 0 && minutes ==0) {        
        finalGameContainer.style.display ='flex'
        pressToPLayFlag= false
        return resetGame()
    }
    
    frame++
    timer()
    ballTouchTheBreaker(breakerPlace)
    if (bricks.length==0) {
        finalGameTitle.innerText = 'You Win'
        finalGameContainer.style.display ='flex'
        pressToPLayFlag= false
        return resetGame()
    }
    breakerMove(breakerPlace)
    animationBallMove = requestAnimationFrame(BallMovement)
}

function timer() {
    if (frame==60) {
        frame =0
        seconds--
        if (seconds==-1) {
            seconds = 59
            minutes--
        }
        time.innerHTML = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
    }
}

function ballTouchTheBreaker() {
    if (ballPlace.y + ballPlace.height >= breakerPlace.y && ballPlace.y <= breakerPlace.y
        && ballPlace.x + (ballPlace.width / 2) >= breakerPlace.x
        && ballPlace.x + (ballPlace.width / 2) <= breakerPlace.x + breakerPlace.width) {
            if (ballPlace.x + (ballPlace.width / 2) <= breakerPlace.x + (breakerPlace.width * 1 / 7)) {
                moveX = -5
                moveY = -5
            } else if (ballPlace.x + (ballPlace.width / 2) < breakerPlace.x + (breakerPlace.width * 2 / 7)) {
                moveX = -3
            moveY = -7
        } else if (ballPlace.x + (ballPlace.width / 2) > breakerPlace.x + (breakerPlace.width * 6 / 7)) {
            moveX = 5
            moveY = -5
        } else if (ballPlace.x + (ballPlace.width / 2) > breakerPlace.x + (breakerPlace.width * 5 / 7)) {
            moveX = 3
            moveY = -7
        } else {
            moveY = moveY <= 0 ? moveY : -moveY
        }

    }
}

function breakerMove() {
    if (moveRight && parseInt(breakerPlace.x) - 7 <= containerPlace.x + containerPlace.width - breakerPlace.width - 10) {
        breaker.style.left = breakerPlace.x + 7 + 'px';
    }
    if (moveLeft && parseInt(breakerPlace.x) - 7 >= containerPlace.x) {
        breaker.style.left = breakerPlace.x - 7 + 'px';
    }

}


function ballTouchTheBricks() {
    for (let layer in layers) {
        if (ballPlace.y >= layers[layer].yHeight) return
        if (ballPlace.y + ballPlace.height >= layers[layer].y) {
            console.log(ballPlace.y + ballPlace.height >= layers[layer].y);

            for (let current of layers[layer].bricks) {
                let br = current.getBoundingClientRect()
                if (ballPlace.x + (ballPlace.width / 2) >= br.x && ballPlace.x + (ballPlace.width / 2) <= br.x + br.width) {
                    current.remove()
                    score.innerHTML = Number.parseInt(score.innerHTML) + 50 
                    moveY = -moveY   
                    bricks = document.getElementsByClassName('brick')
                } else if (ballPlace.y + (ballPlace.width / 2) <= layers[layer].yHeight && ballPlace.y + (ballPlace.width / 2) >= layers[layer].y) {
                    if ((ballPlace.x + (ballPlace.width) >= br.x && ballPlace.x < br.x)
                        || (ballPlace.x <= br.x + br.width && ballPlace.x + ballPlace.width >= br.x + br.width)) {
                        current.remove()
                        score.innerHTML = Number.parseInt(score.innerHTML) + 50 
                        moveX = -moveX
                        bricks = document.getElementsByClassName('brick')
                    }
                }
            }
        }
    }
}

function resetGame() {
    moveY = -5
    moveX = 5
    breaker.style.left = initialBreakerLeft + 'px'
    pressToPLayFlag = true
}

document.addEventListener('keydown', (e) => {
    if (e.key == ' ' && pressToPLayFlag) {
        pressToPLayFlag = false
        pressToPLay.style.display='none'
        requestAnimationFrame(BallMovement)
    }
})

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') moveRight = true;
    if (e.key === 'ArrowLeft') moveLeft = true;
});

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowRight') moveRight = false;
    if (e.key === 'ArrowLeft') moveLeft = false;
    if (e.key === 'p') {
        pauseContainer.style.display = 'flex'
        cancelAnimationFrame(animationBallMove)
    }
});

playButton.addEventListener('click', () => {
    started(true)
})


pauseButton.addEventListener('click', () => {
    pauseContainer.style.display = 'flex'
    cancelAnimationFrame(animationBallMove)
})
resumeButton.addEventListener('click', () => {
    pauseContainer.style.display = 'none'
    pressToPLay.style.display = 'flex'
    pressToPLayFlag = true
})
for (let restart of restartButton) {
    restart.addEventListener('click', () => {
        pauseContainer.style.display= 'none'
        finalGameContainer.style.display = 'none'      
        started(false)
    })
}

for (let exit of exitButton) {
    exit.addEventListener('click', ()=> {
        gameContainer.style.display = 'none'
        pauseContainer.style.display= 'none'
        finalGameContainer.style.display = 'none'
        homeContainer.style.display = 'flex'
        resetGame()
    })
}