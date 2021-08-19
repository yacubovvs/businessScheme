function Result_text(resultText){
    let result = {};
    result.resultText = resultText;
    result.content = document.createElement("div");
    result.content.classList.add("main_bottom_panel-body-result");
    _result_add_text_div(result.content, resultText);
    return result;
}

function ResultNoResult(){
    let result = Result_text("No result")
    //result.content.classList.add("main_bottom_panel-body-result");
    return result;
}

function _result_add_text_div(container, text){
    let el = document.createElement("div");
    el.innerText = text;
    container.appendChild(el)
}