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

        let textSize =  object.fontSize*aCanvas.zoom;
        context.fillStyle = "rgba(0,0,0,1)";
        context.font = "" + textSize + "px sans-serif";
        let fontHeight = getFontHeight(context.font);//*aCanvas.zoom;

        context.textAlign = "start";
        context.textBaseline = "alphabetic";
        if(textSize>5) drawWrapText(context, this.text, x - width + 10*aCanvas.zoom, y-height + fontHeight, width*2 - 20*aCanvas.zoom, height*2 - fontHeight - 10*aCanvas.zoom, fontHeight);
        /*
        else{
            context.fillStyle = "rgb(196,196,196)"; 
            context.fillRect(x - width, y - height, 2*width, 2*height);
        }*/
    }

    object.getSideMenuStruct = function(){
        let draw_struct = [
            new PanelObject_title("Comment:"),
            new PanelObject_spacer(7),

            new PanelObject_label("Font size:"),
            new PanelObject_input_number(object.fontSize, 18,function(value){object.fontSize = value;}, function(obj){ACanvas.draw();}),

            new PanelObject_label("Text:"),
            new PanelObject_input_textArea(object.text, function(value){object.text = value;}, function(obj){ACanvas.draw();}),

            new PanelObject_spacer(10),
            new PanelObject_btn("Cancel selection", function(obj){common_reset_any_actions(); ACanvas.draw(); panelSide.draw();}),
        ];
        
        return draw_struct;
    }

    return object;
}