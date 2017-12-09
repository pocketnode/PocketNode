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
        FileSystem.readdirSync(directory).forEach(dirContent => {
            if(FileSystem.lstatSync(directory + dirContent).isDirectory()){
                if(FileSystem.readdirSync(directory + dirContent + "/")[0] != null) {
                    pluginList[increment] = dirContent;
                    logger.info("Loaded " + dirContent);
                    increment++;
                }
            }
        })
        for(var i = 0; i < pluginList.length; i++) {
            var location = directory + pluginList[i] + "/";
            plugins[i] = require(location + pluginList[i]);
            if(FileSystem.existsSync(location + "manifest.json")) {
                var manifest = JSON.parse(FileSystem.readFileSync(location + "manifest.json").toString());
                manifest = this.checkManifest(manifest);
                plugins[i] = new plugins[i](manifest.name, manifest.description, manifest.permission, manifest.aliases, this.server);
                this.server.getCommandMap().registerCommand(plugins[i]);
                if(plugins[i].onEnable != null) {
                    plugins[i].onEnable();
                }
            } else {
                throw new Error("No manifest found!");
            }
        }
    }

    checkManifest(manifest){
        if(manifest.name != null && manifest.name !== "") {
            if(manifest.description == null) {
                manifest.description = "No description";
            }
            if(manifest.permission == null) {
                manifest.permission = "";
            }
            if(manifest.aliases == null) {
                manifest.aliases = [];
            }
            return manifest;
        } else {
            throw new Error("No valid manifest name.");
        }
    }

}

module.exports = PluginLoader;
