function common_get_treangle_area(x0, y0, x1, y1, x2, y2){
    return Math.abs((x0 - x2)*(y1 - y2) + (x1-x2)*(y2-y0));
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
    return Math.random().toString(32).slice(2);
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