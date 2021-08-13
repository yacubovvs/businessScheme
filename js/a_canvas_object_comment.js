function Comment(visible){
    let object = new Canvas_object(visible);

    object.size.width = 2;
    object.size.height = 2;
    object.color = "rgba(0,0,0,1)";
    object.colorFill = "rgba(255,255,255,0.5)";

    object.visible = true;

    object.draw = function(aCanvas, context){
        if(!this.visible) return;

        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();
        
        
        let x = this.position.x*coordinates_realSize + drawing_shift_x;
        let y = this.position.y*coordinates_realSize + drawing_shift_y;
        let width = this.size.width*coordinates_realSize;
        let height = this.size.height*coordinates_realSize;

        context.beginPath();
        context.strokeStyle = this.color; 
        context.fillStyle = this.colorFill; 

        context.fillRect(x - width, y - height, 2*width, 2*height);
        context.strokeRect(x - width, y - height, 2*width, 2*height);

        /*context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(x4, y4);
        context.lineTo(x1, y1);*/
        
        /*
        let x1 = x-this.size.width*coordinates_realSize;
        let y1 = y;

        let x2 = x;
        let y2 = y-this.size.height*coordinates_realSize;

        let x3 = x+this.size.width*coordinates_realSize;
        let y3 = y;

        let x4 = x;
        let y4 = y+this.size.height*coordinates_realSize;

        context.beginPath();
        context.strokeStyle = this.color; 
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(x4, y4);
        context.lineTo(x1, y1);
        context.stroke();
        */
    }

    return object;
}