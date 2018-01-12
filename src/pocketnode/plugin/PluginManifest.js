const PluginException = pocketnode("plugin/PluginException");

class PluginManifest {
    initVars(){
        this.name = "";
        this.main = "";
        this.api = [];

        this.version = "";

        this.description = "";

        this.authors = [];

        this.website = "";

        this.order = 0;//todo: implement this
    }

    constructor(data){
        this.initVars();
        this.setManifest(((data instanceof Object) ? data : JSON.parse(data)));
    }

    setManifest(data){
        this.name = data.name.replace(/[^A-Za-z0-9 _.-]/g, "");
        if(this.name === ""){
            throw new PluginException(
                Server.translate.getString("pocketnode.plugin.manifest.invalidName"));
        }
        this.name = this.name.replace(" ", "_");
        this.version = data.version;
        this.main = data.main;
        this.api = Array.isArray(data.api) ? data.api : [data.api];
        this.description = data.description;
        this.website = data.website;
        if(typeof data.author !== "undefined"){
            this.authors.push(data.author);
        }else if(typeof data.authors !== "undefined"){
            this.authors = data.authors;
        }
    }

    getFullName(){
        return this.name + " v" + this.version;
    }

    getName(){
        return this.name;
    }

    getCompatibleApis(){
        return this.api;
    }

    getAuthors(){
        return this.authors;
    }

    getDescription(){
        return this.description;
    }

    getMain(){
        return this.main;
    }

    getVersion(){
        return this.version;
    }

    getWebsite(){
        return this.website;
    }
}

module.exports = PluginManifest;