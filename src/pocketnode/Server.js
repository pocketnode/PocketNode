const MinecraftInfo = pocketnode("network/minecraft/Info");
const Config = pocketnode("utils/Config");

const PluginManager = pocketnode("plugin/PluginManager");
const SourcePluginLoader = pocketnode("plugin/SourcePluginLoader");
const ScriptPluginLoader = pocketnode("plugin/ScriptPluginLoader");

const RakNetAdapter = pocketnode("network/RakNetAdapter");
const BatchPacket = pocketnode("network/minecraft/protocol/BatchPacket");

const CommandMap = pocketnode("command/CommandMap");
const ConsoleCommandReader = pocketnode("command/ConsoleCommandReader");
const HelpCommand = pocketnode("command/defaults/HelpCommand");
const StopCommand = pocketnode("command/defaults/StopCommand");
const PluginsCommand = pocketnode("command/defaults/PluginsCommand");

const Player = pocketnode("player/Player");
const PlayerList = pocketnode("player/PlayerList");

const ResourcePackManager = pocketnode("resourcepacks/ResourcePackManager");

const SFS = pocketnode("utils/SimpleFileSystem");

class Server {
    initVars(){
        this._bannedIps = {};
        this._bannedNames = {};
        this._ops = {};
        this._whitelist = {};

        this._running = true;
        this._stopped = false;

        this._pluginManager = {};

        this._scheduler = {}; //todo

        this._tickCounter = 0;
        this._tickAverage = new Array(20).fill(20);
        this._useAverage = new Array(20).fill(0);
        this._currentTPS = 20;
        this._currentUse = 0;

        this._logger = {};
        this._debuggingLevel = 0;

        this._consoleCommandReader = {};

        this._commandMap = {};

        this._resourcePackManager = {};

        this._onlineMode = false;

        this._raknetAdapter = {};

        this._serverId = Math.floor((Math.random() * 99999999)+1);

        this._paths = {};
        this._config = {};

        this._maxPlayers = -1;

        this._players = new PlayerList();
        this._loggedInPlayers = new PlayerList();
        this._playerList = new PlayerList();

        this._levels = new Map();

        this._entityCount = 0;
    }

    constructor(logger, paths){
        this.initVars();

        this._logger = logger;
        this._paths = paths;

        if(!SFS.dirExists(this.getDataPath() + "worlds/")){
            SFS.mkdir(this.getDataPath() + "worlds/");
        }

        if(!SFS.dirExists(this.getDataPath() + "players/")){
            SFS.mkdir(this.getDataPath() + "players/");
        }

        if(!SFS.dirExists(this._paths.plugins)){
            SFS.mkdir(this._paths.plugins);
        }

        this.getLogger().info("Loading " + this.getName() + " a Minecraft: Bedrock Edition server for version " + this.getVersion());

        this.getLogger().info("Loading server configuration...");
        if(!SFS.fileExists(this._paths.data + "pocketnode.json")){
            SFS.copy(this._paths.file + "pocketnode/resources/pocketnode.json", this._paths.data + "pocketnode.json");
        }
        this._config = new Config(this.getDataPath() + "pocketnode.json", Config.JSON, {});
        this._debuggingLevel = this._config.getNested("debugging.level", 0);

        this.getLogger().setDebugging(this._debuggingLevel);

        //this._scheduler

        this._ops = new Config(this.getDataPath() + "ops.json", Config.JSON);
        this._whitelist = new Config(this.getDataPath() + "whitelist.json", Config.JSON);
        this._bannedNames = new Config(this.getDataPath() + "banned-names.json", Config.JSON);
        this._bannedIps = new Config(this.getDataPath() + "banned-ips.json", Config.JSON);
        this._maxPlayers = this._config.getNested("server.max-players", 20);
        this._onlineMode = this._config.getNested("server.online-mode", true);

        if(!pocketnode.TRAVIS_BUILD) process.stdout.write("\x1b]0;" + this.getName() + " " + this.getPocketNodeVersion() + "\x07");

        this.getLogger().debug("Server Id:", this._serverId);

        this.getLogger().info("Starting server on " + this.getIp() + ":" + this.getPort());

        this._raknetAdapter = new RakNetAdapter(this);

        this.getLogger().info("This server is running " + this.getName() + " version " + this.getPocketNodeVersion() + " \"" + this.getCodeName() + "\" (API " + this.getApiVersion() + ")");
        this.getLogger().info("PocketNode is distributed under the GPLv3 License.");

        this._commandMap = new CommandMap(this);
        this.registerDefaultCommands();

        this._consoleCommandReader = new ConsoleCommandReader(this);

        this._resourcePackManager = new ResourcePackManager(this, this.getDataPath() + "resource_packs/");

        this._pluginManager = new PluginManager(this);
        this._pluginManager.registerLoader(SourcePluginLoader);
        this._pluginManager.registerLoader(ScriptPluginLoader);
        this._pluginManager.loadPlugins(this.getPluginPath());
        this._pluginManager.enablePlugins(); //load order STARTUP

        //levels load here

        //enable plugins POSTWORLD

        this.start();
    }

    start(){

        //block banned ips

        this._tickCounter = 0;

        this.getLogger().info("Done ("+(Date.now() - pocketnode.START_TIME)+"ms)!");

        this.tickProcessor();
        //this.forceShutdown();
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
        return this._running;
    }

    shutdown(){
        if(!this._running) return;

        this.getLogger().info("Shutting down...");
        this._raknetAdapter.shutdown();
        this._pluginManager.disablePlugins();

        this._running = false;

        process.exit(); // fix this later
    }

    /**
     * @return {string}
     */
    getName(){
        return pocketnode.NAME;
    }

    /**
     * @return {string}
     */
    getCodeName(){
        return pocketnode.CODENAME;
    }

    /**
     * @return {string}
     */
    getPocketNodeVersion(){
        return pocketnode.VERSION;
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
        return pocketnode.API_VERSION;
    }

    /**
     * @return {CommandMap}
     */
    getCommandMap(){
        return this._commandMap;
    }

    getPluginManager(){
        return this._pluginManager;
    }

    /**
     * @return {string}
     */
    getDataPath(){
        return this._paths.data;
    }
    getFilePath(){
        return this._paths.file;
    }
    getPluginPath(){
        return this._paths.plugins;
    }

    /**
     * @return {number}
     */
    getMaxPlayers(){
        return this._maxPlayers;
    }

    /**
     * Returns whether the server requires players to be authenticated to Xbox Live.
     *
     * @return {boolean}
     */
    getOnlineMode(){
        return this._onlineMode;
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
        return this._config.getNested("server.ip", "0.0.0.0");
    }

    /**
     * @return {number}
     */
    getPort(){
        return this._config.getNested("server.port", 19132);
    }

    /**
     * @return {number}
     */
    getServerId(){
        return this._serverId;
    }

    getGamemode(){
        return this._config.getNested("server.gamemode", 1);
    }

    /**
     * @return {boolean}
     */
    hasWhitelist(){
        return this._config.getNested("server.whitelist", false);
    }

    /**
     * @return {string}
     */
    getMotd(){
        return this._config.getNested("server.motd", pocketnode.NAME + " Server");
    }

    /**
     * @return {Logger}
     */
    getLogger(){
        return this._logger;
    }

    /**
     * @return {Array}
     */
    getOnlinePlayers(){
        return Array.from(this._playerList.values());
    }

    /**
     * @return {Array}
     */
    getLoggedInPlayers(){
        return Array.from(this._loggedInPlayers.values());
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
     * @return {ResourcePackManager}
     */
    getResourcePackManager(){
        return this._resourcePackManager;
    }

    broadcastMessage(message, recipients = this.getOnlinePlayers()){
        recipients.forEach(recipient => recipient.sendMessage(message));

        return recipients.length;
    }

    /**
     * @param name {string}
     * @return {Player}
     */
    getPlayer(name){
        name = name.toLowerCase();

        let found = null;
        let delta = 20; // estimate nametag length

        for(let [username, player] of this._playerList){
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

        if(this._playerList.has(name)){
            return this._playerList.get(name);
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

        for(let [username, player] of this._playerList){
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

        this._players.addPlayer(id, player);
    }

    addOnlinePlayer(player){
        CheckTypes([Player, player]);

        this._playerList.addPlayer(player.getLowerCaseName(), player);
    }

    removeOnlinePlayer(player){
        CheckTypes([Player, player]);

        this._playerList.removePlayer(player.getLowerCaseName()); // todo
    }

    removePlayer(player){
        CheckTypes([Player, player]);

        if(this._players.hasPlayer(player)){
            this._players.removePlayer(this._players.getPlayerIdentifier(player));
        }
    }

    /**
     * @return {PlayerList}
     */
    getPlayerList(){
        return this._players;
    }

    /**
     * @return {PlayerList}
     */
    getOnlinePlayerList(){
        return this._playerList;
    }

    /**
     * @return {Config}
     */
    getNameBans(){
        return this._bannedNames;
    }

    /**
     * @return {Config}
     */
    getIpBans(){
        return this._bannedIps;
    }

    static getGamemodeName(mode){
        switch(mode){
            case Player.SURVIVAL:
                return "Survival";
            case Player.CREATIVE:
                return "Creative";
            case Player.ADVENTURE:
                return "Adventure";
            case Player.SPECTATOR:
                return "Spectator";
            default:
                return "Unknown";
        }
    }

    tickProcessor(){
        let int = createInterval(() => {
            if(this.isRunning()){
                this.tick();
            }else{
                //this.forceShutdown();
                int.stop();
            }
        }, 1000 / 20);
        int.run();
    }

    getRakNetAdapter(){
        return this._raknetAdapter;
    }

    tick(){
        let time = Date.now();

        ++this._tickCounter;

        if((this._tickCounter % 20) === 0){
            this.titleTick();

            this._currentTPS = 20;
            this._currentUse = 0;
        }

        let now = Date.now();
        this._currentTPS = Math.min(20, 1000 / Math.max(1, now - time));
        this._currentUse = Math.min(1, (now - time) / 50);

        this._tickAverage.shift();
        this._tickAverage.push(this._currentTPS);
        this._useAverage.shift();
        this._useAverage.push(this._currentUse);

        this._raknetAdapter.tick();
    }

    getTicksPerSecond(){
        return Math.round_php(this._currentTPS, 2);
    }

    getTicksPerSecondAverage(){
        return Math.round_php(this._tickAverage.reduce((a, b) => a + b, 0) / this._tickAverage.length, 2);
    }

    getTickUsage(){
        return Math.round_php(this._currentUse * 100, 2);
    }

    getTickUsageAverage(){
        return Math.round_php((this._useAverage.reduce((a, b) => a + b, 0) / this._useAverage.length) * 100, 2);
    }

    getCurrentTick(){
        return this._currentTPS;
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

    batchPackets(players, packets, forceSync = false, immediate = false){
        let targets = [];
        players.forEach(player => {
            if(player.isConnected()) targets.push(this._players.getPlayerIdentifier(player));
        });

        if(targets.length > 0){
            let pk = new BatchPacket();

            packets.forEach(packet => pk.addPacket(packet));

            if(!forceSync && !immediate){
                //todo compress batched packets async
            }else{
                this.broadcastPackets(pk, targets, immediate);
            }
        }
    }

    broadcastPackets(pk, identifiers, immediate){
        if(!pk.isEncoded){
            pk.encode();
        }

        if(immediate){
            identifiers.forEach(id => {
                if(this._players.has(id)){
                    this._players.getPlayer(id).directDataPacket(pk);
                }
            });
        }else{
            identifiers.forEach(id => {
                if(this._players.has(id)){
                    this._players.getPlayer(id).dataPacket(pk);
                }
            });
        }
    }

    onPlayerLogin(player){
        this._loggedInPlayers.addPlayer(player.getLowerCaseName(), player); //todo unique ids
    }

    onPlayerLogout(player){
        this._loggedInPlayers.removePlayer(player.getLowerCaseName()); //todo unique id
    }

    onPlayerCompleteLoginSequence(player){

    }
}

module.exports = Server;