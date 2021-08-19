var panelBottom;

function startFunction_panelBottom(){
    panelBottom                 = document.getElementById('main_bottom_panel');
    panelBottom.slide           = document.getElementById('bottom_panel_vertical_slider');
    panelBottom.content_error   = document.getElementById('main_bottom_panel-body-error');
    panelBottom.content_result  = document.getElementById('main_bottom_panel-body-result');
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

    panelBottom.setVisible(true);

    panelBottom.content_result.setResultInProgress = function(){
        this.innerHTML = "";
        resultList = [];
        resultList.push(new InProgress());
        this.setResult(resultList);
    }

    panelBottom.content_error.setErrorsInProgress = function(){
        this.innerHTML = "";
        errorList = [];
        errorList.push(new InProgress());
        this.setErrors(errorList);
    }

    panelBottom.content_error.setErrors = function(errorList, doNotSetVisible){
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

    panelBottom.content_result.setResult = function(resultList, doNotSetVisible){
        this.innerHTML = "";
        if(!resultList) resultList = [];
        if(resultList.length==0){
            resultList.push(new ResultNoResult())
        }

        for(resultList_i in resultList){
            result = resultList[resultList_i];

            this.appendChild(result.content);
        }

        if(doNotSetVisible!=true) panelBottom.setVisible(true);
    
    }

    panelBottom.content_error.showErrorPart = function(){
        panelBottom.content_error.style.display = "block";
        panelBottom.content_result.style.display = "none"
    }

    panelBottom.content_error.showResultPart = function(){
        panelBottom.content_result.style.display = "block";
        panelBottom.content_error.style.display = "none";
    }

    panelBottom.content_error.setErrors(undefined, true);
    panelBottom.content_result.setResult(undefined, true);

    panelBottom.setVisible(false);

    panelBottom.onCloseBtnClick = function(){
        panelBottom.setVisible(false);
    }

    panelBottom.onErrorBtnClick = function(){
        panelBottom.setVisible(true);
        this.content_error.showErrorPart();
    }

    panelBottom.onResultBtnClick = function(){
        panelBottom.setVisible(true);
        this.content_error.showResultPart();
    }

    
}

window.addEventListener('load', startFunction_panelBottom);