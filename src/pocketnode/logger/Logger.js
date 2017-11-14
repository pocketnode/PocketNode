require("../utils/StringTools.js");

const DefaultLogLevels = [
    "emergency",
    "alert";
    "critical";
    "error";
    "warning";
    "notice";
    "info";
    "debug"
];

class Logger {
    constructor(){
        this.debugging = false;

        DefaultLogLevels.forEach(level => {
            this[level] = function(message){
                this.log(level.ucfirst(), message);
            }
        });
    }

    log(level, message){
        if(level.toLowerCase() === "debug" && this.debugging === false) return; 
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