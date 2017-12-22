const MinecraftInfo = pocketnode("network/minecraft/Info");
const Config = pocketnode("utils/Config").Config;
const ConfigTypes = pocketnode("utils/Config").Types;

const PluginManager = pocketnode("plugin/PluginManager");
const SourcePluginLoader = pocketnode("plugin/SourcePluginLoader");
const ScriptPluginLoader = pocketnode("plugin/ScriptPluginLoader");

const RakNetServer = (process.argv.length === 3 && process.argv[2] === "LOCAL" ? require("../../../RakNet") : require("raknet"));

const CommandMap = pocketnode("command/CommandMap");
const ConsoleCommandReader = pocketnode("command/ConsoleCommandReader");
const HelpCommand = pocketnode("command/defaults/HelpCommand");
const StopCommand = pocketnode("command/defaults/StopCommand");
const PluginsCommand = pocketnode("command/defaults/PluginsCommand");

const Player = pocketnode("Player");

const SFS = pocketnode("utils/SimpleFileSystem");

const PHPRound = pocketnode("utils/methods/PHPRound");

class Server {
    initVars(){
        this.interfaces = {};

        this.banned = {};
        this.ops = {};
        this.whitelist = {};

        this.running = true;
        this.stopped = false;

        this.pluginManager = {};

        this.tickCounter = 0;
        this.tickAverage = new Array(20).fill(20);
        this.useAverage = new Array(20).fill(0);
        this.currentTPS = 20;
        this.currentUse = 0;

        this.logger = {};

        this.onlineMode = false;
        this.serverId = Math.floor((Math.random() * 99999999)+1);

        this.paths = {};
        this.properties = {};

        this.levels = new Map();
        this.players = new Map();
    }

    constructor(PocketNode, logger, paths){
        this.initVars();

        this.PocketNode = PocketNode;
        this.logger = logger;
        this.paths = paths;

        if(!SFS.dirExists(this.getDataPath() + "worlds/")){
            SFS.mkdir(this.getDataPath() + "worlds/");
        }

        if(!SFS.dirExists(this.getDataPath() + "players/")){
            SFS.mkdir(this.getDataPath() + "players/");
        }

        if(!SFS.dirExists(this.paths.plugins)){
            SFS.mkdir(this.paths.plugins);
        }

        this.getLogger().info("Loading " + this.getName() + " a Minecraft: Bedrock Edition server for version " + this.getVersion());

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

        //this.interfaces.scheduler

        this.ops = new Config(this.getDataPath() + "ops.json", ConfigTypes.JSON);
        this.whitelist = new Config(this.getDataPath() + "whitelist.json", ConfigTypes.JSON);
        this.banned.names = new Config(this.getDataPath() + "banned-names.json", ConfigTypes.JSON);
        this.banned.ips = new Config(this.getDataPath() + "banned-ips.json", ConfigTypes.JSON);

        process.title = this.getName() + " " + this.getPocketNodeVersion();

        this.getLogger().debug("Server id:", this.serverId);

        this.getLogger().info("Starting server on " + this.getIp() + ":" + this.getPort());

        //network implementation?

        this.interfaces.RakNet = new RakNetServer(this, (new (this.getLogger().constructor)("RakNet")).setDebugging(this.properties.get("is_debugging", false)));

        this.getLogger().info("This server is running " + this.getName() + " version " + this.getPocketNodeVersion() + " \"" + this.getCodeName() + "\" (API " + this.getApiVersion() + ")");
        this.getLogger().info("PocketNode is distributed under the GPLv3 License.");

        this.interfaces.CommandMap = new CommandMap(this);
        this.registerDefaultCommands();
        this.interfaces.ConsoleCommandReader = new ConsoleCommandReader(this);

        this.interfaces.PluginManager = new PluginManager(this);
        this.interfaces.PluginManager.registerLoader(SourcePluginLoader);
        this.interfaces.PluginManager.registerLoader(ScriptPluginLoader);
        this.interfaces.PluginManager.loadPlugins(this.getPluginPath());
        this.interfaces.PluginManager.enablePlugins(); //load order STARTUP

        //if network register raknet here

        //levels load here

        //enable plugins POSTWORLD

        this.start();

        // plugin stuff here
    }

    start(){

        //block banned ips

        this.tickCounter = 0;

        this.getLogger().info("Done ("+(Date.now() - this.PocketNode.START_TIME)+"ms)!");

        this.tickProcessor();
    }

    registerDefaultCommands(){
        this.getCommandMap().registerCommand(new HelpCommand());
        this.getCommandMap().registerCommand(new StopCommand());
        this.getCommandMap().registerCommand(new PluginsCommand());
    }

    /**
     * @return Boolean
     */
    isRunning(){
        return this.running;
    }

    /**
     * @return Boolean
     */
    shutdown(){
        if(!this.running) return;

        this.getLogger().info("Shutting down.");
        this.interfaces.RakNet.server.socket.close();
        this.interfaces.PluginManager.disablePlugins();

        this.running = false;

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

    getPluginManager(){
        return this.interfaces.PluginManager;
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
        return new (pocketnode("logger/Logger"));
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

    tickProcessor(){
        let int = setInterval(() => {
            if(this.isRunning()){
                this.tick();
            }else{
                clearInterval(int);
            }
        }, 1000 / 20);
    }

    tick(){
        let time = Date.now();

        ++this.tickCounter;

        //network process interfaces
        this.interfaces.RakNet.tick();

        if((this.tickCounter % 20) === 0){
            this.titleTick();

            this.currentTPS = 20;
            this.currentUse = 0;
        }

        let now = Date.now();
        this.currentTPS = Math.min(20, 1 / Math.max(0.001, now - time));
        this.currentUse = Math.min(1, (now - time) / 0.05);

        this.tickAverage.shift();
        this.tickAverage.push(this.currentTPS);
        this.useAverage.shift();
        this.useAverage.push(this.currentUse);
        //network update name
    }

    getTicksPerSecond(){
        return PHPRound(this.currentTPS, 2);
    }

    getTicksPerSecondAverage(){
        return PHPRound(this.tickAverage.reduce((a, b) => a + b, 0) / this.tickAverage.length, 2);
    }

    getTickUsage(){
        return PHPRound(this.currentUse * 100, 2);
    }

    getTickUsageAverage(){
        return PHPRound((this.useAverage.reduce((a, b) => a + b, 0) / this.useAverage.length) * 100, 2);
    }

    titleTick(){
        process.title = this.getName() + " " +
            this.getPocketNodeVersion() + " | " +
            "Online " + this.getOnlinePlayerCount() + "/" + this.getMaxPlayers() + " | " +
            "TPS " + this.getTicksPerSecondAverage() + " | " +
            "Load " + this.getTickUsageAverage() + "%";
    }
}
module.exports = Server;
