// Кнопки которые могут активироваться
var btns_to_activate = [

]

addEventListener('keydown', (e) => {
    if(e.code=="Escape"){
        ACanvas.userDrawing_object = undefined;
        ACanvas.selecting_dot = false;
        ACanvas._is_Object_resizing = false;
        ACanvas._object_resize_point = -1;
        ACanvas._object_user_moving = false;
        ACanvas.user_selections = [];
        ACanvas.draw();
    }else if(e.code=="KeyL"){
        pannel_line_clicked();
    }
});

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