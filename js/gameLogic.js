/*-------------- Constants -------------*/
const gameZone = document.getElementById('gameZoneDisplay')
gameZone.width = window.innerWidth
gameZone.height = window.innerHeight

const speedGamePercent = 0.09  
const objectTypes = ['red-pill', 'blue-pill']; // Types of objects in the game
const speedMultiplier = 0.05; // Speed increase per second
/*---------- Variables (state) ---------*/
let objects = [];
let score = 0; 
let shieldCount = 5;
let timer = 60;
let timeElapsed = 0;  
let gameInterval, timerInterval;
/*----- Cached Element References  -----*/
const gameZoneContext = gameZone.getContext("2d"); // Get the 2D context of the canvas for drawing
const timerDisplay = document.getElementById('timer');
const scoreContainer = document.querySelector('.scoreAndTimeDisplay');
const shieldContainer = document.querySelector('.shieldsDisplay');
const playAgainButton = document.getElementById('playAgainButton');
const result = document.getElementById('result');
const coverScreen = document.querySelector('.endGameDisplay');
/*-------------- Functions -------------*/
// A Function to Generate Random Numbers
const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Falling pills Constructor
function FallingObject(type, x, y, size) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.size = size * 2;
  this.baseSpeed = generateRandomNumber(2, 5);
  this.speed = this.baseSpeed;

  const img = new Image();
  img.src = this.type === "red-pill" ? "./image/red-pill.png" : "./image/blue-pill.png";

  // Update the speed over time
  this.updateSpeed = () => {
    this.speed = this.baseSpeed + timeElapsed * speedMultiplier;
  };

  // Update object position
  this.update = () => {
    this.updateSpeed();
    this.y += this.speed;
  };

  // Draw the object on the canvas
  this.draw = () => {
    gameZoneContext.drawImage(img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  };
}

// Create Falling pills
function createObject() {
  const x = generateRandomNumber(50, gameZone.width - 50);
  const y = 0;
  const size = generateRandomNumber(60, 80);

  objects.push(new FallingObject(objectTypes[generateRandomNumber(0, 1)], x, y, size));
}


// Update Shield Icons
function updateShields() {
  const shieldIcons = document.querySelectorAll('.shield');
  shieldIcons.forEach((icon, index) => {
    icon.style.display = index < shieldCount ? "inline-block" : "none";
  });

  if (shieldCount <= 0) {
    endGame("You lost all shields! The Matrix has collapsed....");
  }
}

// Reduce Shields
function loseShield() {
  shieldCount--;
  updateShields();
}

// Game Timer and Speed Multiplierbbbb
function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    timeElapsed++;
    timerDisplay.textContent = timer;
    if (timer <= 0) endGame("Congrats! You saved The Matrix");
  }, 1000);
}

// Update Game State
function updateGame() {
  gameZoneContext.clearRect(0, 0, gameZone.width, gameZone.height); // Clear the canvas
  gameZoneContext.fillStyle = "black"; // Set the background to black
  gameZoneContext.fillRect(0, 0, gameZone.width, gameZone.height); // Draw the black background

  objects.forEach((obj, index) => {
    obj.update();
    obj.draw();
    if (obj.y > gameZone.height && obj.type === "blue-pill") {
      loseShield();
      objects.splice(index, 1);
    }
  });

  if (Math.random() < 0.05) createObject();
}

// Update Score
function updateScore() {
  scoreContainer.textContent = `Score: ${score} | Time: ${timer}s`;
}

// Start Game
function startGame() {
  score = 0;
  shieldCount = 5;
  timer = 60;
  objects = [];
  timerDisplay.textContent = timer;
  updateScore();
  updateShields();
  coverScreen.classList.add("hide");
  playAgainButton.style.display = "none"; // Hide the button
  scoreContainer.classList.remove("hide");
  shieldContainer.classList.remove("hide");
  gameInterval = setInterval(updateGame, 1000 / 60);
  startTimer();
}

// End Game
function endGame(message) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  // Delay showing the end game screen to ensure the game stops first
  setTimeout(() => {
    coverScreen.classList.remove("hide");
    scoreContainer.classList.add("hide");
    shieldContainer.classList.add("hide");

    result.textContent = message;
    playAgainButton.style.display = "block"; // Show the play again button
  }, 300); // Adjust the delay if needed
}

/*----------- Event Listeners ----------*/
gameZone.addEventListener("click", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  objects.forEach((obj, index) => {
    const dist = Math.sqrt((mouseX - obj.x) ** 2 + (mouseY - obj.y) ** 2);
    if (dist < obj.size / 2 && !obj.clicked) {
      obj.clicked = true;
      if (obj.type === "red-pill") {
        loseShield();
      } else {
        score++;
        updateScore();
      }
      objects.splice(index, 1);
    }
  });
});
playAgainButton.addEventListener("click", startGame);

window.onload = () => {
  startGame();
};

