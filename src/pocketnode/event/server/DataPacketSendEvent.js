const ServerEvent = pocketnode("event/server/ServerEvent");
const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");

class DataPacketSendEvent extends ServerEvent {
    isCancellable(){
        return true;
    }

    /**
     * @param {Player}    player
     * @param DataPacket} packet
     */
    constructor(player, packet){
        super();
        CheckTypes([DataPacket, packet]);

        this._player = player;
        this._packet = packet;
    }

    /**
     * @return {Player}
     */
    getPlayer(){
        return this._player;
    }

    /**
     * @return {DataPacket}
     */
    getPacket(){
        return this._packet;
    }
}

module.exports = DataPacketSendEvent;