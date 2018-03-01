const BinaryStream = pocketnode("network/minecraft/NetworkBinaryStream");

class UUID {
    initVars(){
        this._parts = [0, 0, 0, 0];
        this._version = null;
    }

    constructor(part1 = 0, part2 = 0, part3 = 0, part4 = 0, version = null){
        this.initVars();
        this._parts = [part1, part2, part3, part4];
        this._version = version ? version : (part2 & 0xf000) >> 12;
    }

    getVersion(){
        return this._version;
    }

    equals(uuid){
        if(uuid instanceof UUID){
            return uuid._parts[0] === this._parts[0] && uuid._parts[1] === this._parts[1] && uuid._parts[2] === this._parts[2] && uuid._parts[3] === this._parts[3];
        }
        return false;
    }

    static fromString(uuid, version){
        return UUID.fromBinary(Buffer.from(uuid.trim().replace(/-/g, "")), version);
    }

    static fromBinary(buffer, version){
        if(buffer.length !== 16){
            throw new TypeError("UUID buffer must be exactly 16 bytes");
        }
        let stream = new BinaryStream(buffer);

        return new UUID(stream.readInt(), stream.readInt(), stream.readInt(), stream.readInt(), version);
    }

    getPart(i){
        return this._parts[i] ? this._parts[i] : null;
    }
}