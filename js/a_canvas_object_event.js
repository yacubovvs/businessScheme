function Event(object_to_load){
    let object = new Canvas_object(object_to_load);

    object.type = "event";
    object.size.width = 2;
    object.size.height = 2;
    object.color = "rgba(0,0,0,1)";
    object.colorFill = "rgba(0,0,0,0.1)";
    object.visible = true;
    object.resource_changing = {};

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
        let radius = Math.min(width/3,height/3);

        //drawCircle(context, x, y, radius, lineWidth, true, true, this.color, this.colorFill);
        roundedRect(context, x-width, y-height, width*2, height*2, radius, lineWidth, true, true, this.color, this.colorFill);

        textSize =  object.fontSize*aCanvas.zoom;
        context.fillStyle = "rgba(0,0,0,1)";
        context.font = "" + textSize + "px sans-serif";
        let fontHeight = getFontHeight(context.font);//*aCanvas.zoom;

        context.textAlign = "start";
        context.textBaseline = "alphabetic";
        if(textSize>5) drawWrapText(context, this.text, x - width + 10*aCanvas.zoom, y-height + fontHeight + radius/4, width*2 - 20*aCanvas.zoom, height*2 - fontHeight - 10*aCanvas.zoom - radius/4, fontHeight);
    }

    object.getSideMenuStruct = function(){
        let draw_struct = [
            new PanelObject_title("Event:"),

            new PanelObject_spacer(7),

            new PanelObject_label("Font size:"),
            new PanelObject_input_number(object.fontSize, 18,function(value){object.fontSize = value;}, function(obj){ACanvas.draw();}),

            new PanelObject_label("Text:"),
            new PanelObject_input_textArea(object.text, function(value){object.text = value;}, function(obj){ACanvas.draw();}),

            new PanelObject_spacer(7),
            new PanelObject_label("Resources changing:"),
        ]

        if(Resources.list.length==0){
            draw_struct.push(new PanelObject_label("-no resources found"));
        }else{
            for(resource_i in Resources.list){
                let resource = Resources.list[resource_i];
                draw_struct.push(new PanelObject_label(resource.name + ":"));
                draw_struct.push(new PanelObject_input_text(object.get_resource_change_value(resource), function(value){object.set_resource_change_value(resource, value)}, undefined /*function(obj){}*/));
                draw_struct.push(new PanelObject_spacer(2))
            }
        }

        draw_struct.push(new PanelObject_spacer(10));
        draw_struct.push(new PanelObject_btn("Cancel selection", function(obj){common_reset_any_actions(); ACanvas.draw(); panelSide.draw();}));
        
        return draw_struct;
    }

    object.set_resource_change_value = function(resource, value){
        //console.log(resource);
        //console.log(value);
        //console.log("---");
        this.resource_changing[resource.id] = value;
    }

    object.get_resource_change_value = function(resource){
        return this.resource_changing[resource.id];
    }

    return object;
}