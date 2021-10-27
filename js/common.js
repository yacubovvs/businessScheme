function common_get_treangle_area(x0, y0, x1, y1, x2, y2){
    return Math.abs((x0 - x2)*(y1 - y2) + (x1-x2)*(y2-y0));
 }

 function common_reset_any_actions(){
    ACanvas.userDrawing_object = undefined;
    ACanvas.selecting_dot = false;
    ACanvas._is_Object_resizing = false;
    ACanvas._object_resize_point = -1;
    ACanvas._object_user_moving = false;
    ACanvas.user_selections = [];
    ACanvas._main_resizing_object = undefined;
    ACanvas._main_resizing_object_related_objects = undefined;
    panelSide.property_object = ACanvas;
    ACanvas.click();
 }

 function drawCircle_old(context, x, y, radius, color){
    context.beginPath();
    context.lineWidth = 1;
	context.strokeStyle = color;
    context.stroke();
    context.arc(x+radius*2, y+radius*2, radius, 0, 2*Math.PI, false);
    context.fillStyle = color;
    context.fill();
    
}

function drawCircle(context, x, y, radius, lineWidth, stroke, fill, color_stroke, color_filling){
    context.beginPath();
    context.lineWidth = lineWidth;

    context.arc(x, y, radius, 0, 2*Math.PI, false);

    context.fillStyle = color_filling;
    context.strokeStyle = color_stroke;

    if(stroke)context.stroke();
    if(fill)context.fill();

    context.lineWidth = 1;
}

function roundedRect(context, x, y, width, height, radius, lineWidth, stroke, fill, color_stroke, color_filling){
    context.lineWidth = lineWidth;
    context.fillStyle = color_filling;
    context.strokeStyle = color_stroke;

    context.beginPath();
    context.moveTo(x,y+radius);
    context.lineTo(x,y+height-radius);
    context.quadraticCurveTo(x,y+height,x+radius,y+height);
    context.lineTo(x+width-radius,y+height);
    context.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    context.lineTo(x+width,y+radius);
    context.quadraticCurveTo(x+width,y,x+width-radius,y);
    context.lineTo(x+radius,y);
    context.quadraticCurveTo(x,y,x,y+radius);
    if(stroke) context.stroke();
    if(fill) context.fill();

    context.lineWidth = 1;
}

function get_uid(){
    //return Math.random().toString(32).slice(2);
    return Math.random().toString(32).slice(2) + "-" + Math.random().toString(32).slice(2) + "-" + Math.random().toString(32).slice(2);
}

function checkLinesCrossing(p1, p2, p3, p4) {

    if (p2.x < p1.x) { let tmp = p1; p1 = p2; p2 = tmp;}
    if (p4.x < p3.x) { let tmp = p3; p3 = p4; p4 = tmp;}
    if (p2.x < p3.x) { 
        //console.log("false 1");
        return false;
    }

    if((p1.x - p2.x == 0) && (p3.x - p4.x == 0)) {
        if(p1.x == p3.x) if (!((Math.max(p1.y, p2.y) < Math.min(p3.y, p4.y)) || (Math.min(p1.y, p2.y) > Math.max(p3.y, p4.y)))){
            //console.log("true 1");
            return true;
        }
        //console.log("false 2");
        return false;
    }

    if (p1.x - p2.x == 0) {
        let Xa = p1.x;
        let A2 = (p3.y - p4.y) / (p3.x - p4.x);
        let b2 = p3.y - A2 * p3.x;
        let Ya = A2 * Xa + b2;
        if (p3.x <= Xa && p4.x >= Xa && Math.min(p1.y, p2.y) <= Ya && Math.max(p1.y, p2.y) >= Ya){
            //console.log("true 2");
            return true;
        }
        //console.log("false 3");
        return false;
    }


    if (p3.x - p4.x == 0) {
        let Xa = p3.x;
        let A1 = (p1.y - p2.y) / (p1.x - p2.x);
        let b1 = p1.y - A1 * p1.x;
        let Ya = A1 * Xa + b1;

        if (p1.x <= Xa && p2.x >= Xa && Math.min(p3.y, p4.y) <= Ya && Math.max(p3.y, p4.y) >= Ya){
            //console.log("true 3");
            return true;
        }
        //console.log("false 4");
        return false;
    }

    let A1 = (p1.y - p2.y) / (p1.x - p2.x);
    let A2 = (p3.y - p4.y) / (p3.x - p4.x);
    let b1 = p1.y - A1 * p1.x;
    let b2 = p3.y - A2 * p3.x;

    if (A1 == A2) {
        //console.log("false 5");
        return false;
    }
    let Xa = (b2 - b1) / (A1 - A2);

    /*
    console.log(Xa);
    console.log(Math.max(p1.x, p3.x));
    console.log(Xa);
    console.log(Math.min( p2.x, p4.x));
    //Xa = Xa*
    */

    Xa = Math.floor(Xa*10000000000000)/10000000000000;

    if ((Xa < Math.max(p1.x, p3.x)) || (Xa > Math.min( p2.x, p4.x))){
        //console.log("false 6");
        return false;
    }else{
        //console.log("true 5");
        return true;
    }

}

function drawWrapText(context, text, marginLeft, marginTop, maxWidth, height, lineHeight){
    text = text.replace(new RegExp("\n",'g')," \n")
    let words = text.split(" ");
    let countWords = words.length;
    let line = "";
    let maxHeight = marginTop+height;
    for (let n = 0; n < countWords; n++) {
        if(marginTop>=maxHeight) return;
        
        let testLine = line + words[n] + " ";
        let testWidth = context.measureText(testLine).width;

        if (testWidth > maxWidth || words[n][0]=="\n") {
            context.fillText(line.trim(), marginLeft, marginTop);
            if(words[n]!=" ")line = words[n] + " ";
            marginTop += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line.trim(), marginLeft, marginTop);
}

function getFontHeight(font) {
    var parent = document.createElement("span");
    parent.appendChild(document.createTextNode("height"));
    document.body.appendChild(parent);
    parent.style.cssText = "font: " + font + "; white-space: nowrap; display: inline;";
    var height = parent.offsetHeight;
    document.body.removeChild(parent);
    return height;
}

function Point(x,y){
    return {x:x, y:y};
}

function min(x1, x2){
    return Math.min(x1, x2);
}

function max(x1, x2){
    return Math.max(x1, x2);
}

function random(x1,x2){
    let d = min(x1,x2) + max(x1,x2)
    return  min(x1,x2) + Math.random()*d + 0.5;
}

function randomInt(x1,x2){
    let d = min(x1,x2) - max(x1,x2)
    return Math.floor(random(x1,x2));
}

function int(x){
    return Math.float(x)
}

function round(x){
    return Math.round(x)
}

function pow(x, n){
    return Math.pow(x,n);
}

function sqrt(x){
    return Math.sqrt(x);
}

function getRealCoordinates(aCanvas, point){
    let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
    let drawing_shift_x = aCanvas._get_drawing_shift_x();
    let drawing_shift_y = aCanvas._get_drawing_shift_y();

    return {
        x: point.x*coordinates_realSize + drawing_shift_x,
        y: point.y*coordinates_realSize + drawing_shift_y
    }
}