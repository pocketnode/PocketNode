const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const BinaryStream = pocketnode("network/minecraft/NetworkBinaryStream");
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
        let packetId = this.readByte();
        if(packetId !== this.getId()){
            throw new Error("Received "+packetId+" as the id, expected "+this.getId());
        }
    }

    _decodePayload(){
        let data = this.readRemaining();
        this.payload = new BinaryStream(Zlib.unzipSync(data));
    }

    _encodeHeader(){
        this.writeByte(this.getId());
    }

    _encodePayload(){
        let buf = Zlib.deflateSync(this.payload.getBuffer(), {level: this._compressionLevel});
        this.append(buf);
    }

    addPacket(packet){
        if(!packet.canBeBatched()){
            throw new Error(packet.getName() + " can't be batched");
        }

        if(!packet.isEncoded){
            packet.encode();
        }

        this.payload.writeUnsignedVarInt(packet.length);
        this.payload.append(packet.getBuffer());
    }

    getPackets(){
        let pks = [];
        while(!this.payload.feof()){
            pks.push(this.payload.read(this.payload.readUnsignedVarInt()));
        }
        return pks;
    }

    handle(session, logger){
        if(this.payload.length === 0){
            return false;
        }

        this.getPackets().forEach(buf => {
            let pk = session.raknetAdapter.packetPool.getPacket(buf[0]);

            if(pk instanceof DataPacket){
                if(!pk.canBeBatched()){
                    throw new Error("Received invalid "+pk.getName()+" inside BatchPacket");
                }

                pk.setBuffer(buf, 1);
                session.handleDataPacket(pk);
            }else{
                logger.debug("Got unhandled packet: 0x"+buf.slice(0, 1).toString("hex"));
            }
        });

        return true;
    }
}

module.exports = BatchPacket;