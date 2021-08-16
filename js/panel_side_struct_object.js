function panelObject(){
    let object = document.createElement("div");
    object.classList.add("panel_side_element");
    return object;
}

function PanelObject_label(text){
    if(!text) text = "";

    let object = panelObject();
    object.classList.add("panel_side_element_label");
    object.innerText = text;

    return object;
}

function PanelObject_title(text){
    if(!text) text = "";

    let object = panelObject();
    object.classList.add("panel_side_element_title");
    object.innerText = text;

    return object;
}

function PanelObject_spacer(height){
    if(!height) height = 0;
    let object = panelObject();
    object.style.height = height + "px";
    object.style.margin = "0px";
    //object.classList.add("panel_side_element");
    return object;
}

function PanelObject_input_text(value, function_on_change, onfocuslose){
    if(!value) value = "";

    let object = panelObject();
    object.classList.add("panel_side_element_input");
    object.innerText = value;
    object.setAttribute("contenteditable", true);
    object.onfocus = function(){preventCanvasKeys = true;}
    object.onblur = function(){
        preventCanvasKeys = false;
        if(onfocuslose!=undefined){onfocuslose(this);}
    }
    object.oninput = function(){function_on_change(this.innerText);}

    return object;
}

function PanelObject_input_number(value, defaultValue, function_on_change, onfocuslose){
    if(!value) value = "";

    let object = panelObject();
    object.classList.add("panel_side_element_input");
    object.innerText = value;
    object.setAttribute("contenteditable", true);
    object.onfocus = function(){preventCanvasKeys = true;}
    object.onblur = function(){
        preventCanvasKeys = false;
        if(onfocuslose!=undefined){onfocuslose(this);}
    }
    object.oninput = function(){
        let value = parseInt(this.innerText);
        if(isNaN(value)){
            value = defaultValue;
            object.innerText=value;
            const range = document.createRange();
            range.selectNodeContents(object);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        //this.innerText = value;
        function_on_change(value);
    }

    return object;
}

function PanelObject_input_textArea(value, function_on_change, onfocuslose){
    let object = PanelObject_input_text(value, function_on_change, onfocuslose);
    object.classList.add("panel_side_element_input-textArea");
    return object;
}

function PanelObject_btn(text, handler){

    let object = panelObject();

    let resource_add_button = document.createElement("div");
    resource_add_button.classList.add("panel_side_element_btn");
    resource_add_button.innerText = text;
    resource_add_button.onclick = function(){handler(this)};
    object.appendChild(resource_add_button);

    return object;
}

function PanelObject_resources_list(){

    let object = panelObject();
    object.classList.add("panel_side_element_resource-list");

    for (let resource_i in Resources.list){
        let resource = Resources.list[resource_i];

        let resource_dom = document.createElement("div");
        resource_dom.classList.add("panel_side_element_resource-list-element");
        

        let resource_dom_delete_btn = document.createElement("div");
        resource_dom_delete_btn.classList.add("panel_side_element-list-element-del_btn");
        resource_dom_delete_btn.innerText = "x";
        resource_dom_delete_btn.onclick = function(){
            Resources.delete(resource);
            panelSide.draw();
        }

        let resource_dom_text = document.createElement("div");
        resource_dom_delete_btn.classList.add("panel_side_element-list-element-label");
        resource_dom_text.innerText = resource.name;
        resource_dom_text.setAttribute("contenteditable", true);

        resource_dom_text.onfocus = function(){
            preventCanvasKeys = true;
        }
        resource_dom_text.onblur = function(){
            preventCanvasKeys = false;
        }
    
        resource_dom_text.oninput = function(){
            resource.name = resource_dom_text.innerText;
        }

        resource_dom.appendChild(resource_dom_delete_btn);
        resource_dom.appendChild(resource_dom_text);
    
        object.appendChild(resource_dom);
    }
    return object;
}

function PanelObject_parameters_list(){

    let object = panelObject();
    object.classList.add("panel_side_element_resource-list");

    for (let paramater_i in Parameters.list){
        let paramater = Parameters.list[paramater_i];

        let paramater_dom = document.createElement("div");
        paramater_dom.classList.add("panel_side_element_resource-list-element");
        

        let paramater_dom_delete_btn = document.createElement("div");
        paramater_dom_delete_btn.classList.add("panel_side_element-list-element-del_btn");
        paramater_dom_delete_btn.innerText = "x";
        paramater_dom_delete_btn.onclick = function(){
            Parameters.delete(paramater);
            panelSide.draw();
        }

        let paramater_dom_text = document.createElement("div");
        paramater_dom_delete_btn.classList.add("panel_side_element-list-element-label");
        paramater_dom_text.innerText = paramater.name;
        paramater_dom_text.setAttribute("contenteditable", true);

        paramater_dom_text.onfocus = function(){
            preventCanvasKeys = true;
        }
        paramater_dom_text.onblur = function(){
            preventCanvasKeys = false;
        }
    
        paramater_dom_text.oninput = function(){
            paramater.name = paramater_dom_text.innerText;
        }

        paramater_dom.appendChild(paramater_dom_delete_btn);
        paramater_dom.appendChild(paramater_dom_text);

        let paramater_dom_value_label = document.createElement("div");
        paramater_dom_value_label.innerText = "value:";
        paramater_dom_value_label.classList.add("panel_side_element-list-element-value_label");

        let paramater_dom_value = document.createElement("div");
        paramater_dom_value.innerText = paramater.value;
        paramater_dom_value.classList.add("panel_side_element-list-element-value_editable");
        paramater_dom_value.setAttribute("contenteditable", true);

        paramater_dom_value.onfocus     = function(){preventCanvasKeys = true;}
        paramater_dom_value.onblur      = function(){preventCanvasKeys = false;}
        paramater_dom_value.oninput     = function(){ 
            let settedValue = paramater.setValue(paramater_dom_value.innerText);
            if(paramater_dom_value.innerText!=settedValue){
                paramater_dom_value.innerText=settedValue;
                const range = document.createRange();
                range.selectNodeContents(paramater_dom_value);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

        paramater_dom.appendChild(paramater_dom_value_label);
        paramater_dom.appendChild(paramater_dom_value);
        paramater_dom.appendChild(new ClearBothDiv());
    
        object.appendChild(paramater_dom);
    }
        
    return object;
}

function ClearBothDiv(){
    var obj = document.createElement("div");
    obj.classList.add("clear_both");
    return obj;
}