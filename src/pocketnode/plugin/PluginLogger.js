const Logger = pocketnode("logger/Logger");

class PluginLogger extends Logger {
    constructor(plugin){
        super("Server", "[" + plugin.getName() + "] ");
    }
}

module.exports = PluginLogger;