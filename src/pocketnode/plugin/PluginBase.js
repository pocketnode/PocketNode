const FileSystem = require("fs");

const Plugin = pocketnode("plugin/Plugin");
const PluginLogger = pocketnode("plugin/PluginLogger");
const Config = pocketnode("utils/Config");

class PluginBase extends Plugin {
    initVars(){
        this.loader = {};
        this.server = {};

        this.initialized = false;
        this.enabled = false;

        this.manifest = {};

        this.dataFolder = "";
        this.file = "";
        this.config = null;
        this.configFile = null;

        this.logger = {};
    }

    constructor(){
        super();
        this.initVars();
    }

    init(loader, server, manifest, dataFolder, file){
        if(this.initialized === false){
            this.initialized = true;
            this.loader = loader;
            this.server = server;
            this.manifest = manifest;
            this.dataFolder = dataFolder;
            this.file = file;
            this.configFile = this.dataFolder + "config.json";
            this.logger = new PluginLogger(server, this);
        }
    }

    onLoad(){}
    onEnable(){}
    onDisable(){}

    /**
     * @return Boolean
     */
    isEnabled(){
        return this.enabled === true;
    }

    /**
     * @param tf Boolean
     */
    setEnabled(tf){
        tf = tf || true;
        tf = tf === true;
        if(this.enabled !== tf){
            this.enabled = tf;
            if(this.enabled === true){
                this.onEnable();
            }else{
                this.onDisable();
            }
        }
    }

    /**
     * @return Boolean
     */
    isDisabled(){
        return this.enabled === false;
    }

    getDataFolder(){
        return this.dataFolder;
    }


    getManifset(){
        return this.manifest;
    }

    getLogger(){
        return this.logger;
    }

    isInitialized(){
        return this.initialized === true;
    }

    resourceExists(name){
        name = name.replace("\\", "/").trim();
        let path = this.file + "resources/" + name;

        return FileSystem.existsSync(path);
    }

    getResource(name){
        name = name.replace("\\", "/").trim();
        let path = this.file + "resources/" + name;

        if(this.resourceExists(name)){
            return FileSystem.readFileSync(path, {encoding: "utf-8"});
        }

        return null;
    }

    saveResource(name, replace){
        replace = replace || false;

        if(name.trim() === "") return false;
        if(!this.resourceExists(name)) return false;

        let output = this.dataFolder + name;
        if(!FileSystem.existsSync(this.dataFolder)) FileSystem.mkdirSync(this.dataFolder);

        if(FileSystem.existsSync(output) && replace !== true){
            return false;
        }

        FileSystem.copyFileSync(this.file + "resources/" + name, output);

        return true;
    }

    getConfig(){
        if(this.config === null){
            this.reloadConfig();
        }

        return this.config;
    }

    saveConfig(){
        this.getConfig().save();
    }

    saveDefaultConfig(){
        if(!FileSystem.existsSync(this.configFile)){
            return this.saveResource("config.json");
        }

        return false;
    }

    reloadConfig(){
        this.config = new Config(this.configFile, Config.JSON);
        if(this.resourceExists("config.json")){
            this.getConfig().setDefaults(JSON.parse(this.getResource("config.json")));
        }
    }

    getServer(){
        return this.server;
    }

    getName(){
        return this.manifest.getName();
    }

    getFullName(){
        return this.manifest.getFullName();
    }

    getPluginLoader(){
        return this.loader;
    }

    getManifest(){
        return this.manifest;
    }
}

module.exports = PluginBase;
