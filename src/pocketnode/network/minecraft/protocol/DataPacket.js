const BinaryStream = pocketnode("utils/BinaryStream");

class DataPacket {
    static getId(){
        return 0;
    }

    getId(){
        return this.constructor.getId();
    }

    constructor(){
        this.stream = new BinaryStream();

        this.isEncoded = false;
        this.extraByte1 = 0;
        this.extraByte2 = 0;
    }

    getName(){
        return this.constructor.name;
    }

    canBeBatched(){
        return true;
    }

    canBeSentBeforeLogin(){
        return false;
    }

    mayHaveUnreadBytes(){
        return false;
    }

    decode(){
        this.stream.offset = 0;
        this._decodeHeader();
        this._decodePayload();
    }

    _decodeHeader(){
        let packetId = this.getStream().readUnsignedVarInt();
        if(packetId === this.getId()){
            this.extraByte1 = this.getStream().readByte();
            this.extraByte2 = this.getStream().readByte();

            if(this.extraByte1 !== 0 && this.extraByte2 !== 0){
                throw new Error("Got unexpected non-zero split-screen bytes (byte1: "+this.extraBytes[0]+", byte2: "+this.extraBytes[1]);
            }
        }else{
            throw new Error("Packet id received is different from DataPacket id! "+JSON.stringify({recieved: packetId, datapacket: this.getId()}));
        }
    }

    _decodePayload(){}

    encode(){
        this.stream.reset();
        this._encodeHeader();
        this._encodePayload();
        this.isEncoded = true;
    }

    _encodeHeader(){
        this.getStream().writeUnsignedVarInt(this.getId());

        this.getStream()
            .writeByte(this.extraByte1)
            .writeByte(this.extraByte2);
    }

    _encodePayload(){}

    getStream(){
        return this.stream;
    }

    getBuffer(){
        return this.stream.buffer;
    }
}

module.exports = DataPacket;