const readline = require('readline');
const ConsoleCommandSender = pocketnode("command/ConsoleCommandSender");

class ConsoleCommandReader {
    constructor(Server){
        let CommandSender = new ConsoleCommandSender(Server);
        let rl = readline.createInterface({
            input: process.stdin
        });

        rl.on("line", (input) => {
            Server.getCommandMap().dispatchCommand(CommandSender, input);
        });
    }
}

module.exports = ConsoleCommandReader;