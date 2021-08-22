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

function ResultProbabilityResourcesTable(text, resourcesStructArray){
    let result = new Result_text(text);
    //console.log(resourcesStructArray);

    let canvas = document.createElement("canvas");
    result.content.appendChild(canvas);
    return result;
}

function ResultProbabilityFinishTable(text, finishStructArray){
    let result = new Result_text(text);
    //console.log(finishStructArray);

    let probability_struct = {}
    let finish_objects = {}
    let total_element = 0;
    for(let finish_i in finishStructArray){
        let finish_obj = finishStructArray[finish_i]
        let finish = finish_obj.id;
        //console.log(finish);
        if(probability_struct[finish]!=undefined){
            probability_struct[finish]++;
        }else{
            probability_struct[finish]=1;
            finish_objects[finish] = finish_obj;
        }
        total_element ++;
    }

    //console.log(finish_objects);
    //console.log(probability_struct);

    let table = document.createElement("table");
    table.classList.add("finish_probability_table");
    //table.setAttribute("border", "1");
    let total_finishes = 0;

    let tr = document.createElement("tr");
    for(let f_res_i in finish_objects){
        let f_result = finish_objects[f_res_i];
        let td = document.createElement("td");
        td.innerText = "Finish " + f_result.text;
        tr.appendChild(td)
    }
    table.appendChild(tr);
    
    
    tr = document.createElement("tr");
    for(let f_res_i in finish_objects){
        //let f_result = finish_objects[f_res_i];
        let td = document.createElement("td");
        td.innerText = "" + probability_struct[f_res_i] + " times";
        tr.appendChild(td)
        total_finishes+=probability_struct[f_res_i];
    }
    table.appendChild(tr);

    //console.log(total_finishes);
    tr = document.createElement("tr");
    for(let f_res_i in finish_objects){
        //let f_result = finish_objects[f_res_i];
        let td = document.createElement("td");
        let percent_result = Math.round(probability_struct[f_res_i]/total_finishes*10000)/100;
        td.innerText = "" + percent_result + " %";
        tr.appendChild(td)
        
    }
    table.appendChild(tr);

    tr = document.createElement("tr");
    for(let f_res_i in finish_objects){
        //let f_result = finish_objects[f_res_i];
        let td = document.createElement("td");
        td.classList.add("finish_probability_table_result_td");
        //td.innerText = "" + probability_struct[f_res_i];

        let el_bg = document.createElement('div');
        el_bg.classList.add("finish_probability_table_result_td_div_bg");
        let el_result = document.createElement('div');
        el_result.classList.add("finish_probability_table_result_td_div_result");

        let percent_result = Math.round(probability_struct[f_res_i]/total_finishes*10000)/100;
        el_bg.style.height = "" + (100-percent_result) + "%";
        el_result.style.height = "" + (percent_result) + "%";

        td.appendChild(el_bg);
        td.appendChild(el_result);
        tr.appendChild(td)
    }
    table.appendChild(tr);

    //console.log(result);
    result.content.appendChild(table);
    return result;
}

function _result_add_text_div(container, text){
    let el = document.createElement("div");
    el.innerText = text;
    container.appendChild(el)
}

