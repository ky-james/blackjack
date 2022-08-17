var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; 

var hidden;
var deck;

var canHit = true;

var balance = 500;
var bet;

var yourCards = [];
var dealerCards = []


/*
                MAIN ELEMENTS
COMPLETED
blackJack()
dealerBlackJack()
redid win conditions
payouts - commit made
proper dealer dealings
hide hit/stand buttons after game is done
if player busts, game ends

CURRENTLY DOING:

TODO:
customizeable bets
if player has no $, can't play
chip animations

                SECONDARY ELEMENTS
TODO:
time delay for the dealer's cards
*/


window.onload = function() {
    document.getElementById('play-again').style.visibility = 'hidden';
    document.getElementById('balance').innerText = 500;
    buildDeck();-
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); 
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerCards.push(hidden);
    hiddenImg = document.createElement("img");
    hiddenImg.src = "./cards/BACK.png";
    document.getElementById("dealer-cards").append(hiddenImg);
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    showing = deck.pop();
    dealerCards.push(showing);
    showingImg = document.createElement('img');
    showingImg.src = "./cards/" + showing + ".png";
    document.getElementById("dealer-cards").append(showingImg);
    dealerSum += getValue(showing);
    dealerAceCount += checkAce(showing);

    bet = 50;
    balance -= bet;

    document.getElementById('your-sum').innerText = "";
    document.getElementById('dealer-sum').innerText = "";
    document.getElementById("bet").innerText = bet;
    document.getElementById('hit').style.visibility = 'visible';
    document.getElementById('stand').style.visibility = 'visible';

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        yourCards.push(card);
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);

    if (blackJack()){
        stand();
    }
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    yourCards.push(card);
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
        stand();
    }

}

function stand() {

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        dealerCards.push(card);
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        dealerSum = reduceAce(dealerSum, dealerAceCount);
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById('dealer-cards').children[0].src = "./cards/" + hidden + ".png";

    let message = "";

    if (!dealerBlackJack() && blackJack()){
        message = "Black Jack!";
        balance += 3*bet;
        bet = 0;
    }

    else if (yourSum > 21){
        message = "You Bust!";
        bet = 0;
    }

    else if (dealerSum > 21){
        message = "Dealer Busts!";
        balance += 2*bet;
        bet = 0;
    }

    else if (yourSum > dealerSum){
        message = "You Win!"
        balance += 2*bet;
        bet = 0;
    }

    else if (yourSum < dealerSum){
        message = "You Loose!";
        bet = 0;
    }

    else if (yourSum == dealerSum){
        message = "Push";
        balance += bet;
        bet = 0;
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    document.getElementById('stand').style.visibility = 'hidden';
    document.getElementById('hit').style.visibility = 'hidden';
    document.getElementById('play-again').style.visibility = 'visible';
    document.getElementById("play-again").addEventListener("click", playAgain);
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) { 
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

function playAgain(){
    dealerSum = 0;
    yourSum = 0;

    dealerAceCount = 0;
    yourAceCount = 0; 

    canHit = true;

    yourCards = [];
    dealerCards = [];

    document.getElementById("balance").innerText = balance;

    while (document.getElementById("your-cards").firstChild){
        document.getElementById("your-cards").removeChild(document.getElementById("your-cards").firstChild);
    }

    while (document.getElementById("dealer-cards").firstChild){
        document.getElementById("dealer-cards").removeChild(document.getElementById("dealer-cards").firstChild);
    }

    document.createElement("hidden");
    document.getElementById('play-again').style.visibility = 'hidden';

    document.getElementById("results").innerText = "";

    buildDeck();
    shuffleDeck();
    startGame();
}

function blackJack(){
    let ace = false;
    let ten = false;    

    if (yourCards.length == 2){

        for (let i = 0; i < 2; i ++){

            if (yourCards[i][0] == "J" || yourCards[i][0] == "Q" || yourCards[i][0] == "K" || (yourCards[i][0] == "1" && yourCards[i][1] == "0")){
                ten = true;
            }
            else if (yourCards[i][0] == "A"){
                ace = true;
            }
        }
    }

    return (ace && ten);

}

function dealerBlackJack(){
    let ace = false;
    let ten = false;    

    if (dealerCards.length == 2){

        for (let i = 0; i < 2; i ++){

            if (dealerCards[i][0] == "J" || dealerCards[i][0] == "Q" || dealerCards[i][0] == "K" || (dealerCards[i][0] == "1" && dealerCards[i][1] == "0")){
                ten = true;
            }
            else if (dealerCards[i][0] == "A"){
                ace = true;
            }
        }
    }

    return (ace && ten);
}