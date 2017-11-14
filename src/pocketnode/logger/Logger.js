const TerminalTextFormat = require("../utils/TerminalTextFormat.js");
require("../utils/StringTools.js");

const LogLevels = [
    "emergency",
    "alert",
    "critical",
    "error",
    "warning",
    "notice",
    "info",
    "debug"
];

class Logger {
    constructor(){
        this.debugging = false;

        LogLevels.forEach(level => {
            this[level] = function(message){
                this.log(level.ucfirst(), message);
            }
        });
    }

    log(level, message){
        if(level.toLowerCase() === "debug" && this.debugging === false) return;
        let color = "";
        switch(level.toLowerCase()){
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
        message = (color === "" ? message : message+TerminalTextFormat.RESET);
        console.log(color+"["+level+"] "+message);
    }

    setDebugging(tf){
        if(tf === true){
            this.debugging = true;
        }else{
            this.debugging = false;
        }
    }
}

module.exports = Logger;