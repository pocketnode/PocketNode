const Command = pocketnode("command/Command");
const TextFormat = pocketnode("utils/TextFormat");

class SayCommand extends Command {
    constructor(){
        super("say", "Send a message to the server.", "pocketnode.command.say", []);
    }

    execute(sender, args){
        let message = "";
        args.forEach(elem => {
            message += elem + " ";
        });
        sender.getServer().broadcastMessage("§b[SERVER] " + message);
    }
}

module.exports = SayCommand;
