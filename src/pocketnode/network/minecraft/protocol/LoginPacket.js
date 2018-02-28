const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

const BinaryStream = pocketnode("network/minecraft/NetworkBinaryStream");
const Utils = pocketnode("utils/Utils");

const Isset = pocketnode("utils/methods/Isset");

class LoginPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.LOGIN_PACKET;
    }

    initVars(){
        this.username = "";
        this.protocol = 0;
        this.clientUUID = "";
        this.clientId = 0;
        this.xuid = "";
        this.identityPublicKey = "";
        this.serverAddress = "";

        this.chainData = [];
        this.clientDataJwt = "";
        this.clientData = [];
    }

    constructor(){
        super();
        this.initVars();
    }

    canBeSentBeforeLogin(){
        return true;
    }

    mayHaveUnreadBytes(){
        return this.protocol !== 0 && this.protocol !== MinecraftInfo.PROTOCOL;
    }

    _decodePayload(){
        this.protocol = this.readInt();

        if(this.protocol !== MinecraftInfo.PROTOCOL){
            if(this.protocol > 0xffff){
                this.offset -= 6;
                this.protocol = this.readInt();
            }
            return;
        }

        let stream = new BinaryStream(this.readString(true));
        this.chainData = JSON.parse(stream.read(stream.readLInt()).toString());

        this.chainData.chain.forEach(chain => {
            let webtoken = Utils.decodeJWT(chain);
            if(Isset(webtoken.extraData)){
                if(Isset(webtoken.extraData.displayName)){
                    this.username = webtoken.extraData.displayName;
                }
                if(Isset(webtoken.extraData.identity)){
                    this.clientUUID = webtoken.extraData.identity;
                }
                if(Isset(webtoken.extraData.XUID)){
                    this.xuid = webtoken.extraData.XUID;
                }

                if(Isset(webtoken.identityPublicKey)){
                    this.identityPublicKey = webtoken.identityPublicKey;
                }
            }
        });

        this.clientDataJwt = stream.read(stream.readLInt()).toString();
        this.clientData = Utils.decodeJWT(this.clientDataJwt);

        this.clientId = Isset(this.clientData.ClientRandomId) ? this.clientData.ClientRandomId : null;
        this.serverAddress = Isset(this.clientData.ServerAddress) ? this.clientData.ServerAddress : null;
    }

    handle(session){
        return session.handleLogin(this);
    }
}

module.exports = LoginPacket;