const Command = require("../Command.js");
const TextFormat = require("../../utils/TextFormat.js");

class HelpCommand extends Command {
    constructor(){
        super("help", "Show available commands for this server.", "pocketnode.command.help", ["?"]);
        this.addArgument("command", "string", false);
        this.addArgument("page", "integer", false);
    }

    execute(sender, args){
        let linesPerPage = 4;

        let command = "";
        let page = -1;

        if(args.length === 0){
        }else if(!isNaN(args[args.length - 1])){
            page = parseInt(args.pop());
            if(page <= 0) page = 1;

            command = args.join(" ");
        }else{
            command = args.join(" ");
            page = 1;
        }

        if(command === ""){
            let commands = {};

            sender.getServer().getCommandMap().getCommands().forEach(command => {
                if (true) { // if sender has perms
                    commands[command.getName()] = command;
                }
            });

            let sorted_commands = [];

            Object.keys(commands).sort().forEach(command => {
                sorted_commands.push(commands[command]);
                delete commands[command];
            });

            page = Math.min(sorted_commands.length, page);

            if(page < 1) page = 1;

            sender.sendMessage(TextFormat.YELLOW + "----- Help (" + page + " of " + Math.ceil(sorted_commands.length / linesPerPage) + ") -----");
            sorted_commands.slice(((page*linesPerPage)-linesPerPage), (page*linesPerPage)).forEach(command => {
                sender.sendMessage(TextFormat.GOLD + "/" + command.getName() + TextFormat.WHITE + ": " + command.getDescription());
            });
        }else{
            if(sender.getServer().getCommandMap().commandExists(command.toLowerCase())){
                let cmd = sender.getServer().getCommandMap().getCommand(command.toLowerCase());
                if(true){ //test for perms
                    sender.sendMessage(TextFormat.YELLOW + "----- Help: /" + cmd.getName() + " -----");
                    sender.sendMessage(TextFormat.GOLD + "Description: " + TextFormat.WHITE + cmd.getDescription());
                    sender.sendMessage(TextFormat.GOLD + "Usage: " + TextFormat.WHITE + cmd.getUsage().substr(9));
                }
            }else{
                sender.sendMessage(TextFormat.RED + "No help for " + command.toLowerCase());
            }
        }
    }
}

module.exports = HelpCommand;