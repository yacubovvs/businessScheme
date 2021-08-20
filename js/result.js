function Result_text(resultText){
    let result = {};
    result.resultText = resultText;
    result.content = document.createElement("div");
    result.content.classList.add("main_bottom_panel-body-result");
    _result_add_text_div(result.content, resultText);
    return result;
}

function ResultNoResult(){
    let result = new Result_text("No result")
    //result.content.classList.add("main_bottom_panel-body-result");
    return result;
}

function ResultResourcesTable(text, resourcesStruct){
    let result = new Result_text(text);
    //console.log(resourcesStruct);
    //result.content.classList.add("main_bottom_panel-body-result");
    for (let res_i in resourcesStruct){
        //console.log(resourcesStruct);
        let resource_container = document.createElement("div");
        resource_container.innerText = "" + res_i + ": " + resourcesStruct[res_i];

        result.content.appendChild(resource_container);
    }

    return result;
}

function _result_add_text_div(container, text){
    let el = document.createElement("div");
    el.innerText = text;
    container.appendChild(el)
}

