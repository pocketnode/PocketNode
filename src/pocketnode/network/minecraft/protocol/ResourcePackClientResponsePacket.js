const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");

class ResourcePackClientResponsePacket extends DataPacket {
    static getId(){
        return MinecraftInfo.RESOURCE_PACK_CLIENT_RESPONSE_PACKET;
    }

    static get STATUS_REFUSED(){return 1}
    static get STATUS_SEND_PACKS(){return 2}
    static get STATUS_HAVE_ALL_PACKS(){return 3}
    static get STATUS_COMPLETED(){return 4}
    static STATUS(status){
        switch(status){
            case ResourcePackClientResponsePacket.STATUS_REFUSED:
                return "REFUSED";
            case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
                return "SEND_PACKS";
            case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
                return "HAVE_ALL_PACKS";
            case ResourcePackClientResponsePacket.STATUS_COMPLETED:
                return "COMPLETED";
        }
    }

    initVars(){
        this.status = 0;
        this.packIds = [];
    }

    constructor(){
        super();
        this.initVars();
    }

    _decodePayload(){
        this.status = this.readByte();
        let entryCount = this.readLShort();
        while(entryCount-- > 0){
            this.packIds.push(this.readString());
        }
    }

    _encodePayload(){
        this.writeByte(this.status)
            .writeLShort(this.packIds.length);
        this.packIds.forEach(id => {
            this.writeShort(id.length);
            let buf = Buffer.alloc(id.length);
            buf.write(id);
            this.append(buf);
        });
    }

    handle(session){
        return session.handleResourcePackClientResponse(this);
    }
}

module.exports = ResourcePackClientResponsePacket;