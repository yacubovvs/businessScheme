function load_file_from_hash(){
    let file_name = get_filename_from_url_hash();
    if(file_name!=undefined){
        load_file_from_server(file_name);
    }
}

function get_filename_from_url_hash(){
    if(document.location.hash=="") return undefined;
    return document.location.hash.substr(1);
}


function load_file_from_server(filename){
    var request = new XMLHttpRequest;
    request.open('GET', '/examples/saved/' + filename + '.cbs', true);
    request.onload = function () {
        let load_struct = JSON.parse(request.responseText);
        ACanvas.loadACanvasFromFile(load_struct);
    };
    request.send(null);
}