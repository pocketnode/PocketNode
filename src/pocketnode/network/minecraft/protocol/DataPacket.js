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

        this.extraBytes = [];
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
            this.extraBytes.push(this.getStream().readByte());
            this.extraBytes.push(this.getStream().readByte());

            if(this.extraBytes[0] !== 0 && this.extraBytes[0] !== 0){
                throw new Error("Got unexpected non-zero split-screen bytes (byte1: "+this.extraBytes[0]+", byte2: "+this.extraBytes[1]);
            }
        }else{
            throw new Error("Packet id received is different from DataPacket id! "+JSON.stringify({recieved: packetId, datapacket: this.getId()}));
        }
    }

    _decodePayload(){}

    encode(){
        this.getStream().reset();
        this._encodeHeader();
        this._encodePayload();
        this.isEncoded = true;
    }

    _encodeHeader(){
        this.getStream().writeUnsignedVarInt(this.getId());

        this.getStream().append(Buffer.from(this.extraBytes));
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