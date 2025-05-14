// Difficulty settings
const difficulties = {
  easy: { pairs: 8, timeLimit: 180 },
  medium: { pairs: 8, timeLimit: 120 },
  hard: { pairs: 8, timeLimit: 90 },
};

let currentDifficulty = "medium";

const difficultyButtons = {
  easy: document.getElementById("easy-btn"),
  medium: document.getElementById("medium-btn"),
  hard: document.getElementById("hard-btn"),
};

const cards = document.querySelectorAll(".card");
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

let timer;
let time = 0;
const timerElement = document.getElementById("timer");
const messageElement = document.getElementById("message");

//start timer
function startTimer(timeLimit) {
  clearInterval(timer); // Clear any existing timer before starting a new one
  time = timeLimit;
  messageElement.style.display = "none";
  timerElement.textContent = `Time: ${time}s`;
  timer = setInterval(() => {
    time--;
    timerElement.textContent = `Time: ${time}s`;
    if (time <= 0) {
      clearInterval(timer);
      disableDeck = true;
      messageElement.textContent = "You lose! Time's up.";
      messageElement.style.display = "block";
    }
  }, 1000);
}
// stop timer

function stopTimer() {
  clearInterval(timer);
}

// flip card
function flipCard({ target: clickedCard }) {
  if (cardOne !== clickedCard && !disableDeck) {
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    // Play correct match sound
    const correctSound = document.getElementById("correct-sound");
    if (correctSound) {
      correctSound.currentTime = 0;
      correctSound.play();
    }
    matched++;
    if (matched == difficulties[currentDifficulty].pairs) {
      stopTimer();
      messageElement.textContent = "You win! Congratulations!";
      messageElement.style.display = "block";
      setTimeout(() => {
        return shuffleCard(currentDifficulty);
      }, 1000);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }
  // Play wrong selection sound
  const wrongSound = document.getElementById("wrong-sound");
  if (wrongSound) {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }
  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 200);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

// shuffle cards
function shuffleCard(difficulty) {
  if (!difficulty) difficulty = currentDifficulty;
  currentDifficulty = difficulty;
  matched = 0;
  disableDeck = false;
  cardOne = cardTwo = "";
  messageElement.style.display = "none";

  const pairs = difficulties[difficulty].pairs;

  const totalCards = pairs * 2;

  // Create array of pairs
  let arr = [];
  for (let i = 1; i <= pairs; i++) {
    arr.push(i);
    arr.push(i);
  }

  // Shuffle array based on difficulty
  function easyShuffle(array) {
    // Arrange pairs in adjacent order for easy matching
    let index = 0;
    for (let i = 1; i <= array.length / 2; i++) {
      array[index++] = i;
      array[index++] = i;
    }
  }

  function mediumShuffle(array) {
    // Arrange pairs diagonally opposite on a 4x4 grid (for 8 pairs)
    const size = 4; // grid size 4x4
    let grid = new Array(size).fill(null).map(() => new Array(size).fill(null));
    let pairNum = 1;
    for (let i = 0; i < size / 2; i++) {
      for (let j = 0; j < size; j++) {
        if (pairNum > array.length / 2) break;
        grid[i][j] = pairNum;
        grid[size - 1 - i][size - 1 - j] = pairNum;
        pairNum++;
      }
    }
    // Flatten grid back to array
    let idx = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        array[idx++] = grid[r][c];
      }
    }
  }

  function preHardShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function hardShuffle(array) {
    preHardShuffle(array);
    preHardShuffle(array);
  }

  if (difficulty === "easy") {
    easyShuffle(arr);
  } else if (difficulty === "medium") {
    mediumShuffle(arr);
  } else if (difficulty === "hard") {
    hardShuffle(arr);
  }

  // Show/hide cards based on difficulty
  cards.forEach((card, i) => {
    if (i < totalCards) {
      card.style.display = "flex";
      card.classList.remove("flip");
      let imgTag = card.querySelector(".back-view img");
      imgTag.src = `images/img-${arr[i]}.png`;
      card.addEventListener("click", flipCard);
    } else {
      card.style.display = "none";
      card.removeEventListener("click", flipCard);
    }
  });

  startTimer(difficulties[difficulty].timeLimit);
}

// Difficulty button event listeners
Object.keys(difficultyButtons).forEach((level) => {
  difficultyButtons[level].addEventListener("click", () => {
    shuffleCard(level);
    updateDifficultyButtonStyles(level);
  });
});

// Update button styles to show selected difficulty
function updateDifficultyButtonStyles(selected) {
  Object.keys(difficultyButtons).forEach((level) => {
    if (level === selected) {
      difficultyButtons[level].classList.add("selected");
    } else {
      difficultyButtons[level].classList.remove("selected");
    }
  });
}

// Initialize game with default difficulty
shuffleCard(currentDifficulty);
updateDifficultyButtonStyles(currentDifficulty);

// enabling flipCard
cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});

const mainMenu = document.querySelector(".mc-game-menu");
const mainGame = document.querySelector(".wrapper");
