const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class DisconnectPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.DISCONNECT_PACKET;
    }

    initVars(){
        this.hideDisconnectionScreen = false;
        this.message = "";
    }

    constructor(){
        super();
        this.initVars();
    }

    _decodePayload(){
        this.hideDisconnectionScreen = this.getStream().readBool();
        this.message = this.getStream().readString();
    }

    _encodePayload(){
        this.getStream().writeBool(this.hideDisconnectionScreen);
        if(!this.hideDisconnectionScreen){
            this.getStream().writeString(this.message);
        }
    }
}

module.exports = DisconnectPacket;