const CommandSender = require("./CommandSender.js");

class ConsoleCommandSender extends CommandSender {
    constructor(server){
        super(server);
    }

    sendMessage(message){
        this.server.getLogger().log("Command", message);
    }
}

module.exports = ConsoleCommandSender;