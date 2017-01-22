/* 
 *Author: Peter Henderson
 *Date: 18/10/2016
 *Contribution Log: Name/Date/Description
 *Peter Henderson 17/11/2016 Added functions buildAIFleet, getRandShipLocation and validateShipLocation to allow random ship placement
 *
 */

function AI(xSize, ySize, difficulty) {
    this.difficulty = difficulty;
    this.ship = [];
    this.mine = [];
    this.moveList = this.buildMoveList(xSize, ySize);
    this.grid = new Grid(xSize, ySize);
    this.buildAIFleet(1, 1, 1, 1, 1, 2);
    this.moveList = this.buildMoveList(xSize, ySize); //restore Movelist as buildAIFleet mangles it
    this.hitAI = [];
    this.missedAI = [];
    this.missNextGo = false;
    this.extraShot = 0;
    this.counter = 0;
    this.firstStep = [];
    this.secondStep = [];
    // Verticle or horizontal
    this.direction = null;
    // positive or negative
    this.direction2 = null;
    this.sunkLastTurn = 0;
    this.currentScore = 0;
    this.lastTurnsNotEqual = 0;
    this.extraShotOption = 0;

}

AI.prototype = {
    constructor: AI,
    aiScoreChange : function () {

        if (this.currentScore<playerShipsAlive()) {
            this.sunkLastTurn = 1;
            this.counter = 0;
            this.firstStep = [];
            this.secondStep = [];
            // Verticle or horizontal
            this.direction = null;
            // positive or negative
            this.direction2 = null;
            this.status = "none"; 
            this.currentScore = playerShipsAlive();
            

        } else {
            this.sunkLastTurn = 0;
           // if (this.extraShotOption <2) {
           //     console.log("extra shot for AI");
           //     this.extraShot = 2;
           //     this.extraShotOption = this.extraShotOption + 1;
           // }
        }
        
    },
    makeComputerMoveEasy: function () {

        var move = AI.getRandMove();
        var coord = move.split(',').map(Number);
        var x = coord[0];
        var y = coord[1];
        player.grid.fireAtLocation(x, y, false);
        removeItemFromArray(this.moveList, move);
    },
    makeComputerMoveMed: function () {

        if (this.status === "none" ){
            // AI's first move so should be random
            this.status = "gameStarted";
            AI.makeComputerMoveEasy();
        } else if (this.hitLastTurn === 1) {  
            // AI's last go resulted in a hit
            if (this.sunkLastTurn ===1) {
                // AI's last go resulted in sunk ship, should have random move
                AI.makeComputerMoveEasy();
            }
            if (this.status === "hitNextSqaure") {
                AI.hitNextSquare();
            } else if (this.status === "hitOppEndRow") {
                AI.hitOppEndRow();
            } else {
               AI.hitAdjSquare(); 
            }
        } else if (this.status === "hitAdjSquare") {
            AI.hitAdjSquare();
        } else {
            AI.makeComputerMoveEasy();
        }
    },
    makeComputerMoveHard: function () {

        
        // If the AI's last go was a hit + first hit for a ship
        if (this.counter === 1){
            
            // try hit next square along
            this.status = "hitNextSquare";
            AI.hitNextSquare();
        }
                
        
        // If the AI has had two hits
        else if (this.counter>1 && this.counter<3) {
            // AI needs to work out the direction of the ship

            // Take first hit and take x,y vals
            var moveOne = this.firstStep;
            var xOne = moveOne[0];
            var yOne = moveOne[1];

            // Take second hit and take x,y vals
            var moveTwo = this.secondStep;
            var xTwo = moveTwo[0];
            var yTwo = moveTwo[1];

            if (xOne === xTwo ){
                // Same row therefore East/ West direction
                this.direction = "verticle";
                // go to AI.smartMove to continue turn
                AI.smartMove();
                
            } else if (yOne === yTwo) {
                // North/ South direction
                this.direction = "horizontal";
                // go to AI.smartMove to continue turn
                AI.smartMove();
            } else {
                // ERROR
                window.alert("Error: AI doesn't recognise direction");
            }
        
        }
        
        // If the AI has had more than two hits against one ship
        else if(this.counter>2 ) {
            // go to AI.smartMove
           AI.smartMove(); 
            
        // If AI had no hits and first turn
        } else if (this.status === "none" ){
            // AI's first move so should be random    
            this.status = "gameStarted";
            // Make a random move
            AI.makeComputerMoveEasy();
            
        } else {
            // AI hasn't hit, random move needed
            AI.makeComputerMoveEasy();
        }
       
        
    },
    smartMove: function() {
        // x, y vals of last move which was a hit
        var hitMove = this.lastHitTurn;
        var hitX = hitMove[0];
        var hitY = hitMove[1];

        // x, y vals of last move
        var lastMove = this.lastTurn;
        var lastX = lastMove[0];
        var lastY = lastMove[1];
            
        // Take first hit and take x,y vals
        var moveOne = this.firstStep;
        var xOne = moveOne[0];
        var yOne = moveOne[1];
            
        // Take second hit and take x,y vals
        var moveTwo = this.secondStep;
        var xTwo = moveTwo[0];
        var yTwo = moveTwo[1];
            
        console.log("In smartMove");
        console.log("moveOne: " +moveOne);
        console.log("moveTwo: " +moveTwo);
        console.log("hitMove: "+ hitMove);
        console.log("lastMove: " + lastMove);
        console.log("direction: " + this.direction);
        console.log("direction2: "+ this.durection2);
        
        if (this.direction2 !== null) {
            AI.smartMovePart2();
        }
        
        if (lastX!= hitX && lastY != hitY) {
            // if the last go was a miss then it may need to start firing
            // at other end of ship
            console.log("made it here");
            if (this.direction2 === "positive") {
                this.direction2 = "negative";
            } else if(this.direction2 === "negative") {
                this.direction2 = "positive";
            } else {
               this.direction2 = null; 
            }
            
        }
            
        // Calculating if direction2 is negative or positive
        if (lastX===hitX && lastY === hitY){
            this.lastTurnsNotEqual = 0;

                        
            if (yOne>yTwo) {
                // positve
                if (hitX>(xLength-1) ||  hitY>(yLength-1)   || hitX<0 || hitY<0) {
                    // validating position is not off board, if so will need to
                    // go back in opposite direction
                this.direction2 = "positive";
                } else {
                    this.direction2 = "negative";
                }
                
            } else if (yOne<yTwo){
                // minus
                if (hitX>(xLength-1) ||  hitY>(yLength-1)  || hitX<0 || hitY<0 ) {
                    // validating position is not off board, if so will need to
                    // go back in opposite direction
                    this.direction2 = "negative";
                } else {
                   this.direction2 = "positive"; 
                }
                
            } else if (xOne>xTwo) {
                // positve
                if (hitX>(xLength-1) ||  hitY>(yLength-1)  || hitX<0 || hitY<0 ) {
                    // validating position is not off board, if so will need to
                    // go back in opposite direction
                    this.direction2 = "positive";
                } else {
                    this.direction2 = "negative";
                }
            } else if (xOne<xTwo){
                // minus
                if (hitX>(xLength-1) ||  hitY>(yLength-1)  || hitX<0 || hitY<0 ) {
                    // validating position is not off board, if so will need to
                    // go back in opposite direction
                    this.direction2 = "negative";
                } else {
                    this.direction2 = "positive";
                }
            }
            
        
       // } else if (this.direction2 === "positive") {
       //    this.direction2 = "negative";
       // } else if(this.direction2 === "negative") {
       //    this.direction2 = "positive";
        } else if (this.direction2 === null) {

            if (yOne>yTwo) {
                // negative
                if (hitX>(xLength-1) ||  hitY>(yLength-1)  || hitX<0 || hitY<0 ) {
                    // validating position is not off board, if so will need to
                    // go back in opposite direction
                    this.direction2 = "positive";
                } else {
                    this.direction2 = "negative"; 
                }
                    
            } else if (yOne<yTwo){
                // negative
                if (hitX>(xLength-1) ||  hitY>(yLength-1) || hitX<0 || hitY<0 ) {
                    this.direction2 = "positive";
                } else {
                    this.direction2 = "negative";
                }
           } else if (xOne>xTwo) {
                // negative
                if (hitX>(xLength-1) ||  hitY>(yLength-1)  || hitX<0 || hitY<0) {
                    this.direction2 = "positive";
                } else {
                    this.direction2 = "negative";
                }
            } else if (xOne<xTwo){
                if (hitX>(xLength-1) ||  hitY>(yLength-1) || hitX<0 || hitY<0 ) {
                    this.direction2 = "negative";
                } else {
                // positive
                    this.direction2 = "positive";
                }
            } 
        }
        console.log("Did the direction2 set: " + this.direction2);
        AI.smartMovePart2();
    },

    smartMovePart2: function() {
        // x, y vals of last move which was a hit
        var hitMove = this.lastHitTurn;
        var hitX = hitMove[0];
        var hitY = hitMove[1];

        // x, y vals of last move
        var lastMove = this.lastTurn;
        var lastX = lastMove[0];
        var lastY = lastMove[1];
            
        // Take first hit and take x,y vals
        var moveOne = this.firstStep;
        var xOne = moveOne[0];
        var yOne = moveOne[1];
            
        // Take second hit and take x,y vals
        var moveTwo = this.secondStep;
        var xTwo = moveTwo[0];
        var yTwo = moveTwo[1];
        
        if (lastX!= hitX && lastY != hitY) {
            // if the last go was a miss then it may need to start firing
            // at other end of ship
            console.log("made it here2");
            if (this.direction2 === "positive") {
                this.direction2 = "negative";
            } else if(this.direction2 === "negative") {
                this.direction2 = "positive";
            } 
        }
        
        // var coord with be location to move too
        var coord = hitX + "," + hitY; 
        // keepLooking is a variable to keep looping through below to look for 
        // a new move
        var keepLooking = 2;
            
        console.log("start of part 2, direction2: " + this.direction2);
        // Find if hit ship are to left or right of last go
        if (this.direction === "horizontal"){
            if(this.direction2 === "positive"){
                // find next positive move which is in moveList
                while (keepLooking === 2) {
                    // look at next coord and see if in moveList
                    coord = hitX + "," + hitY;
                    if (hitX>(xLength-1) ||  hitY>(yLength-1)  || hitX<0 || hitY<0) {
                        if (this.direction2 === "positive") {
                            this.direction2 = "negative";
                            console.log("direction2 should be opp: " + this.direction2);
                            console.log("HAD TO COMPLETE RESET DIRECTION2");
                            AI.smartMovePart2();
                        } else if(this.direction2 === "negative") {
                            this.direction2 = "positive";
                            console.log("direction2 should be opp: " + this.direction2);
                            console.log("HAD TO COMPLETE RESET DIRECTION2");
                            AI.smartMovePart2();
                        }
                    }
                    if (this.moveList.includes(coord)) {
                        // Found a move to try, break loop by 
                        keepLooking = 1;
                        // make move:
                        // validation of board size

                        this.status = "hitNextSqaure";
                        player.grid.fireAtLocation(hitX, hitY, false);
                        var remove = hitX + ',' + hitY;
                        this.direction2 = null;
                        removeItemFromArray(this.moveList, remove);
                    } else {
                        hitX = hitX + 1; 
                    }
                }
                                       
                                       
            } else if (this.direction2 === "negative"){
                // find next negative move which is in moveList
                while (keepLooking === 2) {
                    // look at next coord and see if in moveList
                    coord = hitX + "," + hitY;
                    if (hitX>(xLength-1) ||  hitY>(yLength-1) || hitX<0 || hitY<0) {
                        if (this.direction2 === "positive") {
                            this.direction2 = "negative";
                            console.log("direction2 should be opp: " + this.direction2);
                            console.log("HAD TO COMPLETE RESET DIRECTION2");
                            AI.smartMovePart2();
                        } else if (this.direction2 === "negative") {
                            this.direction2 = "positive";
                            console.log("direction2 should be opp: " + this.direction2);
                            console.log("HAD TO COMPLETE RESET DIRECTION2");
                            AI.smartMovePart2();
                        }
                    }
                    if (this.moveList.includes(coord)) {
                        // Found a move to try, break loop 
                        keepLooking = 1;
                        // make move:
                        this.status = "hitNextSqaure";
                        player.grid.fireAtLocation(hitX, hitY, false);
                        this.direction2 = null;
                        var remove = hitX + ',' + hitY;
                        removeItemFromArray(this.moveList, remove);
                    } else {
                        hitX = hitX - 1; 
                    }
                }
            } 



        } else if (this.direction === "verticle"){ 
            if(this.direction2 === "positive"){
                while (keepLooking === 2) {
                    // look at next coord and see if in moveList
                    coord = hitX + "," + hitY;
                    if (hitX>(xLength-1) || hitY>(yLength-1)  || hitX<0 || hitY<0 ) {
                        if (this.direction2 === "positive") {
                            this.direction2 = "negative";
                            console.log("direction2 should be opp: " + this.direction2);
                            console.log("HAD TO COMPLETE RESET DIRECTION2");
                            AI.smartMovePart2();
                        } else if(this.direction2 === "negative") {
                            this.direction2 = "positive";
                            console.log("direction2 should be opp: " + this.direction2);
                            console.log("HAD TO COMPLETE RESET DIRECTION2");
                            AI.smartMovePart2();
                        }
                    }
                    if (this.moveList.includes(coord)) {
                        // Found a move to try, break loop 
                        keepLooking = 1;
                        // make move:
                        this.status = "hitNextSqaure";
                        player.grid.fireAtLocation(hitX, hitY, false);
                        var remove = hitX + ',' + hitY;
                        this.direction2 = null;
                        removeItemFromArray(this.moveList, remove);
                    } else {
                        hitY = hitY + 1;                     
                    }
                }
                    
                    
                    
            } else if (this.direction2 === "negative"){
                while (keepLooking === 2) {
                    // look at next coord and see if in moveList
                    coord = hitX + "," + hitY;
                    if (hitX>(xLength-1) ||  hitY>(yLength-1) || hitX<0 || hitY<0) {
                        if (this.direction2 === "positive") {
                            this.direction2 = "negative";
                            console.log("direction2 should be opp: " + this.direction2);
                            console.log("HAD TO COMPLETE RESET DIRECTION2");
                            AI.smartMovePart2();
                        } else if(this.direction2 === "negative") {
                            this.direction2 = "positive";
                            console.log("direction2 should be opp: " + this.direction2);
                            console.log("HAD TO COMPLETE RESET DIRECTION2");
                            AI.smartMovePart2();
                        }
                    }
                    if (this.moveList.includes(coord)) {
                        // Found a move to try, break loop 
                        keepLooking = 1;
                        // make move:
                        this.status = "hitNextSqaure";
                        player.grid.fireAtLocation(hitX, hitY, false);
                        var remove = hitX + ',' + hitY;
                        removeItemFromArray(this.moveList, remove);
                    } else {
                         hitY = hitY - 1;                         
                    }
                } 
            } 
        }       
    },

    hitNextSquare: function () { 
       // list of adjacent squares to last move
       // clear status
        this.status = "gameStarted";
        var move = this.lastHitTurn;
        var x = move[0];
        var y = move[1];

        var adjSquares = [[x+1, y] // one below
                            , [x-1, y] // one above
                            , [x, y-1] // one to left
                            , [x, y+1]]; // one to the right

        // loop through each array in ajsSquares
        for(var i = 0; i < adjSquares.length; i++) {
            var temp = adjSquares[i];
            var coord1 = temp[0] + "," + temp[1];
            if (this.moveList.includes(coord1)) {
                var alreadyHitX = temp[0];
                var alreadyHitY = temp[1];
                }
        } 
        if (alreadyHitX > x) {
            //  it's row below, same y val
            // fire at (x+1, y);
            if (alreadyHitX>(xLength-1) ||  alreadyHitY>(yLength-1) ) {
               this.status = "hitAdjSquare"; 
               AI.hitAdjSquare();
            }
            player.grid.fireAtLocation(alreadyHitX, alreadyHitY, false);
            var remove = alreadyHitX + ',' + alreadyHitY;
            removeItemFromArray(this.moveList, remove);
            if (this.hitLastTurn === 0) {
                this.status = "hitOppEndRow";
            } else {
                this.status = "hitNextSqaure";
            }
            
                    
        } else if (alreadyHitX < x) {
            //  it's row above above, same y val
            // fire at (x-1, y);
            if (alreadyHitX>(xLength-1) ||  alreadyHitY>(yLength-1) ) {
               this.status = "hitAdjSquare"; 
               AI.hitAdjSquare();
            }
            player.grid.fireAtLocation(alreadyHitX, alreadyHitY, false);
            var remove = alreadyHitX + ',' + alreadyHitY;
            removeItemFromArray(this.moveList, remove);
            if (this.hitLastTurn === 0) {
                this.status = "hitOppEndRow";
            } else {
                this.status = "hitNextSqaure";
            }
                   
        } else if (alreadyHitX === x) { 
            //  same row
            if (alreadyHitY > y) {
                //      it's to the right
                // fire at (x, y+1);            
                if (alreadyHitX>(xLength-1) ||  alreadyHitY>(yLength-1) ) {
                    this.status = "hitAdjSquare"; 
                    AI.hitAdjSquare();
                }
                
                player.grid.fireAtLocation(alreadyHitX, alreadyHitY, false);
                var remove = alreadyHitX + ',' + alreadyHitY;
                removeItemFromArray(this.moveList, remove);
                if (this.hitLastTurn === 0) {
                this.status = "hitOppEndRow";
                } else {
                this.status = "hitNextSqaure";
                }
            } else if (alreadyHitY < y) {
                //      it's to the left
                // fire at (x, y-1);
                if (alreadyHitX>(xLength-1) ||  alreadyHitY>(yLength-1) ) {
                    this.status = "hitAdjSquare"; 
                    AI.hitAdjSquare();
                }
                player.grid.fireAtLocation(alreadyHitX, alreadyHitY, false);
                var remove = alreadyHitX + ',' + alreadyHitY;
                removeItemFromArray(this.moveList, remove);
                if (this.hitLastTurn === 0) {
                this.status = "hitOppEndRow";
                } else {
                this.status = "hitNextSqaure";
                }
            }
        } else {
            AI.hitAdjSquare();
        }  
                
    },
   
    hitOppEndRow: function() {
        // clear status
        this.status = "gameStarted";
        // this function is to hit opposite side of row where there has been a miss
        var move = this.lastHitTurn;
        var x = move[0];
        var y = move[1];
        // hit next square along. need a variable to hold last square hit
        // check if left of it been hit already
        var eleID = "p" + String(x) + "," + String(y-1);
        var colour = (document.getElementById(eleID).style.background).trim();
        if (colour === "red") {
            // it's been hit
            // fire at x, y+1
            var coord1 = x + "," + y+1;
            if (this.moveList.includes(coord1)) {
                if (hitX>(xLength-1) ||  hitY>(yLength-1) ) {
                    this.status = "hitAdjSquare"; 
                    AI.hitAdjSquare();
                }
                player.grid.fireAtLocation(x, y+1, false);
                var remove = x + ',' + y+1;
                removeItemFromArray(this.moveList, remove);
                this.status = "brainStepTwo";
            }
        } 
        var eleID = "p" + String(x) + "," + String(y+1);
        var colour = (document.getElementById(eleID).style.background).trim();
        if (colour === "red") {
                //it's been hit
                // fire at x, y-1
            var coord1 = x + "," + y-1;
            if (this.moveList.includes(coord1)) {
                if (hitX>(xLength-1) ||  hitY>(yLength-1) ) {
                    this.status = "hitAdjSquare"; 
                    AI.hitAdjSquare();
                }
                player.grid.fireAtLocation(x, y-1, false);
                var remove = x + ',' + y-1;
                removeItemFromArray(this.moveList, remove);
                this.status = "brainStepTwo";
            }
        }
        // check if above it has been hit already
        var eleID = "p" + String(x-1) + "," + String(y);
        var colour = (document.getElementById(eleID).style.background).trim();
        if (colour === "red") { 
            //it's been hit
            // fire at x+1, y
            var coord1 = x+1 + "," + y;
            if (this.moveList.includes(coord1)) {
                if (hitX>(xLength-1) ||  hitY>(yLength-1) ) {
                    this.status = "hitAdjSquare"; 
                    AI.hitAdjSquare();
                }
                player.grid.fireAtLocation(x+1, y, false); 
                var remove = x+1 + ',' + y;
                removeItemFromArray(this.moveList, remove);
                this.status = "brainStepTwo";
            }
        }
       // check if below it has been hit already
        var eleID = "p" + String(x+1) + "," + String(y);
        var colour = (document.getElementById(eleID).style.background).trim();
        if (colour === "red") {
            //it's been hit
            // fire at x-1, y
            var coord1 = x-1 + "," +y;
            if (this.moveList.includes(coord1)) {
                if (hitX>(xLength-1) ||  hitY>(yLength-1) ) {
                    this.status = "hitAdjSquare"; 
                    AI.hitAdjSquare();
                }
                player.grid.fireAtLocation(x-1, y, false);
                var remove = x-1 + ',' + y;
                removeItemFromArray(this.moveList, remove);
                this.status = "brainStepTwo";
            }
        }
        if (colour == null) {
            this.status = "brainStepTwo";
            AI.brainStepTwo();
        }
        return status;
    },
    hitAdjSquare: function () { 
        // clear status
        this.status = "gameStarted";
        // this function is try hit squares around one which has been hit
        var move = this.lastHitTurn;
        var x = move[0];
        var y = move[1];

        var adjSquares = [[x+1, y] // one below
                            , [x-1, y] // one above
                            , [x, y-1] // one to left
                            , [x, y+1]]; // one to the right

            // loop through each array in ajsSquares
        var thing = 0;
        for(var i = 0; i < adjSquares.length; i++) {
            var temp = adjSquares[i];
            var coord1 = temp[0] + "," + temp[1];
            if (this.moveList.includes(coord1)) {
                //
                var alreadyHitX = temp[0];
                var alreadyHitY = temp[1];
                player.grid.fireAtLocation(alreadyHitX, alreadyHitY, false);
                var remove = alreadyHitX + ',' + alreadyHitY;
                removeItemFromArray(this.moveList, remove);
                if (this.hitLastTurn===1) {
                    this.status = "hitNextSquare";
                } else {
                    this.status = "hitAdjSquare";
                }
                //this.status = "Nothing";
                //return status;
                thing = 1;
                break;
            }
        }
        if (thing===0){
            AI.makeComputerMoveEasy();
        }
            
           
    },

    getRandMove: function () { //selects random move from remainder of move list
        var rand = getRandFromArray(this.moveList);
        return rand;
    },
    think: function () {
        $("#turn").text("Computer Go");
        $("#turn").css({ 'color': 'red'});
        var thought = setInterval(function () {
            AI.think1(thought);
        }, 200);
    },
    think1: function (thought) {
        AIthoughts++;
        if (AIthoughts > 10) {
            AIthoughts = 0;
            clearInterval(thought);
        } else {
            var rand = this.getRandMove();
            var square = "p" + rand;
            AI.think2(square);
        }
    },
    think2: function (square) {
        var prevColor = document.getElementById(square).style.background;
        document.getElementById(square).style.background = 'blue';
        setTimeout(function () {
            AI.think3(square, prevColor);
        }, 200);
    },
    think3: function (square, prevColor) {

        document.getElementById(square).style.background = prevColor;

    },
    buildMoveList: function (xSize, ySize) {
        var moveList = [];
        for (i = 0; i < ySize; i++) {
            for (j = 0; j < xSize; j++) {
                moveList.push(i + ',' + j);
            }
        }
        return moveList;
    },
    drawInitialGrid: function (xLength, yLength) {
        var squareSize = 35;
        var gameBoardContainer = document.getElementById("aigameboard");
        // this has been hard coded for the hack, taken form gridCreation
        // below draws initial grid
        for (i = 0; i < xLength; i++) {
            for (j = 0; j < yLength; j++) {

                // create a new div HTML element for each grid square and make it the right size
                var square = document.createElement("div");
                gameBoardContainer.appendChild(square);
                // give each div element a unique id based on its row and column, like "s00"

                // The ai signifys that it is the id for the players board
                square.id = "ai" + String(i) + "," + String(j);
                // set each grid square's coordinates: multiples of the current row or column number
                var topPosition = j * squareSize;
                var leftPosition = i * squareSize;
                // use CSS absolute positioning to place each grid square on the page
                square.style.top = topPosition + 'px';
                square.style.left = leftPosition + 'px';
            }
        }
        //set click event for player move
        $('#aigameboard').children().one('click', function () {
            startPlayerMove(this.id);
        });
    },
    hitShipDraw: function (x, y) {
        this.counter = this.counter + 1;
        var eleID = "p" + x + "," + y;
        this.hitAI.push(eleID);
        document.getElementById(eleID).style.background = "red";
        this.lastHitTurn = [x,y];
        this.lastTurn = [x,y];
        this.hitLastTurn = 1;

        

        if (this.counter === 1) {
            this.firstStep = [x,y];

        }
        if (this.counter === 2) {
            this.secondStep = [x,y];

        }
        if (this.counter === 5 ){
            AI.counter = 0;
            AI.firstStep = [];
            AI.secondStep = [];
            // Verticle or horizontal
            AI.direction = null;
            // positive or negative
            AI.direction2 = null;
            AI.status = "none"; 
        }
        


    },
    missedShipDraw: function (x, y) {
        var eleID = "p" + x + "," + y;
        this.missedAI.push(eleID);
        document.getElementById(eleID).style.background = "grey";
        this.lastTurn = [x,y];
        this.hitLastTurn = 0;

    },
    hitMineDraw: function (x, y) {
        var eleID = "p" + x + "," + y;
        this.missedAI.push(eleID);
        document.getElementById(eleID).style.background = "black";
        
       
    },
    buildAIFleet: function (carrierCount, battleshipCount, crusierCount, submarineCount, destroyerCount, noOfMines) {
        //Randomly Build AI Fleet
        var shipCount = 0; //index for this.ship array
        var mineCount = 0; //index for this.mine array

        //for each ship type
        for (var i = 0; i < carrierCount; i++) {
            var location = this.getRandShipLocation(5, false); //get positions
            this.ship[shipCount] = new ship('Carrier', 1); //create ship
            this.ship[shipCount].setLocations(location); //add locations
            this.grid.addShip(this.ship[shipCount]); //add ship to grid
            shipCount++;
        }
        for (var i = 0; i < battleshipCount; i++) {
            var location = this.getRandShipLocation(4, false);
            this.ship[shipCount] = new ship('Battleship', 1);
            this.ship[shipCount].setLocations(location);
            this.grid.addShip(this.ship[shipCount]);
            shipCount++;
        }
        for (var i = 0; i < crusierCount; i++) {
            var location = this.getRandShipLocation(3, false);
            this.ship[shipCount] = new ship('Cruiser', 1);
            this.ship[shipCount].setLocations(location);
            this.grid.addShip(this.ship[shipCount]);
            shipCount++;
        }
        for (var i = 0; i < submarineCount; i++) {
            var location = this.getRandShipLocation(3, false);
            this.ship[shipCount] = new ship('Submarine', 1);
            this.ship[shipCount].setLocations(location);
            this.grid.addShip(this.ship[shipCount]);
            shipCount++;
        }
        for (var i = 0; i < destroyerCount; i++) {
            var location = this.getRandShipLocation(2, false);
            this.ship[shipCount] = new ship('Destroyer', 1);
            this.ship[shipCount].setLocations(location);
            this.grid.addShip(this.ship[shipCount]);
            shipCount++;
        }
        for (var i = 0; i < noOfMines; i++) {
            var location = this.getRandShipLocation(1, true); //get positions
            this.mine[mineCount] = new mine(); //create mine
            this.mine[mineCount].setLocations(location); //add location
            this.grid.addMine(this.mine[mineCount]); //add mine to grid
            mineCount++;

        }
    },
    getRandShipLocation: function (length, isMine) {

        invalidLocation = true;
        while (invalidLocation === true) {//repeat finding a random position until a valid location is found

            var target = getRandFromArray(this.moveList); // get random start position
            var coord = target.split(',').map(Number); //split to x and y
            var x = coord[0];
            var y = coord[1];
            var locat = [];
//build location array of each grid
            if (!isMine) {
                var direction = getRandFromArray(['n', 's', 'e', 'w']); //select a random direction
                switch (direction) {
                    case 'n':
                        for (var i = 0; i < length; i++) {
                            locat.push([x, (y + i)]);
                        }
                        break;
                    case 's':

                        for (var i = 0; i < length; i++) {
                            locat.push([x, (y - i)]);
                        }
                        break;
                    case 'e':
                        for (var i = 0; i < length; i++) {
                            locat.push([(x + i), y]);
                        }
                        break;
                    case 'w':
                        for (var i = 0; i < length; i++) {
                            locat.push([(x - i), y]);
                        }
                        break;
                }
            } else {

                locat.push([x, y]);

            }

            invalidLocation = this.validateShipLocation(locat);
        }

        for (i = 0; i < locat.length; i++) {
            //remove each seleted location from move list so it cannot be selected again
            var remove = locat[i][0] + ',' + locat[i][1];
            removeItemFromArray(this.moveList, remove);
        }
        return locat;
    },
    validateShipLocation: function (locat) {

        invalid = false;
        for (var i = 0; i < locat.length; i++) {
            var coord = locat[i][0] + ',' + locat[i][1];
            if (!this.moveList.includes(coord)) { //location is only valid if it exists in the movelist
                invalid = true;
            }
        }
        return invalid;
    }
};
