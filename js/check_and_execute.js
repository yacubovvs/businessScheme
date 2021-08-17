function check_project(){
    let related_Objects_struct = [];
    let errors = [];

    for(obj_i in ACanvas.objects){
        let obj = ACanvas.objects[obj_i];
        if(obj.type!="line"){
            let related_objects = obj.get_related_objects(ACanvas);
            related_Objects_struct.push(related_objects);
            for(error_i in related_objects.errors){
                let error = related_objects.errors[error_i];
                errors.push(error);
            }
        }
    }

    //console.log(errors);
    panelBottom.content.setErrors(errors);
}