const Packet = require("./Packet.js");
const MessageIdentifiers = require("./MessageIdentifiers.js");

class UnconnectedPing extends Packet {
    static getId(){
        return MessageIdentifiers.UnconnectedPing;
    }

    constructor(buffer){
        super();

        this.pingId = -1;
        this.bb = buffer;
        this.bb.offset = 1;
    }

    decode(){
        this.pingId = this.bb.readLong();
        this.bb.flip();
    }
}

module.exports = UnconnectedPing;