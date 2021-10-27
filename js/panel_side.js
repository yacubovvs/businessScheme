var panelSide;

function startFunction_panelSide(){
    panelSide           = document.getElementById('main_side_panel');
    panelSide.slide     = document.getElementById('main_side_panel-slide');
    panelSide.content   = document.getElementById('main_side_panel-body');
    
    panelSide._isVisible = false;
    panelSide.property_object = ACanvas;

    panelSide.toogleVisible = function(){
        this.setVisible(!panelSide._isVisible);
    }

    panelSide.setVisible = function(visible){
        this._isVisible = visible;
        if(visible) this.style.display = "block";
        else this.style.display = "none";

        reizePanels();
    }


    panelSide.content.width = 0;
    panelSide.content._settings = {
        _min_width: 150,
        _max_width: 1200,
    }

    panelSide.content.setWidth = function(size){
        this.width = size;
        if(this.width<this._settings._min_width) this.width = this._settings._min_width;
        if(this.width>this._settings._max_width) this.width = this._settings._max_width;
        this.style.width = "" + this.width + "px";
        reizePanels();
    }

    panelSide.content.changeWidth = function(size){
        this.setWidth(this.width + size);
    }
    panelSide.content.setWidth(300);

    panelSide.slide.is_mouse_on = false;
    panelSide.drag_position = {x:0, y:0};

    let window_onmouseup = function(event){
        panelSide.slide.is_mouse_on = false;
    }

    panelSide.slide.onmousedown = function(event){
        panelSide.slide.is_mouse_on = true;
        panelSide.drag_position.x = event.x;
        panelSide.drag_position.y = event.y;
    }

    let window_onmousemove = function(event){
        if(panelSide.slide.is_mouse_on){
            panelSide.content.changeWidth(event.x - panelSide.drag_position.x);

            panelSide.drag_position.x = event.x;
            panelSide.drag_position.y = event.y;
        }
    }
    
    window.addEventListener('mousemove', window_onmousemove);
    window.addEventListener('mouseup', window_onmouseup);

    panelSide.draw = function(){
        let draw_struct = this.property_object.getSideMenuStruct();

        this.content.innerHTML = "";
        for(let dom_i in draw_struct){
            let dom = draw_struct[dom_i];
            this.content.appendChild(dom);
        }

        //console.log("Drawing struct " + draw_struct);
    }

    panelSide.draw();
    panelSide.setVisible(true);
}

window.addEventListener('load', startFunction_panelSide);