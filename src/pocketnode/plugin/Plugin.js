const ClassHasMethod = pocketnode("utils/methods/ClassHasMethod");

class Plugin {
    constructor(){
        let methods = [
            // Called when the plugin is loaded
            "onLoad",

            // Called when the plugin is enabled
            "onEnable",

            // Called when the plugin is disabled
            "onDisable",

            // @return Boolean
            "isEnabled",
            "isDisabled",

            // Gets the plugin's data folder to save files
            // @return String
            "getDataFolder",

            // @return PluginManifest
            "getManifest",

            // Gets a resource from the plugin's resources folder
            // @param name String
            "getResource",

            // Saves a resource from the plugin's resources folder to it's data folder
            // @param name String
            // @param replace Boolean
            // @return Boolean
            "saveResource",

            // @return Config
            "getConfig",

            "saveConfig",

            // @return Boolean
            "saveDefaultConfig",

            "reloadConfig",

            // @return Server
            "getServer",

            // @return String
            "getName",

            // @return PluginLogger
            "getLogger",

            // @return PluginLoader
            "getPluginLoader"
        ];

        let missingMethods;
        if((missingMethods = ClassHasMethod(this.constructor, methods)) !== true){
            throw new Error("Plugin is missing the following method(s): " + missingMethods.join(", "));
        }
    }
}

module.exports = Plugin;