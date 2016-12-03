/**
 * Created by Charlotte Roche on 25/10/2016.
 * Contribution Log: Name/Date/Description
 * Peter Henderson/29/10/2016/Added game structure, start game function - updated to add content from original main.js file.
 * Peter Henderson/30/10/2016/Completely reworked gameflow to allow for waiting for user click for their move.
 * Peter Henderson/17/11/2016/Rewrote aiShipsAlive to work with a dynamic number of ships
 */


var xLength = 10;
var yLength = 10;
var difficulty = 'easy';
var playerTurn = true;
var AIthoughts = 0;
//default settings
getSettings();
startGame(xLength, yLength, difficulty, playerTurn);
var aiScore = aiShipsAlive();
var userScore = playerShipsAlive();

function startGame(xLength, yLength, difficulty, playerTurn) {//configures and starts the game

    player = new player('Pete', xLength, yLength);
    AI = new AI(xLength, yLength, difficulty);
    player.definePlayerFleetHack();
    player.drawInitialGrid(xLength, yLength);
    AI.drawInitialGrid(xLength, yLength);
    //debug console.log(player.grid);
    //debug console.log(AI.grid);
    refreshTime();
    if (playerTurn === 'false') {
        makeAIMove();  //when player turn, function is started onclick
    }

}
;

function getSettings() {
    var parts = window.location.search.substr(1).split("&");
    var $_GET = {};
    for (var i = 0; i < parts.length; i++) {
        var temp = parts[i].split("=");
        $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }

    if ($_GET.hasOwnProperty('boardsize')) {
        xLength = $_GET['boardsize'];
        yLength = $_GET['boardsize'];
    }
    if ($_GET.hasOwnProperty('difficulty')) {
        difficulty = $_GET['difficulty'];
    }
    if ($_GET.hasOwnProperty('playerTurn')) {
        playerTurn = $_GET['playerTurn'];
    }

}
;

function startPlayerMove(target) {
    $('#aigameboard').children().off('click');
    console.log(target);
    player.makePlayerMove(target);
    //var userScore = playerShipsAlive();

    if (gameWon === true) {
        endGame();
    } else
    {
        setTimeout(function () {
            AI.think();
        }, 2000);
        setTimeout(function () {
            makeAIMove();
        }, 4300)
    }
    document.getElementById("pscore").innerHTML = "Your Score: " + aiShipsAlive();
}
;
function makeAIMove() {

    AI.makeComputerMoveEasy();
    aiShipsAlive();
    playerTurn = true;
    var aiScore = aiShipsAlive();

    if (gameWon === true) {
        endGame();
    }
    setTimeout(function () {
        restoreOnClick();
    }, 3000);
    document.getElementById("cscore").innerHTML = "Computer's Score: " + playerShipsAlive()
}
;
function restoreOnClick() {


    for (var i = 0; i < player.moveList.length; i++) {
        locat = 'ai' + player.moveList[i];
        $($(jq(locat))).on('click', function () {
            startPlayerMove(this.id);
        });

    }
}
;

function endGame() {
    alert("Games Over");//should probs do something a little more interesting here
}
;
function aiShipsAlive() {

    var deadAIShipCount = AI.ship.length;
    for (var i = 0; i < AI.ship.length; i++) {
        if (AI.ship[i].checkIsAlive()) {
            deadAIShipCount--;
        }
    }
    if (deadAIShipCount === AI.ship.length) {
        endGame();
    }
    return deadAIShipCount;
}
;

function playerShipsAlive() {
    var deadPlayerShipCount = 5;
    if (PlayerShip1.checkIsAlive()) {
        deadPlayerShipCount--;
    }
    if (PlayerShip2.checkIsAlive()) {
        deadPlayerShipCount--;
    }
    if (PlayerShip3.checkIsAlive()) {
        deadPlayerShipCount--;
    }
    if (PlayerShip4.checkIsAlive()) {
        deadPlayerShipCount--;
    }
    if (PlayerShip5.checkIsAlive()) {
        deadPlayerShipCount--;
    }
    if (deadPlayerShipCount === 5) {
        endGame();
    }
    return deadPlayerShipCount;
}
