const Command = require("../Command");

class StopCommand extends Command {
    constructor(){
        super("stop", "Stops the server.", "pocketnode.command.stop", ["shutdown"]);
    }

    execute(sender, args){
        sender.getServer().shutdown();
    }
}

module.exports = StopCommand;