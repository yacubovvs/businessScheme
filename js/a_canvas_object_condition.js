function Condition(visible){
    let object = new Canvas_object(visible);

    object.size.width = 2;
    object.size.height = 2;
    object.color = "rgba(0,0,0,0.7)";

    object.visible = true;

    object.draw = function(aCanvas, context){
        if(!this.visible) return;

        let coordinates_realSize = aCanvas._settings._draw_coordinates_size*aCanvas.zoom;
        let drawing_shift_x = aCanvas._get_drawing_shift_x();
        let drawing_shift_y = aCanvas._get_drawing_shift_y();
        
        
        let x = this.position.x*coordinates_realSize + drawing_shift_x;
        let y = this.position.y*coordinates_realSize + drawing_shift_y;

        let x1 = x-this.size.width*coordinates_realSize;
        let y1 = y;

        let x2 = x;
        let y2 = y-this.size.height*coordinates_realSize;

        let x3 = x+this.size.width*coordinates_realSize;
        let y3 = y;

        let x4 = x;
        let y4 = y+this.size.height*coordinates_realSize;

        context.beginPath();
        context.strokeStyle = this.color; 
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(x4, y4);
        context.lineTo(x1, y1);
        context.stroke();
    }

    object._is_click_on_object = function(aCanvas, x_ac, y_ac){ 

        if( Math.abs(this.position.x-x_ac)<this.size.width &&  Math.abs(this.position.y-y_ac)<this.size.height){

            let x = this.position.x; let y = this.position.y;
            let x1 = x-this.size.width; let y1 = y;
            let x2 = x; let y2 = y-this.size.height;
            let x3 = x+this.size.width; let y3 = y;
            let x4 = x; let y4 = y+this.size.height;

            if(common_get_treangle_area(x1, y1, x2, y2, x3, y3)
                ==
                common_get_treangle_area(x1, y1, x2, y2, x_ac, y_ac) + 
                common_get_treangle_area(x1, y1, x_ac, y_ac, x3, y3) + 
                common_get_treangle_area(x_ac, y_ac, x2, y2, x3, y3)
                ||
                common_get_treangle_area(x1, y1, x4, y4, x3, y3)
                ==
                common_get_treangle_area(x1, y1, x4, y4, x_ac, y_ac) + 
                common_get_treangle_area(x1, y1, x_ac, y_ac, x3, y3) + 
                common_get_treangle_area(x_ac, y_ac, x4, y4, x3, y3)
            )return true;
            else
            return false;

        }else return false;
    };

    return object;
}