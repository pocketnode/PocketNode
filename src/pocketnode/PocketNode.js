const Logger = require("./logger/Logger.js");
const Server = require("./Server.js");
class PocketNode {
    constructor(){
        this.NAME = "PocketNode";
        this.CODENAME = "[BEGINNINGS]";
        this.VERSION = "0.0.1dev";
        this.API_VERSION = "1.0.0";

        let logger = new Logger();
        let paths = {
            file: __dirname + "/../../../",
            data: __dirname + "/../../",
            plugins: __dirname + "/../../plugins/"
        };

        logger.info("Loading PocketNode...");

        new Server(this, logger, paths);
    }
}

module.exports = PocketNode;