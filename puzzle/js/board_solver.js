
// --- finite field algebra solver
function modulate(x) {
    // returns z such that 0 <= z < imgcount and x == z (mod imgcount)
    if (x >= 0) return x % imgcount;
    x = (-x) % imgcount;
    if (x == 0) return 0;
    return imgcount - x;
}
function gcd(x, y) { // call when: x >= 0 and y >= 0
    if (y == 0) return x;
    if (x == y) return x;
    if (x > y)  x = x % y; // x < y
    while (x > 0) {
        y = y % x; // y < x
        if (y == 0) return x;
        x = x % y; // x < y
    }
    return y;
}
function invert(value) { // call when: 0 <= value < imgcount
    // returns z such that value * z == 1 (mod imgcount), or 0 if no such z
    if (value <= 1) return value;
    var seed = gcd(value,imgcount);
    if (seed != 1) return 0;
    var a = 1, b = 0, x = value;    // invar: a * value + b * imgcount == x
    var c = 0, d = 1, y = imgcount; // invar: c * value + d * imgcount == y
    while (x > 1) {
        var tmp = Math.floor(y / x);
        y -= x * tmp;
        c -= a * tmp;
        d -= b * tmp;
        tmp = a;  a = c;  c = tmp;
        tmp = b;  b = d;  d = tmp;
        tmp = x;  x = y;  y = tmp;
    }
    return a;
}

// --- finite field matrix solver

var mat;    // integer[i][j]
var cols;   // integer[]
var m;      // count of rows of the matrix
var n;      // count of columns of the matrix
var np;     // count of columns of the enlarged matrix
var r;      // minimum rank of the matrix
var maxr;   // maximum rank of the matrix
var stats;	// for stats run

function a(i,j)   { return mat[i][cols[j]]; }
function setmat(i,j,val) { mat[i][cols[j]] = modulate(val); }

function solve() {
    var col;
    var row;
    for (var goal = 0; goal < imgcount; goal++) {
        if (solveProblem(goal)) { // found an integer solution
            var anscols = new Array();
            var j;
            for (j = 0; j < n; j++)  anscols[cols[j]] = j;
            for (col = 0; col < colcount; col++)
            for (row = 0; row < rowcount; row++) {
                var value;
                j = anscols[row * colcount + col];
                if (j < r) value = a(j,n); else value = 0;
                setanscellimage(col,row,nums[value]);
            }
            return;
        }
    }
    // (aborted or) no solution
    for (var col = 0; col < colcount; col++)
    for (var row = 0; row < rowcount; row++)
        setanscellimage(col,row,outrangeimg);
    alert("No solutions!"); // setanscellimage(0,0,nosolimg);
}

function checkNormal() {
    var size = colcount * rowcount;
    m = size;
    n = size;
    np = n + size;
    initMatrix();
    for (var col = 0; col < colcount; col++)
    for (var row = 0; row < rowcount; row++) {
        var i = row * colcount + col;
        var line = mat[i];
        for (var j = n; j < np; j++)  line[j] = 0;
        line[n + i] = 1;
    }
    if (sweep())
         alert("Always solvable");
    else alert("Not always solvable ( "
        + Math.pow(imgcount,n-r) + " identity patterns )");
}

function newGameForStats(){
    for (var col = 0; col < colcount; col++)
    for (var row = 0; row < rowcount; row++) {
//        setcell(col,row, Math.floor(Math.random() * imgcount));
		cells[col][row] = Math.floor(Math.random() * imgcount);
//        setanscellimage(col,row,outrangeimg);
    }
    playing = true;
    autogen = true;
    steps = 0;
}

function solveForStats() {
    var col;
    var row;
    for (var goal = 0; goal < imgcount; goal++) {
        if (solveProblem(goal)) { // found an integer solution
            var anscols = new Array();
            var j;
            for (j = 0; j < n; j++)  anscols[cols[j]] = j;
            for (col = 0; col < colcount; col++)
            for (row = 0; row < rowcount; row++) {
                var value;
                j = anscols[row * colcount + col];
                if (j < r) value = a(j,n); else value = 0;
//                setanscellimage(col,row,nums[value]);
            }
            return true;
        }
    }
    // (aborted or) no solution
//    for (var col = 0; col < colcount; col++)
//    for (var row = 0; row < rowcount; row++)
//        setanscellimage(col,row,outrangeimg);
//    alert("No solutions!"); // setanscellimage(0,0,nosolimg);
	return false;
}

function tryStats() {

	var solCount = 0;
	var totalCount = 10000;
	stats = true;
	
	for (var i = 0; i < totalCount; i++) {
		newGameForStats();
		if(solveForStats()) solCount++;
	}
	
	alert(solCount + " out of " + totalCount + " tries had solutions");

	stats = false;
	newGame();
}

function initMatrix() {
    maxr = Math.min(m,n);
    mat = new Array();
    for (var col = 0; col < colcount; col++)
    for (var row = 0; row < rowcount; row++) {
        var i = row * colcount + col;
        var line = new Array();
        mat[i] = line;
        for (var j = 0; j < n; j++) line[j] = 0;
        line[i] = 1;
        if (col > 0)            line[i - 1]        = 1;
        if (row > 0)            line[i - colcount] = 1;
        if (col < colcount - 1) line[i + 1]        = 1;
        if (row < rowcount - 1) line[i + colcount] = 1;
    }
    cols = new Array();
    for (var j = 0; j < np; j++) cols[j] = j;
}
function solveProblem(goal) {
    var size = colcount * rowcount;
    m = size;
    n = size;
    np = n + 1;
    initMatrix();
    for (var col = 0; col < colcount; col++)
    for (var row = 0; row < rowcount; row++)
        mat[row * colcount + col][n] = modulate(goal - cells[col][row]);
    return sweep();
}
function sweep() {
    for (r = 0; r < maxr; r++) {
        if (!sweepStep()) return false; // failed in founding a solution
        if (r == maxr) break;
    }
    return true; // successfully found a solution
}
function sweepStep() {
    var i;
    var j;
    var finished = true;
    for (j = r; j < n; j++) {
        for (i = r; i < m; i++) {
            var aij = a(i,j);
            if (aij != 0)  finished = false;
            var inv = invert(aij);
            if (inv != 0) {
                for (var jj = r; jj < np; jj++)
                    setmat(i,jj, a(i,jj) * inv);
                doBasicSweep(i,j);
                return true;
            }
        }
    }
    if (finished) { // we have: 0x = b (every matrix element is 0)
        maxr = r;   // rank(A) == maxr
        for (j = n; j < np; j++)
            for (i = r; i < m; i++)
                if (a(i,j) != 0)  return false; // no solution since b != 0
        return true;    // 0x = 0 has solutions including x = 0
    }
    if(!stats) alert("Internal error");
    return false;   // failed in finding a solution
}

function swap(array,x,y) {
    var tmp  = array[x];
    array[x] = array[y];
    array[y] = tmp;
}
function doBasicSweep(pivoti, pivotj) {
    if (r != pivoti) swap(mat,r,pivoti);
    if (r != pivotj) swap(cols,r,pivotj);
    for (var i = 0; i < m; i++) {
        if (i != r) {
            var air = a(i,r);
            if (air != 0)
                for (var j = r; j < np; j++)
                    setmat(i,j, a(i,j) - a(r,j) * air);
        }
    }
}