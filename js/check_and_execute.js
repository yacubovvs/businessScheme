var related_objects_run = [];
var resources_values_run = {};
var param_values_run = {};

function check_project(){
    related_objects_run = [];
    panelBottom.content_error.showErrorPart();
    panelBottom.content_error.setErrorsInProgress();

    let related_Objects_struct = [];
    let errors = [];

    for(obj_i in ACanvas.objects){
        let obj = ACanvas.objects[obj_i];
        if(obj.type!="line"){
            let related_objects = obj.get_related_objects(ACanvas);
            related_Objects_struct.push(related_objects);
            related_objects_run.push(related_objects);
            for(error_i in related_objects.errors){
                let error = related_objects.errors[error_i];
                errors.push(error);
            }
        }
    }

    //console.log(errors);
    panelBottom.content_error.setErrors(errors);
    if(errors.length==0){
        return true;
    }else{
        return false;
    }
}

function run_project(){
    let has_errors = check_project();
    if(has_errors) return;
    
    panelBottom.content_result.setResultInProgress();
    panelBottom.content_error.showResultPart();

    resultStruct = [];

    run_from_start(resultStruct);

    panelBottom.content_result.setResult(resultStruct);
}

function run_from_start(resultStruct){

    // Step 1: find start
    for(let obj_start_i in related_objects_run){
        let obj_start = related_objects_run[obj_start_i];
        //console.log(obj_start);
        if(obj_start.object.type=="start"){
            let wdt = 0;

            resources_values_run = getResourcesValueArray();
            param_values_run = getParametersValueArray();
            let next_struct = execute_object(obj_start).get_related_objects();
            while(next_struct){

                //console.log(next_object);
                next_object = execute_object(next_struct);
                if(next_object!=undefined){

                    if(next_object.type=="finish"){
                        execute_object(next_object.get_related_objects());
                        
                        let res_result = ResultResourcesTable("Resources on Start " + obj_start.object.text + " - Finish " + next_object.text, resources_values_run);
                        resultStruct.push(res_result);
                        
                        // FINISHING
                        break;
                    }

                    next_struct = next_object.get_related_objects();
                }
                
                wdt ++;
                if (wdt>obj_start.object.wdt){
                    //console.log("Reseted by wdt");

                    let res_result = Error_wdtReset(obj_start.object);
                    resultStruct.push(res_result);
                    break;
                }
            }

        }
    }

   //return result_array;
}

function execute_object(struct){

    //console.log(struct.object);
    let text = struct.object.text.trim();
    if(text.length!=0) text = " " + text;

    if(struct.object.type=="line"){
        console.log("ERROR: Should not be here");
    }else if(struct.object.type=="comment"){
        console.log("ERROR: Should not be here" + text);
    }else if(struct.object.type=="condition"){
        //console.log("Condition object" + text);
        result = execute_condition(struct.object);
        if(result) return struct.output[0];
        else return struct.output_false[0];
        
    }else if(struct.object.type=="event"){
        execute_event(struct.object);
        //console.log("Event object" + text);
        return struct.output[0];
    }else if(struct.object.type=="start"){
        //console.log("Start object" + text);
        return struct.output[0];
    }else if(struct.object.type=="finish"){
        //console.log("Finish!" + text);
        return struct.object;
    } 
    
    return;

}

function execute_condition(condition_obj){
    //console.log(condition_obj);
    let condition_text = condition_obj.condition_text;
    let res = resources_values_run;
    let param = getParametersValueArray();

    let result = eval(condition_text);
    return result;
}


function execute_event(event_obj){
    //console.log(event_obj);
    for(let res_ch in event_obj.resource_changing){
        let ch_exp = event_obj.resource_changing[res_ch].trim();
        
        // Parsing Resource change ecpression
        let exp_operation = ch_exp[0];
        let exp_value = ch_exp.substr(1);

        let resname = Resources.getResourceById(res_ch).name;

        //console.log(ch_exp);
        let res = resources_values_run;
        let param = getParametersValueArray();

        let exp_value_eval = eval(exp_value);

        //console.log(exp_value_eval);
        if(exp_operation=="="){
            resources_values_run[resname] = exp_value_eval;
        }else if(exp_operation=="-"){
            resources_values_run[resname] -= exp_value_eval;
        }else if(exp_operation=="+"){
            resources_values_run[resname] += exp_value_eval;
        }else if(exp_operation=="*"){
            resources_values_run[resname] *= exp_value_eval;
        }else if(exp_operation=="/"){
            resources_values_run[resname] /= exp_value_eval;
        }else{
            //resources_values_run[resname] = exp_value_eval;
            //doing nothing
        }

    }
}

function getResourcesValueArray(){
    // preparing resource array
    let array = {};
    for(let res_i in Resources.list){
        let res = Resources.list[res_i];
        array[res.name] = 0;
    }
    return array;
}

function getParametersValueArray(){
    // preparing parameters array
    let array = {};
    for(let param_i in Parameters.list){
        let param = Parameters.list[param_i];
        array[param.name] = param.value;
    }
    return array;
}