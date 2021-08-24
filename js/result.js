function Result_text(resultText){
    let result = {};
    result.resultText = resultText;
    result.content = document.createElement("div");
    result.content.classList.add("main_bottom_panel-body-result");
    _result_add_text_div(result.content, resultText);
    result.draw = function(){};
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

function ResultProbabilityResourcesTable(text, finish_obj, resourcesStructArray){
    let result = new Result_text(text);
    //console.log(resourcesStructArray);

    let canvas = document.createElement("canvas");
    canvas.classList.add("resource_probability_table_result");
    canvas.classList.add("resize_panels_listener");
    canvas.columns = 20;
    canvas.max_value = 0;
    canvas.resourcesStructArray = resourcesStructArray;

    /*
    canvas.column_array = [
        0.0005,
        0.001,
        0.001,
        0.002,
        0.005,
        0.035,
        0.04,
        0.08,
        0.2,
        0.24,
        0.24,
        0.2,
        0.08,
        0.04,
        0.035,
        0.005,
        0.002,
        0.001,
        0.0002,

    ];*/

    canvas.update_columns = function(){

        canvas.max_value = 0;
        for(let r_i in resourcesStructArray){
            let value = resourcesStructArray[r_i];
            if(canvas.max_value<value) canvas.max_value=value;
        }

        console.clear();
        console.log("Updating columns");
        let max_value = this.max_value;
        let columns = this.columns;

        //console.log(canvas.resourcesStructArray);

        let probability_array = [];

        for(let i=0; i<this.columns; i++){
            if(probability_array[i]==undefined) probability_array[i] = 0;
            //console.log("Column" + i + ":");
            let value_min = max_value/columns*i;
            let value_max = max_value/columns*(i+1);
            //console.log("" + value_min + "<value<=" + value_max );
            for(let i_r in canvas.resourcesStructArray){
                let value = canvas.resourcesStructArray[i_r];
                //console.log(value);
                if(value_min<value && value<=value_max){
                    probability_array[i]++;
                }
            }
        }

        let max_probability = 0;
        for(let prob_ar_i in probability_array){
            //let val_prob_i = probability_array[prob_ar_i];
            probability_array[prob_ar_i] = probability_array[prob_ar_i]/resourcesStructArray.length
            if(max_probability<probability_array[prob_ar_i]) max_probability = probability_array[prob_ar_i];
        }

        //console.log(probability_array);

        canvas.max_probability = max_probability;
        canvas.columns_array = probability_array 
    }

    canvas.draw = function(){

        //console.log("Canvas draw");
        //return;



        //this.height = innerHeight;
        //this.width = innerWidth;
        let context = this.getContext('2d');
        context.fillStyle = "rgb(255,255,255)";
        context.fillRect(0, 0, this.width, this.height);

        // Drowing coordinates
        let coordinates_x_offset = 15;
        let coordinates_y_offset = 15;

        
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.moveTo(coordinates_x_offset, coordinates_y_offset);
        context.lineTo(coordinates_x_offset, this.height-coordinates_y_offset);
        context.lineTo(this.width-coordinates_x_offset, this.height-coordinates_y_offset);
        context.stroke();

        //console.log(canvas.width);
        //console.log(canvas.height);

        let fontSize = coordinates_y_offset;
        //let context = canvas.getContext('2d');
        context.font = "" + fontSize + "px sans-serif";

        context.fillStyle = "rgba(64,64,64)";
        context.textAlign = "start";
        context.textBaseline = "alphabetic";
        
        context.fillText("" + canvas.max_probability, 0, coordinates_y_offset*0.7);
        context.fillText("0", 0, canvas.height-1);
        context.fillText("" + canvas.max_value, canvas.width - fontSize*( ("" + canvas.max_value).length*0.6 ) , canvas.height-1);

        let graph_width = canvas.width - coordinates_x_offset*2;
        let graph_height = canvas.height - coordinates_y_offset*2;
        let element_width =  graph_width/canvas.columns;

        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = 'rgba(165,165,165)';
        for(let value_i in canvas.columns_array){
            let value = canvas.columns_array[value_i];
            let c_x = coordinates_x_offset + value_i*element_width + element_width;
            let c_y = coordinates_y_offset - graph_height*(value/canvas.max_probability) + graph_height;

            if(value_i==0){
                context.moveTo(c_x, c_y);
            }else{
                context.lineTo(c_x, c_y);
            }
            
            //drawCircle(context, c_x, c_y, 3, 2, true, true, "rgb(128,0,0)", "rgb(128,64,64)");
        }
        context.stroke();

        context.fillStyle = "rgba(0,128,128)";
        for(let value_i in canvas.columns_array){
            let value = canvas.columns_array[value_i];

            let c_x = coordinates_x_offset + value_i*element_width + element_width;
            let c_y = coordinates_y_offset - graph_height*(value/canvas.max_probability) + graph_height;
            drawCircle(context, c_x, c_y, 3, 2, true, true, "rgb(128,0,0)", "rgb(128,64,64)");
        }
        
    }

    canvas.onresize = function(){
        //console.log("Canvas resize");
        this.update_width();
        canvas.draw();
    }

    canvas.update_width = function(){this.width = panelBottom.width - 34;}
    

    //canvas.draw();
    let intput_text = new PanelObject_label("Columns:");
    intput_text.style.color = "rgb(0, 146, 12)";
    result.content.appendChild(intput_text);
    let inputColumnsValue = new PanelObject_input_number(canvas.columns, 10, function(value){canvas.columns = value;}, function(){canvas.update_columns(); canvas.draw();});
    inputColumnsValue.style.width = "150px"
    result.content.appendChild(inputColumnsValue)
    result.content.appendChild(canvas);

    canvas.update_width();
    result.draw = function(){
        canvas.draw();
    }

    canvas.update_columns();

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

function _notify_resize_panels_listeners(){
    let listeners = document.getElementsByClassName("resize_panels_listener");
    for(let e_i in listeners){
        if(listeners[e_i].onresize!=undefined){
            listeners[e_i].onresize();
        }
    }
}