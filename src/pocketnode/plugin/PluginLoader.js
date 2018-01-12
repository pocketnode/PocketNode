const ClassHasMethod = pocketnode("utils/methods/ClassHasMethod");

class PluginLoader {
    constructor(){
        let methods = [
            // Loads the plugin from 'file'
            // @param file String
            // @return Plugin|null
            "loadPlugin",

            // Gets the PluginManifest from 'file'
            // @param file String
            // @return PluginManifest|null
            "getPluginManifest",

            // Returns the filename regex patterns that this loader accepts
            // @return RegExp
            "getPluginFilters",

            // @param plugin Plugin
            "enablePlugin",

            // @param plugin Plugin
            "disablePlugin"
        ];

        let missingMethods;
        if((missingMethods = ClassHasMethod(this.constructor, methods)) !== true){
            throw new Error(Server.translate.getString("pocketnode.plugin.missingMethod", [missingMethods.join(", ")]));
        }
    }
}

module.exports = PluginLoader;
