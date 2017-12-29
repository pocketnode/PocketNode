const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const BinaryStream = pocketnode("utils/BinaryStream");
const Zlib = require("zlib");

class BatchPacket extends DataPacket {
    static getId(){
        return 0xFE;
    }

    initVars(){
        this.payload = new BinaryStream();
        this._compressionLevel = 7;
    }

    constructor(){
        super();
        this.initVars();
    }

    canBeBatched(){
        return false;
    }

    canBeSentBeforeLogin(){
        return true;
    }

    _decodeHeader(){
        let packetId = this.getStream().readByte();
        if(packetId !== this.getId()){
            throw new Error("Received "+packetId+" as the id, expected "+this.getId());
        }
    }

    _decodePayload(){
        let data = this.getStream().getRemaining();
        this.payload = new BinaryStream(Zlib.unzipSync(data));
    }

    _encodeHeader(){
        this.getStream().writeByte(this.getId());
    }

    _encodePayload(){
        let buf = Zlib.deflateSync(this.payload.getBuffer(), {level: this._compressionLevel});
        this.getStream().append(buf);
    }

    addPacket(packet){
        if(!packet.canBeBatched()){
            throw new Error(packet.getName() + " can't be batched");
        }

        if(!packet.isEncoded){
            packet.encode();
        }

        this.payload.writeUnsignedVarInt(packet.getStream().length);
        this.payload.append(packet.getStream().getBuffer());
    }

    getPackets(){
        let pks = [];
        while(!this.payload.feof()){
            pks.push(this.payload.readString(true));
        }
        return pks;
    }
}

module.exports = BatchPacket;