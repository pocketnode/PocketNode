const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class ResourcePackDataInfoPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.RESOURCE_PACK_DATA_INFO_PACKET;
    }

    initVars(){
        this.packId = "";
        this.maxChunkSize = 0;
        this.chunkCount = 0;
        this.compressedPackSize = 0;
        this.sha256 = "";
    }

    _decodePayload(){
        this.packId = this.readString();
        this.maxChunkSize = this.readLInt();
        this.chunkCount = this.readLInt();
        this.compressedPackSize = this.readLLong();
        this.sha256 = this.readString();
    }

    _encodePayload(){
        this.writeString(this.packId)
            .writeLInt(this.maxChunkSize)
            .writeLInt(this.chunkCount)
            .writeLLong(this.compressedPackSize)
            .writeString(this.sha256);
    }
}

module.exports = ResourcePackDataInfoPacket;