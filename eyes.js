function setup() {
  let canvas = createCanvas(90, 90); // canvas size
  canvas.parent('logo-canvas'); // Add the canvas to logo-canvas div
  colorMode(HSB);
  angleMode(DEGREES);
}

function draw() {
  background(0);

  // Draw left eye
  let leftX = 30;
  let leftY = 45;

  let leftAngle = atan2(mouseY - leftY, mouseX - leftX);

  push();
  translate(leftX, leftY);
  fill(255);
  ellipse(0, 0, 30, 30);
  rotate(leftAngle);
  fill(0);
  ellipse(7.5, 0, 15, 15);
  pop();

  // Draw right eye
  let rightX = 60;
  let rightY = 45;

  let rightAngle = atan2(mouseY - rightY, mouseX - rightX);

  push();
  translate(rightX, rightY);
  fill(255);
  ellipse(0, 0, 30, 30);
  rotate(rightAngle);
  fill(0);
  ellipse(7.5, 0, 15, 15);
  pop();
}

function createGhost() {
    // create ghost
    const ghost = document.createElement('img');
    ghost.src = 'img/ghost.png'; // image
    ghost.classList.add('ghost');

    // random spawn position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight -200;

    ghost.style.left = `${startX}px`;
    ghost.style.top = `${startY}px`;

    // Add ghost
    document.getElementById('ghost-container').appendChild(ghost);

    // random movement
    const moveX = (Math.random() - 0.5) * 300; // range
    const moveY = (Math.random() - 0.5) * 300;

    // set opacity effect
    setTimeout(() => {
        ghost.style.opacity = 1; // reveal
        ghost.style.transform = `translate(${moveX}px, ${moveY}px)`; // random movement
    }, 100);

    // set disappear effect
    setTimeout(() => {
        ghost.style.opacity = 0;
    }, 5000); // disappear after 5s

    // remove after disappear
    setTimeout(() => {
        ghost.remove();
    }, 6000); // 6s
}

// timer to spawn ghost
setInterval(createGhost, 3000); // each 3s

// load music
const backgroundMusic = new Audio('audio/happy halloween BGM.mp3');
const playButton = document.getElementById('music-toggle');
backgroundMusic.loop = true; // loop

let isMusicPlaying = false; // icon

// change play or pause
function toggleMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        playButton.textContent = "🔇";
    } else {
        backgroundMusic.play();
        playButton.textContent = "🔊";
    }
    isMusicPlaying = !isMusicPlaying; 
}
