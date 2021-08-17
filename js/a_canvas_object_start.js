function Start(loaded_object){
    let object = new Canvas_object(loaded_object);

    object.type = "start";
    object.size.width = 1;
    object.size.height = 1;
    object.color = "rgba(0,255,0,1)";
    object.colorFill = "rgba(0,255,0,0.1)";
    object.fontSize = 32;
    object.visible = true;

    let onum = 1;
    for(obj_i in ACanvas.objects){
        let obj = ACanvas.objects[obj_i];
        if(obj.type=="start"){
            onum++;
        }
    }
    object.text = "" + onum;

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
        let lineWidth = 2; 
        let radius = Math.min(width, height)
        

        drawCircle(context, x, y, radius, lineWidth, true, true, this.color, this.colorFill);

        let textSize =  object.fontSize*aCanvas.zoom;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = this.color;
        context.font = "bold " + textSize + "px sans-serif";
        if(textSize>=5) context.fillText(this.text, x, y);

    }

    object.get_coordinates_of_input_points = function(){
        return [];
    }

    object.getSideMenuStruct = function(){
        let draw_struct = [
            new PanelObject_title("Start:"),
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