const Command = pocketnode("command/Command");

class StopCommand extends Command {
    constructor(){
        super("stop", Server.translate.getString("command.stop.desc"), "pocketnode.command.stop", ["shutdown"]);
    }

    execute(sender, args){
        sender.getServer().shutdown();
    }
}

module.exports = StopCommand;