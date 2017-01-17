/*
 * Created by Charlotte Roche on 20/10/2016.
 *  *Contribution Log: Name/Date/Description
 *  Peter Henderson/27/10/2016/Added grid, build move list and buildmovelist function
 */
function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
}

        var shipsPos = getCookie('shipLocation');
        var placeships = JSON.parse(shipsPos);
        

function player(name, xSize, ySize) {
    this.name = name;
    this.moveList = this.buildMoveList(xSize, ySize);
    this.grid = new Grid(xSize, ySize);
    this.hitPlayer = [];
    this.missedPlayer = [];
    this.missNextGo = false;
}

player.prototype = {
    constructor: player,
    getName: function () {
        return this.name;
    },
    makePlayerMove: function (move) {
        var moveCoord = move.substring(2);
        var coord = moveCoord.split(',').map(Number);
        var x = coord[0];
        var y = coord[1];
        AI.grid.fireAtLocation(x, y, true);
        removeItemFromArray(this.moveList, moveCoord); //Player Move list not required???


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
    definePlayerFleetMVP: function () {

        /*PlayerShip1 = new ship('Carrier', 1);
        PlayerShip1.setLocations([[2, 5, 0], [2, 4, 0], [2, 3, 0], [2, 2, 0], [2, 1, 0]]);
        this.grid.addShip(PlayerShip1);*/

        PlayerShip1 = new ship('Carrier', 1);
        PlayerShip1.setLocations([[placeships.carX, placeships.carY, 0], [placeships.carX, placeships.carY+1, 0], [placeships.carX, placeships.carY+2, 0], [placeships.carX, placeships.carY+3, 0], [placeships.carX, placeships.carY+4, 0]]);
        this.grid.addShip(PlayerShip1);

        PlayerShip2 = new ship('Battleship', 1);
        PlayerShip2.setLocations([[placeships.batX, placeships.batY, 0], [placeships.batX+1, placeships.batY, 0], [placeships.batX+2, placeships.batY, 0], [placeships.batX+3, placeships.batY, 0]]);
        this.grid.addShip(PlayerShip2);

        PlayerShip3 = new ship('Cruiser', 1);
        PlayerShip3.setLocations([[placeships.cruX, placeships.cruY, 0], [placeships.cruX, placeships.cruY+1, 0], [placeships.cruX, placeships.cruY+2, 0]]);
        this.grid.addShip(PlayerShip3);

        PlayerShip4 = new ship('Submarine', 1);
        PlayerShip4.setLocations([[placeships.subX, placeships.subY, 0], [placeships.subX, placeships.subY+1, 0], [placeships.subX, placeships.subY+2, 0]]);
        this.grid.addShip(PlayerShip4);

        PlayerShip5 = new ship('Destroyer', 1);
        PlayerShip5.setLocations([[placeships.desX, placeships.desY, 0], [placeships.desX+1, placeships.desY, 0]]);
        this.grid.addShip(PlayerShip5);
        
        mine1 = new mine();
        mine1.setLocations([[placeships.mine1X], [placeships.mine1Y]]);
        this.grid.addMine(mine1);
        
        mine2 = new mine();
        mine2.setLocations([[placeships.mine2X], [placeships.mine2Y]]);
        this.grid.addMine(mine2);
        
        mine3 = new mine();
        mine3.setLocations([[placeships.mine3X], [placeships.mine3Y]]);
        this.grid.addMine(mine3);

    },
    drawInitialGrid: function (xLength, yLength) {
        var squareSize = 20;
        var gameBoardContainer = document.getElementById("gameboard");
        // this has been hard coded for the hack, taken form gridCreation
        for (i = 0; i < xLength; i++) {
            for (j = 0; j < yLength; j++) {

                // create a new div HTML element for each grid square and make it the right size
                var square = document.createElement("div");
                gameBoardContainer.appendChild(square);

                // give each div element a unique id based on its row and column, like "s00"
                // The p signifys that it is the id for the players board
                square.id = "p" + String(i) + "," + String(j);
                // set each grid square's coordinates: multiples of the current row or column number
                var topPosition = j * squareSize;
                var leftPosition = i * squareSize;

                // use CSS absolute positioning to place each grid square on the page
                square.style.top = topPosition + 'px';
                square.style.left = leftPosition + 'px';
            }
        }
        player.drawGrid();
    },
    hitShipDraw: function (x, y) {
        var eleID = "ai" + x + "," + y;
        this.hitPlayer.push(eleID);
        document.getElementById(eleID).style.background = "red";
        $("#id").off('click');
    },
    missedShipDraw: function (x, y) {
        var eleID = "ai" + x + "," + y;
        this.missedPlayer.push(eleID);
        document.getElementById(eleID).style.background = "grey";
    },
    hitMineDraw: function (x, y) {
        var eleID = "ai" + x + "," + y;
        document.getElementById(eleID).style.background = "black";
    },
    drawGrid: function () { //draw the players grid containing their ships

        //place on board Carrier
        document.getElementById("p"+placeships.carX+","+(placeships.carY + 4)).style.background = "green";
        document.getElementById("p"+placeships.carX+","+(placeships.carY + 3)).style.background = "green";
        document.getElementById("p"+placeships.carX+","+(placeships.carY + 2)).style.background = "green";
        document.getElementById("p"+placeships.carX+","+(placeships.carY + 1)).style.background = "green";
        document.getElementById("p"+placeships.carX+","+placeships.carY).style.background = "green";

        //Batteship
        document.getElementById("p"+placeships.batX+","+placeships.batY).style.background = "green";
        document.getElementById("p"+(placeships.batX+1)+","+placeships.batY).style.background = "green";
        document.getElementById("p"+(placeships.batX+2)+","+placeships.batY).style.background = "green";
        document.getElementById("p"+(placeships.batX+3)+","+placeships.batY).style.background = "green";


        //Cruiser
        document.getElementById("p"+(placeships.cruX)+","+placeships.cruY).style.background = "green";
        document.getElementById("p"+(placeships.cruX)+","+(placeships.cruY+1)).style.background = "green";
        document.getElementById("p"+(placeships.cruX)+","+(placeships.cruY+2)).style.background = "green";

        //Submarine
        document.getElementById("p"+(placeships.subX)+","+(placeships.subY)).style.background = "green";
        document.getElementById("p"+(placeships.subX)+","+(placeships.subY+1)).style.background = "green";
        document.getElementById("p"+(placeships.subX)+","+(placeships.subY+2)).style.background = "green";

        //Destroyer
        document.getElementById("p"+(placeships.desX)+","+(placeships.desY)).style.background = "green";
        document.getElementById("p"+(placeships.desX+1)+","+(placeships.desY)).style.background = "green";
        
        //Mines
        document.getElementById("p"+(placeships.mine1X)+","+(placeships.mine1Y)).style.background = "blue";
        document.getElementById("p"+(placeships.mine2X)+","+(placeships.mine2Y)).style.background = "blue"; 
        document.getElementById("p"+(placeships.mine3X)+","+(placeships.mine3Y)).style.background = "blue";
    }
}

