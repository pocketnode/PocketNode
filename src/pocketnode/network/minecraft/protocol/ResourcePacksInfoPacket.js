const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class ResourcePacksInfoPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.RESOURCE_PACKS_INFO_PACKET;
    }

    initVars(){
        this.mustAccept = false;
        this.behaviorPackEntries = [];
        this.resourcePackEntries = [];
    }

    constructor(){
        super();
        this.initVars();
    }

    _encodePayload(){
        this.getStream().writeBool(this.mustAccept);
        this.getStream().writeLShort(this.behaviorPackEntries.length);
        this.behaviorPackEntries.forEach(entry => {
            this.getStream()
                .writeString(entry.getPackId(), true)
                .writeString(entry.getPackVersion(), true)
                .writeLLong(entry.getPackSize())
                .writeString("", true)
                .writeString("", true);
        });
        this.getStream().writeLShort(this.resourcePackEntries.length);
        this.resourcePackEntries.forEach(entry => {
            this.getStream()
                .writeString(entry.getPackId(), true)
                .writeString(entry.getPackVersion(), true)
                .writeLLong(entry.getPackSize())
                .writeString("", true)
                .writeString("", true);
        });
    }
}

module.exports = ResourcePacksInfoPacket;