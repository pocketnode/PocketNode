const Command = require("../Command");
const Player = require("../../Player");

class FakePlayerCommand extends Command {
    constructor(){
        super("fakeplayer", "Add a fake 'player' to the server.", "pocketnode.command.fakeplayer", ["fp"]);
        this.addArgument("name", "string", true);
    }

    execute(sender, args){
        sender.getServer().registerPlayer(args[0], new Player(sender.getServer(), args[0], 1234, "198.168.1.1", 19292));
        sender.sendMessage("Player made!");
    }
}

module.exports = FakePlayerCommand;
