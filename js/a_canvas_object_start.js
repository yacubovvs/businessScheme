function Start(visible){
    let object = new Canvas_object(visible);

    object.size.width = 2;
    object.size.height = 2;
    object.color = "rgba(0,255,0,1)";
    object.colorFill = "rgba(0,255,0,0.1)";

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
        let lineWidth = 3; 
        let radius = Math.min(width, height)

        drawCircle(context, x, y, radius, lineWidth, true, true, this.color, this.colorFill);
    }

    return object;
}