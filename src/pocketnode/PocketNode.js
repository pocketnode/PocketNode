const Path = require("path");

require("./utils/methods/Globals");

const Logger = pocketnode("logger/Logger");
const Server = pocketnode("Server");

const g = global;

function PocketNode(paths){
    global.pocketnode.START_TIME = Date.now();
    global.pocketnode.NAME = "PocketNode";
    global.pocketnode.CODENAME = "[BEGINNINGS]";
    global.pocketnode.VERSION = "0.0.4";
    global.pocketnode.API_VERSION = "1.0.0";

    let logger = new Logger("Server");
    let path = {
        file: Path.normalize(__dirname + "/../"),
        data: Path.normalize(__dirname + "/../../"),
        plugins: Path.normalize(__dirname + "/../../plugins/")
    };

    for(let i in paths){
        if(typeof path[i] !== "undefined"){
            path[i] = paths[i];
        }
    }

    logger.info("Loading PocketNode...");

    global.pocketnode.TRAVIS_BUILD = process.argv.indexOf("--travis-build") !== -1;
    global.pocketnode.RUNNING_LOCALLY = (process.argv.indexOf("--local") !== -1 || process.argv.indexOf("-l") !== -1);

    let server = new Server(logger, path);
    if(pocketnode.TRAVIS_BUILD === true){
        server.shutdown();
    }

    return server;
}

module.exports = PocketNode;
