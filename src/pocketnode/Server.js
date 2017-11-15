const Config = require("./utils/Config.js").Config;
const ConfigTypes = require("./utils/Config.js").Types;
const RakNetServer = require("../raknet/server/RakNetServer.js");
const FileSystem = require("fs");
class Server {
    initVars(){
        this.interfaces = {};

        this.banned = {};
        this.ops = {};
        this.whitelist = {};

        this.isRunning = true;
        this.hasStopped = false;

        this.logger = {};

        this.onlineMode = false;
        this.serverId = Math.floor((Math.random() * 99999999)+1);
        this.paths = {};

        this.players = [];

        this.levels = [];
    }

    constructor(PocketNode, logger, paths){
        this.initVars();

        this.PocketNode = PocketNode;
        this.logger = logger;
        this.paths = paths;

        if(!FileSystem.existsSync(this.getDataPath() + "worlds/")){
            FileSystem.mkdirSync(this.getDataPath() + "worlds/");
        }

        if(!FileSystem.existsSync(this.getDataPath() + "players/")){
            FileSystem.mkdirSync(this.getDataPath() + "players/");
        }

        if(!FileSystem.existsSync(this.paths.plugins)){
            FileSystem.mkdirSync(this.paths.plugins);
        }

        this.getLogger().info("Starting " + this.getName() + " a Minecraft: Bedrock Edition server for version " + this.getVersion());

        this.getLogger().info("Loading server properties...");
        this.properties = new Config(this.getDataPath() + "server.properties.json", ConfigTypes.JSON, {
            motd: this.getName() + " Server",
            ip: "0.0.0.0",
            port: 19132,
            whitelist: false,
            max_players: 20,
            gamemode: 0,
            is_debugging: false
        });
        this.getLogger().setDebugging(this.properties.get("is_debugging", false));

        this.ops = new Config(this.getDataPath() + "ops.json", ConfigTypes.JSON);
        this.whitelist = new Config(this.getDataPath() + "whitelist.json", ConfigTypes.JSON);
        this.banned.names = new Config(this.getDataPath() + "banned-names.json", ConfigTypes.JSON);
        this.banned.ips = new Config(this.getDataPath() + "banned-ips.json", ConfigTypes.JSON);

        this.getLogger().info("Starting Minecraft: PE server on " + this.getIp() + ":" + this.getPort());
        
        this.interfaces.raknet = new RakNetServer(this);

        this.getLogger().info("This server is running " + this.getName() + " version " + this.getPocketNodeVersion() + " \"" + this.getCodeName() + "\" (API " + this.getApiVersion() + ")");
        this.getLogger().info("PocketNode is distributed under the GPLv3 License.");


        // plugin stuff here
    }
    
    /**
     * @return Boolean
     */
    isRunning(){ //todo
        return this.isRunning;
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
        return "1.2.3";
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
    getDataPath(){
        return this.paths.data;
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
        return this.properties.get("max_players", 20);
    }

    /**
     * Returns whether the server requires players to be authenticated to Xbox Live.
     * 
     * @return Boolean
     */
    getOnlineMode(){
        return this.onlineMode;
    }
    
    /**
     * Alias of this.getOnlineMode()
     * @return Boolean
     */
    requiresAuthentication(){
        return this.getOnlineMode();
    }
    
    /**
     * @return String
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

    /**
     * @return Boolean
     */
    getServerId(){
        return this.serverId;
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
        return this.players;
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
    matchPlayer(partialName){
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
    
    /**
     * @return Config
     */
    getNameBans(){
        return this.banned.names;
    }

    /**
     * @return Config
     */
    getIpBans(){
        return this.banned.ips;
    }

    //todo--rest
    //todo--broadcast
    //todo--reload
}
module.exports = Server;