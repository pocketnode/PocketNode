const TimeStamp = require("time-stamp");

const TextFormat = pocketnode("utils/TextFormat");
const TerminalTextFormat = pocketnode("utils/TerminalTextFormat");

class Logger {
    constructor(caller, subcaller = ""){
        this.debuggingLevel = 0;
        this.caller = caller;
        this.subcaller = subcaller !== "" ? " " + subcaller : "";
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
        if(this.debuggingLevel < 1) return;
        return this.log("Debug", arguments, TerminalTextFormat.GRAY);
    }

    debugExtensive(){
        if(this.debuggingLevel < 2) return;
        return this.log("Debug", arguments, TerminalTextFormat.GRAY);
    }

    logError(error){
        error = error.stack.split("\n");
        this.error(error.shift());
        error.forEach(trace => this.debug(trace));
    }

    /**
     * @param level    String
     * @param messages Array
     * @param color    TerminalTextFormat.COLOR
     */
    log(level, messages, color = TerminalTextFormat.GRAY){
        if(messages.length === 0) return;

        messages = Array.from(messages).map(message => (typeof message === "string" ? TextFormat.toTerminal(message) : message) + TerminalTextFormat.RESET);

        log(TerminalTextFormat.BLUE + "[" + TimeStamp("HH:mm:ss") + "]" + TerminalTextFormat.RESET + " " + color +"[" + this.caller + " > " + level + "]:" + this.subcaller, messages);

        function log(prefix, args){
            console.log(prefix, ...args);
        }
    }

    setDebugging(level){
        this.debuggingLevel = level;

        return this;
    }
}

module.exports = Logger;