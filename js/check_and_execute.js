var related_objects_run = []

function check_project(){
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
    check_project();
    
    panelBottom.content_result.setResultInProgress();
    panelBottom.content_error.showResultPart();

    resultStruct = [];

    run_from_start(resultStruct);



    panelBottom.content_result.setResult(resultStruct);
}

function run_from_start(resultStruct){

    // Step 1 find start
    for(let obj_start_i in related_objects_run){
        let obj_start = related_objects_run[obj_start_i];
        //console.log(obj_start);
        if(obj_start.object.type=="start"){
            console.log("Found start");
            console.log(obj_start);
        }
    }
}