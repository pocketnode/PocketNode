const Config = pocketnode("utils/Config");
const SFS = pocketnode("utils/SimpleFileSystem");

const ResourcePack = pocketnode("resourcepacks/ResourcePack");
const ZippedResourcePack = pocketnode("resourcepacks/ZippedResourcePack");

class ResourcePackManager {
    initVars(){
        this._server = {};
        this._path = "";
        this._config = {};
        this._forceResources = false;
        this._resourcePacks = [];
        this._uuidList = {};
    }

    constructor(server, path){
        this.initVars();
        this._server = server;
        this._path = path;

        if(!SFS.dirExists(path)){
            SFS.mkdir(path);
        }else if(!SFS.isDir(path)){
            throw new Error("Resource packs path "+path+" exists and but is not a directory");
        }

        if(!SFS.fileExists(path + "resource_packs.json")){
            SFS.copy(server.getFilePath() + "pocketnode/resources/resource_packs.json", path + "resource_packs.json");
        }

        this._config = new Config(path + "resource_packs.json", Config.JSON, {});
        this._forceResources = Boolean(this._config.get("force", false));

        server.getLogger().info(
            Server.translate.getString("pocketnode.resourcePack.loading"));

        this._config.get("entries", []).forEach((pack, priority) => {
            try{
                let packPath = SFS.fixPath(path + "/" + pack);
                if(SFS.fileExists(packPath)){
                    let newPack = null;
                    if(SFS.isDir(packPath)){
                        server.getLogger().warning(
                            server.translate.getString("pocketnode.resourcePack.dirNotSupported", [pack]))
                    }else{
                        let newPack;
                        switch(SFS.getExtension(packPath)){
                            case "zip":
                            case "mcpack":
                                newPack = new ZippedResourcePack(packPath);
                                break;
                            default:
                                server.getLogger().warning(
                                    server.translate.getString("pocketnode.resourcePack.formatNotSupported", [pack]));
                                break;
                        }

                        if(newPack instanceof ResourcePack){
                            this._resourcePacks.push(newPack);
                            this._uuidList[newPack.getPackId()] = newPack;
                        }
                    }
                }else{
                    server.getLogger().warning(
                        server.translate.getString("pocketnode.resourcePack.fileOrDirNotFound", [pack]));
                }
            }catch(e){
                server.getLogger().logError(e);
            }
        });

        server.getLogger().debug(
            server.translate.getString("pocketnode.resourcePack.success", [this._resourcePacks.length]));
    }

    resourcePacksRequired(){
        return this._forceResources;
    }

    getResourcePacks(){
        return this._resourcePacks;
    }

    getPackById(id){
        return this._uuidList[id] ? this._uuidList[id] : null;
    }

    getPackIdList(){
        return Object.keys(this._uuidList);
    }
}

module.exports = ResourcePackManager;