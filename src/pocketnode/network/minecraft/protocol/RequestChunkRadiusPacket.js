const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class RequestChunkRadiusPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.REQUEST_CHUNK_RADIUS_PACKET;
    }

    initVars() {
        this.radius = 0;
    }

    _decodePayload(){
        this.radius = this.readVarInt();
    }

    _encodePayload(){
        this.writeVarInt(this.radius);
    }

    handle(session){
        return session.handleRequestChunkRadius(this);
    }
}

module.exports = RequestChunkRadiusPacket;