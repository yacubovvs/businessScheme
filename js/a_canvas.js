
var ACanvas = undefined;


function startFunction_ACanvas(){
    // Инициализация
    ACanvas = document.getElementById('mainACanvas');
    ACanvas.initted = false; // Флаг инициализации
    ACanvas.selecting_dot = false;
    ACanvas.app_version = "0.1";

    ACanvas.user_settings_opened = false;

    ACanvas.project_name = "new Project";
    // Settings initing
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
        //_zoom_size_change: 1.02, // For mac
        _zoom_size_change: 1.1, // For other

        // Selection points
        _selection_points_color_border: "rgb(28,28,28)",
        _selection_points_color_fill: "rgb(220,220,220)",
        _selection_points_size_px: 10,

        // Output points settings
        _input_points_radius: 7, // (px)
        _input_points_lineWidth: 2,
        _input_points_stroke: true,
        _input_points_fill: true,
        _input_points_color_stroke: "rgba(0,255,0,1)",
        _input_points_color_filling: "rgba(0,255,0,0.5)",

        // Input points settings
        _output_points_radius: 7, // (px)
        _output_points_lineWidth: 2,
        _output_points_stroke: true,
        _output_points_fill: true,
        _output_points_color_stroke: "rgba(255,0,0,1)",
        _output_points_color_filling: "rgba(255,0,0,0.5)",

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
    ACanvas._main_resizing_object = undefined;
    ACanvas._main_resizing_object_related_objects = undefined;
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
            this.objects[obj].drawInputPoints(this, context);
        }

        // Drawing current draw object by user
        if(this.userDrawing_object!=undefined){
            this.userDrawing_object.draw(this, context);
            this.userDrawing_object.drawInputPoints(this, context);
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
                this._main_resizing_object = object;
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
                    //this.user_selections = [];
                    if(this.userDrawing_object!=undefined){
                        let position = this._get_position_by_coordinates(event.x, event.y);
                        this.userDrawing_object.user_start_draw_click(this, position.x, position.y);
                    }else{
                        // Just a mouse click, checking objects for clicking
                        let click_position = this._get_position_by_coordinates_raw(event.x, event.y);
                        let clickOnObject = false;
                        for(object_i in this.objects){
                            let object = this.objects[object_i];
                            
                            if(object._is_click_on_object(this, click_position.x, click_position.y)){
                                clickOnObject = true;
                                //console.log(this.user_selections);
                                if(object.type == "line" && this.user_selections.indexOf(object)==-1){
                                    // Select all releated lines
                                    this.user_selections = [];
                                    let lines_array = object.get_related_lines(this, [object]);
                                    for(let obj_i in lines_array){
                                        let obj = lines_array[obj_i];
                                        this.user_selections.push(obj);
                                    }
                                }else{
                                    //console.log("Not line selected");
                                    this.user_selections = [];
                                    this.user_selections.push(object);
                                }
                                
                                needDraw = true;
                            }
                            
                        }

                        if(this.user_selections.length==1){
                            panelSide.property_object = this.user_selections[0];
                            //console.log("Side property for object " + this.user_selections[0])
                        }else{
                            panelSide.property_object = {
                                getSideMenuStruct: function(){
                                    return [
                                        new PanelObject_title("Group of objects:"),
                                        new PanelObject_btn("Cancel selection", function(obj){common_reset_any_actions(); ACanvas.draw(); panelSide.draw();}),
                                    ];
                                }
                            }
                        }

                        if(!clickOnObject){
                            //console.log("Nothing selected");
                            this.user_selections = [];
                            panelSide.property_object = this;
                        }

                        panelSide.draw();
                }
            }else{
                this._is_Object_resizing = false;
                this._main_resizing_object = undefined;
                this._main_resizing_object_related_objects = undefined;
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
            if(this._main_resizing_object==undefined || this._main_resizing_object.type!="line"){
                for(let objects_i in this.user_selections){
                    let object = this.user_selections[objects_i];
                    
                    let position_last = this._get_position_by_coordinates(this._mouse_drag_start.x, this._mouse_drag_start.y);
                    let position_current = this._get_position_by_coordinates(event.x, event.y);
                    needDraw = needDraw || object.is_on_user_selection_resize(this, this._object_resize_point, position_last.x, position_last.y, position_current.x, position_current.y);
                }
            }else{
                let object_resize = this._main_resizing_object;
                    
                let position_last = this._get_position_by_coordinates(this._mouse_drag_start.x, this._mouse_drag_start.y);
                let position_current = this._get_position_by_coordinates(event.x, event.y);
                needDraw = needDraw || object_resize.is_on_user_selection_resize(this, this._object_resize_point, position_last.x, position_last.y, position_current.x, position_current.y);

                // searching for second part of line (is dot is in center of multiline)
                //let secondObjectFound = false;
                if(this._main_resizing_object_related_objects == undefined){
                    this._main_resizing_object_related_objects = [];
                    for(let objects_i in this.user_selections){
                        let object = this.user_selections[objects_i];
                        let object_resize_point = object.is_on_user_selection_click(this, this._mouse_drag_start.x, this._mouse_drag_start.y);
                        //let object_resize_point = object.is_on_user_selection_click(this, event.x, event.y);
                        if(object_resize_point!=-1){
                            secondObjectFound = true;
                            //console.log("Found releated nearest object");
                            needDraw = needDraw || object.is_on_user_selection_resize(this, object_resize_point, position_last.x, position_last.y, position_current.x, position_current.y);
                            this._main_resizing_object_related_objects.push(
                                {
                                    object: object,
                                    object_resize_point: object_resize_point
                                }
                            );
                        }
                    }
                }else{
                    // Related objects to resize allready found
                    for(let objects_i in this._main_resizing_object_related_objects){
                        object_struct = this._main_resizing_object_related_objects[objects_i];
                        needDraw = needDraw || object_struct.object.is_on_user_selection_resize(this, object_struct.object_resize_point, position_last.x, position_last.y, position_current.x, position_current.y);
                    }
                }
                //if(!secondObjectFound) console.log("Line object not found");
                //console.log(this._main_resizing_object);
                //console.log(this._mouse_drag_start.x, this._mouse_drag_start.y);
                //console.log(this._mouse_position.x, this._mouse_position.y);
                
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

    ACanvas.reset_any_actions = function(){
        common_reset_any_actions();
    }

    ACanvas.getSavingFileString = function(){
        let save_struct = {
            scroll: this.scroll,
            zoom: this.zoom,
            resources: Resources.list,
            paramaters: Parameters.list,
            app_version: ACanvas.app_version,
            project_name: ACanvas.project_name,
            objects: ACanvas.objects,
        }
        return JSON.stringify(save_struct);
    }

    ACanvas.loadACanvasFromFile = function(load_object){
        this.reset_any_actions();
        this.objects = [];

        //console.log(load_object);
        this.loadParamater("project_name", load_object.project_name);
        this.loadParamater("scroll", load_object.scroll);
        this.loadParamater("zoom", load_object.zoom);

        for(let obj_i in load_object.objects){
            let object = load_object.objects[obj_i];
            object_load = new Canvas_object(object);
            if(object_load!=undefined){
                this.objects.push(object_load);
            }
        }

        Resources.list = [];
        for(let obj_i in load_object.resources){
            let object = load_object.resources[obj_i];
            object_load = new Resource(object);
            if(object_load!=undefined){
                for(let features_i in object){
                    object_load[features_i] = object[features_i];
                }
                Resources.list.push(object_load);
            }
        }

        Parameters.list = [];
        for(let obj_i in load_object.paramaters){
            let object = load_object.paramaters[obj_i];
            object_load = new Parameter(object);
            if(object_load!=undefined){
                for(let features_i in object){
                    object_load[features_i] = object[features_i];
                }
                Parameters.list.push(object_load);
            }
        }

        this.draw();
    }

    ACanvas.loadParamater = function(paramater, value){
        if(value!=undefined) this[paramater] = value;
    }

    ACanvas.getSideMenuStruct = function(){
        return [
            new PanelObject_title("Project settings:"),
            new PanelObject_spacer(7),
            new PanelObject_label("Project name:"),
            new PanelObject_input_text(this.project_name, function(value){ACanvas.project_name=value;}),

            new PanelObject_spacer(7),
            new PanelObject_label("Resources:"),
            new PanelObject_btn("+ add resource", function(obj){Resources.add(); panelSide.draw();}),
            new PanelObject_resources_list(),

            new PanelObject_spacer(7),
            new PanelObject_label("Parameters:"),
            new PanelObject_btn("+ add parameter", function(obj){Parameters.add(); panelSide.draw();}),
            new PanelObject_parameters_list(),

            new PanelObject_spacer(7),
            new PanelObject_label("App version: " + this.app_version),

        ];
    }

    // user_selections by user
    ACanvas.user_selections = [];

    ACanvas.scroll_to_object = function(obj){
        //console.log("Scrolling to object");
        //console.log(obj);

        //let object = ACanvas.user_selections[0];
        //let aCanvas = ACanvas;
    
        ACanvas.user_selections = [obj];
        panelSide.property_object = obj;
        panelSide.draw();
        this.scroll_to_point(obj.position);
    }

    ACanvas.scroll_to_point = function(point){
        this.zoom = 1;
        let coordinates = getRealCoordinates(this, point);
    
        this.scroll.x -= coordinates.x;
        this.scroll.y -= coordinates.y;
    
        this.scroll.x += (this.zoom * this.width)/2 + panelSide.offsetWidth/2;
        this.scroll.y += (this.zoom * this.height)/2 - panelBottom.offsetHeight/2;
    
        this.draw();
    }

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


window.addEventListener('load', startFunction_ACanvas);
window.addEventListener('resize', function(){
    if(ACanvas!=undefined) if(ACanvas.initted) ACanvas.draw();
    //ACanvas.draw();
    reizePanels();
});