function Canvas_object(object_to_load){

    if(object_to_load!=undefined){

        let object = undefined;

        if(object_to_load.type == "line"){
            object = new Line();
        }else if(object_to_load.type == "start"){
            object = new Start();
        }else if(object_to_load.type == "finish"){
            object = new Finish();
        }else if(object_to_load.type == "event"){
            object = new Event();
        }else if(object_to_load.type == "condition"){
            object = new Condition();
        }else if(object_to_load.type == "comment"){
            object = new Comment();
        }else return undefined;

        for(let features_i in object_to_load){
            //console.log(features_i);
            //console.log(object_to_load[features_i]);
            object[features_i] = object_to_load[features_i];
        }

        //console.log("**************************")
        return object;
    }

    let canvas_object = {};
    canvas_object.type = "";
    canvas_object.label = "";

    canvas_object.text = ""
    canvas_object.fontSize = 18

    canvas_object.position = {x:0,y:0};
    canvas_object.size = {height:1, width:1}
    canvas_object.rotation = 0;
    canvas_object.image = undefined;
    canvas_object.id = get_uid();
    canvas_object.canRotate = false;

    canvas_object.resize_point_start = {x:0,y:0};
    canvas_object.resize_point = {x:0,y:0};
    
    canvas_object.visible = true;

    canvas_object.draw = function(aCanvas, context){}
    canvas_object.user_start_draw_click = function(aCanvas, x, y){
        this.position.x = x;
        this.position.y = y;
        aCanvas.objects.push(this);
        aCanvas.userDrawing_object = undefined;
        aCanvas.selecting_dot = false; // Removing dots selection
        aCanvas.draw();
    }

    canvas_object.user_start_draw_mouse_move = function(aCanvas, x, y){
        this.position.x = x;
        this.position.y = y;

        return this.visible;
    }

    canvas_object._is_click_on_object = function(aCanvas, x, y){ 
        if( 
            Math.abs(this.position.x-x)<this.size.width 
            && Math.abs(this.position.y-y)<this.size.height){
            return true;
        }else return false;
    }; // check is this click on object

    canvas_object.draw_user_selection = function(aCanvas, context){
        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();
        
        let x1 = (this.position.x - this.size.width)*coordinates_realSize + drawing_shift_x;
        let y1 = (this.position.y - this.size.height)*coordinates_realSize + drawing_shift_y;

        let x2 = (this.position.x + this.size.width)*coordinates_realSize + drawing_shift_x;
        let y2 = (this.position.y - this.size.height)*coordinates_realSize + drawing_shift_y;

        let x3 = (this.position.x + this.size.width)*coordinates_realSize + drawing_shift_x;
        let y3 = (this.position.y + this.size.height)*coordinates_realSize + drawing_shift_y;

        let x4 = (this.position.x - this.size.width)*coordinates_realSize + drawing_shift_x;
        let y4 = (this.position.y + this.size.height)*coordinates_realSize + drawing_shift_y;

        context.strokeStyle = aCanvas._settings._selection_points_color_border; 
        context.fillStyle = aCanvas._settings._selection_points_color_fill; 
        
        context.fillRect(x1, y1, aCanvas._settings._selection_points_size_px, aCanvas._settings._selection_points_size_px);
        context.strokeRect(x1, y1, aCanvas._settings._selection_points_size_px, aCanvas._settings._selection_points_size_px);

        context.fillRect(x2, y2, -aCanvas._settings._selection_points_size_px, aCanvas._settings._selection_points_size_px);
        context.strokeRect(x2, y2, -aCanvas._settings._selection_points_size_px, aCanvas._settings._selection_points_size_px);

        context.fillRect(x3, y3, -aCanvas._settings._selection_points_size_px, -aCanvas._settings._selection_points_size_px);
        context.strokeRect(x3, y3, -aCanvas._settings._selection_points_size_px, -aCanvas._settings._selection_points_size_px);

        context.fillRect(x4, y4, aCanvas._settings._selection_points_size_px, -aCanvas._settings._selection_points_size_px);
        context.strokeRect(x4, y4, aCanvas._settings._selection_points_size_px, -aCanvas._settings._selection_points_size_px);
    }

    canvas_object.on_user_move = function(aCanvas, x_last, y_last, x, y){
        //console.log("" + y + "   ---      " + y_last);
        //return true;
        if(
            x_last!=x ||
            y_last!=y
        ){
            //console.log("Object move");
            this.position.x += x-x_last;
            this.position.y += y-y_last;
            return true;
        }

        return false;
    }

    canvas_object.is_on_user_selection_click = function(aCanvas, x, y){
        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();
        
        let x1 = (this.position.x - this.size.width)*coordinates_realSize + drawing_shift_x;
        let y1 = (this.position.y - this.size.height)*coordinates_realSize + drawing_shift_y;

        let x2 = (this.position.x + this.size.width)*coordinates_realSize + drawing_shift_x;
        let y2 = (this.position.y - this.size.height)*coordinates_realSize + drawing_shift_y;

        let x3 = (this.position.x + this.size.width)*coordinates_realSize + drawing_shift_x;
        let y3 = (this.position.y + this.size.height)*coordinates_realSize + drawing_shift_y;

        let x4 = (this.position.x - this.size.width)*coordinates_realSize + drawing_shift_x;
        let y4 = (this.position.y + this.size.height)*coordinates_realSize + drawing_shift_y;

        if(
            x-x1<=aCanvas._settings._selection_points_size_px && x-x1>=0
            && y-y1<=aCanvas._settings._selection_points_size_px && y-y1>=0
        ){
            return 1;
        }else if(
            x2-x<=aCanvas._settings._selection_points_size_px && x2-x>=0
            && y-y2<=aCanvas._settings._selection_points_size_px && y-y2>=0
        ){
            return 2;
        }else if(
            x3-x<=aCanvas._settings._selection_points_size_px && x3-x>=0
            && y3-y<=aCanvas._settings._selection_points_size_px && y3-y>=0
        ){
            return 3;
        }else if(
            x-x4<=aCanvas._settings._selection_points_size_px && x-x4>=0
            && y4-y<=aCanvas._settings._selection_points_size_px && y4-y>=0
        ){
            return 4;
        }

        return -1;
        
    }

    canvas_object.is_on_user_selection_resize = function(aCanvas, select_point, x_last, y_last, x, y){
        
        let dx = x_last - x;
        let dy = y_last - y;

        x = Math.floor((x_last - dx)/2);
        y = Math.floor((y_last - dy)/2);
        

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
                this.size.height -= y_change; 
                this.position.x += x_change;
                this.position.y += y_change;
            }else if(select_point==3){
                this.size.width += x_change; 
                this.size.height += y_change; 
                this.position.x += x_change;
                this.position.y += y_change;
            }else if(select_point==4){
                this.size.width -= x_change; 
                this.size.height += y_change; 
                this.position.x += x_change;
                this.position.y += y_change;
            }
            

            this.resize_point.y = y;
            this.resize_point.x = x;
            //console.log("Redraw on resize!");
            return true;
            
        }
        
        return false; // true for need to redraw
    }

    canvas_object.get_coordinates_of_input_points = function(){
        return [
            {
                x: this.position.x - this.size.width,
                y: this.position.y,
            }
        ];
    }

    canvas_object.get_coordinates_of_output_points = function(){
        return [
            {
                x: this.position.x + this.size.width,
                y: this.position.y,
            }
        ];
    }

    canvas_object.drawInputPoints = function(aCanvas, context){
        let input_points = this.get_coordinates_of_input_points();
        let output_points = this.get_coordinates_of_output_points();

        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();

        
        for (let point_i in input_points){

            let point = input_points[point_i];

            let radius          = aCanvas._settings._input_points_radius; // (px)
            let lineWidth       = aCanvas._settings._input_points_lineWidth;
            let stroke          = aCanvas._settings._input_points_stroke;
            let fill            = aCanvas._settings._input_points_fill;
            let color_stroke    = aCanvas._settings._input_points_color_stroke;
            let color_filling   = aCanvas._settings._input_points_color_filling;

            let x = point.x*coordinates_realSize + drawing_shift_x;
            let y = point.y*coordinates_realSize + drawing_shift_y;

            drawCircle(context, x, y, radius, lineWidth, stroke, fill, color_stroke, color_filling);
        }

        for (let point_i in output_points){

            let point = output_points[point_i];
            
            let radius          = aCanvas._settings._output_points_radius; // (px)
            let lineWidth       = aCanvas._settings._output_points_lineWidth;
            let stroke          = aCanvas._settings._output_points_stroke;
            let fill            = aCanvas._settings._output_points_fill;
            let color_stroke    = aCanvas._settings._output_points_color_stroke;
            let color_filling   = aCanvas._settings._output_points_color_filling;

            let x = point.x*coordinates_realSize + drawing_shift_x;
            let y = point.y*coordinates_realSize + drawing_shift_y;

            drawCircle(context, x, y, radius, lineWidth, stroke, fill, color_stroke, color_filling);
        }
    }

    canvas_object.getSideMenuStruct = function(){
        let draw_struct = [];
        
        return draw_struct;
    }

    // For test:
    // ACanvas.objects[2].get_related_objects();
    canvas_object.get_related_objects = function(aCanvas){
        let related_objects = {
            object: this,
            input: [],
            output: [],
            output_false: [], // only for conditions
            errors: [],
        }

        // Step 1: get related lines on input

        let input_points = this.get_coordinates_of_input_points();
        // geting input points
        for(let point_i in input_points){
            let point = input_points[point_i];
            // searching for input lines
            let lines_for_input_found = false;
            for(let obj_i in aCanvas.objects){
                let obj = aCanvas.objects[obj_i];
                if(obj.type=="line"){
                    let line_coordinates_points = obj.get_points_coordinates();
                    if (
                        point.x == line_coordinates_points.x1 && point.y == line_coordinates_points.y1
                        || point.x == line_coordinates_points.x2 && point.y == line_coordinates_points.y2
                    ){
                        lines_for_input_found = true;
                        let related_objects_array_input_to_input = [];
                        let related_objects_array_input_to_output = [];
                        let related_lines_points = obj.get_related_lines_points(aCanvas);
                        for(let related_point_i in related_lines_points){
                            let related_point = related_lines_points[related_point_i];
                            for(let related_object_i in aCanvas.objects){
                                let related_object = aCanvas.objects[related_object_i];
                                if(related_object.type!="line"){
                                    let related_object_input_points = related_object.get_coordinates_of_input_points();
                                    let related_object_output_points = related_object.get_coordinates_of_output_points();
                                    
                                    for(let related_object_input_point_i in related_object_input_points){
                                        let related_object_input_point = related_object_input_points[related_object_input_point_i];
                                        if(
                                            related_object_input_point.x == related_point.x && 
                                            related_object_input_point.y == related_point.y
                                        ){
                                            if(related_object!=this && related_objects_array_input_to_input.indexOf(related_object)==-1){
                                                //related_objects_array_input_to_input.push(related_object);
                                                related_objects.errors.push(new Error_pointObject_to_pointObject(canvas_object, point, related_object, related_object_input_point, "Forbidden to connect input with input. Only one input and many output."));
                                            }
                                        }
                                    }

                                    for(let related_object_output_point_i in related_object_output_points){
                                        let related_object_output_point = related_object_output_points[related_object_output_point_i];
                                        if(
                                            related_object_output_point.x == related_point.x && 
                                            related_object_output_point.y == related_point.y
                                        ){
                                            if(related_object!=this && related_objects_array_input_to_output.indexOf(related_object)==-1){
                                                related_objects_array_input_to_output.push(related_object);
                                                related_objects.input.push(related_object);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if(related_objects_array_input_to_output.length==0){
                            related_objects.errors.push(new Error_pointObject(canvas_object, point, "No routes was found to object input"));
                        }
                    }
                }
            }
            
            if(input_points.length!=0 && !lines_for_input_found){
                related_objects.errors.push(new Error_pointObject(canvas_object, point, "No routes was found to input point"));
            }
            
        }

        let output_points = this.get_coordinates_of_output_points();
        // geting input points
        for(let point_i in output_points){
            let point = output_points[point_i];
            // searching for input lines
            let lines_for_output_found = false;
            for(let obj_i in aCanvas.objects){
                let obj = aCanvas.objects[obj_i];
                if(obj.type=="line"){
                    let line_coordinates_points = obj.get_points_coordinates();
                    if (
                        point.x == line_coordinates_points.x1 && point.y == line_coordinates_points.y1
                        || point.x == line_coordinates_points.x2 && point.y == line_coordinates_points.y2
                    ){
                        lines_for_output_found = true;
                        let related_objects_array_input_to_input = [];
                        let related_objects_array_input_to_output = [];
                        let related_lines_points = obj.get_related_lines_points(aCanvas);
                        for(let related_point_i in related_lines_points){
                            let related_point = related_lines_points[related_point_i];
                            for(let related_object_i in aCanvas.objects){
                                let related_object = aCanvas.objects[related_object_i];
                                if(related_object.type!="line"){
                                    let related_object_input_points = related_object.get_coordinates_of_input_points();
                                    let related_object_output_points = related_object.get_coordinates_of_output_points();
                                    
                                    for(let related_object_input_point_i in related_object_input_points){
                                        let related_object_input_point = related_object_input_points[related_object_input_point_i];
                                        if(
                                            related_object_input_point.x == related_point.x && 
                                            related_object_input_point.y == related_point.y
                                        ){
                                            if(related_object!=this && related_objects_array_input_to_input.indexOf(related_object)==-1){
                                                related_objects_array_input_to_input.push(related_object);
                                                if(this.type=="condition"){
                                                    if(point_i==0){
                                                        related_objects.output_false.push(related_object);
                                                    }else{
                                                        related_objects.output.push(related_object);
                                                    }
                                                }else{
                                                    // For other objects
                                                    related_objects.output.push(related_object);
                                                }
                                                
                                                //Error_pointObject_to_pointObject(object, point, related_object, related_object_input_point, "Forbidden to connect input with input. Only one input and many output.");
                                            }
                                        }
                                    }

                                    /*
                                    for(let related_object_output_point_i in related_object_output_points){
                                        let related_object_output_point = related_object_output_points[related_object_output_point_i];
                                        if(
                                            related_object_output_point.x == related_point.x && 
                                            related_object_output_point.y == related_point.y
                                        ){
                                            if(related_object!=this && related_objects_array_input_to_output.indexOf(related_object)==-1){
                                                related_objects_array_input_to_output.push(related_object);
                                                //related_objects.output.push(related_object);
                                                // Voided but not interesting for process
                                            }
                                        }
                                    }
                                    */
                                }
                            }
                        }
                        if(related_objects_array_input_to_input.length==0){
                            related_objects.errors.push(new Error_pointObject(canvas_object, point, "No routes was found from object output"));
                        }   
                    }
                    
                }
                
            }
            if(output_points.length!=0 && !lines_for_output_found){
                related_objects.errors.push(new Error_pointObject(canvas_object, point, "No routes was found for output point"));
            }

        }

        return related_objects;

    }

    return canvas_object;
}

function get_object_type_string(obj){
    if(obj.type=="line") return "Line";
    else if(obj.type=="comment") return "Comment";
    else if(obj.type=="condition") return "Condition";
    else if(obj.type=="event") return "Event";
    else if(obj.type=="start") return "Start";
    else if(obj.type=="finish") return "Finish";
    else return obj.type;
}