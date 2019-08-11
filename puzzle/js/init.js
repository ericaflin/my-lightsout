
// --- constants ---
var imgs = new Array();     // string[], URLs of tile images
var nums = new Array();     // string[], URLs of digit images
var maxcolcount = 9;        // integer, maximum number of columns
var maxrowcount = 9;        // integer, maximum number of rows

var outrangeimg = "images/outrange.gif";   // string, URL of empty ans cell
var emptyimg    = "images/empty.gif";      // string, URL of empty cell
// var nosolimg = "images/nosol.gif";      // string, URL of no solution image
imgs[0] = "images/blue.gif";
imgs[1] = "images/red.gif";
imgs[2] = "images/yellow.gif";
imgs[3] = "images/green.gif";
imgs[4] = "images/purple.gif";

// --- global variables ---
var colcount;   // integer, number of columns
var rowcount;   // integer, number of rows
var imgcount;   // integer, number of states of a tile
var cells;      // integer[row][col], current states of tiles
var steps;      // integer, current steps of operation
var playing;    // boolean, if playing
var autogen;    // boolean, if playing with an auto-generated problem

// --- initialization ---
//function onLoad(){}
init();
function init() {
    for (var val = 0; val < imgs.length; val++)
        nums[val] = "images/number" + val + ".gif";
    var col;
    var row;
    cells = new Array();
    for (col = 0; col < maxcolcount; col++) {
        cells[col] = new Array();
        for (row = 0; row < maxrowcount; row++)
            cells[col][row] = 0;
    }
//  playing = false;
}
