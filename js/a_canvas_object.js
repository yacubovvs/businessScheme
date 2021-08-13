function Canvas_object(visible){
    let canvas_object = {};
    canvas_object.type = "";

    canvas_object.position = {x:0,y:0};
    canvas_object.size = {height:1, width:1}
    canvas_object.rotation = 0;
    canvas_object.image = undefined;
    canvas_object.id = get_uid();
    canvas_object.canRotate = false;

    canvas_object.resize_point_start = {x:0,y:0};
    canvas_object.resize_point = {x:0,y:0};
    
    if(visible) canvas_object.visible = true;
    else canvas_object.visible = false;

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

    return canvas_object;
}

function get_uid(){
    return Math.random().toString(32).slice(2);
}