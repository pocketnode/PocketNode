const Logger = pocketnode("logger/Logger");

class PluginLogger extends Logger {
    constructor(server, plugin){
        super("Server", "[" + plugin.getName() + "]");
        this.setDebugging(server._debuggingLevel);
    }
}

module.exports = PluginLogger;