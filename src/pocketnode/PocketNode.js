const Path = require("path");

global.pocketnode = function(path){
    return require(__dirname + Path.sep + path);
};

global.Math.php_round = function(value, precision, mode) {
    var m, f, isHalf, sgn // helper variables
    // making sure precision is integer
    precision |= 0
    m = Math.pow(10, precision)
    value *= m
    // sign of the number
    sgn = (value > 0) | -(value < 0)
    isHalf = value % 1 === 0.5 * sgn
    f = Math.floor(value)
    if (isHalf) {
        switch (mode) {
            case 'ROUND_HALF_DOWN':
                // rounds .5 toward zero
                value = f + (sgn < 0)
                break
            case 'ROUND_HALF_EVEN':
                // rouds .5 towards the next even integer
                value = f + (f % 2 * sgn)
                break
            case 'ROUND_HALF_ODD':
                // rounds .5 towards the next odd integer
                value = f + !(f % 2)
                break
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0)
        }
    }
    return (isHalf ? value : Math.round(value)) / m
}

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
            file: Path.normalize(__dirname + "/../../../"),
            data: Path.normalize(__dirname + "/../../"),
            plugins: Path.normalize(__dirname + "/../../plugins/")
        };

        logger.info("Loading PocketNode...");

        let server = new Server(this, logger, paths);
        if(process.argv.join(" ").indexOf("--travis-build") !== -1){
            server.shutdown();
        }
    }
}

module.exports = PocketNode;
