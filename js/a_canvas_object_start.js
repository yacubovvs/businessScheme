function Start(loaded_object){
    let object = new Canvas_object(loaded_object);

    object.type = "start";
    object.size.width = 1;
    object.size.height = 1;
    object.color = "rgba(0,255,0,1)";
    object.colorFill = "rgba(0,255,0,0.1)";
    object.fontSize = 32;
    object.visible = true;
    object.wdt = 100;
    object.result_type = "resourse_list";
    object.run_repeats = 1;


    object.not_once_run_repeat = function(){
        return object.result_type=="probality_recourse_table" || object.result_type=="probality_finish_table";
    }
    object.get_run_repeats = function(){
        if(this.not_once_run_repeat()){
            return object.run_repeats;
        }else{
            return 1;
        }
    }

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

            new PanelObject_spacer(4),

            new PanelObject_label("WDT steps:"),
            new PanelObject_input_number(object.wdt, 100, function(value){object.wdt = value;}),

            new PanelObject_spacer(4),
            new PanelObject_label("Result type:"),
            new PanelObject_select_list(
                object.result_type,
                [
                    new PanelObject_select_list_element("Resource list", "resourse_list"),
                    new PanelObject_select_list_element("Probability recourse table", "probality_recourse_table"),
                    new PanelObject_select_list_element("Probability finish table", "probality_finish_table"),
                ],
                function(value){object.result_type = value; panelSide.draw();}
            ),
        ];

        if(this.not_once_run_repeat()){
            draw_struct.push(new PanelObject_spacer(4));  
            draw_struct.push(new PanelObject_label("Run repeats:"));
            draw_struct.push(new PanelObject_input_number(object.run_repeats, 100, function(value){object.run_repeats = value;}));
        }

        draw_struct.push(new PanelObject_spacer(10));
        draw_struct.push(new PanelObject_btn("Cancel selection", function(obj){common_reset_any_actions(); ACanvas.draw(); panelSide.draw();}))
        
        return draw_struct;
    }

    return object;
}