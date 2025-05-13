const cards = document.querySelectorAll(".card");

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

let timer;
let time = 0;
const timerElement = document.getElementById("timer");
const messageElement = document.getElementById("message");
const TIME_LIMIT = 120;

//start timer

function startTimer() {
    time = TIME_LIMIT;
    messageElement.style.display = "none";
    timerElement.textContent = Time: ${time}s;
    timer = setInterval(() => {
        time--;
        timerElement.textContent = Time: ${time}s;
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
function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}