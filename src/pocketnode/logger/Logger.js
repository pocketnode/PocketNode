const LogLevel = require("./LogLevel.js");

class Logger {
    constructor(){
        this.debugging = false;

        var LogLevels = new LogLevel();
        for(let level in LogLevels){
            this[LogLevels[level]] = function(message){
                this.log(level, message);
            }
        }
    }

    log(level, message){
        if(level === "DEBUG" && this.debugging === false) return; 
        console.log("["+level+"] "+message);
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