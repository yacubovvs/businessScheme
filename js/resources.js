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
    }
};

function Resource(){
    let resource = {}

    resource.name   = "";
    resource.color  = "rgba(255,255,255,1)";
    resource.id     = get_uid()

    return resource;
}

Resources.add();
Resources.add();
Resources.add();
Resources.add();