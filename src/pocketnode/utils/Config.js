const FileSystem = require("fs");
const isset = require("./Isset.js");

const ConfigTypes = {
    DETECT: 0,
    JSON: 1
};

class Config {
    /**
     * @param String  file file path
     * @param Integer type file type
     * @param Object  def  default
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

                let fill = this.fillDefaults(def, this.config);
                if(fill.changed > 0){
                    this.config = fill.data;
                    this.save();
                }
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
                let Logger = require("../logger/Logger.js");
                let logger = new Logger();
                logger.critical("Couldn't save Config["+this.file+"]: " + e);
            }

            return true;
        }else{
            return false;
        }
    }

    get(k, def){
        def = def || false;
        return ((this.correct && isset(this.config[k])) ? this.config[k] : def);
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

            return isset(array[k]);
        }else{
            return isset(this.config[k]);
        }
    }

    remove(k){
        delete this.config[k];
    }

    fillDefaults(def, data){
        let changed = 0;

        for(let k in def){
            let v = def[k];

            if(v instanceof Object){
                if(!isset(data[k]) && !(data[k] instanceof Object)){
                    data[k] = [];
                }
                let fill = this.fillDefaults(v, data[k]);
                data[k] = fill.data;
                changed += fill.changed;
            }else if(!isset(data[k])){
                data[k] = v;
                ++changed;
            }
        }

        return {changed: changed, data: data};
    }
}

module.exports.Config = Config;
module.exports.Types = ConfigTypes;