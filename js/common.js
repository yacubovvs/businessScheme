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