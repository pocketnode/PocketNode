const Command = require("./Command");
const CommandSender = require("./CommandSender");
const InvalidParameterError = require("../error/InvalidParameterError");

class CommandMap {
    initVars(){
        this.PocketNodeServer = {};
        this.commands = new Map();
        this.aliases = new Map();
    }

    constructor(Server){
        this.initVars();
        this.PocketNodeServer = Server;
    }

    commandExists(commandName){
        return this.commands.has(commandName);
    }

    aliasExists(alias){
        return this.aliases.has(alias);
    }

    registerCommand(command){
        if(command instanceof Command){
            if(!this.commandExists(command.getName())){
                this.commands.set(command.getName(), command);
                command.getAliases().forEach(alias => {
                    this.registerAlias(alias, command);
                });
            }
        }else{
            throw new InvalidParameterError("The command: " + command + " is not an instance of Command!");
        }
    }

    registerAlias(alias, command){
        if(command instanceof Command){
            if (!this.aliasExists(alias)) {
                this.aliases.set(alias, command);
            }
        }else{

        }
    }

    unregisterCommand(commandName){
        if(this.commandExists(commandName)){
            let command = this.getCommand(commandName);
            command.getAliases().forEach(alias => {
                this.unregisterAlias(alias);
            });
            this.commands.delete(commandName);
        }
    }

    unregisterAlias(alias){
        if(this.aliasExists(alias)){
            this.aliases.delete(alias);
        }
    }

    getCommands(){
        return Array.from(this.commands.values());
    }

    getAliases(){
        return Array.from(this.aliases.values());
    }

    getCommand(commandName){
        let command = this.getCommandByName(commandName);
        if(command !== false){
            return command;
        }
        command = this.getCommandByAlias(commandName);
        if(command !== false){
            return command;
        }

        return false;
    }

    getCommandByName(commandName){
        if(this.commandExists(commandName)){
            return this.commands.get(commandName);
        }

        return false;
    }

    getCommandByAlias(commandName){
        let command = false;

        for(let [alias, cmd] in this.aliases){
            if(alias === commandName){
                command = cmd;
                break;
            }
        }

        return command;
    }

    dispatchCommand(sender, commandLine) {
        commandLine = commandLine.split(" ");
        let cmd = commandLine.shift();
        let args = commandLine;

        if(this.commands.has(cmd)){
             let command = this.commands.get(cmd);
             if(command.getArguments().filter(arg => arg.isRequired()).length > 0){
                 if(args.length > 0){
                     if(sender instanceof CommandSender){
                         command.execute(sender, args);
                     }
                 }else{
                    sender.sendMessage(command.getUsage());
                 }
             }else{
                 if(sender instanceof CommandSender){
                     command.execute(sender, args);
                 }
             }
        }else if(this.aliases.has(cmd)){
            let command = this.aliases.get(cmd);
            if(command.getArguments().filter(arg => arg.isRequired()).length > 0){
                if(args.length > 0){
                    if(sender instanceof CommandSender){
                        command.execute(sender, args);
                    }
                }else{
                    sender.sendMessage(command.getUsage());
                }
            }else{
                if(sender instanceof CommandSender){
                    command.execute(sender, args);
                }
            }
        }else{
            sender.sendMessage("§4Command Not Found. Try /help for a list of commands.");
        }
    }
}

module.exports = CommandMap;