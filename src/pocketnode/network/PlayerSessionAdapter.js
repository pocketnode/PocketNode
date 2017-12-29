const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const LoginPacket = pocketnode("network/minecraft/protocol/LoginPacket");
const BatchPacket = pocketnode("network/minecraft/protocol/BatchPacket");

const BinaryStream = pocketnode("utils/BinaryStream");

class PlayerSessionAdapter {
    /**
     * @param player {Player}
     */
    constructor(player){
        /** @type {Server} */
        this.server = player.server;
        /** @type {RakNetAdapter} */
        this.raknetAdapter = this.server.getRakNetAdapter();
        /** @type {Player} */
        this.player = player;
    }

    sendPacket(packet, needACK = false, immediate = true){
        return this.raknetAdapter.sendPacket(this.player, packet, needACK, immediate);
    }

    handleDataPacket(packet){
        CheckTypes([DataPacket, packet]);

        packet.decode();

        switch(packet.getId()){
            case LoginPacket.getId():
                this.player.handleLogin(packet);
                return true;

            case BatchPacket.getId():
                if(packet.payload.length === 0){
                    return false;
                }

                packet.getPackets().forEach(buf => {
                    let pk = this.raknetAdapter.packetPool.getPacket(buf[0]);

                    if(!pk.canBeBatched()){
                        throw new Error("Received invalid "+pk.getName()+" inside BatchPacket");
                    }

                    pk.stream = new BinaryStream(buf, 1);

                    this.server.logger.debug("Got "+pk.getName());

                    this.handleDataPacket(pk);
                });
                return true;
        }
    }
}

module.exports = PlayerSessionAdapter;