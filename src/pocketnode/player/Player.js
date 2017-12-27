const CommandSender = pocketnode("command/CommandSender");

const PlayerSessionAdapter = pocketnode("network/PlayerSessionAdapter");
const LoginPacket = pocketnode("network/minecraft/protocol/LoginPacket");

const MinecraftInfo = pocketnode("network/minecraft/Info");

const TextFormat = pocketnode("utils/TextFormat");

const Base64 = pocketnode("utils/Base64");

class Player extends CommandSender {
    static get SURVIVAL(){return 0}
    static get CREATIVE(){return 1}
    static get ADVENTURE(){return 2}
    static get SPECTATOR(){return 3}
    static get VIEW(){return Player.SPECTATOR}

    initVars(){
        this._sessionAdapter = null;

        this._protocol = -1;

        this.playedBefore = false;
        this.spawned = false;
        this.loggedIn = false;
        this.joined = false;
        this.gamemode = null;

        this._authenticated = false;
        this._xuid = "";

        this.speed = null;

        this.creationTime = 0;

        this._randomClientId = 0;

        this._ip = "";
        this._port = 0;
        this._username = "";
        this._iusername = "";
        this._displayName = "";
        this._clientId = null;

    }
    
    constructor(server, clientId, ip, port){
        super(server);
        this.initVars();
        this._clientId = clientId;
        this._ip = ip;
        this._port = port;
        this.creationTime = Date.now();

        this._sessionAdapter = new PlayerSessionAdapter(this);
    }

    isConnected(){
        return this._sessionAdapter !== null;
    }
    
    static isValidUserName(name){
        return name.toLowerCase() !== "rcon" && name.toLowerCase() !== "console" && name.length >= 1 && name.length <= 16 && /[^A-Za-z0-9_ ]/.test(name);
    }

    isAuthenticated(){
        return this._authenticated;
    }

    getXuid(){
        return this._xuid;
    }

    hasPlayedBefore(){
        return this.playedBefore;
    }

    getName(){
        return this._username;
    }

    getLowerCaseName(){
        return this._iusername;
    }

    getAddress(){
        return this._ip;
    }

    getPort(){
        return this._port;
    }

    handleLogin(packet){
        CheckTypes([LoginPacket, packet]);

        if(this.loggedIn){
            return false;
        }

        this._protocol = packet.protocol;

        if(packet.protocol !== MinecraftInfo.PROTOCOL){
            if(packet.protocol < MinecraftInfo.PROTOCOL){
                //this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_CLIENT, true);
            }else{
                //this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_SERVER, true);
            }

            //todo: add close func. close due to incompatible protocol

            return true;
        }

        this._username = TextFormat.clean(packet.username);
        this._displayName = this._username;
        this._iusername = this._username.toLowerCase();

        //todo: add kick
        //if(this.server.isFull() && this.kick("Server Full", false)){
        //    return true;
        //}

        this._randomClientId = packet.clientId;

        //todo: uuids

        //todo: add close
        //if(Player.isValidUserName(packet.username)){
        //    this.close("", "Invalid Username");
        //    return true;
        //}


        let geometryJsonEncoded = Base64.decode(packet.clientData.SkinGeometry ? packet.clientData.SkinGeometry : "");
        if(geometryJsonEncoded !== ""){
            geometryJsonEncoded = JSON.stringify(JSON.parse(geometryJsonEncoded));
        }

        //todo: skin stuff

        //todo: if banned kick

        //todo: add tasks
        //todo: verify
        //this.server.getScheduler().scheduleAsyncTask(new VerifyLoginTask(this, packet));

        return true;
    }

    /**
     * @return {PlayerSessionAdapter}
     */
    getSessionAdapter(){
        return this._sessionAdapter;
    }
}

module.exports = Player;
