const TimeStamp = require("time-stamp");

const TextFormat = require("../utils/TextFormat");
const TerminalTextFormat = require("../utils/TerminalTextFormat");

class Logger {
    constructor(caller){
        this.debugging = false;
        this.caller = caller;
    }

    emergency(message){
        return this.log("Emergency", message);
    }

    alert(message){
        return this.log("Alert", message);
    }

    critical(message){
        return this.log("Critical", message);
    }

    error(message){
        return this.log("Error", message);
    }

    warning(message){
        return this.log("Warning", message);
    }

    notice(message){
        return this.log("Notice", message);
    }

    info(message){
        return this.log("Info", message);
    }

    debug(message){
        if(!this.debugging) return;
        return this.log("Debug", message);
    }

    /**
     * @param level   String
     * @param message String
     * @param color   TerminalTextFormat.COLOR
     */
    log(level, message, color){
        message = TextFormat.toTerminal(message);
        color = color || "";

        if(color === "") {
            switch(level.toLowerCase()) {
                case "emergency":
                case "alert":
                case "critical":
                    color = TerminalTextFormat.RED;
                    break;
                case "error":
                    color = TerminalTextFormat.DARK_RED;
                    break;
                case "warning":
                    color = TerminalTextFormat.YELLOW;
                    break;
                case "notice":
                    color = TerminalTextFormat.AQUA;
                    break;
                case "info":
                    color = TerminalTextFormat.WHITE;
                    break;
                case "debug":
                default:
                    color = TerminalTextFormat.GRAY;
                    break;
            }
        }

        message = (color === "" ? message : message + TerminalTextFormat.RESET);

        console.log(TerminalTextFormat.BLUE + "[" + TimeStamp("HH:mm:ss") + "]" + TerminalTextFormat.RESET + " " + color +"[" + this.caller + ": " + level + "]: " + message);
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