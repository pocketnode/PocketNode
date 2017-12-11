global.pocketnode = function(path){
    return require(__dirname + "/" + path);
};

const Logger = pocketnode("logger/Logger");
const Server = pocketnode("Server");

const Config = pocketnode("utils/Config").Config;
const ConfigTypes = pocketnode("utils/Config").Types;

const localizationManager = pocketnode("localization/localizationManager");
class PocketNode {
    constructor(){
        this.START_TIME = Date.now();
        this.NAME = "PocketNode";
        this.CODENAME = "[BEGINNINGS]";
        this.VERSION = "0.0.2";
        this.API_VERSION = "1.0.0";

        let logger = new Logger("Server");
        let paths = {
            file: __dirname + "/../../../",
            data: __dirname + "/../../",
            plugins: __dirname + "/../../plugins/"
        };

        this.properties = new Config(paths.data + "server.properties.json", ConfigTypes.JSON, {
            language: "en",
            motd: this.NAME + " Server",
            ip: "0.0.0.0",
            port: 19132,
            whitelist: false,
            max_players: 20,
            gamemode: 0,
            is_debugging: false
        });

        this.localizationManager = new localizationManager(this.properties.get("language", false));
        this.localizationManager.loadLanguages();

        logger.info(this.localizationManager.getPhrase("loading"));

        new Server(this, this.localizationManager, logger, paths);
    }
}

module.exports = PocketNode;
