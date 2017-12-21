global.pocketnode = function(path){
    return require(__dirname + "/" + path);
};

const Logger = pocketnode("logger/Logger");
const Server = pocketnode("Server");
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

        logger.info("Loading PocketNode...");

        let server = new Server(this, logger, paths);
        if(process.argv.join(" ").indexOf("--travis-build") !== -1){
            server.shutdown();
        }
    }
}

module.exports = PocketNode;
