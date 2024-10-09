// get canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isGameOver = false; // set gameover bool

const hoverSound = new Audio('audio/spot.wav');
// set score element
const scoreElement = document.querySelector('.score');
let score = 0; // set defult score

const audioElement = document.getElementById('background-audio');
const playButton = document.getElementById('play-button');

window.addEventListener('load', playAudio);

// adjust canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector('.header').offsetHeight; // Subtract the height of the header
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let shapes = [];
const maskSize = 120; // the size of mask
let bgImg, shapeImg;
let lastGhostTime = 0; // Record the last time a ghost was generated
const ghostInterval = 3000; // set period to spawn a ghost
const ghostStayDuration = 5000; // ghost stay for 5s
let isMaskVisible = true; // set bool to decide is mask visible
const ghostSize = 75;

// load images
function loadImages() {
  bgImg = new Image();
  shapeImg = new Image();

  bgImg.src = 'img/1.jpg'; // img path
  shapeImg.src = 'img/ghost.png'; // img path

  // start draw load img
  bgImg.onload = shapeImg.onload = function() {
    requestAnimationFrame(draw);
  }
}

// draw function
function draw(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // only spawn ghost when game is not over
  if (!isGameOver && timestamp - lastGhostTime > ghostInterval) {
    shapes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: ghostSize,
      opacity: 1,
      createdTime: timestamp,
      isFading: false,
      isHovered: false,
      hasBeenHovered: false
    });
    console.log("Spawn ghost");
    lastGhostTime = timestamp;
  }

  // check the mouse if hover on any ghost and change score
  shapes.forEach(shape => {
    const distance = Math.sqrt(
      (mouseX - (shape.x + shape.size / 2)) ** 2 + (mouseY-90 - (shape.y + shape.size / 2)) ** 2
    );

    if (distance < shape.size / 2 && !shape.isHovered && !shape.hasBeenHovered) {
      shape.isHovered = true;
      shape.hasBeenHovered = true;
      score++;
      scoreElement.textContent = score;
      hoverSound.currentTime = 0; // reset sound
      hoverSound.play(); // play sound effect

    } else if (distance >= shape.size / 2) {
      shape.isHovered = false;
    }
  });

  if (isMaskVisible) {
    drawMask();
  }

  requestAnimationFrame(draw);
}


// draw mask（only the circle will reveal background and ghost）
function drawMask() {
  // draw a overlay cover the whole screen first
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Displays the background and ghost on the mask through a circle (custom mouse)
  ctx.save();

  // set the size of the circle，reveal the img behind
  ctx.beginPath();
  ctx.arc(mouseX, mouseY-90, maskSize, 0, Math.PI * 2);
  ctx.clip(); // Clip to limit the drawing range to a circle

  // Draw a background picture within a circular area
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // draw ghosts
  shapes = shapes.filter(shape => shape.opacity > 0);
  shapes.forEach(shape => {
    const elapsed = performance.now() - shape.createdTime;

    if (elapsed > ghostStayDuration) {
      shape.isFading = true; // begins to disappear after duration
    }

    if (shape.isFading) {
      shape.opacity -= 0.01; // start to decrease opacity
    }

    ctx.globalAlpha = shape.opacity; // set alpha value to the opacity
    
    if (shape.isHovered) {
      // When the ghost is hovered, move it up by 20px
      ctx.drawImage(shapeImg, shape.x, shape.y - 10, shape.size, shape.size);
    } else {
      ctx.drawImage(shapeImg, shape.x, shape.y, shape.size, shape.size);
    }
  });

  ctx.restore(); // Resume clipping
  ctx.globalAlpha = 1; // Restore transparency
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// update mouse position
canvas.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// The mask is displayed when the mouse enters the canvas
canvas.addEventListener('mouseenter', () => {
  isMaskVisible = true;
});

// Hides the mask when the mouse leaves the canvas
canvas.addEventListener('mouseleave', () => {
  isMaskVisible = false;
});

// Hides the mask when the mouse enters the header
document.querySelector('.header').addEventListener('mouseenter', () => {
  isMaskVisible = false;
});

// Redisplays the mask when the mouse leaves the header
document.querySelector('.header').addEventListener('mouseleave', () => {
  isMaskVisible = true;
});

// Load the image and initialize
loadImages();

// Removed when the animated text disappears
document.addEventListener('DOMContentLoaded', () => {
  const introText = document.querySelector('.intro-text');
  introText.style.display = 'block'; // Displays text elements

  // Listen for the animation end event
  introText.addEventListener('animationend', () => {
    introText.remove(); // Delete the element after the animation ends
  });
});

// Get the countdown element
const timeElement = document.querySelector('.time');
let time = 60; // Initialize the countdown time

// set popup element
let popup;

// counter
function startTimer() {
  const timerInterval = setInterval(() => {
    time--;
    timeElement.textContent = time;

    
    if (time <= 0) {
      clearInterval(timerInterval);
      showPopup();
    }
  }, 1000); // Triggers every 1000 milliseconds (1 second).
}


function showPopup() {
  isGameOver = true; // game over

  // create popup
  popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Time's Up!</h2>
      <p>Your Score: <span class="final-score">${score}</span></p>
      <button class="play-again-button">Play Again</button>
    </div>
  `;

  // add popup to page
  document.body.appendChild(popup);

  const finalScoreElement = document.querySelector('.final-score');
  finalScoreElement.style.color = '#48FF00';
  finalScoreElement.style.fontWeight = 'bold';

  // Set the mouse to switch to the default pointer when entering the pop-up window
  popup.addEventListener('mouseenter', () => {
    document.body.style.cursor = 'default';
  });

  
  popup.addEventListener('mouseleave', () => {
    document.body.style.cursor = 'none';
  });

  // click to reset the game
  document.querySelector('.play-again-button').addEventListener('click', resetGame);
}


// reset game function
function resetGame() {
  popup.remove();

  playAudio();
  playButton.textContent = "🔊";

  score = 0;
  time = 60;
  scoreElement.textContent = score;
  timeElement.textContent = time;

  isGameOver = false; // reset gmaeover bool

  document.body.style.cursor = 'none'; // hide cursor
  startTimer();

  shapes = [];
}

function toggleAudio() {
  if (audioElement.paused) {
    playAudio();
    playButton.textContent = "🔊";
  } else {
    audioElement.pause();
    playButton.textContent = "🔇";
  }
}

function playAudio() {
  audioElement.currentTime = 0;
  audioElement.play();
}

// Start a countdown on initialization
startTimer();
