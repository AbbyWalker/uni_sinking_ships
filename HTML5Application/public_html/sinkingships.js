
/**
 * Created by Charlotte Roche on 25/10/2016.
 * Contribution Log: Name/Date/Description
 * Peter Henderson/29/10/2016/Added game structure, start game function - updated to add content from original main.js file.
 * Peter Henderson/30/10/2016/Completely reworked gameflow to allow for waiting for user click for their move.
 * Peter Henderson/17/11/2016/Rewrote aiShipsAlive to work with a dynamic number of ships
 * Peter Henderson/22/01/2017/Added multi shot into the logic for AI and Player Moves
 */
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
        return parts.pop().split(";").shift();
}

var playerSettings = getCookie('playerSettings');
var playerSettings = JSON.parse(playerSettings);

var xLength = playerSettings.xLength;
var yLength = playerSettings.yLength;
var difficulty = playerSettings.difficulty;
var playerTurn = playerSettings.playerTurn;
var AIthoughts = 0;
var debug = true; //turn AI thinking on or off / true or false
//default settings
var gameWon = false;
setHalfVolume();

startGame(xLength, yLength, difficulty, playerTurn);
var userScore = aiShipsAlive();
var aiScore = playerShipsAlive();

function startGame(xLength, yLength, difficulty, playerTurn) {
    //configures and starts the game

    player = new player('Pete', xLength, yLength);
    AI = new AI(xLength, yLength, difficulty);
    player.definePlayerFleetMVP();
    player.drawInitialGrid(xLength, yLength);
    AI.drawInitialGrid(xLength, yLength);
    
    refreshTime();
    if (playerTurn === 'false') {
        AIthinkAndMove();  
    } else {
        //when player goes first, function is started onclick
        $("#turn").text("Player Go");
        $("#turn").css({'color': 'blue'});
    }

}
;


function startPlayerMove(target) {
  //player move logic.
    $('#aigameboard').children().off('click'); // deactivates grid buttons so player can only make a move when expected

    player.makePlayerMove(target);  
    if (gameWon == true) {
        endGame();
    }
    if (!debug && !AI.missNextGo && player.extraShot === 0)
    {
        AIthinkAndMove();
    } else if (!AI.missNextGo && player.extraShot === 0) 
    {
        makeAIMove();
    } else if (player.extraShot === 0)
    {
        AI.missNextGo = false;

    } else
    {
        player.extraShot = player.extraShot - 1;
        restoreOnClick();
    }
    ;
    document.getElementById("pscore").innerHTML = "Your Score: " + aiShipsAlive();
    if(aiShipsAlive == 5){
        gameWon = true;
    }
}
;
function makeAIMove() {
    
//High level AI Move logic
    if (difficulty == "easy") {
        AI.makeComputerMoveEasy();
    } else if (difficulty == "medium") {
        AI.makeComputerMoveMed();
    } else if (difficulty == "hard") {
        AI.makeComputerMoveHard();
    } else {
        window.alert("Error: Difficulty setting not detected. ");
    }
    aiShipsAlive();
    playerTurn = true;

    if (gameWon == true) {
        endGame();
    }
//below segment decides whether to give AI another go or end
    if (AI.extraShot > 0) {
        AI.extraShot = AI.extraShot - 1;
        if (!debug && !AI.missNextGo)
        {
            AIthinkAndMove();
        } else if (!AI.missNextGo) {
            makeAIMove();
        } else {
            AI.missNextGo = false;
        }
    } else if (player.missNextGo === true) {
        player.missNextGo = false;
        if (!debug && !AI.missNextGo)
        {
            AIthinkAndMove();
        } else if (!AI.missNextGo) {
            makeAIMove();
        } else {
            AI.missNextGo = false;
        }
    } else if (debug) {
        restoreOnClick();
    } else {
        setTimeout(function () {
            restoreOnClick();
        }, 3000);
    }
    AI.aiScoreChange();
    document.getElementById("cscore").innerHTML = "Computer's Score: " + playerShipsAlive()
    if (playerShipsAlive() == 5){
        gameWon = true;
    }

}
;
function restoreOnClick() {

//iterates through each possible move that hasnt been made and reactivates the onclick function
    for (var i = 0; i < player.moveList.length; i++) {
        locat = 'ai' + player.moveList[i];
        $($(jq(locat))).on('click', function () {
            startPlayerMove(this.id);
        });
    }
    $("#turn").text("Player Go");
    $("#turn").css({'color': 'blue'});
}
;

function endGame() {
    var winner;
    if (userScore == 5){
        winner = 'You';
    }
    else if (aiScore == 5){
        winner = 'Computer';
    }
    window.document.location.href = 'popup.html';
}
;
function aiShipsAlive() {
//Iterates through AI fleet to check score/if game is over
    var deadAIShipCount = AI.ship.length;
    for (var i = 0; i < AI.ship.length; i++) {
        if (AI.ship[i].checkIsAlive()) {
            deadAIShipCount--;
        }
    }
    //if (deadAIShipCount == AI.ship.length) {
      //  gameWon = true
    //}
    return deadAIShipCount;
    
}
;

function playerShipsAlive() {
    
    //checks all of the player ships to find the score/see if game is over
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
    if (deadPlayerShipCount === 0) {
        //gameWon = true;
    }
    return deadPlayerShipCount;
}

;
