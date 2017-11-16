const Command = require("../Command.js");

class HelpCommand extends Command {
    constructor(){
        super("help", "Show available commands for this server.", "pocketnode.command.help", ["h"]);
        this.addArgument("page", "integer", false);
    }

    execute(sender, args){
        sender.sendMessage("Your args: " + args);
    }
}

module.exports = HelpCommand;