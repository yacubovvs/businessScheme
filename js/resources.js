var Resources = {
    list: [],
    add: function(name){
        if(!name) name = "Resource " + (this.list.length + 1)
        let resource = new Resource();
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
    getResourceById: function(res_id){
        for(res_i in this.list){
            let res = this.list[res_i];
            if(res.id==res_id) return res;
        }
    },
    getResourceByName: function(res_name){
        for(res_i in this.list){
            let res = this.list[res_i];
            if(res.name==res_name) return res;
        }
    }
};

function Resource(object_to_load){
    let resource = {}
    
    if(object_to_load){};

    resource.name   = "";
    resource.color  = "rgba(255,255,255,1)";
    resource.id     = get_uid()

    return resource;
}

/* * /
Resources.add();
Resources.add();
Resources.add();
Resources.add();
/* */