const CommandSender = require("./CommandSender");
const TerminalTextFormat = require("../utils/TerminalTextFormat");

class ConsoleCommandSender extends CommandSender {
    constructor(server){
        super(server);
    }

    sendMessage(message){
        this.server.getLogger().log("Command", message, TerminalTextFormat.WHITE);
    }
}

module.exports = ConsoleCommandSender;