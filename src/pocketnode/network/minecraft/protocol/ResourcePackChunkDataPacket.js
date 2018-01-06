const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class ResourcePackChunkDataPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.RESOURCE_PACK_CHUNK_DATA_PACKET;
    }

    initVars(){
        this.packId = "";
        this.chunkIndex = 0;
        this.progress = 0;
        this.data = null;
    }

    constructor(){
        super();
        this.initVars();
    }

    _decodePayload(){
        this.packId = this.readString();
        this.chunkIndex = this.readLInt();
        this.progress = this.readLLong();
        this.data = this.read(this.readLInt());
    }

    _encodePayload(){
        this.writeString(this.packId)
            .writeLInt(this.chunkIndex)
            .writeLLong(this.progress)
            .writeLInt(this.data.length)
            .append(this.data);
    }
}

module.exports = ResourcePackChunkDataPacket;