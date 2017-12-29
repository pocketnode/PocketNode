const CommandSender = pocketnode("command/CommandSender");

const MinecraftInfo = pocketnode("network/minecraft/Info");
const PlayerSessionAdapter = pocketnode("network/PlayerSessionAdapter");

const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const LoginPacket = pocketnode("network/minecraft/protocol/LoginPacket");
const PlayStatusPacket = pocketnode("network/minecraft/protocol/PlayStatusPacket");
const DisconnectPacket = pocketnode("network/minecraft/protocol/DisconnectPacket");
const ResourcePacksInfoPacket = pocketnode("network/minecraft/protocol/ResourcePacksInfoPacket");

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
        this.closed = false;
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

        this._needACK = {};
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
                this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_CLIENT, true);
            }else{
                this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_SERVER, true);
            }

            this.close("", "Incompatible Protocol", false);

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

        //---temp---
        //todo: verifyCompleted
        this._authenticated = true;
        //todo: processLogin
        this.sendPlayStatus(PlayStatusPacket.LOGIN_SUCCESS);
        this.loggedIn = true;
        this.server.onPlayerLogin(this);
        this.server.logger.debug("Player logged in: "+this._username);

        setTimeout(() => {
            let pk = new ResourcePacksInfoPacket();
            //set entries
            //set must accept
            this.dataPacket(pk); //todo
        }, 2000);
        //---temp---

        //this.server.getScheduler().scheduleAsyncTask(new VerifyLoginTask(this, packet));

        return true;
    }

    sendPlayStatus(status, immediate = false){
        let pk = new PlayStatusPacket();
        pk.status = status;
        pk.protocol = this._protocol;
        if(immediate){
            this.directDataPacket(pk);
        }else{
            this.dataPacket(pk);
        }
    }

    dataPacket(packet, needACK = false){
        return this.sendDataPacket(packet, needACK, false);
    }

    directDataPacket(packet, needACK = false){
        return this.sendDataPacket(packet, needACK, true);
    }

    sendDataPacket(packet, needACK = false, immediate = false){
        if(!this.isConnected()) return false;
        CheckTypes([DataPacket, packet], [Boolean, needACK], [Boolean, immediate]);

        if(packet.getName().toLowerCase() !== "batchpacket") this.server.logger.debug("Sending "+packet.getName()+" to "+(this.getName()!==""?this.getName():this._ip+":"+this._port));

        if(!this.loggedIn && !packet.canBeSentBeforeLogin()){
            throw new Error("Attempted to send "+packet.getName()+" to "+this.getName()+" before they got logged in.");
        }

        let identifier = this.getSessionAdapter().sendPacket(packet, needACK, immediate);

        if(needACK && identifier !== null){
            this._needACK[identifier] = false;
            return identifier;
        }

        return true;
    }

    close(message, reason = "generic reason", notify = true){
        if(this.isConnected() && !this.closed){
            try{
                if(notify && reason.length > 0){
                    let pk = new DisconnectPacket();
                    pk.message = reason;
                    this.directDataPacket(pk);
                }

                this._sessionAdapter = null;

                //unsub from perms?
                //stopsleep

                if(this.joined){
                    try{
                        //save player data
                    }catch(e){
                        this.server.getLogger().critical("Failed to save player data for "+this.getName());
                        this.server.getLogger().critical(e);
                    }

                    //tell server player left the game
                }
                this.joined = false;

                //if valid do chuck stuff

                if(this.loggedIn){
                    this.server.onPlayerLogout(this);
                    //can see etc
                }

                this.spawned = false;

                this.server.getLogger().info(TextFormat.AQUA + "[" + this.getName() + "/"+this._ip+":"+this._port+"]" + TextFormat.WHITE + " has disconnected due to " + reason);

                if(this.loggedIn){
                    this.loggedIn = false;
                    this.server.removeOnlinePlayer(this);
                }
            }catch(e){
                this.server.getLogger().error(e);
            }finally{
                this.server.getRakNetAdapter().close(this, notify ? reason : "");
                this.server.removePlayer(this);
            }
        }
    }

    /**
     * @return {PlayerSessionAdapter}
     */
    getSessionAdapter(){
        return this._sessionAdapter;
    }
}

module.exports = Player;
