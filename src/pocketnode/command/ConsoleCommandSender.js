const CommandSender = pocketnode("command/CommandSender");

class ConsoleCommandSender extends CommandSender {
    constructor(server){
        super(server);
    }

    sendMessage(message){
        this.server.getLogger().info(message);
    }

    getName(){
        return "CONSOLE";
    }

    isOp(){
        return true;
    }
}

module.exports = ConsoleCommandSender;