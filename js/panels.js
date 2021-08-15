// Кнопки которые могут активироваться
var btns_to_activate = [

]



function pannel_line_clicked(){

    ACanvas.userDrawing_object = new Line(); // Передаем новый создаваемый объект
    ACanvas.selecting_dot = true; // Устанавливаем параметр на выделение ближайших точек
}

function pannel_condition_clicked(){
    ACanvas.userDrawing_object = new Condition(); // Передаем новый создаваемый объект
    ACanvas.selecting_dot = true; // Устанавливаем параметр на выделение ближайших точек
}

function pannel_comment_clicked(){
    ACanvas.userDrawing_object = new Comment(); // Передаем новый создаваемый объект
    ACanvas.selecting_dot = true; // Устанавливаем параметр на выделение ближайших точек
}

function pannel_start_clicked(){
    ACanvas.userDrawing_object = new Start(); // Передаем новый создаваемый объект
    ACanvas.selecting_dot = true; // Устанавливаем параметр на выделение ближайших точек
}

function pannel_finish_clicked(){
    ACanvas.userDrawing_object = new Finish(); // Передаем новый создаваемый объект
    ACanvas.selecting_dot = true; // Устанавливаем параметр на выделение ближайших точек
}

function pannel_event_clicked(){
    ACanvas.userDrawing_object = new Event(); // Передаем новый создаваемый объект
    ACanvas.selecting_dot = true; // Устанавливаем параметр на выделение ближайших точек
}

function pannel_save_clicked(){
    let save_struct = {
        app_version: ACanvas.app_version,
        project_name: ACanvas.project_name,
        objects: ACanvas.objects,
    }
    var string = JSON.stringify(save_struct);
    var blob = new Blob([string], {type: "text/plain"});
    var link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", ACanvas.project_name + ".cbs");
    link.click();
}