function Error(errorText){
    let error = {};
    error.errorText = errorText;

    return error;
}

function Error_object(object, errorText){
    let error = new Error(errorText);
    error.object = object;

    return error;
}

function Error_pointObject(object, point, errorText){
    let error = new Error_object(object, errorText);
    error.point = point;

    return error;
}

function Error_pointObject_to_pointObject(object, point, object2, point2, errorText){
    let error = new Error_object(object, errorText);
    error.point = point;
    error.object2 = object2;
    error.point2 = point2

    return error;
}