function Error(errorText){
    let error = {};
    error.errorText = errorText;
    error.content = document.createElement("div");
    error.content.classList.add("main_bottom_panel-body-error");
    _errors_add_text_div(error.content, errorText);
    return error;
}

function Error_object(object, errorText){
    let error = new Error(errorText);
    error.object = object;
    _errors_add_text_div(error.content, "Object: " + get_object_type_string(object) + " " + object.id);
    _errors_add_btn_scroll_to_object(error.content, "go to object", object)
    return error;
}

function Error_pointObject(object, point, errorText){
    let error = new Error_object(object, errorText);
    error.point = point;
    _errors_add_text_div(error.content, "Point:  [" + point.x + "," + point.y + "]");
    _errors_add_btn_scroll_to_point(error.content, "go to point", point)
    
    return error;
}

function Error_pointObject_to_pointObject(object, point, object2, point2, errorText){
    let error = new Error_pointObject(object, point, errorText);
    error.object2 = object2;
    _errors_add_text_div(error.content, "Object 2: " + get_object_type_string(object2) + " " + object2.id);
    _errors_add_btn_scroll_to_object(error.content, "go to object", object2)

    error.point2 = point2
    _errors_add_text_div(error.content, "Point 2:  [" + point2.x + "," + point2.y + "]");
    _errors_add_btn_scroll_to_point(error.content, "go to point", point2)

    return error;
}

function InProgress(){
    let error = new Error("In progress...");
    error.content.classList.add("main_bottom_panel-body-error_error-no_error");
    return error;
}

function NoErrors(){
    let error = new Error("No error");
    error.content.classList.add("main_bottom_panel-body-error_error-no_error");
    return error;
}

function _errors_add_text_div(container, text){
    let el = document.createElement("div");
    el.innerText = text;
    container.appendChild(el)
}


function _errors_add_btn_scroll_to_object(container, text, object){
    let resource_add_button = document.createElement("div");
    resource_add_button.classList.add("bottom_pannel_inError-btn");
    resource_add_button.innerText = text;
    resource_add_button.onclick = function(){ ACanvas.scroll_to_object(object);};
    container.appendChild(resource_add_button);
}

function _errors_add_btn_scroll_to_point(container, text, point){
    let resource_add_button = document.createElement("div");
    resource_add_button.classList.add("bottom_pannel_inError-btn");
    resource_add_button.innerText = text;
    resource_add_button.onclick = function(){ACanvas.scroll_to_point(point);};
    container.appendChild(resource_add_button);
}