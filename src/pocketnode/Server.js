const Config = require("./utils/Config.js").Config;
const ConfigTypes = require("./utils/Config.js").Types;
const RakNetServer = require("../raknet/server/RakNetServer.js");
const FileSystem = require("fs");
class Server {
    constructor(PocketNode, logger, paths){
        this.PocketNode = PocketNode;
        this.logger = logger;
        this.paths = paths;

        if(!FileSystem.existsSync(this.paths.home + "worlds/")){
            FileSystem.mkdirSync(this.paths.home + "worlds/");
        }

        if(!FileSystem.existsSync(this.paths.home + "players/")){
            FileSystem.mkdirSync(this.paths.home + "players/");
        }

        if(!FileSystem.existsSync(this.paths.plugins)){
            FileSystem.mkdirSync(this.paths.plugins);
        }

        this.logger.info("Starting " + this.getName() + " a Minecraft: PE server for version " + this.getVersion());

        this.logger.info("Loading server properties...");
        this.properties = new Config(this.paths.home + "server.properties.json", ConfigTypes.JSON, {
            motd: this.getName() + " Server",
            ip: "0.0.0.0",
            port: 19132,
            whitelist: false,
            max_players: 20,
            gamemode: 0,
            is_debugging: false
        });
        logger.setDebugging(this.properties.get("is_debugging", false));

        this.ops = new Config(this.paths.home + "ops.json", ConfigTypes.JSON);
        this.whitelist = new Config(this.paths.home + "whitelist.json", ConfigTypes.JSON);
        this.banned = {
            names: new Config(this.paths.home + "banned-names.json", ConfigTypes.JSON),
            ips: new Config(this.paths.home + "banned-ips.json", ConfigTypes.JSON)
        };
        this.playerList = [];
        this.maxPlayers = this.properties.get("max_players", 20);

        this.logger.info("Starting Minecraft: PE server on " + this.getIp() + ":" + this.getPort());

        this.serverId = 53412923;
        
        new RakNetServer(this);

        this.logger.info("This server is running " + this.getName() + " version " + this.getPocketNodeVersion() + " \"" + this.getCodeName() + "\" (API " + this.getApiVersion() + ")");
        this.logger.info("PocketNode is distributed under the GPLv3 License.");


        // plugin stuff here
    }
    
    /**
     * @return Boolean
     */
    isRunning(){ //todo
        return true;
    }

    /**
     * @return String
     */
    getName(){
        return this.PocketNode.NAME;
    }

    /**
     * @return String
     */
    getCodeName(){
        return this.PocketNode.CODENAME;
    }

    /**
     * @return String
     */
    getPocketNodeVersion(){
        return this.PocketNode.VERSION;
    }

    /**
     * @return String
     */
    getVersion(){
        return "0.14.0";
    }

    /**
     * @return String
     */
    getApiVersion(){
        return this.PocketNode.API_VERSION;
    }

    /**
     * @return String
     */
    getFilePath(){
        return this.paths.home;
    }

    /**
     * @return String
     */
    getPluginPath(){
        return this.paths.plugins;
    }

    /**
     * @return Integer
     */
    getMaxPlayers(){
        return this.maxPlayers;
    }

    //add xbox live support
    //getOnlineMode
    //requiresAuthentication
    
    /**
     * @return Integer
     */
    getIp(){
        return this.properties.get("ip", "0.0.0.0");
    }

    /**
     * @return Integer
     */
    getPort(){
        return this.properties.get("port", 19132);
    }

    //getAutoSave
    //setAutoSave
    //getLevelType
    //getGenerateStructures
    //getGamemode
    //getForceGamemode
    //getGamemodeString
    //getGamemodeName
    //getGamemodeFromString
    //getDifficultyByString
    //getDifficulty
    
    /**
     * @return Boolean
     */
    hasWhitelist(){
        return this.properties.get("whitelist", false);
    }

    //getSpawnRadius
    //getAllowFlight
    //isHardcore
    //getDefaultGamemode
    
    /**
     * @return String
     */
    getMotd(){
        return this.properties.get("motd", this.PocketNode.NAME + " Server");
    }

    /**
     * @return Logger
     */
    getLogger(){
        return this.logger;
    }

    //getEntityMetadata
    //getPlayerMetadata
    //getLevelMetadata
    //getUpdater
    //getPluginManager
    //getScheduler
    //getTick
    //getTicksPerSecond
    //getTicksPerSecondAverage
    //getTickUsage
    //getTickUsageAverage
    //getCommandMap
    //getLoggedInPlayers
    
    /**
     * @return Array
     */
    getOnlinePlayers(){
        return this.playerList;
    }

    //addRecipe
    //shouldSavePlayerData
    //getOfflinePlayer
    //getOfflinePlayerData
    //saveOfflinePlayerData

    /**
     * @param  String name
     * 
     * @return Player
     */
    getPlayer(name){
        name = name.toLowerCase();
        let found = null;
        let delta = 20; // estimate nametag length
        let onlinePlayers = this.getOnlinePlayers();
        for(var index in onlinePlayers){
            let player = onlinePlayers[index];
            if(player.getName().indexOf(name) === 0){
                let curDelta = player.getName().length - name.length;
                if(curDelta < delta){
                    found = player;
                    delta = curDelta;
                }
                if(curDelta === 0){
                    break;
                }
            }
        }

        return found;
    }

    /**
     * @param  String name
     * 
     * @return Player
     */
    getPlayerExact(name){
        name = name.toLowerCase();

        let onlinePlayers = this.getOnlinePlayers();
        for(var index in onlinePlayers){
            let player = onlinePlayers[index];
            if(player.getName().toLowerCase() === name){
                return player;
            }
        }

        return null;
    }

    /**
     * @param String partialName
     *
     * @return Player[]
     */
    matchPlayer($partialName){
        partialName = partialName.toLowerCase();
        let matchedPlayers = [];

        let onlinePlayers = this.getOnlinePlayers();
        for(var index in onlinePlayers){
            let player = onlinePlayers[index];
            if(player.getName().toLowerCase() === partialName){
                matchedPlayers = [player];
                break;
            }else if(player.getName().indexOf(partialName) === 0){
                matchedPlayers.push(player);
            }
        }

        return matchedPlayers;
    }

    //removePlayer
    //getLevels
    //getDefaultLevel
    //setDefaultLevel
    //isLevelLoaded
    //getLevel
    //getLevelByName
    //unloadLevel
    //loadLevel
    //generateLevel
    //isLevelGenerated
    //getConfigString
    //getPluginCommand
    
    // banlist?
    getNameBans(){
        return this.banned.names;
    }

    // banlist?
    getIpBans(){
        return this.banned.ips;
    }

    //todo--rest
    //todo--broadcast
    //todo--reload
}
module.exports = Server;