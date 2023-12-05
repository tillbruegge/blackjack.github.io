let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;
let playerDeck;
let dealerDeck;
let playerHands;
let dealerHands;

let canHit = true; //allows the player (you) to draw while yourSum <= 21
let roundOver = false;
let no_round = sessionStorage.getItem("someVarKey");

if (parseInt(no_round) > 0) {} else {
let no_round = "0";
sessionStorage.setItem("someVarKey", no_round);
}

window.onload = function() {
    let no_round = sessionStorage.getItem("someVarKey");
    i = parseInt(no_round);
    buildDealerDeck(i);
    buildPlayerDeck(i);
    startGame();
}



function nextRound() {
    if (!roundOver) {
      return;
    }
    let no_round = sessionStorage.getItem("someVarKey");
    i = parseInt(no_round)
    i += 1
   
      if (i < 20) {
        console.log(i);
        sessionStorage.setItem("someVarKey", String(i));
        window.location.reload();
    } else {
        // Display thanks for playing message
        document.getElementById("game-message-container").innerHTML = "<p>Thanks for playing! You can now press continue.</p>";
    }
}

function buildPlayerDeck(i) {
  playerHands = [["2-H","K-S","10-C"],
                ["10-C","A-S","Q-D"],
                ["4-S","10-C","9-D"],
                ["2-C","9-D","K-D"],
                ["2-H","10-H","7-S"],
                ["K-H","Q-C","A-H"],
                ["4-S","7-D","3-S", "J-C"],
                ["7-S","3-S","5-H", "Q-S"],
                ["9-D","2-D","J-C"],
                ["K-D","Q-S","2-C", "A-D"],
                ["J-S","3-H","5-H","8-C","4-H"],
                ["6-H","A-S","8-D","10-H"],
                ["9-S","2-H","2-C","5-C","J-S"],
                ["10-S","2-H","5-S","7-D","6-C"],
                ["10-H","A-C","8-D","2-D"],
                ["J-S","Q-S","7-H","3-H"],
                ["K-D","5-D","3-S","10-S"],
                ["5-D","9-S","8-D","3-C"],
                ["8-H","10-D","6-S","4-C"],
                ["4-H","A-C","9-S","10-D"]
                ];

  playerDeck = playerHands[i]
  console.log(playerDeck);
}

function buildDealerDeck(i) {
  dealerHands = [["9-H","Q-C"],
                ["5-C","4-S","K-D"],
                ["8-H", "K-D","2-S"],
                ["8-D","10-S"],
                ["9-H","6-C","Q-H"],
                ["9-C","J-D"],
                ["10-S","5-C","Q-H"],
                ["9-S","2-S","J-D"],
                ["9-H","10-C"],
                ["5-H","10-S","3-D"],
                ["J-H","4-D","K-H"],
                ["9-D","6-S","7-S"], 
                ["10-S","3-D","Q-C"],
                ["Q-S","6-D","J-H"],
                ["10-C","6-C","4-S"],
                ["7-S","K-D"],
                ["9-D","Q-S"],
                ["2-H","6-C","10-H"],
                ["8-H","9-H"],
                ["7-C","K-S"]
                ];
  dealerDeck = dealerHands[i]
  console.log(dealerDeck);
}

function startGame() {
    hidden = dealerDeck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = dealerDeck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = playerDeck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("nextRound").addEventListener("click", nextRound); 

}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = playerDeck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You win!";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    roundOver = true

}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

//newGame(0)
