var panelBottom;

function startFunction_panelBottom(){
    panelBottom                 = document.getElementById('main_bottom_panel');
    panelBottom.slide           = document.getElementById('bottom_panel_vertical_slider');
    panelBottom.content         = document.getElementById('main_bottom_panel-body');
    panelBottom.on_hide_btns    = document.getElementById('bottom_panel_top_btn_holder_free');
    
    panelBottom._isVisible = false;

    panelBottom.toogleVisible = function(){
        this.setVisible(!panelBottom._isVisible);
    }

    panelBottom.setVisible = function(visible){
        this._isVisible = visible;
        if(visible) this.style.display = "block";
        else this.style.display = "none";
    }

    panelBottom.height = 0;
    panelBottom._settings = {
        _min_height: 50,
        _max_height: 1200,
    }

    panelBottom.slide.is_mouse_on = false;
    panelBottom.drag_position = {x:0, y:0};


    panelBottom.changeHeight = function(size){
        this.setHeight(this.height - size);
    }
    

    let window_onmouseup = function(event){
        panelBottom.slide.is_mouse_on = false;
    }

    let window_onmousemove = function(event){
        if(panelBottom.slide.is_mouse_on){
            panelBottom.changeHeight(event.y - panelBottom.drag_position.y);

            panelBottom.drag_position.x = event.x;
            panelBottom.drag_position.y = event.y;
        }
    }

    panelBottom.slide.onmousedown = function(event){
        panelBottom.slide.is_mouse_on = true;
        panelBottom.drag_position.x = event.x;
        panelBottom.drag_position.y = event.y;
    }

    panelBottom.width = 0;
    panelBottom.setWidth = function(size){
        this.width = size;
        this.style.width = "" + this.width + "px";
    }

    panelBottom.setHeight = function(size){
        this.height = size;
        if(this.height<this._settings._min_height) this.height = this._settings._min_height;
        if(this.height>this._settings._max_height) this.height = this._settings._max_height;
        this.style.height = "" + this.height + "px";

        if(this.height<=50){
            panelBottom.slide.is_mouse_on = false;
            panelBottom.setVisible(false);
            this.setHeight(300);
        }
        // panelBottom.setHeight(300);
    }

    
    panelBottom.setHeight(300);
    
    window.addEventListener('mousemove', window_onmousemove);
    window.addEventListener('mouseup', window_onmouseup);

    panelBottom.draw = function(){

    }

    panelBottom.draw();
    panelBottom.setVisible(true);

    panelBottom.content.setErrors = function(errorList, doNotSetVisible){
        this.innerHTML = "";
        if(!errorList) errorList = [];
        if(errorList.length==0){
            errorList.push(new NoErrors())
        }

        for(errorList_i in errorList){
            error = errorList[errorList_i];

            this.appendChild(error.content);
        }

        if(doNotSetVisible!=true) panelBottom.setVisible(true);
    }

    panelBottom.content.setErrors(undefined, true);
    panelBottom.setVisible(false);

    panelBottom.onCloseBtnClick = function(){
        panelBottom.setVisible(false);
    }

    panelBottom.onErrorBtnClick = function(){
        panelBottom.setVisible(true);
    }

    panelBottom.onResultBtnClick = function(){
        panelBottom.setVisible(true);
    }

    
}

window.addEventListener('load', startFunction_panelBottom);