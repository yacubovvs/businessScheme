function Comment(object_to_load){
    let object = new Canvas_object(object_to_load);

    object.type = "comment";
    object.size.width = 2;
    object.size.height = 2;
    object.color = "rgba(0,0,0,1)";
    object.colorFill = "rgba(255,255,255,0.5)";

    object.visible = true;

    object.get_coordinates_of_input_points = function(){
        return [];
    }

    object.get_coordinates_of_output_points = function(){
        return [];
    }

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
        context.lineWidth = 2;
        context.fillRect(x - width, y - height, 2*width, 2*height);
        context.strokeRect(x - width, y - height, 2*width, 2*height);
        context.lineWidth = 1;
    }

    object.getSideMenuStruct = function(){
        let draw_struct = [
            new PanelObject_title("Comment:"),
        ];
        
        return draw_struct;
    }

    return object;
}