const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class FullChunkDataPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.FULL_CHUNK_DATA_PACKET;
    }

    initVars(){
        this.chunkX = 0;
        this.chunkY = 0;
        this.data = null;
    }

    constructor(){
        super();
        this.initVars();
    }

    _decodePayload(){
        this.chunkX = this.readVarInt();
        this.chunkY = this.readVarInt();
        this.data = this.readString();
    }

    _encodePayload(){
        this.writeVarInt(this.chunkX)
            .writeVarInt(this.chunkY)
            .writeString(this.data);
    }
}

module.exports = FullChunkDataPacket;