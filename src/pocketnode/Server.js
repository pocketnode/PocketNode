const MinecraftInfo = pocketnode("network/minecraft/Info");
const Config = pocketnode("utils/Config").Config;
const ConfigTypes = pocketnode("utils/Config").Types;

const PluginManager = pocketnode("plugin/PluginManager");
const SourcePluginLoader = pocketnode("plugin/SourcePluginLoader");
const ScriptPluginLoader = pocketnode("plugin/ScriptPluginLoader");

const RakNetAdapter = pocketnode("network/RakNetAdapter");

const CommandMap = pocketnode("command/CommandMap");
const ConsoleCommandReader = pocketnode("command/ConsoleCommandReader");
const HelpCommand = pocketnode("command/defaults/HelpCommand");
const StopCommand = pocketnode("command/defaults/StopCommand");
const PluginsCommand = pocketnode("command/defaults/PluginsCommand");

const Player = pocketnode("player/Player");
const PlayerList = pocketnode("player/PlayerList");

const SFS = pocketnode("utils/SimpleFileSystem");

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
        this.players = new PlayerList();
        this.playerList = new PlayerList();
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

        process.stdout.write("\x1b]0;" + this.getName() + " " + this.getPocketNodeVersion() + "\x07");

        this.getLogger().debug("Server id:", this.serverId);

        this.getLogger().info("Starting server on " + this.getIp() + ":" + this.getPort());

        this.interfaces.RakNetAdapter = new RakNetAdapter(this);

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
     * @return {boolean}
     */
    isRunning(){
        return this.running;
    }

    shutdown(){
        if(!this.running) return;

        this.getLogger().info("Shutting down...");
        this.interfaces.RakNetAdapter.close();
        this.interfaces.PluginManager.disablePlugins();

        this.running = false;

        process.exit(); // fix this later
    }

    /**
     * @return {string}
     */
    getName(){
        return this.PocketNode.NAME;
    }

    /**
     * @return {string}
     */
    getCodeName(){
        return this.PocketNode.CODENAME;
    }

    /**
     * @return {string}
     */
    getPocketNodeVersion(){
        return this.PocketNode.VERSION;
    }

    /**
     * @return {string}
     */
    getVersion(){
        return MinecraftInfo.VERSION;
    }

    /**
     * @return {number}
     */
    getProtocol(){
        return MinecraftInfo.PROTOCOL;
    }

    /**
     * @return {string}
     */
    getApiVersion(){
        return this.PocketNode.API_VERSION;
    }

    /**
     * @return {CommandMap}
     */
    getCommandMap(){
        return this.interfaces.CommandMap;
    }

    getPluginManager(){
        return this.interfaces.PluginManager;
    }

    /**
     * @return {string}
     */
    getDataPath(){
        return this.paths.data;
    }

    /**
     * @return {string}
     */
    getPluginPath(){
        return this.paths.plugins;
    }

    /**
     * @return {number}
     */
    getMaxPlayers(){
        return this.properties.get("max_players", 20);
    }

    /**
     * Returns whether the server requires players to be authenticated to Xbox Live.
     *
     * @return {boolean}
     */
    getOnlineMode(){
        return this.onlineMode;
    }

    /**
     * Alias of this.getOnlineMode()
     *
     * @return {boolean}
     */
    requiresAuthentication(){
        return this.getOnlineMode();
    }

    /**
     * @return {string}
     */
    getIp(){
        return this.properties.get("ip", "0.0.0.0");
    }

    /**
     * @return {number}
     */
    getPort(){
        return this.properties.get("port", 19132);
    }

    /**
     * @return {number}
     */
    getServerId(){
        return this.serverId;
    }

    /**
     * @return {boolean}
     */
    hasWhitelist(){
        return this.properties.get("whitelist", false);
    }

    /**
     * @return {string}
     */
    getMotd(){
        return this.properties.get("motd", this.PocketNode.NAME + " Server");
    }

    /**
     * @return {Logger}
     */
    getLogger(){
        return this.logger;
    }

    /**
     * @return {Array}
     */
    getOnlinePlayers(){
        return Array.from(this.playerList.values());
    }

    /**
     * @return {number}
     */
    getOnlinePlayerCount(){
        return this.getOnlinePlayers().length;
    }

    /**
     * @return {boolean}
     */
    isFull(){
        return this.getOnlinePlayerCount() === this.getMaxPlayers();
    }

    /**
     * @param name {string}
     * @return {Player}
     */
    getPlayer(name){
        name = name.toLowerCase();

        let found = null;
        let delta = 20; // estimate nametag length

        for(let [username, player] of this.playerList){
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
     * @param name {string}
     * @return {Player}
     */
    getPlayerExact(name){
        name = name.toLowerCase();

        if(this.playerList.has(name)){
            return this.playerList.get(name);
        }

        return null;
    }

    /**
     * @param partialName {string}
     * @return []{Player}
     */
    matchPlayer(partialName){
        partialName = partialName.toLowerCase();
        let matchedPlayers = [];

        for(let [username, player] of this.playerList){
            if(username === partialName){
                matchedPlayers = [player];
                break;
            }else if(username.indexOf(partialName) === 0){
                matchedPlayers.push(player);
            }
        }

        return matchedPlayers;
    }

    addPlayer(id, player){
        CheckTypes([Player, player]);

        this.players.addPlayer(id, player);
    }

    addOnlinePlayer(player){
        CheckTypes([Player, player]);

        this.playerList.addPlayer(player.getLowerCaseName(), player);
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
     * @return {PlayerList}
     */
    getPlayerList(){
        return this.players;
    }

    /**
     * @return {PlayerList}
     */
    getOnlinePlayerList(){
        return this.playerList;
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
        let gamemode;

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

        this.interfaces.RakNetAdapter.tick();
    }

    getTicksPerSecond(){
        return Math.round_php(this.currentTPS, 2);
    }

    getTicksPerSecondAverage(){
        return Math.round_php(this.tickAverage.reduce((a, b) => a + b, 0) / this.tickAverage.length, 2);
    }

    getTickUsage(){
        return Math.round_php(this.currentUse * 100, 2);
    }

    getTickUsageAverage(){
        return Math.round_php((this.useAverage.reduce((a, b) => a + b, 0) / this.useAverage.length) * 100, 2);
    }

    titleTick(){
        process.stdout.write("\x1b]0;"+
            this.getName() + " " +
            this.getPocketNodeVersion() + " | " +
            "Online " + this.getOnlinePlayerCount() + "/" + this.getMaxPlayers() + " | " +
            "TPS " + this.getTicksPerSecondAverage() + " | " +
            "Load " + this.getTickUsageAverage() + "%"
        +"\x07");
    }
}

module.exports = Server;