const FileSystem = require("fs");

class PluginLoader {
    /**
     * @param directory String
     */
    constructor(directory, server){
        this.server = server;
        this.loadPlugins(directory);
    }

    loadPlugins(directory){
        let Logger = require("../logger/Logger");
        let logger = new Logger("Server");
        let pluginList = [];
        let plugins = [];
        let increment = 0;
        FileSystem.readdirSync(directory).forEach(file => {
            pluginList[increment] = file;
            logger.info("Loaded " + file);
            increment++;
        })
        for(var i = 0; i < pluginList.length; i++) {
            var location = directory + pluginList[i] + "/";
            plugins[i] = require(location + pluginList[i]);
            var manifest = JSON.parse(FileSystem.readFileSync(location + "manifest.json").toString());
            plugins[i] = new plugins[i](manifest.name, manifest.description, manifest.permission, manifest.aliases, this.server);
            this.server.getCommandMap().registerCommand(plugins[i]);
            if(plugins[i].onEnable != null) {
              plugins[i].onEnable();
            }
        }
    }
}

module.exports = PluginLoader;
