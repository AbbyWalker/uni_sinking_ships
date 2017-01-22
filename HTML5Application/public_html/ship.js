/* 
 * Author: Charlotte Roche
 * Ship class that works better with the other code, but didn't want to change the shipClass with Petes code in it
 */

function ship(type, orientation) {
    this.locations = [];
    this.type = type;
    this.isAlive = true;
    this.orientation = orientation;
    switch (type.toLowerCase()) {
        case 'cruiser':
            this.size = 3;
            break;
        case 'carrier':
            this.size = 5;
            break;
        case 'battleship':
            this.size = 4;
            break;
        case 'submarine':
            this.size = 3;
            break;
        case 'destroyer':
            this.size = 2;
            break;
    }
}

ship.prototype = {
    constructor: ship,
    setLocations: function (locs) {

        this.locations = locs;

    },
    getLocations: function () {
        return this.locations;
    },
    getType: function () {
        return this.type;
    },
    checkIsAlive: function () {
        numofhits = 0;
        for (var i = 0; i < this.getLocations().length; i++) {
            if (this.getLocations()[i][2] === 1) {
                numofhits++;
            }
        }

        if (numofhits < this.size) {
            return true;
        } else {
            return false;
        }
    },
    shootShip: function (x, y) {
        for (var i = 0; i < this.getLocations().length; i++) {
            if (this.getLocations()[i][0] === x && this.getLocations()[i][1] === y) {
                this.getLocations()[i][2] = 1;
            }
        }
    }
};



