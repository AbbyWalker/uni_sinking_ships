/* 
 * This File is intented to contain al global/final variables as well 
 * as any utility functions that may be used repeatedly thoughout the game
 *Author: Peter Henderson
 *Date: 17/10/2016
 *Contribution Log: Name/Date/Description
 *
 *Pete/17/10/2015/Created File, added ship definition Final Variables
 *
 * 
 */


//ship variables

var CARRIER_LEN = 5;
var BATTLESHIP_LEN = 4;
var CRUISER_LEN = 3;
var SUBMARINE_LEN = 3;
var DESTROYER_LEN = 2;


function getRandFromArray(array) {

    var rand = array[Math.floor(Math.random() * array.length)];
    return rand;

}
function removeItemFromArray(array, value) {

    var index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }

}