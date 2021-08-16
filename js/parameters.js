var Parameters = {
    list: [],
    add: function(name){
        if(!name) name = "Parameter " + (this.list.length + 1)
        let resource = new Parameter();
        resource.name = name;
        this.list.push(resource);
        return resource;
    },
    delete: function(obj){
        let position = this.list.indexOf(obj);
        if(position!=-1){
            this.list.splice(position, 1);
        }
    },

};

function Parameter(object_to_load){
    let parameter = {}

    if(object_to_load){}

    parameter.name   = "";
    parameter.color  = "rgba(255,255,255,1)";
    parameter.id     = get_uid();
    parameter.value  = 0;

    parameter.setValue = function(value){
        value = parseInt(value)
        if(isNaN(value)) value = 0;
        this.value = value;
        return value;
    }

    return parameter;
}

/* * /
Parameters.add();
Parameters.add();
Parameters.add();
Parameters.add();
/* */