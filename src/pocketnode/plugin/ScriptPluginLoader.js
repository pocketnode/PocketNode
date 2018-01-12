const FileSystem = require("fs");
const Path = require("path");

const PluginBase = pocketnode("plugin/PluginBase");
const PluginLoader = pocketnode("plugin/PluginLoader");
const PluginManifest = pocketnode("plugin/PluginManifest");

class ScriptPluginLoader extends PluginLoader {
    constructor(server){
        super();
        this.server = server;
    }

    loadPlugin(file){
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

            let plugin = require(file);
            if(typeof plugin.plugin !== "undefined"){                
                plugin = new plugin.plugin();
                if(plugin instanceof PluginBase){
                    this.initPlugin(plugin, manifest, dataFolder, file);
                    return plugin;
                }
            }
        }

        return null;
    }

    getPluginManifest(file){
        let plugin = require(file);
        if(typeof plugin.manifest !== "undefined"){
            if(plugin.manifest instanceof PluginManifest){
                return plugin.manifest;
            }else if(plugin.manifest instanceof Object){
                return new PluginManifest(plugin.manifest);
            }
        }

        return null;
    }

    getPluginFilters(){
        return /^[^\\/]*\.js/g;
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

module.exports = ScriptPluginLoader;