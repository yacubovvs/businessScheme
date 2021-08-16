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

function PanelObject_input_text(value, function_on_change){
    if(!value) value = "";

    let object = panelObject();
    object.classList.add("panel_side_element_input");
    object.innerText = value;
    object.setAttribute("contenteditable", true);
    object.onfocus = function(){
        //console.log("Focus element")
        preventCanvasKeys = true;
    }
    object.onblur = function(){
        //console.log("Unfocus element")
        preventCanvasKeys = false;
    }

    object.oninput = function(){
        //console.log("Input oninput");
        function_on_change(this.innerText);
    }

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

    //let object = document.createElement("div");
    //object.appendChild(resource_list);

    for (resource_i in Resources.list){
        let resource = Resources.list[resource_i];

        let resource_dom = document.createElement("div");
        resource_dom.classList.add("panel_side_element_resource-list-element");
        

        let resource_dom_delete_btn = document.createElement("div");
        resource_dom_delete_btn.classList.add("panel_side_element_resource-list-element-del_btn");
        resource_dom_delete_btn.innerText = "x";
        resource_dom_delete_btn.onclick = function(){
            Resources.delete(resource);
            panelSide.draw();
        }

        let resource_dom_text = document.createElement("div");
        resource_dom_delete_btn.classList.add("panel_side_element_resource-list-element-label");
        resource_dom_text.innerText = resource.name;
        resource_dom_text.setAttribute("contenteditable", true);

        resource_dom_text.onfocus = function(){
            //console.log("Focus element")
            preventCanvasKeys = true;
        }
        resource_dom_text.onblur = function(){
            //console.log("Unfocus element")
            preventCanvasKeys = false;
        }
    
        resource_dom_text.oninput = function(){
            //console.log("Input oninput");
            //function_on_change(this.innerText);
            resource.name = resource_dom_text.innerText;
            //panelSide.draw();
        }

        resource_dom.appendChild(resource_dom_delete_btn);
        resource_dom.appendChild(resource_dom_text);
    
        object.appendChild(resource_dom);
    }
    

    return object;
}