/*-------------- Constants -------------*/
const gameZone = document.getElementById('gameZoneDisplay') 
gameZone.width = window.innerWidth //game display will be the width of the entire screen 
gameZone.height = window.innerHeight //game game display will be take over the height of the entire screen 

const speedIncrease= 0.04
const pillTypes = ['red-pill', 'blue-pill'] 
/*---------- Variables (state) ---------*/
let pills = []
let score = 0 
let shieldCount = 5
let timer = 60
let timeElapsed = 0  //this will track the time passed since the game started 
let gameLoop // help updating the game state  
let countdownTimer
/*----- Cached Element References  -----*/
const gameZoneContext = gameZone.getContext("2d"); // where we gonna "draw" on the canvas the gamezone 
const timerDisplay = document.getElementById('timer');
const scoreAndTimeDisplay = document.querySelector('.scoreAndTimeDisplay');
const shieldContainer = document.querySelector('.shieldsDisplay');
const playAgainButton = document.getElementById('playAgainButton');
const result = document.getElementById('result');
const endGameDisplay = document.querySelector('.endGameDisplay');
const shields = document.querySelectorAll('.shield');
/*-------------- Functions -------------*/
const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function FallingPill(type, x, y, size) {

  //define the falling pill properties 
  this.type = type //assign the type of pill if red or blue
  this.x = x // where in the game display the pill will be start horizontally   
  this.y = y //where in the game display the pill will start vertically    
  this.size = size * 2; //addded it to make the pill size bigger to the game display
  this.speedRange = generateRandomNumber(1, 5) // range of how fast the pill will fall
  this.speed = this.speedRange  //current speed of pill 

  const pillImg = new Image()
  if (this.type === "red-pill") {
    pillImg.src = "./image/red-pill.png"
  } else {
    pillImg.src = "./image/blue-pill.png"
  }
  
  this.updateSpeed = () => {
    this.speed = this.speedRange + timeElapsed * speedIncrease //updates and increase of speed over time 
  }

  this.update = () => {
    this.updateSpeed();
    this.y = this.y + this.speed;  
  }

  //draw the pill into the game zone, horizantal and vertically 
  this.draw = () => {
    gameZoneContext.drawImage(pillImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  };
}

// Create falling pill at random properties then add it to the pills array 
function createPill() {
  const x = generateRandomNumber(50, gameZone.width - 50)//make the pill random placed in the game zone
  const y = 0 // start game from top of the game zone screen 
  const size = generateRandomNumber(60, 80)

  pills.push(new FallingPill(pillTypes[generateRandomNumber(0, 1)], x, y, size)) //passes the permeters to the fallingpill 
}


//displaying shields 
function updateShields() {
  for (let i = 0; i < shields.length; i++) {
    if (i < shieldCount) {
      shields[i].style.display = "inline-block"
    } else {
      shields[i].style.display = "none"
    }
  }
  if (shieldCount <= 0) {
    endGame("You lost all shields! The Matrix has collapsed....")
  }
}

// player loses the shield, decrease the shield count 
function loseShield() {
  shieldCount = shieldCount -1;
  updateShields(); //once it decreases, run updateshield to update game zone 
}

// 

//
function countDown() {
  countdownTimer = setInterval(() => {
    timer--
    timerDisplay.innerHTML = timer;
    timeElapsed++; 
    if (timer <= 0) endGame("Congrats! You saved The Matrix");
  }, 1000);
}

function updateGame() {
  gameZoneContext.clearRect(0, 0, gameZone.width, gameZone.height)
  gameZoneContext.fillStyle = "black"; 
  gameZoneContext.fillRect(0, 0, gameZone.width, gameZone.height)

  pills.forEach((pill, index) => {
    pill.update();
    pill.draw();
    if (pill.y > gameZone.height && pill.type === "blue-pill") {
      loseShield();
      pills.splice(index, 1)
    }
  });

  if (Math.random() < 0.05) createPill()
}

function updateScoreAndTime() {
  scoreAndTimeDisplay.textContent = `Score: ${score} | Time: ${timer}s`
}

function startGame() {
  score = 0;
  shieldCount = 5
  timer = 60
  pills = []
  timerDisplay.textContent = timer
  updateScoreAndTime()
  updateShields()
  endGameDisplay.classList.add("hide")
  playAgainButton.style.display = "none"
  scoreAndTimeDisplay.classList.remove("hide")
  shieldContainer.classList.remove("hide")
  gameLoop = setInterval(updateGame, 1000 / 60)
  countDown()
}

function endGame(resultMessage) {
  clearInterval(gameLoop)
  clearInterval(countdownTimer)

  setTimeout(() => {
    endGameDisplay.classList.remove("hide")
    scoreAndTimeDisplay.classList.add("hide")
    shieldContainer.classList.add("hide")

    result.textContent = resultMessage
    playAgainButton.style.display = "block"
  }, 300)
} //ends the game displaying the end screen and result

/*----------- Event Listeners ----------*/
gameZone.addEventListener("click", (e) => {
  const mouseX = e.clientX
  const mouseY = e.clientY

  pills.forEach((pill, index) => {
    const dist = Math.sqrt((mouseX - pill.x) ** 2 + (mouseY - pill.y) ** 2);
    if (dist < pill.size / 2 && !pill.clicked) {
      pill.clicked = true
      if (pill.type === "red-pill") {
        loseShield()
      } else {
        score++
        updateScoreAndTime()
      }
      pills.splice(index, 1)
    }
  })
}) //checks if its red or blue and updates accordingly 
playAgainButton.addEventListener("click", startGame) //reset the game 

window.onload = () => {
  startGame()
}

