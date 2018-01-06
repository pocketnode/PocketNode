const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class ResourcePackStackPacket extends DataPacket {
    static getId(){
        return MinecraftInfo.RESOURCE_PACK_STACK_PACKET;
    }

    initVars(){
        this.mustAccept = false;

        this.behaviorPackStack = [];
        this.resourcePackStack = [];
    }

    constructor(){
        super();
        this.initVars();
    }

    _encodePayload(){
        this.writeBool(this.mustAccept);

        this.writeUnsignedVarInt(this.behaviorPackStack.length);
        this.behaviorPackStack.forEach(entry => {
            this.writeString(entry.getPackId())
                .writeString(entry.getPackVersion())
                .writeString("");
        });

        this.writeUnsignedVarInt(this.resourcePackStack.length);
        this.resourcePackStack.forEach(entry => {
            this.writeString(entry.getPackId())
                .writeString(entry.getPackVersion())
                .writeString("");
        });
    }
}

module.exports = ResourcePackStackPacket;