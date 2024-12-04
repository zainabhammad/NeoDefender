/*-------------- Constants -------------*/
const startGameBtn = document.getElementById('startgame-btn'); 
const music = document.getElementById('background-music');
const startGamePage = document.getElementById('startgame-page');
const story = document.getElementById('story-page');
const stories = document.querySelectorAll('.story');
const storyButtons = document.querySelectorAll('.story-btn');

/*---------- Variables (state) ---------*/
let currentStory = 0;

/*-------------- Functions -------------*/

const startGame = () => {
    startGamePage.style.display = 'none';
    story.style.display = 'flex';
    music.play();
};

const handleStoryProgression = (event) => {
    const nextId = event.target.getAttribute('data-next');
    stories[currentStory].style.display = 'none';
    const nextStory = document.getElementById(nextId);
    nextStory.style.display = 'block';
    currentStory++;
};

/*----------- Event Listeners ----------*/

startGameBtn.addEventListener('click', startGame); 

storyButtons.forEach((button) => {
    button.addEventListener('click', handleStoryProgression);
});

document.querySelector(".startButton").addEventListener("click", function() {
    window.location.href = "./game.html"; // Redirect to game.html
});
