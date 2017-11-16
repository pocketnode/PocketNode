const CommandSender = require("./command/CommandSender.js");

class Player extends CommandSender {
    initVars(){
        this.username = "";
        this.displayName = ""
    }
    
    constructor(){
        super();
        this.initVars();
    }
    
    isValidUserName(name){
		if(name === null){
			return false;
		}
		return name.toLowerCase() !== "rcon" and name.toLowerCase() !== "console" and name.length >= 1;// and name.length <= 16 and preg_match("/[^A-Za-z0-9_ ]/", $name) === 0;
	}
}

module.exports = Player;
