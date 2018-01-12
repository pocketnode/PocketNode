const FileSystem = require("fs");
const Path = require("path");

const PluginBase = pocketnode("plugin/PluginBase");
const PluginLoader = pocketnode("plugin/PluginLoader");
const PluginManifest = pocketnode("plugin/PluginManifest");

class SourcePluginLoader extends PluginLoader {
    constructor(server){
        super();
        this.server = server;
    }

    loadPlugin(file){
        if(FileSystem.lstatSync(file).isDirectory() && FileSystem.existsSync(file + "/manifest.json") && FileSystem.existsSync(file + "/src/")){
            let manifest;
            if((manifest = this.getPluginManifest(file)) instanceof PluginManifest){
                let logger = this.server.getLogger();

                logger.info(
                    Server.translate.getString("pocketnode.plugin.loading", manifest.getFullName()));
                let dataFolder = Path.dirname(file) + "/" + manifest.getName();

                if(FileSystem.existsSync(dataFolder) && !FileSystem.lstatSync(dataFolder).isDirectory()){
                    logger.warning(
                        Server.translate.getString("pocketnode.plugin.folderNotEx", [dataFolder, manifest.getName()]));
                    return null;
                }

                let main = manifest.getMain();
                let mainPath = file + "/src/" + main;

                if(FileSystem.existsSync(mainPath + ".js")){
                    let plugin = require(mainPath);
                    plugin = new plugin();

                    this.initPlugin(plugin, manifest, dataFolder, file);

                    return plugin;
                }else{
                    logger.warning(
                        Server.translate.getString("pocketnode.plugin.couldntLoad", [manifest.getName()]));
                    return null;
                }
            }
        }

        return null;
    }

    getPluginManifest(file){
        if(FileSystem.lstatSync(file).isDirectory() && FileSystem.existsSync(file + "/manifest.json")){
            let data = FileSystem.readFileSync(file + "/manifest.json", {encoding: "utf-8"});
            if(data !== "") return new PluginManifest(data);
        }

        return null;
    }

    getPluginFilters(){
        return /[^\\.]/g;
    }

    initPlugin(plugin, manifest, dataFolder, file){
        plugin.init(this, this.server, manifest, dataFolder, file);
        plugin.onLoad();
    }

    enablePlugin(plugin){
        if(plugin instanceof PluginBase && !plugin.isEnabled()){
            this.server.getLogger().info(
                Server.translate.getString("pocketnode.plugin.enable", [plugin.getFullName()]));

            plugin.setEnabled(true);

            //todo: event stuff: call PluginEnableEvent
        }
    }

    disablePlugin(plugin){
        if(plugin instanceof PluginBase && plugin.isEnabled()){
            this.server.getLogger().info(
                Server.translate.getString("pocketnode.plugin.disable", [plugin.getFullName()]));

            //todo: event stuff: call PluginDisableEvent

            plugin.setEnabled(false);
        }
    }
}

module.exports = SourcePluginLoader;