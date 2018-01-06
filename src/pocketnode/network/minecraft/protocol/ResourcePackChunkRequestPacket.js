const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class ResourcePackChunkRequestPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.RESOURCE_PACK_CHUNK_REQUEST_PACKET;
    }

    initVars(){
        this.packId = "";
        this.chunkIndex = 0;
    }

    constructor(){
        super();
        this.initVars();
    }

    _decodePayload(){
        this.packId = this.readString();
        this.chunkIndex = this.readLInt();
    }

    _encodePayload(){
        this.writeString(this.packId)
            .writeLInt(this.chunkIndex);
    }

    handle(session){
        return session.handleResourcePackChunkRequest(this);
    }
}

module.exports = ResourcePackChunkRequestPacket;