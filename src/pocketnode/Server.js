const MinecraftInfo = require("./network/minecraft/Info");
const Config = require("./utils/Config").Config;
const ConfigTypes = require("./utils/Config").Types;

const RakNetServer = (process.argv.length === 3 && process.argv[2] === "LOCAL" ? require("../../../RakNet") : require("raknet"));

const CommandMap = require("./command/CommandMap");
const ConsoleCommandReader = require("./command/ConsoleCommandReader");
const HelpCommand = require("./command/defaults/HelpCommand");
const StopCommand = require("./command/defaults/StopCommand");

const Player = require("./Player");

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

        this.levels = new Map();
        this.players = new Map();
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
        
        this.interfaces.RakNet = new RakNetServer(this, (new (this.getLogger().constructor)("RakNet")).setDebugging(this.properties.get("is_debugging", false)));
        this.interfaces.CommandMap = new CommandMap(this);
        this.interfaces.ConsoleCommandReader = new ConsoleCommandReader(this);

        this.registerDefaultCommands();

        this.getLogger().info("This server is running " + this.getName() + " version " + this.getPocketNodeVersion() + " \"" + this.getCodeName() + "\" (API " + this.getApiVersion() + ")");
        this.getLogger().info("PocketNode is distributed under the GPLv3 License.");

        this.getLogger().info("Done ("+(new Date().getTime() - this.PocketNode.START_TIME)+"ms)!");

        // plugin stuff here
    }

    registerDefaultCommands(){
        this.getCommandMap().registerCommand(new HelpCommand());
        this.getCommandMap().registerCommand(new StopCommand());
        this.getCommandMap().registerCommand(new (require("./command/defaults/FakePlayerCommand"))());
    }

    /**
     * @return Boolean
     */
    isRunning(){
        return this.isRunning;
    }

    /**
     * @return Boolean
     */
    shutdown(){
        if(!this.isRunning) return;

        this.getLogger().info("Shutting down.");
        this.interfaces.RakNet.server.socket.close();

        this.isRunning = false;

        process.exit(); // fix this later
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
        return MinecraftInfo.VERSION;
    }

    /**
     * @returns Number
     */
    getProtocol(){
        return MinecraftInfo.PROTOCOL;
    }

    /**
     * @return String
     */
    getApiVersion(){
        return this.PocketNode.API_VERSION;
    }

    /**
     * @returns {CommandMap}
     */
    getCommandMap(){
        return this.interfaces.CommandMap;
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
     * @return Number
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
     *
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
     * @return Number
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
    
    /**
     * @return Boolean
     */
    hasWhitelist(){
        return this.properties.get("whitelist", false);
    }
    
    /**
     * @return String
     */
    getMotd(){
        return this.properties.get("motd", this.PocketNode.NAME + " Server");
    }

    /**
     * @return {Logger}
     */
    static getLogger(){
        return new (require("./logger/Logger"));
    }
    getLogger(){
        return this.logger;
    }

    /**
     * @return Map
     */
    getOnlinePlayers(){
        return this.players;
    }

    /**
     * @returns Number
     */
    getOnlinePlayerCount(){
        return this.getOnlinePlayers().size;
    }

    /**
     * @param name String
     * 
     * @return {Player}
     */
    getPlayer(name){
        name = name.toLowerCase();
        
        let found = null;
        let delta = 20; // estimate nametag length

        for(let [username, player] of this.getOnlinePlayers()){
            if(username.indexOf(name) === 0){
                let curDelta = username.length - name.length;
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
     * @param name String
     * 
     * @return {Player}
     */
    getPlayerExact(name){
        name = name.toLowerCase();

        let onlinePlayers = this.getOnlinePlayers();
        if(onlinePlayers.has(name)){
            return onlinePlayers.get(name);
        }

        return null;
    }

    /**
     * @param partialName String
     *
     * @return {Player}[]
     */
    matchPlayer(partialName){
        partialName = partialName.toLowerCase();
        let matchedPlayers = [];

        for(let [username, player] of this.getOnlinePlayers()){
            if(username === partialName){
                matchedPlayers = [player];
                break;
            }else if(username.indexOf(partialName) === 0){
                matchedPlayers.push(player);
            }
        }

        return matchedPlayers;
    }

    registerPlayer(name, player){
        if(player instanceof Player){
            if(this.getPlayer(name) !== null) return false;
            this.players.set(name.toLowerCase(), player);
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * @return {Config}
     */
    getNameBans(){
        return this.banned.names;
    }

    /**
     * @return {Config}
     */
    getIpBans(){
        return this.banned.ips;
    }

    getGamemodeName(){
        let gamemode = "";

        switch(this.gamemode){
            default:
            case 0:
                gamemode = "Survival";
                break;

            case 1:
                gamemode = "Creative";
                break;
        }

        return gamemode;
    }
}
module.exports = Server;