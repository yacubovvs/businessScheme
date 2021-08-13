
var ACanvas = undefined;


function startFunction(){
    // Инициализация
    ACanvas = document.getElementById('mainACanvas');
    ACanvas.initted = false; // Флаг инициализации
    ACanvas.selecting_dot = false;

    // Инициализация настроек
    ACanvas._settings = {
        // Задний фон
        _bg_color: "rgb(255,255,255)",

        // Minimum px for draging canvas
        _min_px_for_dragging: 5,
    
        // Отрисовка точек на конве
        _draw_dots: true,
        _draw_dots_every: 50,
        _draw_dots_radius: 1.5,
        _draw_dots_color: "rgb(128,128,128)",
        _draw_select_dots_color: "rgb(255,0,0)",
    
        // Зум за прокрутку мыши
        _zoom_on_wheel_value: 0.2,
    
        // Координаты элементов
        _draw_coordinates_size: 50,
        
        // Изменение зума за одно нажатие
        _zoom_size_change: 1.02,

        // Selection points
        _selection_points_color_border: "rgb(28,28,28)",
        _selection_points_color_fill: "rgb(220,220,220)",
        _selection_points_size_px: 10,

    };
    
    // Deleting functions
    ACanvas.delete_selected_objects = function(){
        for(let obj_i in this.user_selections){
            let object = this.user_selections[obj_i];
            if(this.delete_object(object)){
                this.user_selections.splice(obj_i,1);
                this.delete_selected_objects();
                return;
            }
        }
        this.draw();
    }
    
    ACanvas.delete_object = function(object_to_delete){
        for(let obj_i in this.objects){
            let object = this.objects[obj_i];
            if(object==object_to_delete){
                //console.log("Deleting object " + object.id);
                this.objects.splice(obj_i,1);
                return true;
            }
        }
        return false;
    }

    // Screen scrolls values
    ACanvas.scroll = {x: 0,y: 0,};
    // Zoom value
    ACanvas.zoom = 1

    // Flag on object resize
    ACanvas._is_Object_resizing = false;
    ACanvas._object_resize_point = -1;

    // Flag of moving object by user
    ACanvas._object_user_moving = false;
    

    ACanvas.objects = [];
    ACanvas.userDrawing_object = undefined;

    ACanvas._get_between_dots_length = function(){
        let value = this._settings._draw_dots_every*this.zoom;
        while(value<30){
            value*=2;
        }
        return value;
    }

    ACanvas._stick_to_dots_size = function(){
        //return this._get_between_dots_length()/4 + 1;
        return this._get_between_dots_length()/2;
    }

    ACanvas._get_drawing_shift_x_dots = function(){
        return (this._get_drawing_shift_x())%this._get_between_dots_length();
    }

    ACanvas._get_drawing_shift_y_dots = function(){
        return (this._get_drawing_shift_y())%this._get_between_dots_length();;
    }

    ACanvas._get_drawing_shift_x = function(){
        return this.scroll.x + this._mouse_drag.x;
    }

    ACanvas._get_drawing_shift_y = function(){
        return this.scroll.y + this._mouse_drag.y;
    }

    // Отрисовываем конву
    ACanvas.draw = function(){
        let context = ACanvas.getContext('2d');

        // Filling the background
        context.fillStyle = this._settings._bg_color;
        context.fillRect(0, 0, ACanvas.width, ACanvas.height);
    
        // setting real size
        ACanvas.height = innerHeight;
        ACanvas.width = innerWidth;

        // Drawing dots coordinates
        if(this._settings._draw_dots) aCanvas_drawDots(this, context);

        // Drawing objects
        for(let obj in this.objects){
            this.objects[obj].draw(this, context);
        }

        // Drawing current draw object by user
        if(this.userDrawing_object!=undefined){
            this.userDrawing_object.draw(this, context);
        }

        // Drawing user selections
        if(this.user_selections.length!=0){
            for(let selection_obj_i in this.user_selections){
                let obj = this.user_selections[selection_obj_i];
                obj.draw_user_selection(this, context);
            }
        }
    }

    ACanvas._get_cordinates_by_position = function(x,y){
        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();

        x = x*coordinates_realSize + drawing_shift_x;
        y = y*coordinates_realSize + drawing_shift_y;

        return {x:x, y:y}; // result in pixels
    }

    ACanvas._get_position_by_coordinates = function(x,y){
        let coordinates_realSize = this._settings._draw_coordinates_size*this.zoom;

        x -= this._get_drawing_shift_x();
        y -= this._get_drawing_shift_y();

        x = Math.round(x/coordinates_realSize);// + drawing_shift_x;
        y = Math.round(y/coordinates_realSize);
        //console.log("X: " + x + " Y: " + y);

        return {x:x, y:y};
    }

    ACanvas._get_position_by_coordinates_raw = function(x,y){
        let coordinates_realSize = this._settings._draw_coordinates_size*this.zoom;

        x -= this._get_drawing_shift_x();
        y -= this._get_drawing_shift_y();

        x = x/coordinates_realSize;// + drawing_shift_x;
        y = y/coordinates_realSize;
        //console.log("X: " + x + " Y: " + y);

        return {x:x, y:y};
    }

    // Событие мыши
    ACanvas._mouseTouched = false;
    ACanvas._mouse_drag_start = {x:0, y:0};
    ACanvas._mouse_drag = {x:0, y:0};
    ACanvas._mouse_position = {x:0, y:0};

    ACanvas.onwheel = function(event){
        if(event.deltaY<0){
            this.zoom*=this._settings._zoom_size_change;
            this.scroll.x *= this._settings._zoom_size_change;
            this.scroll.x -= event.x*(this._settings._zoom_size_change-1);
            this.scroll.y *= this._settings._zoom_size_change;
            this.scroll.y -= event.y*(this._settings._zoom_size_change-1);
        }else if(event.deltaY>0){
            this.zoom/=this._settings._zoom_size_change;
            this.scroll.x /= this._settings._zoom_size_change
            this.scroll.x += event.x*(this._settings._zoom_size_change-1);
            this.scroll.y /= this._settings._zoom_size_change;
            this.scroll.y += event.y*(this._settings._zoom_size_change-1);
        } 
        ACanvas.draw();
    }

    ACanvas.onmousedown = function(event){
        this._mouseTouched = true;
        this._mouse_drag_start.x = event.x;
        this._mouse_drag_start.y = event.y;
        this._mouse_position.x = event.x;
        this._mouse_position.y = event.y;

        // Check for click on user selection
        for(let objects_i in this.user_selections){
            let object = this.user_selections[objects_i];
            let object_resize_point = object.is_on_user_selection_click(this, event.x, event.y);
            if(object_resize_point!=-1){
                this._is_Object_resizing = true;
                this._object_resize_point = object_resize_point;
                return;
            }
        }

        // Just a mouse click, checking objects for clicking
        let click_position = this._get_position_by_coordinates_raw(event.x, event.y);
        for(let object_i in this.user_selections){
            let object = this.user_selections[object_i];
            
            if(object._is_click_on_object(this, click_position.x, click_position.y)){
                this._object_user_moving = true;
            }
        }
        
    }

    ACanvas.onmouseup = function(event){
        let needDraw;
        this._mouseTouched = false;
        this._object_user_moving = false;
        
        if(Math.abs(this._mouse_drag.x)>this._settings._min_px_for_dragging || Math.abs(this._mouse_drag.y)>this._settings._min_px_for_dragging){
            this.scroll.x += this._mouse_drag.x;
            this.scroll.y += this._mouse_drag.y;
        }else{

            if(!this._is_Object_resizing){ // if not clicked on user selection
                if(this.user_selections.length!=0) needDraw = true;
                    this.user_selections = [];
                    if(this.userDrawing_object!=undefined){
                        let position = this._get_position_by_coordinates(event.x, event.y);
                        this.userDrawing_object.user_start_draw_click(this, position.x, position.y);
                    }else{
                        // Just a mouse click, checking objects for clicking
                        let click_position = this._get_position_by_coordinates_raw(event.x, event.y);
                        for(object_i in this.objects){
                            let object = this.objects[object_i];
                            
                            if(object._is_click_on_object(this, click_position.x, click_position.y)){
                                //console.log("Clicked on object " + object.id);
                                //console.log(object);
                                this.user_selections.push(object);
                                needDraw = true;
                            }
                        }
                }
            }else{
                this._is_Object_resizing = false;
                this._object_resize_point = -1;
            }
            
        }
        
        this._mouse_drag.x = 0;
        this._mouse_drag.y = 0;

        if(needDraw) this.draw();
    }

    ACanvas.onmousemove = function(event){
        let needDraw = false;
        
        if(this._is_Object_resizing){
            for(let objects_i in this.user_selections){
                let object = this.user_selections[objects_i];
                
                let position_last = this._get_position_by_coordinates(this._mouse_drag_start.x, this._mouse_drag_start.y);
                let position_current = this._get_position_by_coordinates(event.x, event.y);
                needDraw = object.is_on_user_selection_resize(this, this._object_resize_point, position_last.x, position_last.y, position_current.x, position_current.y);
                
            }
            if(needDraw) this.draw();
            return;
        }

        if(this.userDrawing_object!=undefined){
            let position = this._get_position_by_coordinates(event.x, event.y);
            needDraw = (this.userDrawing_object.user_start_draw_mouse_move(this, position.x, position.y)==true) || needDraw;
        }

        //console.log((this._mouse_position.x)%this._get_between_dots_length());
        if(this.selecting_dot){
            if(
                (this._mouse_position.x + this._stick_to_dots_size()/2)%this._get_between_dots_length()<this._stick_to_dots_size()
                || (this._mouse_position.y + this._stick_to_dots_size()/2)%this._get_between_dots_length()<this._stick_to_dots_size()
            ) needDraw = true;
             
            //let _get_drawing_shift_y_dots
        }

        // Object moving
        if(this._object_user_moving){
            
            let click_position_raund_last = this._get_position_by_coordinates(this._mouse_position.x, this._mouse_position.y);
            let click_position_raund = this._get_position_by_coordinates(event.x, event.y);
            
            for(object_i in this.user_selections){
                let object = this.user_selections[object_i];    
                //console.log(click_position_raund_last.x, click_position_raund_last.y, click_position_raund.x, click_position_raund.y);
                needDraw = object.on_user_move(this, click_position_raund_last.x, click_position_raund_last.y, click_position_raund.x, click_position_raund.y) || needDraw;
            }
            
            this._mouse_position.x = event.x;
            this._mouse_position.y = event.y;
            
            if(needDraw) this.draw();
            return;
        }

        this._mouse_position.x = event.x;
        this._mouse_position.y = event.y;

        // Screen dragging
        if(this._mouseTouched){
            this._mouse_drag.x = event.x - this._mouse_drag_start.x;
            this._mouse_drag.y = event.y - this._mouse_drag_start.y;
            if(Math.abs(this._mouse_drag.x)>this._settings._min_px_for_dragging || Math.abs(this._mouse_drag.y)>this._settings._min_px_for_dragging){
                needDraw = true; 
            }
        }

        if(needDraw) this.draw();
        
    }

    ACanvas.objects.push(new Line(true));
    ACanvas.scroll.x = + 220;
    ACanvas.scroll.y = + 220;

    // user_selections by user
    ACanvas.user_selections = [];

    ACanvas.draw();
    ACanvas.initted = true;
}



function aCanvas_drawDots(aCanvas, context){   
    
    let between_dots_size = aCanvas._get_between_dots_length();
    let drawing_shift_x = aCanvas._get_drawing_shift_x_dots();
    let drawing_shift_y = aCanvas._get_drawing_shift_y_dots();
    
    for(let x=-aCanvas._settings._draw_dots_radius*2; x<aCanvas._settings._draw_dots_radius*2+aCanvas.width; x+=between_dots_size){
        for(let y=-aCanvas._settings._draw_dots_radius*2; y<aCanvas._settings._draw_dots_radius*2+aCanvas.height; y+=between_dots_size){
            let x1 = drawing_shift_x+x;
            let y1 = drawing_shift_y+y;
            let radius = aCanvas._settings._draw_dots_radius;

            if(aCanvas.selecting_dot){
                if(Math.abs(aCanvas._mouse_position.x-x1)<aCanvas._stick_to_dots_size() && Math.abs(aCanvas._mouse_position.y-y1)<aCanvas._stick_to_dots_size()){
                    drawCircle_old(context, x1-radius*6, y1-radius*6, radius*4, aCanvas._settings._draw_select_dots_color);    
                }
            }

            drawCircle_old(context, x1, y1, radius, aCanvas._settings._draw_dots_color);
        } 
    } 
    
}


window.addEventListener('load', startFunction);