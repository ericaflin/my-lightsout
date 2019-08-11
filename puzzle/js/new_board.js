// --- document writer ---
function createField(imgsrc, prefix) {
    var row;
    var col;
    for (row = 0; row < maxrowcount; row++) {
        for (col = 0; col < maxcolcount; col++) {
            document.write("<IMG SRC='" + imgsrc);
            document.write("' NAME='" + prefix + cellname(col,row));
            document.write("' onmousedown='javascript:" + prefix);
            document.write("operate(" + col + "," + row + ")' ");
            document.write("ondblclick='javascript:" + prefix);
            document.write("operate(" + col + "," + row + ")'>");
        }
        document.write("<BR>");
    }
}

document.write("<TABLE><TR><TD>");
createField(emptyimg, "");
document.write("<TD WIDTH=10%><TD>");
createField(outrangeimg, "ans");
document.write("</TABLE>");