const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const LoginPacket = pocketnode("network/minecraft/protocol/LoginPacket");

class PlayerSessionAdapter {
    /**
     * @param player {Player}
     */
    constructor(player){
        /** @type {Server} */
        this.server = player.server;
        /** @type {Player} */
        this.player = player;
    }

    handleDataPacket(packet){
        CheckTypes([DataPacket, packet]);

        switch(packet.getId()){
            case LoginPacket.getId():
                this.player.handleLogin(packet);
                console.log(this.player);
                return true;
        }
    }
}

module.exports = PlayerSessionAdapter;