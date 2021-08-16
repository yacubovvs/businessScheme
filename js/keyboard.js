var preventCanvasKeys = false;

addEventListener('keydown', (e) => {
    if(!preventCanvasKeys){
        if(e.code=="Escape"){
            ACanvas.reset_any_actions();
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
            ACanvas.reset_any_actions();
            panelSide.draw();
        }else{
            console.log(e.code);
        }
    }

});