function Line(visible){
    let object = new Canvas_object(visible);

    object.size.width = 0;
    object.size.height = 1;
    object.color = "rgba(255,0,0,1)";

    object.positionSetted = false;

    object.draw = function(aCanvas, context){
        if(!this.visible) return;

        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();
        
        context.beginPath();
        context.strokeStyle = this.color; 
        let x1 = this.position.x*coordinates_realSize + drawing_shift_x;
        let y1 = this.position.y*coordinates_realSize + drawing_shift_y;
        let x2 = (this.position.x + this.size.width)*coordinates_realSize + drawing_shift_x;
        let y2 = (this.position.y + this.size.height)*coordinates_realSize + drawing_shift_y;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }

    object.user_start_draw_click = function(aCanvas, x, y){
        //console.log("user_start_draw_click")
        if(this.positionSetted==false){
            this.positionSetted = true;
            this.size.width = 0;
            this.size.height = 0;
            this.position.x = x;
            this.position.y = y;
            this.visible = true;
        }else{
            aCanvas.objects.push(this);
            let newObject = new Line(true);
            newObject.position.x = x;
            newObject.position.y = y;
            newObject.positionSetted = true;
            aCanvas.userDrawing_object = newObject;
        }
        
    }

    object.user_start_draw_mouse_move = function(aCanvas, x, y){
        //console.log("user_start_draw_mouse_move");
        this.size.width = x - this.position.x;
        this.size.height = y - this.position.y;

        return this.visible; // need for redraw ACanvas
    }

    object._is_click_on_object = function(aCanvas, x, y){return false;} 

    return object;
}