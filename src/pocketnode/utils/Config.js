const FileSystem = require("fs");
const Path = require("path");

class Config {
    static get DETECT(){return 0}
    static get JSON(){return 1}
    
    /**
     * @param file String
     * @param type Number
     * @param def  Object
     */
    constructor(file, type, def){
        this.load(file, type, def);
    }

    load(file, type = Config.DETECT, def = {}){
        this.correct = true;
        this.file = file;
        this.type = type;

        if(!(def instanceof Object)){
            def = {};
        }
        if(!FileSystem.existsSync(file)){
            this.config = def;
            this.save();
        }else{
            if(this.type === Config.DETECT){
                switch(Path.extname(this.file)){
                    case ".json":
                        this.type = Config.JSON;
                        break;
                }
            }

            if(this.correct === true){
                let content = FileSystem.readFileSync(this.file, {encoding: "utf-8"});
                switch(this.type){
                    case Config.JSON:
                        this.config = eval("("+content+")"); // to ignore comments..
                        break;

                    default:
                        this.correct = false;
                        return false;
                }

                if(!(this.config instanceof Object)){
                    this.config = def;
                }

                this.config = this.fillDefaults(def, this.config);
                this.save();
            }else{
                return false;
            }
        }
    }

    reload(){
        this.config = {};
        this.correct = false;
        delete this.type;
        this.load(this.file);
    }

    save(){
        if(this.correct === true){
            let content;

            switch(this.type){
                case Config.JSON:
                    content = JSON.stringify(this.config, null, 4);
                    break;
            }
            FileSystem.writeFileSync(this.file, content);

            return true;
        }else{
            return false;
        }
    }

    get(k, def = false){
        return ((this.correct && typeof this.config[k] !== "undefined") ? this.config[k] : def);
    }

    getNested(k, def){
        let parts = k.split(".");
        if(!this.config[parts[0]]){
            return def;
        }

        let config = this.config[parts.shift()];

        while(parts.length > 0){
            let part = parts.shift();
            if(typeof config[part] !== "undefined"){
                config = config[part];
            }else{
                return def;
            }
        }

        return config;
    }

    getAll(k = false){
        return (k === true ? Object.keys(this.config) : this.config);
    }

    set(k, v = true){
        this.config[k] = v;
    }

    setNested(k, v){
        let parts = k.split(".");
        let base = parts.shift();

        if(typeof this.config[base] === "undefined"){
            this.config[base] = {};
        }

        base = this.config[base];

        while(parts.length > 0){
            part = parts.shift();

            if(typeof this.config[part] === "undefined"){
                base[part] = {};
            }

            if(parts.length > 0){
                base = base[part];
            }else{
                base[part] = v;
            }
        }

        return true;
    }

    setAll(v){
        this.config = v;
    }

    exists(k, lower){
        if(lower === true){
            k = k.toLowerCase();
            let array = Object.keys(this.config).map(k => {return k.toLowerCase()});

            return typeof array[k] !== "undefined";
        }else{
            return typeof this.config[k] !== "undefined";
        }
    }

    remove(k){
        delete this.config[k];
    }

    fillDefaults(def, data){
        return Object.assign({}, def, data);
    }

    setDefaults(def){
        this.config = this.fillDefaults(def, this.config);
    }
}

module.exports = Config;