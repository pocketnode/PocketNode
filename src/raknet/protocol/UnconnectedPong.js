const ByteBuffer = require("bytebuffer");
const Packet = require("./Packet.js");
const MessageIdentifiers = require("./MessageIdentifiers.js");

class UnconnectedPong extends Packet {
    static getId(){
        return MessageIdentifiers.UnconnectedPong;
    }

    constructor(pingId, options){
        super();
        
        this.pingId = pingId;
        options.name           = options.name           || "PocketNode Server";
        options.protocol       = options.protocol       || 137; // 1.2.3
        options.version        = options.version        || "0.14.0";
        options.players.online = options.players.online || 0;
        options.players.max    = options.players.max    || 20;
        options.serverId       = options.serverId       || 536734; // uhh todo--make better?
        options.gamemode       = options.gamemode       || "Survival";
        
        
        this.name = [
            "MCPE",
            options.name,
            options.protocol,
            options.version,
            options.players.online,
            options.players.max,
            "PocketNode",
            options.gamemode
        ].join(";");
        this.bb = new ByteBuffer();
        this.bb.buffer[0] = this.raknet.UNCONNECTED_PONG;
        this.bb.offset = 1;
    }
    
    encode(){
        this.bb.
            writeLong(this.pingId).
            writeLong(this.raknet.SERVER_ID).
            append(this.raknet.MAGIC, "hex").
            writeShort(this.name.length).
            writeString(this.name).
            flip().
            compact();
    }
}

module.exports = UnconnectedPong;