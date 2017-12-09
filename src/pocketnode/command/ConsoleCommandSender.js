const CommandSender = pocketnode("command/CommandSender");
const TerminalTextFormat = pocketnode("utils/TerminalTextFormat");

class ConsoleCommandSender extends CommandSender {
    constructor(server){
        super(server);
    }

    sendMessage(message){
        this.server.getLogger().log("Command", message, TerminalTextFormat.WHITE);
    }
}

module.exports = ConsoleCommandSender;