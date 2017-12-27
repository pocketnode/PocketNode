const Zlib = require("zlib");
const BinaryStream = pocketnode("utils/BinaryStream");

const MinecraftFlag = 0xFE;

class MinecraftPacketBatch {
    constructor(stream, logger){
        this.stream = stream;
        this.logger = logger;

        this.packets = [];
    }

    decode(packetPool){
        let flag = this.getStream().readByte();
        if(flag !== MinecraftFlag){
            return;
        }

        let buffer = this.getStream().getRemaining();

        this.stream = new BinaryStream(Zlib.unzipSync(buffer));

        //console.log(this.stream.toHex(true));

        let packetBuffers = [];

        while(!this.getStream().feof()){
            packetBuffers.push(this.getStream().readString(true));
        }

        packetBuffers.forEach(buffer => {
            let packetId = buffer[0];

            if(!packetPool.isRegistered(packetId)){
                this.logger.debug("Got unhandled Minecraft protocol with id:", packetId);
                return;
            }

            let packet = packetPool.getPacket(packetId);
            packet = new packet();

            packet.stream = new BinaryStream(buffer);

            this.packets.push(packet);
        });
    }

    getStream(){
        return this.stream;
    }
}

module.exports = MinecraftPacketBatch;