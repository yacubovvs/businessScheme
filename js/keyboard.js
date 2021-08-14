addEventListener('keydown', (e) => {
    if(e.code=="Escape"){
        ACanvas.userDrawing_object = undefined;
        ACanvas.selecting_dot = false;
        ACanvas._is_Object_resizing = false;
        ACanvas._object_resize_point = -1;
        ACanvas._object_user_moving = false;
        ACanvas.user_selections = [];
        ACanvas._main_resizing_object = undefined;
        ACanvas._main_resizing_object_related_objects = undefined;
        ACanvas.draw();
    }else if(e.code=="KeyL"){
        pannel_line_clicked();
    }else if(e.code=="KeyF"){
        pannel_finish_clicked();
    }else if(e.code=="KeyS"){
        pannel_start_clicked();
    }else if(e.code=="KeyM"){
        pannel_comment_clicked();
    }else if(e.code=="KeyC"){
        pannel_condition_clicked();
    }else if(e.code=="KeyE"){
        pannel_event_clicked();
    }else if(e.code=="Delete"){
        ACanvas.delete_selected_objects();
    }else{
        console.log(e.code);
    }

});