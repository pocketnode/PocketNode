const FileSystem = require("fs");

const ConfigTypes = {
    DETECT: 0,
    JSON: 1
};

class Config {
    /**
     * @param file String
     * @param type Number
     * @param def  Object
     */
    constructor(file, type, def){
        this.load(file, type, def);
    }

    load(file, type, def){
        this.correct = true;
        this.file = file;
        this.type = type || ConfigTypes.DETECT;
        def = def || {};

        if(!(def instanceof Object)){
            def = {};
        }
        if(!FileSystem.existsSync(file)){
            this.config = def;
            this.save();
        }else{
            if(this.type === ConfigTypes.DETECT){}

            if(this.correct === true){
                let content = FileSystem.readFileSync(this.file);
                switch(this.type){
                    case ConfigTypes.JSON:
                        this.config = JSON.parse(content);
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
            try {
                let content;

                switch(this.type){
                    case ConfigTypes.JSON:
                        content = JSON.stringify(this.config, null, 4);
                        break;
                }
                FileSystem.writeFileSync(this.file, content);
            } catch (e) {
                let Logger = require("../logger/Logger");
                let logger = new Logger("Server");
                logger.critical("Couldn't save Config["+this.file+"]: " + e);
            }

            return true;
        }else{
            return false;
        }
    }

    get(k, def){
        def = def || false;
        return ((this.correct && typeof this.config[k] !== "undefined") ? this.config[k] : def);
    }

    getAll(k){
        k = k || false;
        return (k === true ? Object.keys(this.config) : this.config);
    }

    set(k, v){
        v = v || true;
        this.config[k] = v;
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
}

module.exports.Config = Config;
module.exports.Types = ConfigTypes;
