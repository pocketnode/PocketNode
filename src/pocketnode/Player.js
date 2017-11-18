const CommandSender = require("./command/CommandSender");

class Player extends CommandSender {
    initVars(){
        this.username = "";
        this.displayName = "";
        this.clientId = -1;
        this.ip = "";
        this.port = -1;
    }
    
    constructor(server, username, clientId, ip, port){
        super(server);
        this.initVars();
        if(this.isValidUserName(username)){
            this.username = username;
            this.clientId = clientId;
            this.ip = ip;
            this.port = port;
        }
    }
    
    isValidUserName(name){
        if(name === null){
            return false;
        }
        return name.toLowerCase() !== "rcon" && name.toLowerCase() !== "console" && name.length >= 1 && name.length <= 16 && /[^A-Za-z0-9_ ]/.test(name);
    }
}

module.exports = Player;
