const readline = require('readline');
const ConsoleCommandSender = require("./ConsoleCommandSender.js");

class ConsoleCommandReader {
    constructor(Server){
        let CommandSender = new ConsoleCommandSender(Server);
        let rl = readline.createInterface({
            input: process.stdin
        });

        rl.on("line", (input) => {
            Server.getCommandHandler().dispatchCommand(CommandSender, input);
        });
    }
}

module.exports = ConsoleCommandReader;