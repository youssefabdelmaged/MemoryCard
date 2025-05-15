// Difficulty settings
const difficulties = {
  easy: { pairs: 8, timeLimit: 180 },
  medium: { pairs: 8, timeLimit: 120 },
  hard: { pairs: 8, timeLimit: 90 },
};

let currentDifficulty = "medium";
let playerName = "";
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let timer;
let time = 0;

// DOM elements
const cards = document.querySelectorAll(".card");
const timerElement = document.getElementById("timer");
const messageElement = document.getElementById("message");
const startButton = document.getElementById("start-button");
const nameInput = document.getElementById("name-input");
const difficultySelect = document.getElementById("difficulty-select");
const mainMenu = document.querySelector(".mc-game-menu");
const mainGame = document.querySelector(".wrapper");
const scoreList = document.getElementById("score-list");

// Start timer
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
      endGame(false); // Game lost
    }
  }, 1000);
}

// Stop timer
function stopTimer() {
  clearInterval(timer);
}

// Flip card
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
      endGame(true); // Game won
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

// Shuffle cards
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

// End game
function endGame(won) {
  stopTimer();
  disableDeck = true;
const score = won ? time * matched : matched * 10;

  // Prepare message element for smooth fade-in and grow
  messageElement.style.opacity = 0;
  messageElement.style.maxHeight = "10px";
  messageElement.style.maxWidth = "390px";
  messageElement.style.overflow = "hidden";
  messageElement.style.display = "flex";
  messageElement.style.whiteSpace = "normal";
  messageElement.style.transition = "opacity 1.5s ease, max-height 1.5s ease";

  // Set message text
  messageElement.textContent = won
    ? `You win! Congratulations, ${playerName}`
    : `You lose! Time's up, ${playerName}.`;

  // Trigger fade-in and grow
  setTimeout(() => {
    messageElement.style.opacity = 1;
    messageElement.style.maxHeight = "300px";
  }, 50);

  // Save score to local storage
  saveScore(playerName, score);

  // Clear user input fields
  nameInput.value = "";
  difficultySelect.value = "easy";

  setTimeout(() => {
    // Fade out and shrink message before hiding game
    messageElement.style.opacity = 0;
    messageElement.style.maxHeight = "0px";
    setTimeout(() => {
      mainMenu.style.display = "flex";
      mainGame.style.display = "none";
      messageElement.style.display = "none";
      updateLeaderboard();
    }, 1500);
  }, 3000);
}

// Function to generate a readable unique ID
function generateNumericId(existingIds = []) {
  if (existingIds.length === 0) {
    return 1;
  }

  const maxId = Math.max(...existingIds);
  return maxId + 1;
}

// Save score to local storage
function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  const existingIds = scores.map((item) => item.id).filter((id) => !isNaN(id));
  const id = generateNumericId(existingIds);
  scores.push({ id, name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("scores", JSON.stringify(scores));
}

// Update leaderboard
function updateLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scoreList.innerHTML = scores
    .map((entry) => `<div>  ${entry.name} - ${entry.score}</div>`)
    .join("");
}

mainGame.style.display = "none";

// Start button event listener
startButton.addEventListener("click", () => {
  playerName = nameInput.value.trim();
  const selectedDifficulty = difficultySelect.value;

  if (!playerName) {
    alert("Please enter your name.");
    return;
  }

  if (!selectedDifficulty) {
    alert("Please select a difficulty.");
    return;
  }

  mainMenu.style.display = "none";
  mainGame.style.display = "block";

  shuffleCard(selectedDifficulty);
});

updateLeaderboard();
