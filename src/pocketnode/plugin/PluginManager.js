class PluginManager {
    initVars() {
        this.server = {};
        this.plugins = new Map();
    }

    constructor(server) {
        this.initVars();
        this.server = server;
    }

    getPlugin(name) {
        if (this.plugins.has(name)) {
            return this.plugins.get(name);
        }
        return null;
    }

    loadPlugin(path){

    }
}
