
// --- event handlers ---
function newSettings(){
    var dimension = document.toolbar.dimension.options[
        document.toolbar.dimension.selectedIndex].value;
    colcount = eval(dimension.substring(0,1));
    rowcount = eval(dimension.substring(2,3));
    imgcount = eval(document.toolbar.colors.options[
        document.toolbar.colors.selectedIndex].value);
    for (var col = 0; col < maxcolcount; col++)
    for (var row = 0; row < maxrowcount; row++) {
        setcellimage(col,row,emptyimg);
        setanscellimage(col,row,outrangeimg);
    }
    newGame();
}
function newGame(){
    for (var col = 0; col < colcount; col++)
    for (var row = 0; row < rowcount; row++) {
        setcell(col,row, Math.floor(Math.random() * imgcount));
        setanscellimage(col,row,outrangeimg);
    }
    playing = true;
    autogen = true;
    steps = 0;
}
function edit() {
    if (!playing) {
        for (var col = 0; col < colcount; col++)
        for (var row = 0; row < rowcount; row++)
            setcell(col,row,0);
    }
    playing = false;
    autogen = false;
}
function play() {
    playing = true;
}
function ansoperate(col,row) {
    operate(col,row);
    solve();
}
function operate(col,row) {
    if (col >= colcount || row >= rowcount) return;
    flip(col,row);
    if (playing) {
        if (col > 0)            flip(col-1, row);
        if (row > 0)            flip(col, row-1);
        if (col < colcount - 1) flip(col+1, row);
        if (row < rowcount - 1) flip(col, row+1);
        steps++;
        if (autogen && isCleared()) {
            alert("Cleared in " + steps + " steps!");
            autogen = false;
        }
    }
}

// --- operation methods ---
function setcell(col,row,val) {
    cells[col][row] = val;
    setcellimage(col,row,imgs[val]);
}
function setcellimage(col,row,imgsrc) {
    eval("document." + cellname(col,row) + ".src = '" + imgsrc + "'");
}
function setanscellimage(col,row,imgsrc) {
    eval("document.ans" + cellname(col,row) + ".src = '" + imgsrc + "'");
}
function cellname(col,row) {
    return "cell" + col + "_" + row;
}
function flip(col,row) {
    setcell(col,row,(cells[col][row] + 1) % imgcount);
}

// --- status methods ---
function isCleared(){
    var sample = cells[0][0];
    for (var col = 0; col < colcount; col++)
    for (var row = 0; row < rowcount; row++)
        if (cells[col][row] != sample) return false;
    return true;
}

