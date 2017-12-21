const TimeStamp = require("time-stamp");

const TextFormat = pocketnode("utils/TextFormat");
const TerminalTextFormat = pocketnode("utils/TerminalTextFormat");

class Logger {
    constructor(caller, subcaller){
        this.debugging = false;
        this.caller = caller;
        this.subcaller = subcaller || "";
    }

    emergency(){
        return this.log("Emergency", arguments, TerminalTextFormat.RED);
    }

    alert(){
        return this.log("Alert", arguments, TerminalTextFormat.RED);
    }

    critical(){
        return this.log("Critical", arguments, TerminalTextFormat.RED);
    }

    error(){
        return this.log("Error", arguments, TerminalTextFormat.DARK_RED);
    }

    warning(){
        return this.log("Warning", arguments, TerminalTextFormat.YELLOW);
    }

    notice(){
        return this.log("Notice", arguments, TerminalTextFormat.AQUA);
    }

    info(){
        return this.log("Info", arguments, TerminalTextFormat.WHITE);
    }

    debug(){
        if(!this.debugging) return;
        return this.log("Debug", arguments, TerminalTextFormat.GRAY);
    }

    /**
     * @param level    String
     * @param messages Array
     * @param color    TerminalTextFormat.COLOR
     */
    log(level, messages, color){
        if(messages.length === 0) return;
        color = color || TerminalTextFormat.GRAY;

        Array.from(messages).map(Logger.formatError).join(" ").split("\n").forEach(message => {
            message = TextFormat.toTerminal(message) + TerminalTextFormat.RESET;
            console.log(TerminalTextFormat.BLUE + "[" + TimeStamp("HH:mm:ss") + "]" + TerminalTextFormat.RESET + " " + color +"[" + this.caller + " > " + level + "]: " + this.subcaller + message);
        });        
    }

    static formatError(e){
        if(!(e instanceof Error)) return e;
        return e.stack;
    }

    setDebugging(tf){
        if(tf === true){
            this.debugging = true;
        }else{
            this.debugging = false;
        }

        return this;
    }
}

module.exports = Logger;