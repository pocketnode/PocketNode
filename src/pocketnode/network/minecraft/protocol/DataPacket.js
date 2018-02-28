const BinaryStream = pocketnode("utils/BinaryStream");
const Vector3 = pocketnode("math/Vector3");

class DataPacket extends BinaryStream {
    static getId(){
        return 0;
    }

    getId(){
        return this.constructor.getId();
    }

    constructor(){
        super();

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
        this.offset = 0;
        this._decodeHeader();
        this._decodePayload();
    }

    _decodeHeader(){
        let packetId = this.readUnsignedVarInt();
        if(packetId === this.getId()){
            this.extraByte1 = this.readByte();
            this.extraByte2 = this.readByte();

            if(this.extraByte1 !== 0 && this.extraByte2 !== 0){
                throw new Error("Got unexpected non-zero split-screen bytes (byte1: "+this.extraBytes[0]+", byte2: "+this.extraBytes[1]);
            }
        }else{
            throw new Error("Packet id received is different from DataPacket id! "+JSON.stringify({recieved: packetId, datapacket: this.getId()}));
        }
    }

    _decodePayload(){}

    encode(){
        this.reset();
        this._encodeHeader();
        this._encodePayload();
        this.isEncoded = true;
    }

    _encodeHeader(){
        this.writeUnsignedVarInt(this.getId());

        this.writeByte(this.extraByte1)
            .writeByte(this.extraByte2);
    }

    _encodePayload(){}

    getBuffer(){
        return this.buffer;
    }

    getEntityUniqueId(){
        return this.readVarLong();
    }

    writeEntityUniqueId(eid){
        this.writeVarLong(eid);
        return this;
    }

    getEntityRuntimeId(){
        return this.readUnsignedVarLong();
    }

    writeEntityRuntimeId(eid){
        this.writeUnsignedVarLong(eid);
        return this;
    }

    getVector3Obj(){
        return new Vector3(
            this.readRoundedLFloat(4),
            this.readRoundedLFloat(4),
            this.readRoundedLFloat(4)
        );
    }

    writeVector3Obj(vector){
        this.writeLFloat(vector.x);
        this.writeLFloat(vector.y);
        this.writeLFloat(vector.z);
    }

    getBlockPosition(){
        return [
            this.readVarInt(),
            this.readUnsignedVarInt(),
            this.readVarInt()
        ];
    }

    writeBlockPosition(x, y, z){
        this.writeVarInt(x)
            .writeUnsignedVarInt(y)
            .writeVarInt(z);
        return this;
    }

    getGameRules(){
        let count = this.readUnsignedVarInt();
        let rules = [];
        for(let i = 0; i < count; ++i){
            let name = this.readString();
            let type = this.readUnsignedVarInt();
            let value = null;
            switch(type){
                case 1:
                    value = this.readBool();
                    break;
                case 2:
                    value = this.readUnsignedVarInt();
                    break;
                case 3:
                    value = this.readLFloat();
                    break;
            }

            rules[name] = [type, value];
        }

        return rules;
    }

    writeGameRules(rules){
        this.writeUnsignedVarInt(rules.length);
        rules.forEach((rule, name) => {
            this.writeString(name);
            this.writeUnsignedVarInt(rule[0]);
            switch(rule[0]){
                case 1:
                    this.writeBool(rule[1]);
                break;

                case 2:
                    this.writeUnsignedVarInt(rule[1]);
                break;

                case 3:
                    this.writeLFloat(rule[1]);
                break;
            }
        });

        return this;
    }

    handle(session){
        return false;
    }
}

module.exports = DataPacket;
