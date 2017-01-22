/* 
 *Author: Peter Henderson
 *Date: 03/12/2016
 *Contribution Log: Name/Date/Description
 *
 */

function mine() {
    this.locations = [];
}

mine.prototype = {
    constructor: mine,
    setLocations: function (locs) {

        this.locations = locs;

    },
    getLocations: function () {
        return this.locations;
    }
};
