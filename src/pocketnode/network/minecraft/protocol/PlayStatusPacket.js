const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class PlayStatusPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.PLAY_STATUS_PACKET;
    }

    static get LOGIN_SUCCESS(){return 0}
    static get LOGIN_FAILED_CLIENT(){return 1}
    static get LOGIN_FAILED_SERVER(){return 2}
    static get PLAYER_SPAWN(){return 3}
    static get LOGIN_FAILED_INVALID_TENANT(){return 4}
    static get LOGIN_FAILED_VANILLA_EDU(){return 5}
    static get LOGIN_FAILED_EDU_VANILLA(){return 6}

    initVars(){
        this.status = -1;
        this.protocol = -1;

    }

    constructor(){
        super();
        this.initVars();
    }

    canBeSentBeforeLogin(){
        return true;
    }

    _decodePayload(){
        this.status = this.readInt();
    }

    _encodeHeader(){
        if(this.protocol < 130){
            this.writeByte(this.getId());
        }else{
            super._encodeHeader();
        }
    }

    _encodePayload(){
        this.writeInt(this.status);
    }
}

module.exports = PlayStatusPacket;