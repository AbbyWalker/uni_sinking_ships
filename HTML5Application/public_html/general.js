/* 
 * This File is intented to contain any global/final variables as well 
 * as any utility functions that may be used repeatedly thoughout the game
 *Author: Peter Henderson
 *Date: 17/10/2016
 *Contribution Log: Name/Date/Description
 *
 *Pete/17/10/2016/Created File, added ship definition Final Variables
 *Pete/27/11/2016/Stopwatch, functions refreshTime, getTimes
 *Pete/22/01/2017/Added doc ready function for jquery multi shot button
 */
var TIME = 0;
var SEC = 0;
var TIME_PAUSED = 0;
var PAUSED_SEC = 0;
var PAUSED = false;

var hitNoise = new Audio('hitNoise.mp3');
var missNoise = new Audio('missNoise.mp3');
var userFleet = [];
var compFleet = [];
var gameWon = false;
//ship variables
var CARRIER_LEN = 5;
var BATTLESHIP_LEN = 4;
var CRUISER_LEN = 3;
var SUBMARINE_LEN = 3;
var DESTROYER_LEN = 2;
function getRandFromArray(array) { 
    var rand = array[Math.floor(Math.random() * array.length)];
    return rand;
};
function removeItemFromArray(array, value) {
    var index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
};
function refreshTime() {    
    setInterval(getTime, 1000)
};
function getTime() {
    if (!PAUSED) {
        TIME++;
        var min = Math.floor((TIME) / 60);
        var sec = Math.floor((TIME) % 60);
        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }
        $('#clock').text(min + ':' + sec);
    }
};
function jq(myid) { //correctly formats ID's for jquery

    return "#" + myid.replace(/(:|\.|\[|\]|,|=)/g, "\\$1");

};


function setHalfVolume() {
    var myAudio = document.getElementById("audio1");  
    myAudio.volume = 0.5; //Changed this to 0.5 or 50% volume since the function is called Set Half Volume ;)
};

$(document).ready(function () {
    console.log( "document ready" );
    
$("#btnMultiShot").click(function () {
    player.extraShot = 2;
    $("#btnMultiShot").prop('disabled', true).addClass('disabled');
    
    });
});

