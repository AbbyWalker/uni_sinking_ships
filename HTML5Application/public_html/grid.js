/**
 * Created by Charlotte Roche on 20/10/2016.
 * Updated it (including the title to incorporate all code)
 */


function createArray(length) {
    var arr = new Array(length || 0),
            i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--)
            arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}
//undefined = not hit or picked
//ship with location index 2 == 0 is unhit
//ship with location index 2 == 1 is hit

function Grid(xSize, ySize) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.grd = createArray(xSize, ySize);
}
Grid.prototype = {
    constructor: Grid,
    getGrid: function () {
        return this.grd;
    },
    clearGridValue: function (x, y) {
        this.grd[x][y] = undefined;
    },
    addShip: function (ship) {
        for (var i = 0; i < ship.getLocations().length; i++) {
            currentloc = ship.getLocations()[i];
            this.grd[currentloc[0]][currentloc[1]] = ship;
        }
    },
    addMine: function (mine) {
        for (var i = 0; i < mine.getLocations().length; i++) {

            currentloc = mine.getLocations()[i];

            this.grd[currentloc[0]][currentloc[1]] = mine;

        }
    },
    fireAtLocation: function (x, y, playerTurn) {
        if (this.getGrid()[x][y] instanceof ship) {
            currentShip = this.getGrid()[x][y];
            hitNoise.play();
            console.log('Ship hit at [' + x + '], [' + y + ']');
            currentShip.shootShip(x, y);
            if (playerTurn === true) {
                player.hitShipDraw(x, y);
                $("#dialogueBox").text("You hit a ship");
            }
            if (playerTurn === false) {
                $("#aidialogueBox").text("AI hit a ship");
                AI.hitShipDraw(x, y);
            }

        } else if (this.getGrid()[x][y] instanceof mine) {
            hitNoise.play();
            if (playerTurn === true) {
                $("#dialogueBox").text("You hit a mine");
                player.missNextGo = true;
                player.hitMineDraw(x, y);
            }
            if (playerTurn === false) {
                $("#aidialogueBox").text("AI hit a mine");
                AI.hitShipDraw(x, y);
                AI.missNextGo = true;
                AI.hitMineDraw(x, y);
            }

        } else {
            missNoise.play();
            if (playerTurn === true) {
                player.missedShipDraw(x, y);
                $("#dialogueBox").text("Player Missed");
            }
            if (playerTurn === false) {
                AI.missedShipDraw(x, y);
                $("#aidialogueBox").text("AI Missed");
            }


        }
    }
};

