class BinaryStream {
    initVars(){
        /** @type {Buffer} */
        this.buffer = Buffer.alloc(0);
        /** @type {number} */
        this.offset = 0;
    }

    /**
     * @param buffer
     */
    constructor(buffer){
        this.initVars();

        if(buffer instanceof Buffer){
            this.append(buffer);
            this.offset = 0;
        }
    }

    reset(){
        this.buffer = Buffer.alloc(0);
        this.offset = 0;
    }

    setBuffer(buffer = Buffer.alloc(0), offset = 0){
        this.buffer = buffer;
        this.offset = offset;
    }

    getOffset(){
        return this.offset;
    }

    /**
     * @return {Buffer}
     */
    getBuffer(){
        return this.buffer;
    }

    get length(){
        return this.buffer.length;
    }

    /**
     * @return {number}
     */
    getRemainingBytes(){
        return this.buffer.length - this.offset;
    }

    /**
     * @return {Buffer}
     */
    getRemaining(){
        let buf = this.buffer.slice(this.offset);
        this.offset = this.buffer.length;
        return buf;
    }

    /**
     * Increases offset
     * @param v   {number}  Value to increase offset by
     * @param ret {boolean} Return the new offset
     * @return {number}
     */
    increaseOffset(v, ret = false){
        return (ret === true ? (this.offset += v) : (this.offset += v) - v);
    }

    /**
     * Append data to buffer
     * @param buf
     */
    append(buf){
        if(buf instanceof Buffer){
            this.buffer = Buffer.concat([this.buffer, buf]);
            this.offset += buf.length;
        }else if(typeof buf === "string"){
            buf = Buffer.from(buf, "hex");
            this.buffer = Buffer.concat([this.buffer, buf]);
            this.offset += buf.length;
        }
        return this;
    }

    /**
     * Reads a byte boolean
     * @return {boolean}
     */
    readBool(){
        return this.readByte() !== 0;
    }

    /**
     * Writes a byte boolean
     * @param v {boolean}
     * @return {BinaryStream}
     */
    writeBool(v){
        this.writeByte(v === true ? 1 : 0);
        return this;
    }

    /**
     * Reads a unsigned/signed byte
     * @return {number}
     */
    readByte(){
        return this.getBuffer()[this.increaseOffset(1)];
    }

    /**
     * Writes a unsigned/signed byte
     * @param v {number}
     * @returns {BinaryStream}
     */
    writeByte(v){
        let buf = Buffer.from([v & 0xff]);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 16-bit unsigned or signed big-endian number
     * @return {number}
     */
    readShort(){
        return this.buffer.readUInt16BE(this.increaseOffset(2));
    }

    /**
     * Writes a 16-bit unsigned big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    writeShort(v){
        let buf = Buffer.alloc(2);
        buf.writeUInt16BE(v);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 16-bit signed big-endian number
     * @return {number}
     */
    readSignedShort(){
        return this.buffer.readInt16BE(this.increaseOffset(2));
    }

    /**
     * Writes a 16-bit signed big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    writeSignedShort(v){
        let buf = Buffer.alloc(2);
        buf.writeInt16BE(v);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 16-bit unsigned little-endian number
     * @return {number}
     */
    readLShort(){
        return this.buffer.readUInt16LE(this.increaseOffset(2));
    }

    /**
     * Writes a 16-bit unsigned little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    writeLShort(v){
        let buf = Buffer.alloc(2);
        buf.writeUInt16BE(v);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 16-bit signed little-endian number
     * @return {number}
     */
    readSignedLShort(){
        return this.buffer.readInt16LE(this.increaseOffset(2));
    }

    /**
     * Writes a 16-bit signed little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    writeSignedLShort(v){
        let buf = Buffer.alloc(2);
        buf.writeInt16LE(v);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 3-byte big-endian number
     * @return {number}
     */
    readTriad(){
        return this.buffer.readUIntBE(this.increaseOffset(3), 3);
    }

    /**
     * Writes a 3-byte big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    writeTriad(v){
        let buf = Buffer.alloc(3);
        buf.writeUIntBE(v, 0, 3);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 3-byte little-endian number
     * @return {number}
     */
    readLTriad(){
        return this.buffer.readUIntLE(this.increaseOffset(3), 3);
    }

    /**
     * Writes a 3-byte little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    writeLTriad(v){
        let buf = Buffer.alloc(3);
        buf.writeUIntLE(v, 0, 3);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 32-bit signed big-endian number
     * @return {number}
     */
    readInt(){
        return this.buffer.readInt32BE(this.increaseOffset(4));
    }

    /**
     * Writes a 32-bit signed big-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    writeInt(v){
        let buf = Buffer.alloc(4);
        buf.writeInt32BE(v);
        this.append(buf);

        return this;
    }

    /**
     * Reads a 32-bit signed little-endian number
     * @return {number}
     */
    readLInt(){
        return this.buffer.readInt32LE(this.increaseOffset(4));
    }

    /**
     * Writes a 32-bit signed little-endian number
     * @param v {number}
     * @return {BinaryStream}
     */
    writeLInt(v){
        let buf = Buffer.alloc(4);
        buf.writeInt32LE(v);
        this.append(buf);

        return this;
    }

    /**
     * @return {number}
     */
    readFloat(){
        return this.buffer.readFloatBE(this.increaseOffset(4));
    }

    /**
     * @param accuracy {number}
     * @return {number}
     */
    readRoundedFloat(accuracy){
        return Math.round_php(this.readFloat(), accuracy);
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    writeFloat(v) {
        let buf = Buffer.alloc(8); // bc you never know *shrug*
        let bytes = buf.writeFloatBE(v);
        this.append(buf.slice(0, bytes));

        return this;
    }

    /**
     * @return {number}
     */
    readLFloat(){
        return this.buffer.readFloatLE(this.increaseOffset(4));
    }

    /**
     * @param accuracy {number}
     * @return {number}
     */
    readRoundedLFloat(accuracy){
        return Math.round_php(this.readLFloat(), accuracy);
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    writeLFloat(v){
        let buf = Buffer.alloc(8); // bc you never know *shrug*
        let bytes = buf.writeFloatLE(v);
        this.append(buf.slice(0, bytes));

        return this;
    }

    /**
     * @return {number}
     */
    readDouble(){
        return this.buffer.readDoubleBE(this.increaseOffset(8));
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    writeDouble(v) {
        let buf = Buffer.alloc(8);
        buf.writeDoubleBE(v);
        this.append(buf);

        return this;
    }

    /**
     * @return {number}
     */
    readLDouble(){
        return this.buffer.readDoubleLE(this.increaseOffset(8));
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    writeLDouble(v){
        let buf = Buffer.alloc(8);
        buf.writeDoubleLE(v);
        this.append(buf);

        return this;
    }

    /**
     * @return {number}
     */
    readLong(){
        return (this.buffer.readUInt32BE(this.increaseOffset(4)) << 8) + this.buffer.readUInt32BE(this.increaseOffset(4));
    }

    /**
     * @param v {number}
     * @return {BinaryStream}
     */
    writeLong(v){
        let MAX_UINT32 = 0xFFFFFFFF;

        let buf = Buffer.alloc(8);
        buf.writeUInt32BE((~~(v / MAX_UINT32)), 0);
        buf.writeUInt32BE((v & MAX_UINT32), 4);
        this.append(buf);

        return this;
    }

    readLLong(){
        return this.buffer.readUInt32LE(0) + (buffer.readUInt32LE(4) << 8);
    }

    writeLLong(v){
        let MAX_UINT32 = 0xFFFFFFFF;

        let buf = Buffer.alloc(8);
        buf.writeUInt32LE((v & MAX_UINT32), 0);
        buf.writeUInt32LE((~~(v / MAX_UINT32)), 4);
        this.append(buf);

        return this;
    }

    readString(returnBuffer = false, len = this.readUnsignedVarInt()){
        let buffer = this.buffer.slice(this.offset, this.increaseOffset(len, true));
        return returnBuffer === true ? buffer : buffer.toString();
    }

    /**
     * Damn this is a mess
     * @param v {string}
     * @param writeLengthAsShort [input=false] {boolean}
     * @return {BinaryStream}
     */
    writeString(v, writeLengthAsShort = false){
        let stream = new BinaryStream();

        if(writeLengthAsShort === true){
            stream.writeShort(v.length);
        }else{
            stream.writeUnsignedVarInt(v.length);
        }

        let buf = Buffer.alloc(v.length);
        buf.write(v);

        stream.append(buf);

        this.append(stream.buffer);
        return this;
    }

    // todo: readUUID
    // todo: writeUUID

    // todo: readSlot
    // todo: writeSlot

    readUnsignedVarInt(){
        let value = 0;

        for(let i = 0; i <= 35; i += 7){
            let b = this.readByte();
            value |= ((b & 0x7f) << i);

            if((b & 0x80) === 0){
                return value;
            }
        }

        return 0;
    }

    writeUnsignedVarInt(v){
        let stream = new BinaryStream();
        while (v !== 0){
            let tmp = v & 0x7f;
            v >>>= 7;
            if(v !== 0){
                tmp |= 0x80;
            }
            stream.writeByte(tmp);
        }
        this.append(stream.buffer);

        return this;
    }

    readVarInt(){
        let raw = this.readUnsignedVarInt();
        let tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }

    writeVarInt(v){
        v = (v << 32 >> 32);
        return this.writeUnsignedVarInt((v << 1) ^ (v >> 31));
    }

    readUnsignedVarLong(){
        let value = 0;
        for(let i = 0; i <= 63; i += 7){
            let b = this.readByte();
            value |= ((b & 0x7f) << i);

            if((b & 0x80) === 0){
                return value;
            }
        }
        return 0;
    }

    writeUnsignedVarLong(v){
        let stream = new BinaryStream();
        while(v !== 0){
            let tmp = v & 0x7f;
            v >>>= 7;
            if(v !== 0){
                tmp |= 0x80;
            }
            stream.writeByte(tmp);
        }
        this.append(stream.buffer);

        return this;
    }

    readVarLong(){
        let raw = this.readUnsignedVarLong();
        let tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }

    writeVarLong(v){
        return this.writeUnsignedVarLong((v << 1) ^ (v >> 63));
    }

    /**
     * Found end of buffer
     * @return {boolean}
     */
    feof(){
        return typeof this.getBuffer()[this.offset] === "undefined";
    }

    /**
     * Reads address from buffer
     * @return {{ip: string, port: number, version: number}}
     */
    readAddress(){
        let addr, port;
        let version = this.readByte();
        switch(version){
            default:
            case 4:
                addr = [];
                for(let i = 0; i < 4; i++){
                    addr.push(this.readByte() & 0xff);
                }
                addr = addr.join(".");
                port = this.readShort();
                break;
            // add ipv6 support
        }
        return {ip: addr, port: port, version: version};
    }

    /**
     * Writes address to buffer
     * @param addr    {string}
     * @param port    {number}
     * @param version {number}
     * @return {BinaryStream}
     */
    writeAddress(addr, port, version = 4){
        this.writeByte(version);
        switch(version){
            default:
            case 4:
                addr.split(".", 4).forEach(b => {
                    this.writeByte((Number(b)) & 0xff);
                });
                this.writeShort(port);
                break;
        }
        return this;
    }

    flip(){
        this.offset = 0;
        return this;
    }

    /**
     * Return hex from buffer
     * @param spaces {boolean}
     */
    toHex(spaces = false){
        let hex = this.buffer.toString("hex");
        return spaces ? hex.split(/(..)/).filter(v=>{return v !== ""}).join(" ") : hex;
    }
}

module.exports = BinaryStream;