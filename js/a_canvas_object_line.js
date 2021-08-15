function Line(object_to_load){
    let object = new Canvas_object(object_to_load);

    object.visible = false;
    object.type = "line";
    object.size.width = 0;
    object.size.height = 1;
    object.color = "rgba(196, 0, 0, 1)";

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
        context.lineWidth = 2;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.lineWidth = 1;
    }

    object.draw_user_selection = function(aCanvas, context){
        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();
        
        let x1 = (this.position.x)*coordinates_realSize + drawing_shift_x;
        let y1 = (this.position.y)*coordinates_realSize + drawing_shift_y;

        let x2 = (this.position.x + this.size.width)*coordinates_realSize + drawing_shift_x;
        let y2 = (this.position.y + this.size.height)*coordinates_realSize + drawing_shift_y;


        context.strokeStyle = aCanvas._settings._selection_points_color_border; 
        context.fillStyle = aCanvas._settings._selection_points_color_fill; 
        
        context.fillRect(x1 - aCanvas._settings._selection_points_size_px/2, y1 -  aCanvas._settings._selection_points_size_px/2, aCanvas._settings._selection_points_size_px, aCanvas._settings._selection_points_size_px);
        context.strokeRect(x1 - aCanvas._settings._selection_points_size_px/2, y1 -  aCanvas._settings._selection_points_size_px/2, aCanvas._settings._selection_points_size_px, aCanvas._settings._selection_points_size_px);

        context.fillRect(x2 + aCanvas._settings._selection_points_size_px/2, y2 -  aCanvas._settings._selection_points_size_px/2, -aCanvas._settings._selection_points_size_px, aCanvas._settings._selection_points_size_px);
        context.strokeRect(x2 + aCanvas._settings._selection_points_size_px/2, y2 -  aCanvas._settings._selection_points_size_px/2, -aCanvas._settings._selection_points_size_px, aCanvas._settings._selection_points_size_px);

    }

    object.is_on_user_selection_click = function(aCanvas, x, y){
        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();
        
        let x1 = (this.position.x)*coordinates_realSize + drawing_shift_x - aCanvas._settings._selection_points_size_px/2;
        let y1 = (this.position.y)*coordinates_realSize + drawing_shift_y - aCanvas._settings._selection_points_size_px/2;

        let x2 = (this.position.x + this.size.width)*coordinates_realSize + drawing_shift_x + aCanvas._settings._selection_points_size_px/2;
        let y2 = (this.position.y + this.size.height)*coordinates_realSize + drawing_shift_y - aCanvas._settings._selection_points_size_px/2;

        //console.log(x-x1);

        if(
            x-x1<=aCanvas._settings._selection_points_size_px && x-x1>=0
            && y-y1<=aCanvas._settings._selection_points_size_px && y-y1>=0
        ){
            //console.log("Click on 1 user selection");
            return 1; //1;
        }else if(
            x2-x<=aCanvas._settings._selection_points_size_px && x2-x>=0
            && y-y2<=aCanvas._settings._selection_points_size_px && y-y2>=0
        ){
            //console.log("Click on 2 user selection");
            return 2; //2;
        }

        return -1;
        
    }

    object.is_on_user_selection_resize = function(aCanvas, select_point, x_last, y_last, x, y){
        
        let dx = x_last - x;
        let dy = y_last - y;

        //x = Math.floor((x_last - dx)/2);
        //y = Math.floor((y_last - dy)/2);
        

        if(
            this.resize_point_start.x != x_last
            || this.resize_point_start.y != y_last
            || this.resize_point.y != y
            || this.resize_point.x != x
            
        ){
            if(this.resize_point_start.x != x_last
            || this.resize_point_start.y != y_last){
                this.resize_point_start.x = x_last;
                this.resize_point_start.y = y_last;
                this.resize_point.y = y;
                this.resize_point.x = x;
                return true;
            }

            //let x_change = Math.floor((x - this.resize_point.x)/2)*2;
            //let y_change = Math.floor((y - this.resize_point.y)/2)*2;

            let x_change = x - this.resize_point.x;
            let y_change = y - this.resize_point.y;

            if(select_point==1){
                this.size.width -= x_change; 
                this.size.height -= y_change;                 
                this.position.x += x_change;
                this.position.y += y_change;
            }else if(select_point==2){
                this.size.width += x_change; 
                this.size.height += y_change; 
                //this.position.x += x_change;
                //this.position.y += y_change;
            }
            

            this.resize_point.y = y;
            this.resize_point.x = x;
            //console.log("Redraw on resize!");
            return true;
            
        }
        
        return false; // true for need to redraw
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

    object._is_click_on_object = function(aCanvas, x, y){
        let coord = this.get_points_coordinates();
        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;

        let realSize = Math.sqrt(Math.pow(coord.x1 - coord.x2,2) + Math.pow(coord.y1 - coord.y2,2))*coordinates_realSize;
        let byMouseSize = (Math.sqrt(Math.pow(x - coord.x2,2) + Math.pow(y - coord.y2,2)) + Math.sqrt(Math.pow(x - coord.x1,2) + Math.pow(y - coord.y1,2)))*coordinates_realSize;
        
        if((byMouseSize - realSize)<1.5){
            return true;
        }
        return false;
    } 

    object.get_points_coordinates = function(){
        return {
            x1: this.position.x,
            y1: this.position.y,
            x2: this.position.x + this.size.width,
            y2: this.position.y + this.size.height,
        };
    }

    object.get_related_lines = function(aCanvas, related_lines){
        let coordinates = this.get_points_coordinates()
        
        if(typeof(related_lines)!="object"){
            related_lines = [];
        }

        for(let obj_i in aCanvas.objects){
            let object = aCanvas.objects[obj_i]
            if(object.type=="line"){
                let coordinates2 = object.get_points_coordinates();
                if(
                    (coordinates.x1==coordinates2.x1 && coordinates.y1==coordinates2.y1) ||
                    (coordinates.x2==coordinates2.x1 && coordinates.y2==coordinates2.y1) ||
                    (coordinates.x1==coordinates2.x2 && coordinates.y1==coordinates2.y2) ||
                    (coordinates.x2==coordinates2.x2 && coordinates.y2==coordinates2.y2)
                ){
                    if(related_lines.indexOf(object)==-1){
                        related_lines.push(object);
                        object.get_related_lines(aCanvas, related_lines);
                    }
                }
            }
        }
        return related_lines;
    }

    object.get_coordinates_of_input_points = function(){
        return [];
    }

    object.get_coordinates_of_output_points = function(){
        return [];
    }

    return object;
}